import { AutoTokenizer } from '@huggingface/transformers';
import { retrieveKnowledge } from '../src/knowledge/index.js';
import { buildSystemPrompt } from '../src/knowledge/systemPrompt.js';

// Format 1: Current format in production
function formatCurrent(chunks, options = {}) {
  const { verificationAnalysis } = options;

  if (!chunks || chunks.length === 0) {
    if (verificationAnalysis?.isInsufficient && verificationAnalysis?.suggestedAnswer) {
      return `[VERIFICATION DIRECTIVE]\nTopic: ${verificationAnalysis.activeGuard?.topic || 'Unverified company detail'}\nStatus in verified 10X corpus: UNVERIFIED.\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nNever invent values or state unconfirmed facts.`;
    }
    return '';
  }

  let guardDirectives = '';
  if (verificationAnalysis?.isVerificationSensitive) {
    if (verificationAnalysis.isInsufficient) {
      guardDirectives = `[CRITICAL SAFETY DIRECTIVE: UNVERIFIED CURRENT STATUS]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nUnresolved Fact: ${verificationAnalysis.activeGuard?.unresolvedFact}\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nDo NOT use historical figures as current status.\n${verificationAnalysis.activeGuard?.historicalAllowedSummary ? `Allowed historical context: "${verificationAnalysis.activeGuard.historicalAllowedSummary}"` : ''}`;
    } else if (verificationAnalysis.temporalClassification === 'historical') {
      guardDirectives = `[HISTORICAL CONTEXT NOTICE]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nAnswer using documented historical facts. Do NOT present past awards or milestones as active current status.`;
    }
  }

  const sections = chunks.map((chunk, index) => {
    const statusNote = chunk.temporalStatus ? ` [${chunk.temporalStatus.toUpperCase()}]` : '';
    return `[FACT ${index + 1}: ${chunk.title.toUpperCase()}${statusNote}]\n${chunk.content.trim()}`;
  });

  return `[VERIFIED 10X TECHNOLOGIES KNOWLEDGE BASE]\n${guardDirectives ? guardDirectives.trim() + '\n\n' : ''}${sections.join('\n\n')}\n[END VERIFIED KNOWLEDGE]`;
}

// Format 2: Candidate Streamlined format
function formatStreamlined(chunks, options = {}) {
  const { verificationAnalysis } = options;

  if (!chunks || chunks.length === 0) {
    if (verificationAnalysis?.isInsufficient && verificationAnalysis?.suggestedAnswer) {
      return `[VERIFICATION DIRECTIVE]\nTopic: ${verificationAnalysis.activeGuard?.topic || 'Unverified company detail'}\nStatus: UNVERIFIED.\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nNever invent values or state unconfirmed facts.`;
    }
    return '';
  }

  let guardDirectives = '';
  if (verificationAnalysis?.isVerificationSensitive) {
    if (verificationAnalysis.isInsufficient) {
      guardDirectives = `[CRITICAL SAFETY DIRECTIVE: UNVERIFIED CURRENT STATUS]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nUnresolved Fact: ${verificationAnalysis.activeGuard?.unresolvedFact}\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nDo NOT use historical figures as current status.\n${verificationAnalysis.activeGuard?.historicalAllowedSummary ? `Allowed historical context: "${verificationAnalysis.activeGuard.historicalAllowedSummary}"` : ''}`;
    } else if (verificationAnalysis.temporalClassification === 'historical') {
      guardDirectives = `[HISTORICAL CONTEXT NOTICE]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nAnswer using documented historical facts. Do NOT present past awards or milestones as active current status.`;
    }
  }

  const sections = chunks.map((chunk, index) => {
    const statusNote = chunk.temporalStatus ? ` (${chunk.temporalStatus})` : '';
    return `[Fact ${index + 1}: ${chunk.title}${statusNote}]\n${chunk.content.trim()}`;
  });

  return `[Verified Knowledge Base]\n${guardDirectives ? guardDirectives.trim() + '\n\n' : ''}${sections.join('\n\n')}`;
}

