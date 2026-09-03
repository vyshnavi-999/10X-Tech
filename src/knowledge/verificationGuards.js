/**
 * 10X Technologies - Verification Guards & Temporal Safety Metadata
 * 
 * Authoritative Source: 10X_Technologies_Knowledge_Corpus_v1-1.md
 * 
 * Safety Metadata representing every unresolved [[VERIFY]] item from the corpus.
 * These guards ensure that:
 * 1. Historical facts are NEVER presented as current status.
 * 2. Unresolved claims trigger honest "insufficient verified information" answers.
 * 3. Legitimate historical queries receive their verified historical facts.
 * 4. Qwen is strictly constrained with explicit negative rules and factual boundaries.
 */

export const VERIFICATION_GUARDS = [
  // -------------------------------------------------------------------------
  // 1. AWS Activate Status
  // -------------------------------------------------------------------------
  {
    id: 'guard-aws-activate',
    topic: 'AWS Activate',
    entity: 'Amazon Web Services / AWS Activate',
    unresolvedFact: 'Current AWS Activate tier, approval status, and active credit balance',
    issueType: 'current_status',
    triggerPatterns: [
      /\b(aws|amazon(\s+web\s+services)?)\b.*\b(activate|credits?|tier|status)\b/i,
      /\bactivate\b.*\b(tier|status|credits?|aws|amazon)\b/i,
      /\b(aws\s*activate)\b/i
    ],
    currentStatusPatterns: [
      /\b(current|currently|now|latest|present|today|status|tier|approval|active|approved|balance|exact)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|previously|prior|in the past|past|earlier|initially|before|previously\s+receive|ever\s+receive)\b/i
    ],
    allowedHistoricalFacts: [
      'A prior award at the $10,000 tier was received under Amazon Web Services startup programme (AWS Activate).',
      'A subsequent application at the $25,000 tier was submitted through Mooreas Technologies as reseller partner.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm 10X Technologies' current AWS Activate status.",
    historicalAllowedSummary: "10X previously received an award at the $10,000 tier under the AWS Activate startup program, and submitted a subsequent $25,000 application via Mooreas Technologies; however, the current tier and approval status remain unverified."
  },

  // -------------------------------------------------------------------------
  // 2. Publication Status
  // -------------------------------------------------------------------------
  {
    id: 'guard-publication-status',
    topic: 'Publication Status',
    entity: 'Research Papers & Preprints',
    unresolvedFact: 'Current publication status (whether preprint posted, submitted, under review, or accepted)',
    issueType: 'publication_status',
    triggerPatterns: [
      /\b(publication|paper|papers|preprint|arxiv|published|journal|manuscript|dravidianlangtech)\b/i
    ],
    currentStatusPatterns: [
      /\b(current|currently|now|latest|present|today|status|is.*published|published\s*yet|accepted|posted\s*yet|link|doi|pdf)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|planned\s+venue)\b/i
    ],
    allowedHistoricalFacts: [
      'Publication roadmap developed with Dr. Hariharan at VIT targets an arXiv preprint first to timestamp priority, followed by the DravidianLangTech workshop.',
      'No peer-reviewed paper or preprint has been formally published or accepted yet.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm 10X Technologies' current publication status.",
    historicalAllowedSummary: "10X Technologies has planned an arXiv preprint followed by DravidianLangTech with Dr. Hariharan (VIT), but no paper has been officially published yet."
  },

  // -------------------------------------------------------------------------
  // 3. IndiaAI Mission Engagement
  // -------------------------------------------------------------------------
  {
    id: 'guard-indiaai-mission',
    topic: 'IndiaAI Mission Engagement',
    entity: 'IndiaAI Mission / MeitY',
    unresolvedFact: 'Formal IndiaAI Mission engagement, empanelment, award, or allocation',
    issueType: 'government_engagement',
    triggerPatterns: [
      /\b(india\s*ai(\s*mission)?|indiaai)\b/i
    ],
    currentStatusPatterns: [
      /\b(participating|working\s+with|formal|partner|awarded|empanelled|allocation|contract|selected|funding)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously)\b/i
    ],
    allowedHistoricalFacts: [
      '10X Technologies holds a MeitY Genesis Grant (₹10 lakh, awarded January 2026), which is a separate programme under the same ministry.',
      '10X Technologies roadmap aligns with IndiaAI Mission pillars (indigenous models, datasets, priority-sector AI), but the company does not have a formal IndiaAI Mission award or partnership.'
    ],
    insufficientMessage: "10X Technologies does not currently have a formal IndiaAI Mission award or partnership. The company holds a ₹10 lakh MeitY Genesis Grant from the same ministry and aligns with the Mission's pillars.",
    historicalAllowedSummary: "10X Technologies is aligned with IndiaAI Mission goals and holds a MeitY Genesis Grant, but has no formal IndiaAI Mission engagement."
  },

  // -------------------------------------------------------------------------
  // 4. Provisional Patent Details
  // -------------------------------------------------------------------------
  {
    id: 'guard-patent-details',
    topic: 'Patent Details',
    entity: 'Intellectual Property / Patents',
    unresolvedFact: 'Exact provisional patent application numbers, filing dates, titles, and precise claim scope',
    issueType: 'exact_number',
    triggerPatterns: [
      /\b(patents?|provisional\s*patents?)\b/i
    ],
    currentStatusPatterns: [
      /\b(numbers?|application\s*numbers?|filing\s*dates?|titles?|claims?|exact|granted|patented)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|how\s+many\s+patents\s+were\s+filed)\b/i
    ],
    allowedHistoricalFacts: [
      '10X Technologies has filed two provisional patent applications in India.',
      'One filing covers an architecture for emotionally-aware voice interaction (a filed provisional claim, not a granted patent or shipped feature).'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the exact provisional patent application numbers, filing dates, or titles.",
    historicalAllowedSummary: "10X has filed two provisional patent applications in India (including one for emotionally-aware interaction), but specific application numbers and filing dates are unverified."
  },

  // -------------------------------------------------------------------------
  // 5. DPIIT and Startup India Details
  // -------------------------------------------------------------------------
  {
    id: 'guard-dpiit-startup-india',
    topic: 'DPIIT & Startup India',
    entity: 'DPIIT / Startup India Registration',
    unresolvedFact: 'DPIIT recognition number, registration date, Startup India certificate number',
    issueType: 'exact_number',
    triggerPatterns: [
      /\b(dpiit|startup\s*india)\b/i
    ],
    currentStatusPatterns: [
      /\b(numbers?|dates?|certificate|registration\s*number|exact|current\s*status)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|when\s+was\s+it\s+recognized)\b/i
    ],
    allowedHistoricalFacts: [
      '10X Technologies is officially recognized as a deep-tech startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm 10X Technologies' exact DPIIT or Startup India registration number and certificate date.",
    historicalAllowedSummary: "10X is officially recognized by DPIIT as a deep-tech startup, but exact certificate numbers and dates are unverified."
  },

  // -------------------------------------------------------------------------
  // 6. Incorporation Details (CIN, Registered Office)
  // -------------------------------------------------------------------------
  {
    id: 'guard-incorporation',
    topic: 'Incorporation Details',
    entity: 'Pikachu Global Technologies Pvt Ltd',
    unresolvedFact: 'Date of incorporation, CIN (Corporate Identity Number), exact registered office address',
    issueType: 'legal_status',
    triggerPatterns: [
      /\b(incorporation|incorporated|cin|corporate\s*id|registered\s*office|legal\s*entity|pikachu\s*global)\b/i
    ],
    currentStatusPatterns: [
      /\b(date|exact|cin|address|when\s+was.*incorporated|number)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|where\s+was\s+it\s+incorporated)\b/i
    ],
    allowedHistoricalFacts: [
      'The legal entity is Pikachu Global Technologies Private Limited, trading and operating as 10X Technologies.',
      'Headquartered in Ongole, Prakasam district, Andhra Pradesh, India.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the exact incorporation date, CIN, or registered office address on record.",
    historicalAllowedSummary: "The legal entity is Pikachu Global Technologies Private Limited based in Ongole, Andhra Pradesh, but CIN and exact incorporation date remain unverified."
  },

  // -------------------------------------------------------------------------
  // 7. Google Cloud Credits Details
  // -------------------------------------------------------------------------
  {
    id: 'guard-gcp-credits',
    topic: 'Google Cloud Credits',
    entity: 'Google Cloud / GCP',
    unresolvedFact: 'Exact GCP credit amount, specific startup programme, and current balance/status',
    issueType: 'exact_number',
    triggerPatterns: [
      /\b(gcp|google\s*cloud)\b.*\b(credits?|funding|compute|tier|status)\b/i,
      /\b(google\s*cloud\s*credits?)\b/i
    ],
    currentStatusPatterns: [
      /\b(amount|how\s*much|exact|current|status|latest|balance|tier)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|prior\s+credits)\b/i
    ],
    allowedHistoricalFacts: [
      '10X Technologies was awarded cloud compute credits from Google Cloud under its startup program.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm 10X Technologies' exact Google Cloud credit amount or current status.",
    historicalAllowedSummary: "10X received startup compute credits from Google Cloud, but the exact credit amount and program tier are unverified."
  },

  // -------------------------------------------------------------------------
  // 8. Grant & Accelerator Outcomes (RTIH Catalyst, MVAM)
  // -------------------------------------------------------------------------
  {
    id: 'guard-grant-outcomes',
    topic: 'Grant Application Outcomes',
    entity: 'RTIH Catalyst & MVAM Applications',
    unresolvedFact: 'Final selection/funding outcomes of the RTIH Catalyst Program Vizag Edition and MVAM grant applications',
    issueType: 'current_status',
    triggerPatterns: [
      /\b(rtih|catalyst(\s*program)?|mvam|nvidia-aws(\s*collaboration)?(\s*grant)?)\b/i
    ],
    currentStatusPatterns: [
      /\b(outcome|result|status|selected|selection|win|won|awarded|approved|final)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|jury\s+pitch\s+date)\b/i
    ],
    allowedHistoricalFacts: [
      '10X Technologies participated in the RTIH Catalyst Program – Vizag Edition 1.0 jury pitch in late July 2026.',
      'Submitted an MVAM NVIDIA-AWS collaboration grant application in mid-2026.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the final outcomes of the RTIH Catalyst or MVAM grant applications.",
    historicalAllowedSummary: "10X pitched at the RTIH Catalyst Vizag jury and applied for the MVAM NVIDIA-AWS grant in mid-2026, but final outcomes are unverified."
  },

  // -------------------------------------------------------------------------
  // 9. Akshara Fertility Table & Exact Numbers
  // -------------------------------------------------------------------------
  {
    id: 'guard-akshara-fertility',
    topic: 'Akshara Fertility Numbers',
    entity: 'Akshara Tokenizer Evaluation',
    unresolvedFact: 'Per-language fertility numbers, named evaluation corpora, and named comparative baseline figures',
    issueType: 'benchmark',
    triggerPatterns: [
      /\b(fertility\s*(table|number|numbers?|metric|score|scores?|values?|results?))\b/i,
      /\b(exact\s+fertility)\b/i
    ],
    currentStatusPatterns: [
      /\b(exact|numbers?|scores?|table|percentages?|what\s+is\s+the\s+fertility|how\s+fertile)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|what\s+is\s+fertility|concept\s+of\s+fertility)\b/i
    ],
    allowedHistoricalFacts: [
      'Fertility is the average tokens generated per word (lower is better).',
      'Akshara tokenizers are trained on Indic morphology to achieve substantially lower fertility than English-biased tokenizers on Telugu and Dravidian languages.',
      'Fertility claims require specifying the evaluation corpus and comparative baselines.'
    ],
    insufficientMessage: "I don't have enough verified information to provide exact numerical fertility tables or benchmark scores for Akshara across languages.",
    historicalAllowedSummary: "Akshara tokenizers are designed for low fertility on Indic languages, but specific per-language fertility tables with named eval corpora remain unverified."
  },

  // -------------------------------------------------------------------------
  // 10. Qwen3-0.6B CPT POC Benchmark Numbers
  // -------------------------------------------------------------------------
  {
    id: 'guard-qwen-benchmarks',
    topic: 'Qwen3-0.6B POC Benchmark Numbers',
    entity: 'Education POC Evaluation',
    unresolvedFact: 'Exact numerical benchmark accuracy scores, question counts, and evaluation set splits',
    issueType: 'benchmark',
    triggerPatterns: [
      /\b(benchmark\s*(numbers?|scores?|results?|percentages?))\b/i,
      /\b(qwen\s*(\d|\.)*|qwen3-0\.6b)\b.*\b(benchmark|score|accuracy|jee|numbers?|percentages?)\b/i,
      /\b(jee|curriculum)\b.*\b(scores?|accuracy|percentages?|exact\s+numbers?)\b/i
    ],
    currentStatusPatterns: [
      /\b(exact|numbers?|percentages?|scores?|how\s*much\s*better|metrics?|split)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|how\s+was\s+the\s+poc\s+tested)\b/i
    ],
    allowedHistoricalFacts: [
      'In a verified education proof-of-concept, continued pre-training of Qwen3-0.6B on a curated K-12 Indic dataset outperformed the base model on curriculum and JEE-style questions.',
      'The POC confirmed that small models can be effectively domain-adapted for Indian education.'
    ],
    insufficientMessage: "I don't have enough verified information to provide exact numerical benchmark percentages or question counts for the Qwen3-0.6B proof-of-concept.",
    historicalAllowedSummary: "Continued-pretrained Qwen3-0.6B outperformed the base model on curriculum and JEE questions in testing, but exact numerical benchmark scores are unverified."
  },

  // -------------------------------------------------------------------------
  // 11. Exact Language Completion List
  // -------------------------------------------------------------------------
  {
    id: 'guard-language-completion',
    topic: 'Language Model Completion Status',
    entity: 'Akshara Languages (Tokenizers vs Models)',
    unresolvedFact: 'Exact list distinguishing which languages have completed tokenizers vs completed trained models',
    issueType: 'current_status',
    triggerPatterns: [
      /\b(which\s+languages|language\s+list|supported\s+languages|how\s+many\s+languages)\b.*\b(model|trained|ready|complete|status)\b/i,
      /\b(model-complete|tokenizer-complete)\b/i
    ],
    currentStatusPatterns: [
      /\b(exact|current|status|list|completion|which\s+exactly|all\s+languages)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|first\s+language)\b/i
    ],
    allowedHistoricalFacts: [
      'Akshara tokenizer family covers multiple Indic languages (starting with Telugu and Dravidian languages).',
      'The company builds dedicated monolingual Language Fluency Models (LFMs), but tokenizers are distinct from completed models.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the exact completion status of all individual language models.",
    historicalAllowedSummary: "Akshara tokenizers are built across Indic languages, but the exact breakdown of completed models versus tokenizers-only remains unverified."
  },

  // -------------------------------------------------------------------------
  // 12. Orchestration Layer Implementation Status
  // -------------------------------------------------------------------------
  {
    id: 'guard-orchestration-status',
    topic: 'Orchestration Layer Implementation',
    entity: 'Multi-Model Orchestration Layer',
    unresolvedFact: 'Which orchestration components are working vs designed vs planned',
    issueType: 'current_status',
    triggerPatterns: [
      /\b(orchestration\s*(layer)?)\b.*\b(status|implemented|working|runs|built|progress)\b/i
    ],
    currentStatusPatterns: [
      /\b(current|status|working|implemented|runs\s+today|ready|what\s+exists)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|original\s+design)\b/i
    ],
    allowedHistoricalFacts: [
      'The orchestration layer architecture is designed to handle Language Identification (LID), routing to monolingual models, composition, and escalation management.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm which components of the orchestration layer are currently working versus in design.",
    historicalAllowedSummary: "The orchestration layer architecture is designed for multi-model routing and language identification, but component-by-component implementation status is unverified."
  },

  // -------------------------------------------------------------------------
  // 13. Libre OS Technical Status
  // -------------------------------------------------------------------------
  {
    id: 'guard-libre-os-status',
    topic: 'Libre OS Technical Status',
    entity: 'Libre OS Kernel & Runtime',
    unresolvedFact: 'Whether Libre OS is an Android derivative or independent kernel, and what runs today vs in design',
    issueType: 'current_status',
    triggerPatterns: [
      /\b(libre\s*os)\b.*\b(technical\s*status|kernel|android\s*derivative|independent|what\s+runs\s+today)\b/i
    ],
    currentStatusPatterns: [
      /\b(exact|current|status|kernel|android|runs\s+today|technical\s+status)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|what\s+is\s+libre\s+os)\b/i
    ],
    allowedHistoricalFacts: [
      'Libre OS is 10X Technologies voice-first operating layer designed around user intent rather than app grids, featuring multi-user continuous voice recognition.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the exact low-level kernel architecture or current runtime implementation of Libre OS.",
    historicalAllowedSummary: "Libre OS is designed as a voice-first intent layer, but its underlying kernel classification and runtime implementation status are unverified."
  },

  // -------------------------------------------------------------------------
  // 14. LUCA Retail Availability, Price & BOM
  // -------------------------------------------------------------------------
  {
    id: 'guard-luca-availability',
    topic: 'LUCA Availability & Pricing',
    entity: 'LUCA Smart Speaker',
    unresolvedFact: 'Consumer retail shipping date, exact price, current bill of materials (BOM), and manufacturing schedule',
    issueType: 'pricing',
    triggerPatterns: [
      /\b(buy\s+luca|purchase\s+luca|luca\s+price|retail\s+price|cost\s+of\s+luca|shipped\s+luca|is\s+luca\s+shipped|has\s+10x\s+shipped\s+luca)\b/i
    ],
    currentStatusPatterns: [
      /\b(current|exact|price|cost|how\s+much|shipped|available|buy\s+now|order|release\s+date|timeline)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously|prototype\s+design)\b/i
    ],
    allowedHistoricalFacts: [
      'LUCA is not yet available for retail purchase; consumer units have not yet shipped.',
      'Hardware definitions, prototypes, and trademarked animated eyes design are completed.',
      'LUCA is positioned as a premium domestic AI device, benchmarked against Amazon Echo and Google Nest.'
    ],
    insufficientMessage: "LUCA is not yet available for retail purchase and consumer units have not shipped. Exact pricing and commercial release timelines remain unverified.",
    historicalAllowedSummary: "LUCA hardware definitions and prototypes are completed, but consumer units have not shipped to retail and pricing remains unverified."
  },

  // -------------------------------------------------------------------------
  // 15. Team: Dina Details
  // -------------------------------------------------------------------------
  {
    id: 'guard-team-dina',
    topic: 'Dina Background Details',
    entity: '10X Engineering Team (Dina)',
    unresolvedFact: 'Dina full name, exact title, scope of responsibility, and start date',
    issueType: 'identity',
    triggerPatterns: [
      /\b(who\s+is\s+dina|dina\s+at\s+10x|dina\s+role|dina\s+full\s+name)\b/i
    ],
    currentStatusPatterns: [
      /\b(full\s*name|exact\s*role|title|start\s*date|who\s*is|details)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously)\b/i
    ],
    allowedHistoricalFacts: [
      'Dina works on software engineering and system infrastructure at 10X Technologies.'
    ],
    insufficientMessage: "Dina works on software engineering at 10X Technologies, but specific details such as full name, exact title, and start date remain unverified.",
    historicalAllowedSummary: "Dina contributes to software at 10X Technologies, but full biographical details are unverified in the public corpus."
  },

  // -------------------------------------------------------------------------
  // 16. Team: Irfan Abidi Prior Traction Conflation
  // -------------------------------------------------------------------------
  {
    id: 'guard-team-irfan-prior',
    topic: 'Irfan Abidi Background & Prior Open-Source Traction',
    entity: 'Irfan Abidi / LMODroid',
    unresolvedFact: 'LMODroid download and user metrics belong to Irfan prior independent work, not 10X Technologies traction',
    issueType: 'identity',
    triggerPatterns: [
      /\b(irfan|abidi|lmodroid)\b/i
    ],
    currentStatusPatterns: [
      /\b(downloads?|users?|traction|metrics?|stats?|numbers?)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously)\b/i
    ],
    allowedHistoricalFacts: [
      'Irfan Abidi is Co-founder and Software Lead at 10X Technologies, directing system architecture.',
      'He has prior independent experience building and shipping open-source Android systems at scale (prior work, not 10X company traction).'
    ],
    insufficientMessage: "I don't have verified numbers regarding Irfan Abidi's prior independent projects, which are separate from 10X Technologies.",
    historicalAllowedSummary: "Irfan Abidi is co-founder and software lead; his prior open-source work demonstrates Android systems experience, but metrics are not 10X traction."
  },

  // -------------------------------------------------------------------------
  // 17. Advisors: Abhiram Meenan & Dr. Muralidhar Details
  // -------------------------------------------------------------------------
  {
    id: 'guard-advisors-details',
    topic: 'Advisor Background Details',
    entity: '10X Advisors (Abhiram Meenan / Dr. Muralidhar)',
    unresolvedFact: 'Abhiram Meenan professional background/domain; Dr. Muralidhar exact institution and title',
    issueType: 'identity',
    triggerPatterns: [
      /\b(abhiram(\s+meenan)?|dr\.?\s*muralidhar)\b/i
    ],
    currentStatusPatterns: [
      /\b(background|domain|institution|title|full\s*name|details|bio)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously)\b/i
    ],
    allowedHistoricalFacts: [
      'Abhiram Meenan is an early advisor holding 2% equity.',
      'Dr. Muralidhar is a key advisor who was instrumental in securing the MeitY Genesis Grant.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the complete professional background or institutional affiliation for this advisor.",
    historicalAllowedSummary: "Abhiram Meenan holds 2% advisory equity, and Dr. Muralidhar advised on the MeitY Genesis Grant, but detailed bios remain unverified."
  },

  // -------------------------------------------------------------------------
  // 18. Model Weights & Libre OS Licensing Decisions
  // -------------------------------------------------------------------------
  {
    id: 'guard-licensing-decisions',
    topic: 'Trained Weights & OS Licensing Position',
    entity: 'Licensing Posture',
    unresolvedFact: 'Per-model commercial vs open release decision; Libre OS commercial licensing position',
    issueType: 'legal_status',
    triggerPatterns: [
      /\b(license|licensing|open\s*source|commercial\s*license)\b.*\b(weights?|models?|libre\s*os)\b/i
    ],
    currentStatusPatterns: [
      /\b(exact|decision|status|commercial|weights\s*open|libre\s*os\s*license)\b/i
    ],
    historicalPatterns: [
      /\b(history|historical|in\s+the\s+past|previously)\b/i
    ],
    allowedHistoricalFacts: [
      'Akshara tokenizers are fully open source (Apache 2.0 on Hugging Face & GitHub).',
      'Training datasets are proprietary/private.',
      'LUCA hardware design is closed.',
      'Decisions on specific trained model weights and Libre OS licensing positions are evaluated per release.'
    ],
    insufficientMessage: "I don't have enough verified information to confirm the final licensing decision for trained model weights or Libre OS.",
    historicalAllowedSummary: "Akshara tokenizers are Apache 2.0 open source, but trained weight distribution and Libre OS licensing terms remain unverified."
  }
];

