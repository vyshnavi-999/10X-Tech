/**
 * 10X Technologies Knowledge Retrieval Engine (Client-Side RAG)
 * 
 * Capabilities:
 * - 100% Client-side execution (runs in browser memory in <1ms).
 * - Zero external API calls, zero tracking, zero external network dependency.
 * - BM25 scoring combined with keyword, title, and exact phrase boosting.
 * - Suffix normalization and domain-aware synonym mapping.
 * - Deep integration with Verification Guards & Temporal Safety Metadata.
 * - Multi-chunk evidence gathering across historical and current facts.
 * - Formats verified knowledge directly for LUCA / Qwen prompt injection.
 */

import { KNOWLEDGE_CHUNKS } from './knowledgeChunks.js';
import { VERIFICATION_GUARDS, analyzeVerification, normalizeQuery } from './verificationGuards.js';

// Common English stopwords that add noise to scoring
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

// Domain synonym and intent mappings for 10X Technologies
const SYNONYMS = {
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

/**
 * Tokenize and normalize a string into cleaned word tokens
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(token => token.length > 1);
}

/**
 * Perform light stemming on common English suffixes
 */
function stemWord(word) {
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * Pre-index the corpus chunks for fast retrieval
 */
class KnowledgeIndex {
  constructor(chunks) {
    this.chunks = chunks;
    this.chunkCount = chunks.length;
    this.avgDocLength = 0;
    this.docTokens = new Map();
    this.docFrequencies = new Map();

    this.init();
  }

  init() {
    let totalLength = 0;

    this.chunks.forEach(chunk => {
      // Combine title, keywords, and content for indexing
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

      // Calculate document frequency for each unique term
      const uniqueTerms = new Set(stemmedTokens);
      uniqueTerms.forEach(term => {
        const count = this.docFrequencies.get(term) || 0;
        this.docFrequencies.set(term, count + 1);
      });
    });

    this.avgDocLength = totalLength / Math.max(1, this.chunkCount);
  }

  /**
   * Compute BM25 Inverse Document Frequency
   */
  getIdf(term) {
    const docFreq = this.docFrequencies.get(term) || 0;
    return Math.log(1 + (this.chunkCount - docFreq + 0.5) / (docFreq + 0.5));
  }

  /**
   * Search knowledge chunks given a user query string
   */
  search(query, options = {}) {
    let {
      topK = 3,
      minScore = 0.8,
      category = null
    } = options;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return {
        chunks: [],
        hasMatch: false,
        topScore: 0,
        query: '',
        verificationAnalysis: null,
        chunksDebug: []
      };
    }

    const cleanQuery = query.toLowerCase().trim();
    const normalized = normalizeQuery(cleanQuery);
    const verificationAnalysis = analyzeVerification(cleanQuery);

    // Multi-chunk evidence: If question is verification-sensitive or asks about current status/numbers,
    // ensure we retrieve at least 4 chunks to evaluate both historical and current context.
    if (verificationAnalysis.isVerificationSensitive) {
      topK = Math.max(topK, 4);
    }

    const rawQueryTokens = tokenize(cleanQuery);
    
    // Filter non-essential stopwords unless query is very short
    const queryTokens = rawQueryTokens.length > 2
      ? rawQueryTokens.filter(t => !STOP_WORDS.has(t))
      : rawQueryTokens;

    if (queryTokens.length === 0) {
      return {
        chunks: [],
        hasMatch: false,
        topScore: 0,
        query: cleanQuery,
        verificationAnalysis,
        chunksDebug: []
      };
    }

    // Expand query with synonyms
    const expandedTokens = new Set();
    queryTokens.forEach(token => {
      const stemmed = stemWord(token);
      expandedTokens.add(stemmed);

      if (SYNONYMS[token]) {
        SYNONYMS[token].forEach(syn => {
          tokenize(syn).forEach(st => expandedTokens.add(stemWord(st)));
        });
      }
    });

    const scores = [];
    const k1 = 1.2;
    const b = 0.75;

    this.chunks.forEach(chunk => {
      if (category && chunk.category !== category) {
        return;
      }

      const docData = this.docTokens.get(chunk.id);
      if (!docData) return;

      let score = 0;
      const termFrequencies = new Map();
      docData.stemmed.forEach(term => {
        termFrequencies.set(term, (termFrequencies.get(term) || 0) + 1);
      });

      // BM25 calculation across query terms
      expandedTokens.forEach(term => {
        const tf = termFrequencies.get(term) || 0;
        if (tf > 0) {
          const idf = this.getIdf(term);
          const numerator = tf * (k1 + 1);
          const denominator = tf + k1 * (1 - b + b * (docData.length / this.avgDocLength));
          let termScore = idf * (numerator / denominator);

          // Boost if term matches chunk Title
          if (docData.titleTokens.has(term)) {
            termScore *= 2.5;
          }

          // Boost if term matches chunk Keywords tag
          if (docData.keywordTokens.has(term)) {
            termScore *= 3.0;
          }

          score += termScore;
        }
      });

      // Bonus for exact multi-word phrase occurrences in content or title
      const lowerContent = chunk.content.toLowerCase();
      const lowerTitle = chunk.title.toLowerCase();

      if (lowerTitle.includes(cleanQuery)) {
        score += 12.0;
      } else if (lowerContent.includes(cleanQuery)) {
        score += 6.0;
      }

      // Sub-phrase matching (e.g. "mani bhavan", "smart speaker", "token fertility", "aws activate")
      if (score > 0 && rawQueryTokens.length >= 2) {
        for (let i = 0; i < rawQueryTokens.length - 1; i++) {
          const w1 = rawQueryTokens[i];
          const w2 = rawQueryTokens[i + 1];
          if (STOP_WORDS.has(w1) && STOP_WORDS.has(w2)) {
            continue;
          }
          const bigram = `${w1} ${w2}`;
          if (lowerTitle.includes(bigram)) {
            score += 4.0;
          } else if (lowerContent.includes(bigram)) {
            score += 2.0;
          }
        }
      }

      if (score >= minScore) {
        scores.push({
          chunk,
          score,
          title: chunk.title,
          category: chunk.category
        });
      }
    });

    // Sort by descending score
    scores.sort((a, b) => b.score - a.score);

    const topResults = scores.slice(0, topK);
    const topScore = topResults.length > 0 ? topResults[0].score : 0;
    const hasMatch = topResults.length > 0 && topScore >= minScore;

    // Build safety debug metadata for inspection
    const chunksDebug = topResults.map(r => ({
      id: r.chunk.id,
      title: r.chunk.title,
      temporalStatus: r.chunk.temporalStatus || 'current',
      verificationSensitivity: r.chunk.verificationSensitivity || 'none',
      factualStatus: r.chunk.factualStatus || 'verified',
      sourceSection: r.chunk.sourceSection || 'N/A',
      score: Number(r.score.toFixed(2))
    }));

    return {
      chunks: topResults.map(r => r.chunk),
      hasMatch,
      topScore,
      scoredResults: topResults,
      query: cleanQuery,
      verificationAnalysis,
      chunksDebug
    };
  }
}

// Global singleton index for instant retrieval
const GLOBAL_INDEX = new KnowledgeIndex(KNOWLEDGE_CHUNKS);

/**
 * Retrieve verified knowledge chunks relevant to user input
 * 
 * @param {string} query - The user question or prompt
 * @param {object} options - Optional parameters: { topK = 3, minScore = 0.8, category }
 * @returns {object} { chunks, hasMatch, topScore, scoredResults, query, verificationAnalysis, chunksDebug }
 */
export function retrieveKnowledge(query, options = {}) {
  return GLOBAL_INDEX.search(query, options);
}

/**
 * Format retrieved knowledge chunks into an authoritative prompt context block
 * with temporal and verification guards strictly applied.
 * 
 * @param {Array} chunks - The chunks returned from retrieveKnowledge
 * @param {object} options - Optional context options { verificationAnalysis }
 * @returns {string} Formatted context block ready to inject into LUCA prompt
 */
export function formatKnowledgeContext(chunks, options = {}) {
  const { verificationAnalysis } = options;

  if (!chunks || chunks.length === 0) {
    if (verificationAnalysis?.isInsufficient && verificationAnalysis?.suggestedAnswer) {
      return `
[VERIFICATION SAFETY DIRECTIVE]
The user query inquires about: ${verificationAnalysis.activeGuard?.unresolvedFact || 'an unverified company detail'}.
Status in verified 10X corpus: UNVERIFIED.
Required response: "${verificationAnalysis.suggestedAnswer}"
Never invent values or state unconfirmed facts.
[END VERIFICATION SAFETY DIRECTIVE]
`.trim();
    }
    return '';
  }

  let guardDirectives = '';
  if (verificationAnalysis?.isVerificationSensitive) {
    if (verificationAnalysis.isInsufficient) {
      guardDirectives = `
[CRITICAL SAFETY DIRECTIVE: UNVERIFIED CURRENT STATUS]
Topic: ${verificationAnalysis.activeGuard?.topic}
Unresolved Fact: ${verificationAnalysis.activeGuard?.unresolvedFact}
Instruction: The user is asking about current status or exact details that are marked as UNVERIFIED in the 10X corpus.
You must state clearly that the available verified information is insufficient (e.g. "${verificationAnalysis.suggestedAnswer}").
Do NOT use historical figures (such as prior awards, past amounts, or roadmap plans) as current status.
${verificationAnalysis.activeGuard?.historicalAllowedSummary ? `Allowed historical context (if appropriate): "${verificationAnalysis.activeGuard.historicalAllowedSummary}"` : ''}
[END CRITICAL SAFETY DIRECTIVE]
`;
    } else if (verificationAnalysis.temporalClassification === 'historical') {
      guardDirectives = `
[HISTORICAL CONTEXT NOTICE]
Topic: ${verificationAnalysis.activeGuard?.topic}
The user is asking a historical question. You may answer using documented historical facts from the context below.
Do NOT present historical achievements or past awards as the active current status.
[END HISTORICAL CONTEXT NOTICE]
`;
    }
  }

  const sections = chunks.map((chunk, index) => {
    const statusNote = chunk.temporalStatus ? ` (TEMPORAL STATUS: ${chunk.temporalStatus.toUpperCase()})` : '';
    return `[FACT ${index + 1}: ${chunk.title.toUpperCase()}${statusNote}]\n${chunk.content.trim()}`;
  });

  return `
[VERIFIED 10X TECHNOLOGIES KNOWLEDGE BASE]
Use the following verified company facts to answer the question.
Never invent facts, dates, names, or performance metrics outside this verified context.
If this context does not contain enough information to answer, state clearly that you do not have verified information.
${guardDirectives ? '\n' + guardDirectives.trim() + '\n' : ''}
${sections.join('\n\n')}
[END OF VERIFIED KNOWLEDGE]
`.trim();
}

/**
 * Helper to get a specific chunk by its ID
 */
export function getChunkById(id) {
  return KNOWLEDGE_CHUNKS.find(chunk => chunk.id === id) || null;
}

/**
 * Helper to get all chunks in a given category
 */
export function getChunksByCategory(category) {
  return KNOWLEDGE_CHUNKS.filter(chunk => chunk.category === category);
}

/**
 * Helper to get all available categories
 */
export function getAllCategories() {
  return Array.from(new Set(KNOWLEDGE_CHUNKS.map(c => c.category)));
}

/**
 * Export default object for convenience
 */
export default {
  KNOWLEDGE_CHUNKS,
  VERIFICATION_GUARDS,
  retrieveKnowledge,
  formatKnowledgeContext,
  analyzeVerification,
  getChunkById,
  getChunksByCategory,
  getAllCategories
};
