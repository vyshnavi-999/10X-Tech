/**
 * 10X Technologies - Qwen WebGPU Service (P0 Singleton Engine)
 * 
 * Manages the single authoritative Qwen3-0.6B-ONNX WebGPU pipeline instance,
 * shared concurrent initialization promises, WebGPU device.lost lifecycle recovery,
 * synchronous hot-state detection, intent-based prewarming, and streaming inference.
 */

import { pipeline, TextStreamer, env } from '@huggingface/transformers';

// Ensure standard Transformers.js browser Cache API is active
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';

let modelPromise = null;
let modelGenerator = null;
let isDeviceLost = false;
let lastError = null;

// Registry of active progress listeners (allows multiple components or prewarm to subscribe)
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
 * Check if the current browser environment supports WebGPU
 */
export function isWebGPUSupported() {
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
 * Clean any accidental <think> reasoning tokens from Qwen3 output
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

  if (!isWebGPUSupported()) {
    const err = new Error('WebGPU is not available in this browser. Please use a recent Chrome or Edge browser.');
    lastError = err;
    notifyState('error', err);
    throw err;
  }

  isDeviceLost = false;
  lastError = null;
  notifyState('loading');

  // 3. Initiate single authoritative initialization promise
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
      notifyState('error', err);
      throw err;
    }
  })();

  return modelPromise;
}

/**
 * Pre-warm the Qwen WebGPU model on explicit user intent (e.g. hover, focus on LUCA entry point).
 * Non-blocking, safe, and avoids redundant work if already ready or loading.
 */
export function prewarmQwen() {
  if (!isWebGPUSupported()) return;
  if (isModelReady() || modelPromise) return;

  // Background non-blocking warm up
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
      const cleaned = cleanOutput(rawAccumulated);
      onToken(cleaned);
    },
  });

  try {
    await generator(prompt, {
      max_new_tokens: maxNewTokens,
      do_sample: doSample,
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
  isWebGPUSupported,
  isModelReady,
  getModelStatus,
  cleanOutput,
  getQwenGenerator,
  generateQwenResponse,
  prewarmQwen,
  resetQwenGenerator,
  subscribeState,
  subscribeProgress,
};
