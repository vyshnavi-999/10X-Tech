/**
 * 10X Technologies - Qwen WebGPU Service (Hardware-Adaptive Singleton Engine)
 * 
 * Manages the single authoritative Qwen3-0.6B-ONNX WebGPU pipeline instance,
 * asynchronous hardware/adapter capability probing (adapter, shader-f16, memory),
 * safe non-crashing initialization guards, adaptive context management,
 * WebGPU device.lost lifecycle recovery, synchronous hot-state detection,
 * intent-based prewarming, and streaming inference.
 */

import { pipeline, TextStreamer, env } from '@huggingface/transformers';

// Ensure standard Transformers.js browser Cache API is active
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';

let modelPromise = null;
let modelGenerator = null;
let isDeviceLost = false;
let lastError = null;

// Hardware probe cache
let cachedCapability = null;
let cachedCapabilityPromise = null;

export const RUNTIME_TIERS = {
  TIER_A: {
    id: 'TIER_A',
    label: 'High-Performance WebGPU',
    supported: true,
    topK: 3,
    ragTopK: 3,
    maxNewTokens: 160,
    historyTurns: 4,
    historyLimit: -4,
    doSample: false,
    temperature: 0.2,
    statusMessage: 'Preparing LUCA AI...',
    readyMessage: 'LUCA is ready.'
  },
  TIER_B: {
    id: 'TIER_B',
    label: 'Efficient WebGPU (Memory-Conscious)',
    supported: true,
    topK: 2,
    ragTopK: 2,
    maxNewTokens: 128,
    historyTurns: 2,
    historyLimit: -2,
    doSample: false,
    temperature: 0.0,
    statusMessage: 'Preparing LUCA for this device...',
    lowMemoryNotice: 'Your device has limited available memory, so startup may take a little longer.',
    readyMessage: 'LUCA is ready.'
  },
  TIER_C: {
    id: 'TIER_C',
    label: 'Unsupported Hardware',
    supported: false,
    topK: 0,
    ragTopK: 0,
    maxNewTokens: 0,
    historyTurns: 0,
    historyLimit: 0,
    doSample: false,
    temperature: 0.0,
    statusMessage: 'Your browser/device cannot run local WebGPU AI inference safely.',
    readyMessage: 'Local AI unsupported on this device.'
  }
};

export function getRuntimeConfig(capability = cachedCapability) {
  if (!capability || !capability.supported) {
    return RUNTIME_TIERS.TIER_C;
  }
  if (capability.tier) {
    return capability.tier;
  }
  if (capability.isMobile || capability.hasLowMemory) {
    return RUNTIME_TIERS.TIER_B;
  }
  return RUNTIME_TIERS.TIER_A;
}

// Registry of active progress and state listeners
const progressListeners = new Set();
const stateListeners = new Set();

function notifyProgress(progress) {
  progressListeners.forEach((fn) => {
    try {
      fn(progress);
    } catch (e) {
      console.warn('[QwenService] Progress listener error:', e);
    }
  });
}

function notifyState(state, detail = null) {
  stateListeners.forEach((fn) => {
    try {
      fn(state, detail);
    } catch (e) {
      console.warn('[QwenService] State listener error:', e);
    }
  });
}

/**
 * Handle WebGPU device loss safely without leaving the app in a permanently broken state
 */
function handleDeviceLost(info) {
  console.warn('[QwenService] WebGPU device was lost:', info);
  isDeviceLost = true;
  modelGenerator = null;
  modelPromise = null;
  lastError = new Error(info?.message || 'WebGPU device was lost. Pipeline invalidated.');
  notifyState('device_lost', info);
}

// Intercept WebGPU adapter.requestDevice if in a supported browser environment
if (typeof navigator !== 'undefined' && 'gpu' in navigator && navigator.gpu?.requestAdapter) {
  try {
    const origRequestAdapter = navigator.gpu.requestAdapter.bind(navigator.gpu);
    navigator.gpu.requestAdapter = async function (options) {
      const adapter = await origRequestAdapter(options);
      if (adapter && adapter.requestDevice) {
        const origRequestDevice = adapter.requestDevice.bind(adapter);
        adapter.requestDevice = async function (deviceDescriptor) {
          const device = await origRequestDevice(deviceDescriptor);
          if (device && device.lost && typeof device.lost.then === 'function') {
            device.lost.then((info) => {
              handleDeviceLost(info);
            }).catch(() => {});
          }
          return device;
        };
      }
      return adapter;
    };
  } catch (e) {
    // Non-fatal hook failure in strict environments
    console.debug('[QwenService] WebGPU adapter interception bypassed:', e);
  }
}