/**
 * Normalizes query string for analysis
 */
export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Detects if the query is an unsupported general question outside 10X Technologies
 */
export function isUnsupportedGeneralQuery(normalizedQuery) {
  const companyKeywords = [
    '10x', 'technologies', 'akshara', 'luca', 'libre', 'os', 'mani', 'bhavan',
    'ongole', 'telugu', 'indic', 'token', 'tokenizer', 'fertility', 'lfm', 'slm',
    'smart speaker', 'speaker', 'eyes', 'pikachu', 'genesis', 'meity', 'dpiit',
    'inception', 'nvidia', 'aws', 'activate', 'google cloud', 'gcp', 'vit',
    'vyshnavi', 'irfan', 'dina', 'hariharan', 'muralidhar', 'sohan', 'basak',
    'jee', 'curriculum', 'education', 'school', 'patent', 'patents', 'b2b', 'seat'
  ];

  const hasCompanyKeyword = companyKeywords.some(kw => normalizedQuery.includes(kw));
  if (hasCompanyKeyword) return false;

  // Common off-topic patterns
  const generalPatterns = [
    /\b(how\s+to|how\s+do\s+i|recipe|bake|cake|cook|weather|capital\s+of|who\s+is\s+president|cricket|football|movie|song|joke)\b/i
  ];

  return generalPatterns.some(p => p.test(normalizedQuery));
}

