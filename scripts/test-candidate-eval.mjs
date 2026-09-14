import { retrieveKnowledge, formatKnowledgeContext } from '../src/knowledge/index.js';

const TEST_QUESTIONS = [
  { id: 'Q1', label: 'Factual 10X', query: 'What is Akshara and what does it do?' },
  { id: 'Q2', label: 'RAG Grounded', query: 'What is LUCA and what is its role at 10X?' },
  { id: 'Q3', label: 'Sensitive Benchmarks', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: 'Q4', label: 'Hallucination Probe', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: 'Q5', label: 'Off-Topic', query: 'Can you give me a recipe for chocolate cake?' },
  { id: 'Q6', label: 'Speculative Claim', query: 'When will the 10X IPO happen and what is the share price?' }
];

function buildCurrentPrompt(context) {
  const baseRules = `You are LUCA, the AI assistant for 10X Technologies.

Rules:
- Answer factually, directly, and concisely without conversational filler.
- Rely strictly on the verified 10X company knowledge below. Never guess, assume, or invent facts, dates, numbers, or achievements.
- Historical facts must only answer historical questions; never present past awards or prior milestones as current status.
- If verified context is insufficient or unconfirmed, state clearly that verified information is unavailable. Never invent unverified details.
- No conversational sign-offs (e.g., "Feel free to ask", "Let me know if you need help"). Never prepend "I am LUCA" unless asked who you are.
- Prohibited overclaims: Do not use "India's first", "world's first", "SOTA", "revolutionary", "unparalleled", or "patented" (use "provisional patent applications filed").
- Do not output <think> reasoning tokens.`;

  return `${baseRules}\n\n${context}`;
}

function buildCandidatePrompt(context) {
  const baseRules = `You are LUCA, the AI assistant for 10X Technologies.

Rules:
- Answer factually, directly, and concisely. No conversational filler, greetings, or sign-offs.
- Rely strictly on the verified knowledge below. If unconfirmed or missing, state that verified information is unavailable. Never guess or invent details.
- Historical facts must only answer historical questions; never present past awards or prior milestones as current status.
- Prohibited overclaims: Do not use "India's first", "world's first", "SOTA", "revolutionary", "unparalleled", or "patented" (use "provisional patent applications filed").
- Do not output <think> reasoning tokens.`;

  return `${baseRules}\n\n${context}`;
}

async function runInference(systemContent, userPrompt) {
  const fullPrompt = `<|im_start|>system\n${systemContent}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n`;

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
  return data.response.trim();
}

async function main() {
  console.log('Testing Candidate Dense Prompt vs Current Prompt across all 6 queries...\n');

  for (const t of TEST_QUESTIONS) {
    console.log(`=======================================================`);
    console.log(`[${t.id}: ${t.label}] Query: "${t.query}"`);
    console.log(`=======================================================`);

    const ragResult = retrieveKnowledge(t.query, { topK: 3, minScore: 0.8 });
    let knowledgeContext = '';
    if (ragResult.hasMatch && ragResult.chunks.length > 0) {
      knowledgeContext = formatKnowledgeContext(ragResult.chunks, { verificationAnalysis: ragResult.verificationAnalysis });
    } else if (ragResult.verificationAnalysis?.isInsufficient) {
      knowledgeContext = formatKnowledgeContext([], { verificationAnalysis: ragResult.verificationAnalysis });
    }

    if (ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer) {
      console.log('-> Guarded Short-Circuit Triggered (Identical across both):');
      console.log(`"${ragResult.verificationAnalysis.suggestedAnswer}"\n`);
      continue;
    }

    const currPrompt = buildCurrentPrompt(knowledgeContext);
    const candPrompt = buildCandidatePrompt(knowledgeContext);

    const currAns = await runInference(currPrompt, t.query);
    const candAns = await runInference(candPrompt, t.query);

    console.log('[CURRENT PROMPT ANSWER]:');
    console.log(currAns);
    console.log('\n[CANDIDATE DENSE PROMPT ANSWER]:');
    console.log(candAns);
    console.log('\n');
  }
}

main().catch(console.error);