/**
 * Perform a real, non-destructive hardware capability probe.
 * Checks adapter availability, shader-f16 feature support, and device memory.
 * Results are cached so subsequent calls are instantaneous (< 0.1 ms).
 */
export async function probeDeviceCapability() {
  if (cachedCapability) return cachedCapability;
  if (cachedCapabilityPromise) return cachedCapabilityPromise;

  cachedCapabilityPromise = (async () => {
    const hasNav = typeof navigator !== 'undefined';
    const isMobile = hasNav && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const deviceMemory = hasNav && 'deviceMemory' in navigator ? Number(navigator.deviceMemory) : null;
    const hardwareConcurrency = hasNav && 'hardwareConcurrency' in navigator ? Number(navigator.hardwareConcurrency) : null;
    const hasLowMemory = deviceMemory !== null && deviceMemory <= 4;

    // 1. Basic WebGPU API existence check
    if (!hasNav || !('gpu' in navigator)) {
      const res = {
        supported: false,
        reason: 'UNSUPPORTED_LOCAL_WEBGPU',
        message: 'Your browser/device cannot run local WebGPU AI inference.',
        isMobile,
        deviceMemory,
        hardwareConcurrency,
        hasShaderF16: false,
        hasLowMemory,
        adapterInfo: null,
        tier: RUNTIME_TIERS.TIER_C,
      };
      cachedCapability = res;
      return res;
    }

    try {
      // 2. Request physical GPU adapter with high-performance preference
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!adapter) {
        const res = {
          supported: false,
          reason: 'UNSUPPORTED_LOCAL_WEBGPU',
          message: 'Your browser/device cannot run local WebGPU AI inference.',
          isMobile,
          deviceMemory,
          hardwareConcurrency,
          hasShaderF16: false,
          hasLowMemory,
          adapterInfo: null,
          tier: RUNTIME_TIERS.TIER_C,
        };
        cachedCapability = res;
        return res;
      }

      // 3. Inspect adapter features: check shader-f16 extension
      const hasShaderF16 = adapter.features?.has('shader-f16') === true;

      // Inspect adapter metadata where permitted
      let adapterInfo = null;
      try {
        if (adapter.info) {
          adapterInfo = {
            vendor: adapter.info.vendor,
            architecture: adapter.info.architecture,
            device: adapter.info.device,
            description: adapter.info.description,
          };
        } else if (adapter.requestAdapterInfo) {
          const info = await adapter.requestAdapterInfo();
          adapterInfo = {
            vendor: info.vendor,
            architecture: info.architecture,
            device: info.device,
            description: info.description,
          };
        }
      } catch (e) {
        // Non-fatal
      }

      // 4. Critical memory check:
      // If the browser explicitly reports deviceMemory < 4 GB, running a 543 MB model causes kernel OOM kills.
      if (deviceMemory !== null && deviceMemory < 4) {
        const res = {
          supported: false,
          reason: 'INSUFFICIENT_DEVICE_RESOURCES',
          message: 'Your device has limited available memory to run the local AI model.',
          isMobile,
          deviceMemory,
          hardwareConcurrency,
          hasShaderF16,
          hasLowMemory: true,
          adapterInfo,
          tier: RUNTIME_TIERS.TIER_C,
        };
        cachedCapability = res;
        return res;
      }

      // 5. Check shader-f16 compatibility:
      // Qwen3-0.6B q4f16 requires shader-f16 WGSL operations. Hardware lacking shader-f16 will fail WGSL shader compilation.
      if (!hasShaderF16) {
        const res = {
          supported: false,
          reason: 'UNSUPPORTED_SHADER_F16',
          message: 'Your device GPU does not support the required WebGPU features for local inference.',
          isMobile,
          deviceMemory,
          hardwareConcurrency,
          hasShaderF16: false,
          hasLowMemory,
          adapterInfo,
          tier: RUNTIME_TIERS.TIER_C,
        };
        cachedCapability = res;
        return res;
      }

      // Determine active runtime tier based on real hardware capability
      const isTierB = isMobile || (deviceMemory !== null && deviceMemory <= 6);
      const activeTier = isTierB ? RUNTIME_TIERS.TIER_B : RUNTIME_TIERS.TIER_A;

      // All requirements met: Capable device running Qwen3-0.6B
      const res = {
        supported: true,
        reason: 'CAPABLE_WEBGPU',
        message: activeTier.statusMessage,
        isMobile,
        deviceMemory,
        hardwareConcurrency,
        hasShaderF16: true,
        hasLowMemory,
        adapterInfo,
        tier: activeTier,
      };
      cachedCapability = res;
      return res;
    } catch (err) {
      const res = {
        supported: false,
        reason: 'UNSUPPORTED_LOCAL_WEBGPU',
        message: `Your browser/device cannot run local WebGPU AI inference (${err?.message || 'Adapter probe failed'}).`,
        isMobile,
        deviceMemory,
        hardwareConcurrency,
        hasShaderF16: false,
        hasLowMemory,
        adapterInfo: null,
        tier: RUNTIME_TIERS.TIER_C,
      };
      cachedCapability = res;
      return res;
    }
  })();

  return cachedCapabilityPromise;
}

