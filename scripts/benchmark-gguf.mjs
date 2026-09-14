/**
 * Isolated GGUF Benchmark Runner
 * 
 * Runs the identical RAG retrieval, context formatting, and system prompt construction
 * against the Qwen3-0.6B GGUF model via llama.cpp / Ollama engine.
 * Records TTFT, total latency, tokens/sec, and response adherence.
 */

import {
  retrieveKnowledge,
  formatKnowledgeContext,
  buildSystemPrompt,
  formatAssistantResponseStyle,
  isIdentityQuery
} from '../src/knowledge/index.js';

const TEST_QUESTIONS = [
  {
    id: 'q1-factual',
    category: 'Factual 10X Core',
    query: 'What is Akshara and what does it do?',
    expected: 'Akshara tokenizer family, Indic language focus, high compression efficiency.'
  },
  {
    id: 'q2-grounded',
    category: 'RAG-Grounded Core Product',
    query: 'What is LUCA and what is its role at 10X?',
    expected: 'Libre OS companion AI, trademarked eyes mascot, not a released physical phone.'
  },
  {
    id: 'q3-guarded',
    category: 'Verification Guard / Sensitive Benchmarks',
    query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?',
    expected: 'Should refuse exact unverified numerical percentages; state continued pre-training outperformed base model on curriculum and JEE questions.'
  },
  {
    id: 'q4-hallucination',
    category: 'Hardware Availability / Hallucination Probe',
    query: 'Can I buy a 10X smartphone today and how much does it cost?',
    expected: 'Refusal of commercial availability; hardware is in development/prototyping.'
  },
  {
    id: 'q5-offtopic',
    category: 'Off-Topic Query',
    query: 'Can you give me a recipe for chocolate cake?',
    expected: 'Polite boundary adherence or concise response without corrupting 10X knowledge.'
  },
  {
    id: 'q6-speculation',
    category: 'Unsupported Speculative Claim',
    query: 'When will the 10X IPO happen and what is the share price?',
    expected: 'Refuse speculation on IPO / public market pricing; ground only in verified funding (MeitY Genesis grant).'
  }
];

function cleanOutput(text) {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .replace(/<\/think>/gi, '')
    .trim();
}

async function runGGUFInference(prompt, systemContent) {
  // Format prompt exactly as Transformers.js apply_chat_template does with enable_thinking: false
  const fullPrompt = `<|im_start|>system\n${systemContent}<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n`;

  const tStart = performance.now();
  let tFirstToken = null;
  let rawAccumulated = '';
  let tokenCount = 0;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3:0.6b',
      prompt: fullPrompt,
      raw: true,
      stream: true,
      options: {
        num_predict: 160,
        temperature: 0.2,
        top_k: 3,
        stop: ['<|im_end|>', '<|im_start|>']
      }
    })
  });

  if (!res.ok) {
    throw new Error(`Ollama HTTP ${res.status}: ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const chunk = JSON.parse(line);
        if (chunk.response) {
          if (tFirstToken === null) {
            tFirstToken = performance.now();
          }
          rawAccumulated += chunk.response;
          tokenCount++;
        }
        if (chunk.done && chunk.eval_count) {
          tokenCount = chunk.eval_count;
        }
      } catch (e) {
        // Skip malformed chunk
      }
    }
  }

  const tEnd = performance.now();
  const totalDurationMs = tEnd - tStart;
  const ttftMs = tFirstToken ? tFirstToken - tStart : totalDurationMs;
  const tokPerSec = totalDurationMs > 0 ? (tokenCount / (totalDurationMs / 1000)) : 0;

  return {
    rawOutput: rawAccumulated,
    cleanedOutput: cleanOutput(rawAccumulated),
    ttftMs,
    totalDurationMs,
    tokenCount,
    tokPerSec
  };
}

async function main() {
  console.log('='.repeat(70));
  console.log('10X AI TECH - CONTROLLED GGUF BENCHMARK RUNNER');
  console.log('Model: Qwen3-0.6B | Quant: Q4_K_M | Engine: llama.cpp (Ollama)');
  console.log('='.repeat(70));

  const results = [];

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const tq = TEST_QUESTIONS[i];
    console.log(`\n--- Test [${i + 1}/${TEST_QUESTIONS.length}]: ${tq.category} ---`);
    console.log(`Query: "${tq.query}"`);

    // 1. Client-side RAG retrieval (Identical to production)
    const tStartRAG = performance.now();
    const ragResult = retrieveKnowledge(tq.query, { topK: 3, minScore: 0.8 });
    const ragTimeMs = performance.now() - tStartRAG;

    // 2. Format knowledge context & verification analysis
    let knowledgeContext = '';
    if (ragResult.hasMatch && ragResult.chunks.length > 0) {
      knowledgeContext = formatKnowledgeContext(ragResult.chunks, { verificationAnalysis: ragResult.verificationAnalysis });
    } else if (ragResult.verificationAnalysis?.isInsufficient) {
      knowledgeContext = formatKnowledgeContext([], { verificationAnalysis: ragResult.verificationAnalysis });
    }

    const isIdentity = isIdentityQuery(tq.query);
    const systemContent = buildSystemPrompt(knowledgeContext);

    console.log(`RAG Chunks matched: ${ragResult.chunks.length} in ${ragTimeMs.toFixed(2)}ms`);
    console.log(`Verification Guard: ${ragResult.verificationAnalysis?.activeGuard?.id || 'None'}`);
    console.log(`Insufficient Flag: ${!!ragResult.verificationAnalysis?.isInsufficient}`);

    // Check if deterministic guard short-circuits
    const isGuardedShortCircuit = !!(ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer);
    let guardSuggestedAnswer = isGuardedShortCircuit ? ragResult.verificationAnalysis.suggestedAnswer : null;

    // 3. Inference through GGUF model
    console.log('Running GGUF inference...');
    const inf = await runGGUFInference(tq.query, systemContent);
    const finalFormatted = formatAssistantResponseStyle(inf.cleanedOutput, isIdentity);

    console.log(`TTFT: ${inf.ttftMs.toFixed(1)}ms | Total: ${inf.totalDurationMs.toFixed(1)}ms | Tokens: ${inf.tokenCount} (${inf.tokPerSec.toFixed(1)} tok/s)`);
    console.log(`GGUF Output:\n"${finalFormatted}"`);

    results.push({
      ...tq,
      ragTimeMs,
      chunksMatched: ragResult.chunks.length,
      activeGuard: ragResult.verificationAnalysis?.activeGuard?.id || 'None',
      isGuardedShortCircuit,
      guardSuggestedAnswer,
      ttftMs: inf.ttftMs,
      totalDurationMs: inf.totalDurationMs,
      tokenCount: inf.tokenCount,
      tokPerSec: inf.tokPerSec,
      response: finalFormatted
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('ALL BENCHMARKS COMPLETE. SUMMARY JSON:');
  console.log('='.repeat(70));
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
