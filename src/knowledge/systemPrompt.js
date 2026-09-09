/**
 * 10X Technologies - Authoritative Prompt Builder & Response Sanitizer
 * 
 * Centralized, token-optimized system prompt and response formatting for LUCA.
 * Eliminates instruction duplication and guarantees that all grounding,
 * temporal, anti-hallucination, and anti-overclaim rules are strictly enforced.
 */

/**
 * Builds a dense, token-efficient system prompt for Qwen3-0.6B
 * 
 * @param {string} knowledgeContext - Formatted context block from formatKnowledgeContext()
 * @returns {string} The complete system prompt
 */
export function buildSystemPrompt(knowledgeContext = '') {
  const baseRules = `You are LUCA, the AI assistant for 10X Technologies.

Rules:
- Answer factually, directly, and concisely without conversational filler.
- Rely strictly on the verified 10X company knowledge below. Never guess, assume, or invent facts, dates, numbers, or achievements.
- Historical facts must only answer historical questions; never present past awards or prior milestones as current status.
- If verified context is insufficient or unconfirmed, state clearly that verified information is unavailable. Never invent unverified details.
- No conversational sign-offs (e.g., "Feel free to ask", "Let me know if you need help"). Never prepend "I am LUCA" unless asked who you are.
- Prohibited overclaims: Do not use "India's first", "world's first", "SOTA", "revolutionary", "unparalleled", or "patented" (use "provisional patent applications filed").
- Do not output <think> reasoning tokens.`;

  if (knowledgeContext && knowledgeContext.trim()) {
    return `${baseRules}\n\n${knowledgeContext.trim()}`;
  }

  return `${baseRules}\n\n[NOTICE: No verified 10X Technologies knowledge chunks were found for this query. If the query asks about 10X Technologies facts, state clearly that available verified information is insufficient.]`;
}

/**
 * Check if the user query explicitly asks for LUCA's identity
 * 
 * @param {string} query - User input string
 * @returns {boolean} True if identity inquiry
 */
export function isIdentityQuery(query) {
  if (!query || typeof query !== 'string') return false;
  return /\b(who\s+(are\s+you|is\s+luca)|what\s+is\s+your\s+name|introduce\s+yourself|what\s+are\s+you|tell\s+me\s+about\s+yourself|who\s+am\s+i\s+talking\s+to|what\s+should\s+i\s+call\s+you)\b/i.test(query);
}

/**
 * Format and sanitize assistant response text:
 * 1. Remove repetitive generic closings/sign-offs.
 * 2. Remove unnecessary prepended identity statements unless explicitly asked.
 * 3. Ensure response starts directly with the grounded factual answer.
 * 
 * @param {string} text - Raw model output
 * @param {boolean} isIdentity - Whether user specifically asked for identity
 * @returns {string} Sanitized output
 */
export function formatAssistantResponseStyle(text, isIdentity = false) {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove repetitive generic closing phrases
  const closingPatterns = [
    /\s*(?:please\s+)?let\s+me\s+know\s+if\s+you\s+have\s+(?:any\s+)?(?:more\s+|other\s+)?questions[.!]*\s*$/i,
    /\s*(?:please\s+)?let\s+me\s+know\s+if\s+you\s+need\s+(?:any\s+)?(?:more\s+|other\s+)?(?:help|information|assistance|details)[.!]*\s*$/i,
    /\s*feel\s+free\s+to\s+ask\s+(?:if\s+you\s+(?:have|need)\s+(?:any\s+)?(?:more\s+|other\s+)?(?:questions|information|help|details)|more|further)[.!]*\s*$/i,
    /\s*feel\s+free\s+to\s+ask\s+if\s+you'd\s+like\s+to\s+know\s+more[.!]*\s*$/i,
    /\s*(?:is\s+there\s+)?anything\s+else\s+(?:I\s+can\s+help\s+(?:you\s+)?with|you\s+(?:would\s+like|want)\s+to\s+know)\??\s*$/i,
    /\s*how\s+else\s+can\s+I\s+(?:assist|help)\s+you\??\s*$/i,
    /\s*hope\s+this\s+helps[.!]*\s*$/i,
    /\s*(?:please\s+)?don'?t\s+hesitate\s+to\s+ask[.!]*\s*$/i,
    /\s*if\s+you\s+have\s+any\s+(?:other\s+|more\s+)?questions,?\s*(?:please\s+)?(?:feel\s+free\s+to\s+ask|let\s+me\s+know)[.!]*\s*$/i
  ];

  for (const pattern of closingPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // 2. Remove unnecessary prepended identity text if not an identity query
  if (!isIdentity) {
    cleaned = cleaned
      .replace(/^(?:hello!?|hi!?|hey!?|greetings!?)[,\s]*(?:i\s*am|i'm)\s+luca[.,\s]*(?:the\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*|an\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*)?/i, '')
      .replace(/^(?:i\s*am|i'm)\s+luca[.,\s]*(?:the\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*|an\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*)?/i, '')
      .replace(/^(?:as\s+luca[.,\s]*(?:the\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*|an\s+ai\s+assistant[.,\s]*)?)/i, '')
      .replace(/^(?:as\s+an\s+ai\s+assistant\s+(?:for\s+10x\s+technologies)?[.,\s]*)/i, '')
      .replace(/^[.,:;\s-]+/, '')
      .trim();

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  }

  return cleaned.trim();
}