/**
 * Synchronous accessor for the cached capability result
 */
export function getCachedCapability() {
  return cachedCapability;
}

/**
 * Check if the current browser environment has WebGPU capability
 */
export function isWebGPUSupported() {
  if (cachedCapability) return cachedCapability.supported;
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Synchronously check whether the Qwen model instance is hot in memory and ready for immediate generation
 */
export function isModelReady() {
  return modelGenerator !== null && !isDeviceLost;
}

/**
 * Get current lifecycle status: 'ready' | 'loading' | 'error' | 'idle'
 */
export function getModelStatus() {
  if (modelGenerator && !isDeviceLost) return 'ready';
  if (modelPromise) return 'loading';
  if (lastError) return 'error';
  return 'idle';
}

/**
 * Clean streaming tokens during active generation.
 * Strips leading whitespace and removes <think> tags, but PRESERVES trailing spaces
 * so words do not collapse while new tokens arrive.
 */
export function cleanStreamingOutput(text) {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .replace(/<\/think>/gi, '')
    .replace(/^\s+/, '');
}

/**
 * Clean any accidental <think> reasoning tokens from Qwen3 output (final clean)
 */
export function cleanOutput(text) {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .replace(/<\/think>/gi, '')
    .trim();
}

/**
 * Initialize or retrieve the cached singleton Qwen3-0.6B generator instance.
 * Reuses active in-flight promises so concurrent calls never trigger duplicate downloads or shader compilations.
 * Prevents large model download/initialization on unsupported or memory-insufficient hardware.
 * 
 * @param {Function} onProgress - Optional callback for download/compilation progress
 * @returns {Promise<Function>} The text-generation pipeline instance
 */
export async function getQwenGenerator(onProgress) {
  if (onProgress && typeof onProgress === 'function') {
    progressListeners.add(onProgress);
  }

  // 1. Return existing hot singleton immediately
  if (modelGenerator && !isDeviceLost) {
    return modelGenerator;
  }

  // 2. Return existing in-flight promise if already initializing
  if (modelPromise) {
    return modelPromise;
  }

  // 3. Perform real hardware capability probe before attempting large asset downloads
  const capability = await probeDeviceCapability();
  if (!capability.supported) {
    const err = new Error(capability.message);
    err.code = capability.reason;
    err.capability = capability;
    lastError = err;
    notifyState(capability.reason, capability);
    throw err;
  }

  // Notify if low-memory condition is detected on a supported device
  if (capability.hasLowMemory) {
    notifyState('low_memory_notice', capability);
  }

  isDeviceLost = false;
  lastError = null;
  notifyState('loading');

  // 4. Initiate single authoritative initialization promise for the SAME Qwen3-0.6B model
  modelPromise = (async () => {
    try {
      const generator = await pipeline(
        'text-generation',
        MODEL_ID,
        {
          device: 'webgpu',
          dtype: 'q4f16',
          progress_callback: (progress) => {
            notifyProgress(progress);
          },
        }
      );

      modelGenerator = generator;
      modelPromise = null;
      isDeviceLost = false;
      lastError = null;
      notifyState('ready');
      return generator;
    } catch (err) {
      modelPromise = null; // Allow clean retry on failure
      modelGenerator = null;
      lastError = err;
      notifyState('INITIALIZATION_FAILED', err);
      throw err;
    }
  })();

  return modelPromise;
}

/**
 * Pre-warm the Qwen WebGPU model on explicit user intent (e.g. hover, focus on LUCA entry point).
 * Safe and non-blocking; aborts if hardware cannot run WebGPU or is already ready/loading.
 */
export async function prewarmQwen() {
  if (isModelReady() || modelPromise) return;

  const capability = await probeDeviceCapability();
  if (!capability.supported) return; // Do not trigger large asset download on incompatible device

  getQwenGenerator().catch((err) => {
    console.debug('[QwenService] Non-fatal prewarm notice:', err?.message || err);
  });
}

/**
 * Safely reset the singleton generator (e.g. after WebGPU context loss or fatal error)
 */
export function resetQwenGenerator() {
  modelGenerator = null;
  modelPromise = null;
  isDeviceLost = false;
  lastError = null;
  notifyState('reset');
}

/**
 * Subscribe to model lifecycle state changes
 */
export function subscribeState(callback) {
  if (typeof callback === 'function') {
    stateListeners.add(callback);
    return () => stateListeners.delete(callback);
  }
  return () => {};
}

/**
 * Subscribe to model download/compilation progress events
 */
export function subscribeProgress(callback) {
  if (typeof callback === 'function') {
    progressListeners.add(callback);
    return () => progressListeners.delete(callback);
  }
  return () => {};
}

/**
 * Generate a streaming response using Qwen3-0.6B on WebGPU with RAG context
 * 
 * @param {Array} messages - Array of { role: 'system'|'user'|'assistant', content: string }
 * @param {object} options - Configuration options: { onToken, maxNewTokens = 128, doSample = false }
 * @returns {Promise<string>} The complete cleaned generated response
 */
export async function generateQwenResponse(messages, options = {}) {
  const {
    onToken = () => {},
    maxNewTokens = 128,
    doSample = false,
    temperature = 0.2,
  } = options;

  let generator;
  try {
    generator = await getQwenGenerator();
  } catch (err) {
    throw err;
  }

  /*
   * IMPORTANT:
   * Qwen3 defaults to thinking mode.
   * Thinking mode must be explicitly disabled via apply_chat_template:
   * enable_thinking: false
   */
  const prompt = generator.tokenizer.apply_chat_template(
    messages,
    {
      tokenize: false,
      add_generation_prompt: true,
      enable_thinking: false,
    }
  );

  let rawAccumulated = '';

  const streamer = new TextStreamer(generator.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (text) => {
      rawAccumulated += text;
      const cleaned = cleanStreamingOutput(rawAccumulated);
      onToken(cleaned);
    },
  });

  try {
    await generator(prompt, {
      max_new_tokens: maxNewTokens,
      do_sample: doSample,
      ...(doSample ? { temperature } : {}),
      streamer,
    });
  } catch (err) {
    if (err?.message && /device.*lost|context.*lost|invalidated|destroyed/i.test(err.message)) {
      handleDeviceLost({ message: err.message });
    }
    throw err;
  }

  return cleanOutput(rawAccumulated);
}

export default {
  RUNTIME_TIERS,
  getRuntimeConfig,
  probeDeviceCapability,
  getCachedCapability,
  isWebGPUSupported,
  isModelReady,
  getModelStatus,
  cleanStreamingOutput,
  cleanOutput,
  getQwenGenerator,
  generateQwenResponse,
  prewarmQwen,
  resetQwenGenerator,
  subscribeState,
  subscribeProgress,
};
