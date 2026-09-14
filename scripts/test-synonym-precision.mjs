import { AutoTokenizer } from '@huggingface/transformers';
import { KNOWLEDGE_CHUNKS } from '../src/knowledge/knowledgeChunks.js';
import { analyzeVerification, VERIFICATION_GUARDS } from '../src/knowledge/verificationGuards.js';
import { formatKnowledgeContext, buildSystemPrompt } from '../src/knowledge/index.js';

// Define the two synonym sets: Current vs Refined
const SYNONYMS_CURRENT = {
  'ceo': ['founder', 'mani', 'bhavan', 'leadership'],
  'founder': ['mani', 'bhavan', 'ceo', 'first-generation'],
  'started': ['founded', 'origin', 'genesis', 'history', 'pivot'],
  'created': ['founded', 'built', 'developed'],
  'location': ['ongole', 'headquarters', 'based', 'address', 'city', 'prakasam'],
  'where': ['location', 'ongole', 'headquarters', 'based'],
  'speaker': ['luca', 'hardware', 'device', 'eyes', 'smart speaker'],
  'os': ['libre', 'libre os', 'operating system', 'voice-first', 'intent'],
  'model': ['akshara', 'lfm', 'slm', 'monolingual', 'tokenizer', 'qwen'],
  'models': ['akshara', 'lfm', 'slm', 'monolingual', 'tokenizer'],
  'tokenizer': ['akshara', 'fertility', 'tokens', 'vocabulary', 'morpheme'],
  'tokenizers': ['akshara', 'fertility', 'tokens', 'vocabulary'],
  'money': ['funding', 'grants', 'capital', 'pricing', 'meity', 'genesis'],
  'funding': ['meity', 'genesis', 'grant', 'aws', 'google', 'investor', 'equity'],
  'invest': ['investment', 'investor', 'equity', 'valuation', 'fundraising'],
  'price': ['pricing', 'cost', 'seat', 'license', 'perpetual'],
  'cost': ['pricing', 'price', 'economics', 'license'],
  'competitors': ['sarvam', 'ai4bharat', 'openai', 'google', 'competition', 'echo', 'nest'],
  'build': ['products', 'stack', 'akshara', 'libre os', 'luca', 'hardware', 'models'],
  'builds': ['products', 'stack', 'akshara', 'libre os', 'luca', 'hardware', 'models'],
  'product': ['build', 'builds', 'stack', 'akshara', 'libre os', 'luca', 'hardware', 'models'],
  'products': ['build', 'builds', 'stack', 'akshara', 'libre os', 'luca', 'hardware', 'models'],
  'school': ['education', 'student', 'curriculum', 'parent', 'teacher', 'jee'],
  'privacy': ['sovereignty', 'on-premise', 'local', 'offline', 'dpdp']
};

const SYNONYMS_REFINED = {
  ...SYNONYMS_CURRENT,
  'price': ['pricing', 'cost'],
  'cost': ['pricing', 'price', 'economics'],
  'pricing': ['price', 'cost', 'economics'],
  'license': ['licensing', 'seat', 'perpetual', 'maintenance', 'b2b'],
  'licensing': ['license', 'seat', 'perpetual', 'maintenance', 'b2b'],
  'seat': ['license', 'perpetual', 'maintenance', 'b2b', 'seats']
};

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i',
  'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'which', 'while', 'who', 'whom', 'with', 'would', 'you', 'your', 'yours', 'yourself'
]);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/[\s-]+/).filter(t => t.length > 1);
}

function stemWord(word) {
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) return word.slice(0, -1);
  return word;
}

class TestKnowledgeIndex {
  constructor(chunks, synonyms) {
    this.chunks = chunks;
    this.synonyms = synonyms;
    this.chunkCount = chunks.length;
    this.docTokens = new Map();
    this.docFrequencies = new Map();
    this.init();
  }

  init() {
    let totalLength = 0;
    this.chunks.forEach(chunk => {
      const titleTokens = tokenize(chunk.title);
      const keywordTokens = (chunk.keywords || []).flatMap(k => tokenize(k));
      const contentTokens = tokenize(chunk.content);
      const allTokens = [...titleTokens, ...keywordTokens, ...contentTokens];
      const stemmedTokens = allTokens.map(stemWord);

      this.docTokens.set(chunk.id, {
        raw: allTokens,
        stemmed: stemmedTokens,
        titleTokens: new Set(titleTokens.map(stemWord)),
        keywordTokens: new Set(keywordTokens.map(stemWord)),
        length: allTokens.length
      });

      totalLength += allTokens.length;
      const uniqueTerms = new Set(stemmedTokens);
      uniqueTerms.forEach(term => {
        this.docFrequencies.set(term, (this.docFrequencies.get(term) || 0) + 1);
      });
    });
    this.avgDocLength = totalLength / Math.max(1, this.chunkCount);
  }

  getIdf(term) {
    const docFreq = this.docFrequencies.get(term) || 0;
    return Math.log(1 + (this.chunkCount - docFreq + 0.5) / (docFreq + 0.5));
  }