const MATRIX_QUERIES = [
  { id: 'M1', label: 'Smartphone purchase/cost', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: 'M2', label: 'LUCA price/cost', query: 'What does LUCA cost or what is its price?' },
  { id: 'M3', label: 'Software licensing', query: 'How does 10X license its software?' },
  { id: 'M4', label: 'Enterprise/B2B pricing', query: "What is 10X's pricing architecture for B2B schools?" },
  { id: 'M5', label: 'Training cost (unrelated)', query: 'How did training cost impact the Qwen CPT experiment?' },
  { id: 'M6', label: 'Benchmark: Akshara', query: 'What is Akshara and what does it do?' },
  { id: 'M7', label: 'Benchmark: LUCA Role', query: 'What is LUCA and what is its role at 10X?' },
  { id: 'M8', label: 'Benchmark: Sensitive JEE', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: 'M9', label: 'Benchmark: Off-topic', query: 'Can you give me a recipe for chocolate cake?' },
  { id: 'M10', label: 'Benchmark: IPO & share price', query: 'When will the 10X IPO happen and what is the share price?' }
];

const BENCHMARK_6_QUERIES = [
  { id: 'Q1', label: 'Akshara (Factual)', query: 'What is Akshara and what does it do?' },
  { id: 'Q2', label: 'LUCA Role (Grounded)', query: 'What is LUCA and what is its role at 10X?' },
  { id: 'Q3', label: 'JEE Benchmarks (Guarded)', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: 'Q4', label: 'Smartphone Purchase (Hallucination Probe)', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: 'Q5', label: 'Chocolate Cake Recipe (Domain Guard)', query: 'Can you give me a recipe for chocolate cake?' },
  { id: 'Q6', label: 'IPO & Share Price (Speculative)', query: 'When will the 10X IPO happen and what is the share price?' }
];

async function callOllama(systemText, userPrompt) {
  const fullPrompt = `<|im_start|>system\n${systemText}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n`;

  const startTime = performance.now();
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3:0.6b',
      prompt: fullPrompt,
      raw: true,
      stream: false,
      options: { num_predict: 160, temperature: 0.2, top_k: 3, stop: ['<|im_end|>', '<|im_start|>'] }
    })
  });

  const data = await res.json();
  const totalMs = performance.now() - startTime;
  const evalCount = data.eval_count || 0;
  const promptTokens = data.prompt_eval_count || 0;
  const promptEvalDurationMs = (data.prompt_eval_duration || 0) / 1e6;
  const evalDurationMs = (data.eval_duration || 0) / 1e6;
  const tokPerSec = evalDurationMs > 0 ? (evalCount / (evalDurationMs / 1000)).toFixed(1) : '0';

  return {
    response: (data.response || '').trim(),
    promptTokens,
    evalCount,
    promptEvalDurationMs: Math.round(promptEvalDurationMs),
    evalDurationMs: Math.round(evalDurationMs),
    totalMs: Math.round(totalMs),
    tokPerSec
  };
}

