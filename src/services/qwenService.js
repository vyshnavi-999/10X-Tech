/**
 * 10X Technologies - Qwen WebGPU Service
 * 
 * Manages singleton Qwen3-0.6B-ONNX WebGPU pipeline instance,
 * prompt templating (with thinking mode disabled), and streaming inference.
 */

import { pipeline, TextStreamer, env } from '@huggingface/transformers';

// Ensure standard Transformers.js browser Cache API is active
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';

let modelPromise = null;
let modelGenerator = null;

/**
 * Check if the current browser environment supports WebGPU
 */
export function isWebGPUSupported() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
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
 * Initialize or retrieve the cached singleton Qwen3-0.6B generator instance
 * 
 * @param {Function} onProgress - Optional callback for download/compilation progress
 * @returns {Promise<Function>} The text-generation pipeline instance
 */
export async function getQwenGenerator(onProgress) {
  if (modelGenerator) {
    return modelGenerator;
  }

  if (modelPromise) {
    return modelPromise;
  }

  if (!isWebGPUSupported()) {
    throw new Error('WebGPU is not available in this browser. Please use a recent Chrome or Edge browser.');
  }

  modelPromise = (async () => {
    try {
      const generator = await pipeline(
        'text-generation',
        MODEL_ID,
        {
          device: 'webgpu',
          dtype: 'q4f16',
          progress_callback: onProgress,
        }
      );
      modelGenerator = generator;
      return generator;
    } catch (err) {
      modelPromise = null; // Allow retry on failure
      throw err;
    }
  })();

  return modelPromise;
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

  const generator = await getQwenGenerator();

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

  await generator(prompt, {
    max_new_tokens: maxNewTokens,
    do_sample: doSample,
    streamer,
  });

  return cleanOutput(rawAccumulated);
}

export default {
  isWebGPUSupported,
  cleanOutput,
  getQwenGenerator,
  generateQwenResponse,
};