  search(query, options = {}) {
    let { topK = 3, minScore = 0.8 } = options;
    const cleanQuery = query.toLowerCase().trim();
    const verificationAnalysis = analyzeVerification(cleanQuery);

    if (verificationAnalysis.isVerificationSensitive) {
      topK = Math.max(topK, 4);
    }

    const rawQueryTokens = tokenize(cleanQuery);
    const queryTokens = rawQueryTokens.length > 2 ? rawQueryTokens.filter(t => !STOP_WORDS.has(t)) : rawQueryTokens;
    const expandedTokens = new Set();
    queryTokens.forEach(token => {
      const stemmed = stemWord(token);
      expandedTokens.add(stemmed);
      if (this.synonyms[token]) {
        this.synonyms[token].forEach(syn => {
          tokenize(syn).forEach(st => expandedTokens.add(stemWord(st)));
        });
      }
    });

    const k1 = 1.2;
    const b = 0.75;
    const scores = [];

    this.chunks.forEach(chunk => {
      const docData = this.docTokens.get(chunk.id);
      if (!docData) return;
      let bm25Score = 0;
      let titleHits = 0;
      let keywordHits = 0;

      const termCounts = new Map();
      docData.stemmed.forEach(term => {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
      });

      expandedTokens.forEach(term => {
        const tf = termCounts.get(term) || 0;
        if (tf > 0) {
          const idf = this.getIdf(term);
          const num = tf * (k1 + 1);
          const den = tf + k1 * (1 - b + b * (docData.length / this.avgDocLength));
          bm25Score += idf * (num / den);
          if (docData.titleTokens.has(term)) titleHits++;
          if (docData.keywordTokens.has(term)) keywordHits++;
        }
      });

      const totalScore = bm25Score + (titleHits * 4.0) + (keywordHits * 3.0);
      if (totalScore >= minScore) {
        scores.push({ chunk, score: totalScore });
      }
    });

    scores.sort((a, b) => b.score - a.score);
    const topResults = scores.slice(0, topK);
    return {
      chunks: topResults.map(r => r.chunk),
      scoredResults: topResults,
      verificationAnalysis
    };
  }
}

const TEST_QUERIES = [
  { id: '1', label: 'Smartphone purchase/cost', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: '2', label: 'LUCA price/cost', query: 'What does LUCA cost or what is its price?' },
  { id: '3', label: 'Software licensing', query: 'How does 10X license its software?' },
  { id: '4', label: 'Enterprise/B2B pricing', query: "What is 10X's pricing architecture for B2B schools?" },
  { id: '5', label: 'Training cost (unrelated)', query: 'How did training cost impact the Qwen CPT experiment?' },
  { id: '6', label: 'Benchmark: Akshara', query: 'What is Akshara and what does it do?' },
  { id: '7', label: 'Benchmark: LUCA Role', query: 'What is LUCA and what is its role at 10X?' },
  { id: '8', label: 'Benchmark: Sensitive JEE', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: '9', label: 'Benchmark: Off-topic', query: 'Can you give me a recipe for chocolate cake?' },
  { id: '10', label: 'Benchmark: IPO & share price', query: 'When will the 10X IPO happen and what is the share price?' }
];

async function run() {
  const tokenizer = await AutoTokenizer.from_pretrained('onnx-community/Qwen3-0.6B-ONNX');
  const indexCurrent = new TestKnowledgeIndex(KNOWLEDGE_CHUNKS, SYNONYMS_CURRENT);
  const indexRefined = new TestKnowledgeIndex(KNOWLEDGE_CHUNKS, SYNONYMS_REFINED);

  console.log('='.repeat(80));
  console.log('RAG SYNONYM PRECISION: BEFORE VS AFTER RETRIEVAL MATRIX');
  console.log('='.repeat(80));

  for (const t of TEST_QUERIES) {
    const resBefore = indexCurrent.search(t.query, { topK: 3, minScore: 0.8 });
    const resAfter = indexRefined.search(t.query, { topK: 3, minScore: 0.8 });

    const ctxBefore = resBefore.chunks.length > 0 ? formatKnowledgeContext(resBefore.chunks, { verificationAnalysis: resBefore.verificationAnalysis }) : '';
    const ctxAfter = resAfter.chunks.length > 0 ? formatKnowledgeContext(resAfter.chunks, { verificationAnalysis: resAfter.verificationAnalysis }) : '';

    const tokBefore = ctxBefore ? tokenizer.encode(ctxBefore).length : 0;
    const tokAfter = ctxAfter ? tokenizer.encode(ctxAfter).length : 0;

    console.log(`\n>>> Query [${t.id}: ${t.label}]`);
    console.log(`"${t.query}"`);
    console.log(`- BEFORE (Current):`);
    console.log(`  Chunks (${resBefore.chunks.length}):`, resBefore.scoredResults.map(r => `${r.chunk.id} (${r.score.toFixed(1)})`).join(', '));
    console.log(`  Context Tokens: ${tokBefore}`);

    console.log(`- AFTER (Refined):`);
    console.log(`  Chunks (${resAfter.chunks.length}):`, resAfter.scoredResults.map(r => `${r.chunk.id} (${r.score.toFixed(1)})`).join(', '));
    console.log(`  Context Tokens: ${tokAfter}`);

    const delta = tokBefore - tokAfter;
    console.log(`  Token Delta: ${delta > 0 ? `-${delta} tokens` : delta < 0 ? `+${-delta} tokens` : '0 tokens'}`);
    console.log(`  Guarded: ${!!(resBefore.verificationAnalysis?.isInsufficient && resBefore.verificationAnalysis?.suggestedAnswer)}`);
  }
}

run().catch(console.error);
