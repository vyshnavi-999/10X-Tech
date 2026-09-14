import { retrieveKnowledge } from '../src/knowledge/index.js';

const queries = [
  'What is Akshara and what does it do?',
  'What is LUCA and what is its role at 10X?',
  'Can I buy a 10X smartphone today and how much does it cost?',
  'When will the 10X IPO happen and what is the share price?'
];

for (const q of queries) {
  const res = retrieveKnowledge(q, { topK: 3, minScore: 0.8 });
  console.log('========================================');
  console.log('Query:', q);
  console.log('========================================');
  res.scoredResults.forEach((r, idx) => {
    console.log(`Chunk ${idx + 1}: [${r.chunk.id}] Score: ${r.score.toFixed(2)} | Title: "${r.chunk.title}"`);
    console.log('Content preview:');
    console.log(r.chunk.content.trim().slice(0, 250) + '...\n');
  });
}
