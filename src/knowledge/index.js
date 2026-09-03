/**
 * 10X Technologies Knowledge Base Module
 * 
 * Single entry point for client-side RAG:
 * - KNOWLEDGE_CHUNKS: Full array of curated, verified knowledge chunks with temporal metadata.
 * - VERIFICATION_GUARDS: Safety metadata representing unresolved [[VERIFY]] claims from the corpus.
 * - analyzeVerification(query): General query classifier for temporal intent and verification status.
 * - retrieveKnowledge(query, options): High-speed search with multi-chunk evidence and verification checking.
 * - formatKnowledgeContext(chunks, options): Formats chunks with safety directives for model prompt injection.
 * - getChunkById(id): Direct lookup by chunk ID.
 * - getChunksByCategory(category): Filter chunks by category.
 */

export { KNOWLEDGE_CHUNKS } from './knowledgeChunks.js';
export { VERIFICATION_GUARDS, analyzeVerification } from './verificationGuards.js';
export {
  retrieveKnowledge,
  formatKnowledgeContext,
  getChunkById,
  getChunksByCategory,
  getAllCategories
} from './knowledgeRetriever.js';
export { default } from './knowledgeRetriever.js';