async function run() {
  const tokenizer = await AutoTokenizer.from_pretrained('onnx-community/Qwen3-0.6B-ONNX');

  console.log('='.repeat(80));
  console.log('INVESTIGATION 3 OPTION 2: CONTEXT CHUNK DELIMITER STREAMLINING');
  console.log('='.repeat(80));

  console.log('\n--- PART 1: 10-QUERY RETRIEVAL MATRIX TOKEN DELTA ---');
  let totalCurTokens = 0;
  let totalStmTokens = 0;

  for (const item of MATRIX_QUERIES) {
    const rag = retrieveKnowledge(item.query, { topK: 3, minScore: 0.8 });
    const cCur = formatCurrent(rag.chunks, { verificationAnalysis: rag.verificationAnalysis });
    const cStm = formatStreamlined(rag.chunks, { verificationAnalysis: rag.verificationAnalysis });

    const sysCur = buildSystemPrompt(cCur);
    const sysStm = buildSystemPrompt(cStm);

    const tokCur = tokenizer.encode(sysCur).length;
    const tokStm = tokenizer.encode(sysStm).length;
    const diff = tokCur - tokStm;

    totalCurTokens += tokCur;
    totalStmTokens += tokStm;

    console.log(`[${item.id}: ${item.label}]`);
    console.log(`  Chunks retrieved:  ${rag.chunks.map(c => c.id).join(', ') || 'NONE'}`);
    console.log(`  Current Tokens:    ${tokCur}`);
    console.log(`  Streamlined:       ${tokStm}`);
    console.log(`  Token Reduction:   -${diff} tokens (-${((diff / tokCur) * 100).toFixed(1)}%)`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log(`TOTAL 10-QUERY PROMPT TOKENS (Current):     ${totalCurTokens}`);
  console.log(`TOTAL 10-QUERY PROMPT TOKENS (Streamlined): ${totalStmTokens}`);
  console.log(`NET REDUCTION: -${totalCurTokens - totalStmTokens} tokens (-${(((totalCurTokens - totalStmTokens) / totalCurTokens) * 100).toFixed(1)}%)`);
  console.log(`AVERAGE PER-QUERY SAVING: -${Math.round((totalCurTokens - totalStmTokens) / MATRIX_QUERIES.length)} tokens`);
  console.log('-'.repeat(80));

  console.log('\n--- PART 2: 6-QUERY GENERATION & REGRESSION MATRIX ---');

  for (const b of BENCHMARK_6_QUERIES) {
    console.log(`\n======================================================================`);
    console.log(`BENCHMARK [${b.id}: ${b.label}]`);
    console.log(`Query: "${b.query}"`);
    console.log(`======================================================================`);

    const rag = retrieveKnowledge(b.query, { topK: 3, minScore: 0.8 });

    // Check if verification guard short-circuit applies
    if (rag.verificationAnalysis?.isInsufficient && rag.verificationAnalysis?.suggestedAnswer) {
      console.log('⚡ Verification Guard Short-Circuit: Triggered');
      console.log(`Deterministic Refusal: "${rag.verificationAnalysis.suggestedAnswer}"`);
      console.log('Result: IDENTICAL across Current and Streamlined (guarded logic unchanged).');
      continue;
    }

    const cCur = formatCurrent(rag.chunks, { verificationAnalysis: rag.verificationAnalysis });
    const cStm = formatStreamlined(rag.chunks, { verificationAnalysis: rag.verificationAnalysis });

    const sysCur = buildSystemPrompt(cCur);
    const sysStm = buildSystemPrompt(cStm);

    console.log('Running Inference for Current Delimiters...');
    const resCur = await callOllama(sysCur, b.query);

    console.log('Running Inference for Streamlined Delimiters...');
    const resStm = await callOllama(sysStm, b.query);

    console.log(`\n[METRICS: CURRENT vs STREAMLINED]`);
    console.log(`  Prompt Tokens:  ${resCur.promptTokens}  ->  ${resStm.promptTokens} (-${resCur.promptTokens - resStm.promptTokens})`);
    console.log(`  Prefill Time:   ${resCur.promptEvalDurationMs}ms  ->  ${resStm.promptEvalDurationMs}ms`);
    console.log(`  Output Tokens:  ${resCur.evalCount}  vs  ${resStm.evalCount}`);
    console.log(`  Generation Spd: ${resCur.tokPerSec} tok/s  vs  ${resStm.tokPerSec} tok/s`);

    console.log(`\n[CURRENT OUTPUT]:\n${resCur.response}`);
    console.log(`\n[STREAMLINED OUTPUT]:\n${resStm.response}`);

    // Evaluation checks
    const hasHallucination = /can buy|available for purchase|costs \$|priced at \$|\$799|\$999/i.test(resStm.response);
    const hasRefusal = /not available|insufficient|unverified|unavailable|not for sale|cannot buy/i.test(resStm.response);
    console.log(`\n[GROUNDING / SAFETY AUDIT]:`);
    console.log(`  Refusal Intact:      ${hasRefusal ? 'YES' : 'N/A'}`);
    console.log(`  Hallucination Free:  ${!hasHallucination ? 'YES' : 'FAIL'}`);
  }
}

run().catch(console.error);