/**
 * Generalized Temporal & Verification Classifier
 * 
 * Inspects query against the entire VERIFICATION_GUARDS registry to determine:
 * - isVerificationSensitive
 * - activeGuard
 * - temporalClassification: 'current' | 'historical' | 'planned' | 'general'
 * - isInsufficient
 * - suggestedAnswer (if insufficient)
 */
export function analyzeVerification(query) {
  const normalized = normalizeQuery(query);

  // 1. Check for off-topic query
  if (isUnsupportedGeneralQuery(normalized)) {
    return {
      isUnsupportedGeneral: true,
      isVerificationSensitive: false,
      temporalClassification: 'general',
      activeGuard: null,
      isInsufficient: true,
      suggestedAnswer: "I am LUCA, an AI assistant built specifically for 10X Technologies. I can answer questions about our Akshara models, Libre OS, the LUCA smart speaker, and our company research, but I don't have information on general topics."
    };
  }

  // 2. Classify temporal intent
  const currentStatusMarkers = [
    'current', 'currently', 'now', 'latest', 'present', 'presently', 'today',
    'status', 'tier', 'approval', 'exact', 'active', 'approved', 'balance',
    'available', 'shipped', 'completed', 'published'
  ];
  const historicalMarkers = [
    'history', 'historical', 'previously', 'prior', 'in the past', 'past',
    'earlier', 'initially', 'before', 'started', 'origin', 'genesis',
    'why did 10x move', 'why did 10x pivot', 'did 10x receive', 'was awarded'
  ];
  const futureMarkers = [
    'plan', 'planned', 'future', 'roadmap', 'will', 'going to', 'upcoming', 'next'
  ];

  const hasCurrentMarker = currentStatusMarkers.some(m => normalized.includes(m));
  const hasHistoricalMarker = historicalMarkers.some(m => normalized.includes(m));
  const hasFutureMarker = futureMarkers.some(m => normalized.includes(m));

  let temporalClassification = 'general';
  if (hasCurrentMarker && !hasHistoricalMarker) {
    temporalClassification = 'current';
  } else if (hasHistoricalMarker) {
    temporalClassification = 'historical';
  } else if (hasFutureMarker) {
    temporalClassification = 'planned';
  }

  // 3. Match against Verification Guards
  for (const guard of VERIFICATION_GUARDS) {
    const isTopicMatch = guard.triggerPatterns.some(pattern => pattern.test(normalized));
    if (!isTopicMatch) continue;

    const asksCurrentOrExact = guard.currentStatusPatterns.some(pattern => pattern.test(normalized));
    const asksHistorical = guard.historicalPatterns.some(pattern => pattern.test(normalized));

    // Priority 1: If asking for current status or exact details
    // (exact / current / number overrides historical patterns, e.g. "What is 10X's exact DPIIT recognition number?")
    const hasExactOrCurrentKeyword = normalized.includes('exact') || normalized.includes('current') || normalized.includes('status') || normalized.includes('number');
    if (asksCurrentOrExact && (!asksHistorical || hasExactOrCurrentKeyword)) {
      return {
        isUnsupportedGeneral: false,
        isVerificationSensitive: true,
        temporalClassification: 'current',
        activeGuard: guard,
        isInsufficient: true,
        suggestedAnswer: guard.insufficientMessage,
        guardReason: `Query requests current status or exact details of [${guard.topic}], which is unresolved in the corpus.`
      };
    }

    // Priority 2: Historical inquiry on a guarded topic
    if (asksHistorical) {
      return {
        isUnsupportedGeneral: false,
        isVerificationSensitive: true,
        temporalClassification: 'historical',
        activeGuard: guard,
        isInsufficient: false,
        allowedHistoricalFacts: guard.allowedHistoricalFacts,
        guardReason: `Query requests historical facts about [${guard.topic}]. Historical facts may be answered, but current status must not be inferred.`
      };
    }

    // Priority 3: Inquiries about an intrinsically unverified status or detail
    return {
      isUnsupportedGeneral: false,
      isVerificationSensitive: true,
      temporalClassification: 'current',
      activeGuard: guard,
      isInsufficient: true,
      suggestedAnswer: guard.insufficientMessage,
      guardReason: `Query inquires about unresolved item [${guard.topic}].`
    };
  }

  // No verification guard triggered - safe verified query
  return {
    isUnsupportedGeneral: false,
    isVerificationSensitive: false,
    temporalClassification,
    activeGuard: null,
    isInsufficient: false
  };
}
