import { AutoTokenizer } from '@huggingface/transformers';
import { retrieveKnowledge, formatKnowledgeContext, buildSystemPrompt } from '../src/knowledge/index.js';

const BENCHMARK_QUERIES = [
  { id: 'Q1', label: 'Factual 10X', query: 'What is Akshara and what does it do?' },
  { id: 'Q2', label: 'RAG Grounded', query: 'What is LUCA and what is its role at 10X?' },
  { id: 'Q3', label: 'Sensitive Benchmarks', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: 'Q4', label: 'Hallucination Probe', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: 'Q5', label: 'Off-Topic', query: 'Can you give me a recipe for chocolate cake?' },
  { id: 'Q6', label: 'Speculative Claim', query: 'When will the 10X IPO happen and what is the share price?' }
];

async function run() {
  console.log('Loading tokenizer...');
  const tokenizer = await AutoTokenizer.from_pretrained('onnx-community/Qwen3-0.6B-ONNX');

  // 1. Base system rules tokens
  const baseRulesOnly = `You are LUCA, the AI assistant for 10X Technologies.

Rules:
- Answer factually, directly, and concisely without conversational filler.
- Rely strictly on the verified 10X company knowledge below. Never guess, assume, or invent facts, dates, numbers, or achievements.
- Historical facts must only answer historical questions; never present past awards or prior milestones as current status.
- If verified context is insufficient or unconfirmed, state clearly that verified information is unavailable. Never invent unverified details.
- No conversational sign-offs (e.g., "Feel free to ask", "Let me know if you need help"). Never prepend "I am LUCA" unless asked who you are.
- Prohibited overclaims: Do not use "India's first", "world's first", "SOTA", "revolutionary", "unparalleled", or "patented" (use "provisional patent applications filed").
- Do not output <think> reasoning tokens.`;

  const baseTokens = tokenizer.encode(baseRulesOnly);
  console.log('=== 1. Base System Rules Tokens ===');
  console.log('Characters:', baseRulesOnly.length);
  console.log('Tokens:', baseTokens.length);

  console.log('\n=== 2. Benchmark Queries Token Breakdown ===');
  for (const bq of BENCHMARK_QUERIES) {
    const ragResult = retrieveKnowledge(bq.query, { topK: 3, minScore: 0.8 });
    let knowledgeContext = '';
    if (ragResult.hasMatch && ragResult.chunks.length > 0) {
      knowledgeContext = formatKnowledgeContext(ragResult.chunks, { verificationAnalysis: ragResult.verificationAnalysis });
    } else if (ragResult.verificationAnalysis?.isInsufficient) {
      knowledgeContext = formatKnowledgeContext([], { verificationAnalysis: ragResult.verificationAnalysis });
    }

    const systemContent = buildSystemPrompt(knowledgeContext);
    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: bq.query }
    ];

    const formattedFullPrompt = tokenizer.apply_chat_template(messages, {
      tokenize: false,
      add_generation_prompt: true,
      enable_thinking: false
    });

    const userQueryTokens = tokenizer.encode(bq.query);
    const contextTokens = knowledgeContext ? tokenizer.encode(knowledgeContext) : [];
    const systemPromptTokens = tokenizer.encode(systemContent);
    const totalPromptTokens = tokenizer.encode(formattedFullPrompt);
    const templateOverheadTokens = totalPromptTokens.length - (systemPromptTokens.length + userQueryTokens.length);

    console.log(`\n--- [${bq.id}: ${bq.label}] ---`);
    console.log(`Query: "${bq.query}"`);
    console.log(`  User query tokens:        ${userQueryTokens.length}`);
    console.log(`  Retrieved chunks:          ${ragResult.chunks.length} chunks (${ragResult.chunks.map(c => c.id).join(', ')})`);
    console.log(`  Knowledge context tokens:  ${contextTokens.length}`);
    console.log(`  Base rules tokens:         ${baseTokens.length}`);
    console.log(`  System prompt total tokens:${systemPromptTokens.length}`);
    console.log(`  Chat template overhead:    ${templateOverheadTokens} tokens`);
    console.log(`  TOTAL PROMPT TOKENS:       ${totalPromptTokens.length}`);
    console.log(`  Guarded short-circuit:     ${!!(ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer)}`);
  }
}

run().catch(console.error);
