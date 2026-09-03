/**
 * 10X Technologies Verified Knowledge Base Chunks
 * 
 * Source: 10X_Technologies_Knowledge_Corpus_v1-1.md
 * 
 * Strict Sanitation Rules Applied:
 * 1. Zero unverified placeholders or unconfirmed items included.
 * 2. Part IX (Voice & Style instructions) and Part XII (Verification ledger) excluded from knowledge chunks.
 * 3. Only verified factual statements preserved; unconfirmed claims omitted.
 * 4. Structured for high-speed client-side retrieval (BM25 + keyword boosting).
 */

export const KNOWLEDGE_CHUNKS = [
  // =========================================================================
  // 1. COMPANY & ORIGIN
  // =========================================================================
  {
    id: 'company-overview',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part I, Section 1',
    title: '10X Technologies Overview & Mission',
    category: 'company',
    keywords: [
      '10x', 'technologies', 'company', 'overview', 'mission', 'pikachu', 'global',
      'ongole', 'andhra pradesh', 'indic', 'akshara', 'libre os', 'luca', 'what is 10x'
    ],
    content: `10X Technologies is an Indic-language AI company based in Ongole, Andhra Pradesh, India. The company's legal entity is Pikachu Global Technologies Private Limited, and it trades and builds under the name 10X Technologies. 

The company builds three interconnected layers:
1. Akshara: A family of tokenizers and small monolingual language fluency models (LFMs), one per Indian language.
2. Libre OS: A voice-first operating layer designed around user intent rather than app grids.
3. LUCA: A smart speaker designed for Indian households where multiple generations share one room and several languages.

10X Technologies is primarily a model company, and secondarily a hardware company that builds the best showcase for its models. Its core mission is to make computers actually speak Indian languages natively, with authentic cultural grounding, honorifics, and code-switching, rather than treating Indian languages as an afterthought.`
  },
  {
    id: 'company-ongole-roots',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part I, Section 2',
    title: 'Headquarters: Why Ongole, Andhra Pradesh Matters',
    category: 'company',
    keywords: [
      'ongole', 'headquarters', 'location', 'where based', 'andhra pradesh', 'prakasam',
      'tier-2', 'bengaluru', 'hyderabad', 'cost', 'talent', 'vit-ap', 'vit'
    ],
    content: `10X Technologies is headquartered in Ongole, a tier-2 city in Prakasam district, Andhra Pradesh, roughly three hours from Vijayawada and five from Hyderabad. The team travels to Hyderabad frequently for business.

Being in Ongole is a strategic advantage for three reasons:
1. Living with the target user: The users 10X builds for are in Ongole, Guntur, Nellore, and Kurnool — grandmothers who have never typed on a keyboard, parents who read Telugu comfortably, and families that naturally code-switch. The team lives with the people they build for, avoiding the tech failure mode of treating Indian users as an abstraction.
2. Capital efficiency: A rupee of grant money or founder savings buys substantially more runway in Ongole than in tier-1 hubs like Bengaluru. This efficiency enabled approximately five years of self-funded development.
3. Talent strategy: 10X recruits talent from Andhra Pradesh and Tamil Nadu engineering institutions, including VIT-AP and VIT Vellore, offering young engineers end-to-end ownership of language models rather than minor tickets at large IT firms.`
  },
  {
    id: 'company-founder-mani-bhavan',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part I, Section 3',
    title: 'Founder & CEO: Mani Bhavan',
    category: 'company',
    keywords: [
      'founder', 'ceo', 'chief engineer', 'mani', 'bhavan', 'age', 'background',
      'education', 'vit-ap', 'first-generation', 'who founded'
    ],
    content: `Mani Bhavan is the founder, Chief Executive Officer, and Chief Engineer of 10X Technologies. He is 22 years old, born and raised in Ongole in a middle-class family, and is a first-generation founder.

He studied Computer Science at VIT-AP and left his degree to build 10X Technologies full-time. He funded the company's development for approximately five years largely from his own savings and grants before institutional support. 

Mani leads product definition, model architecture, business development, industrial design, brand, and fundraising. A core founder trait is that he updates rapidly on empirical evidence: when data contradicts a plan (such as retiring the initial cost-reduction B2B pitch after analyzing actual cloud pricing), he reverses strategy immediately.`
  },
  {
    id: 'company-founding-problem',
    temporalStatus: 'historical',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part I, Section 4',
    title: 'The Founding Problem: Digital Exclusion in Indian Languages',
    category: 'company',
    keywords: [
      'founding problem', 'origin', 'telugu', 'english', 'voice assistant',
      'smartphone', 'why started', 'indian languages'
    ],
    content: `The company was founded on a simple observation: smartphones and computing in India are English-first. Operating systems, setup flows, error messages, and voice assistants cater to English and Hindi, while performing poorly or failing completely on Telugu, Kannada, Odia, Assamese, Marathi, and other regional languages.

Roughly 80 to 90 million people speak Telugu, a classical language with over a millennium of literary tradition. Yet in practice, using digital technology in Telugu has meant poor performance, leading people to stop expecting it to work. Older non-English speakers often assume technology is not for them.

The founding question was: "What would it take for a computer to speak Telugu properly?" — not as a translated dropdown menu, but speaking naturally with authentic code-switching, idioms, honorifics, and regional cadence.`
  },
  {
    id: 'company-two-pivots',
    temporalStatus: 'historical',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part I, Section 5',
    title: 'Company Evolution & The Two Major Pivots',
    category: 'company',
    keywords: [
      'pivots', 'smartphone', 'smart speaker', 'hardware to models', 'evolution',
      'history', 'apple of india', 'moq', 'capital'
    ],
    content: `10X Technologies arrived at its current model-first structure through two deliberate pivots:

1. Pivot 1 (Smartphone to Smart Speaker):
The company initially set out to build an Indian smartphone with an Indian Telugu-first OS. However, bringing a smartphone to market requires hundreds of crores in tooling, certifications, supply chain, and massive Minimum Order Quantities (MOQs) on custom SoCs and screens. 10X pivoted to smart speakers (LUCA), which eliminated cellular certifications, cameras, and screens while using mature supply chains. Crucially, a smart speaker sits in a shared living room, making it naturally suited to multi-generational Indian families who speak multiple languages, unlike single-user smartphones.

2. Pivot 2 (Hardware Company to Model Company):
While building LUCA, the team searched for an existing model that spoke Telugu fluently and found none. Large multilingual models treat Telugu as a tiny fraction of their capacity, and standard tokenizers shred agglutinative Telugu words. 10X realized the missing foundation was the tokenizer and the model. 10X built Akshara (tokenizers and small language fluency models) and transitioned to being a model company first, with LUCA as the hardware showcase.`
  },
  {
    id: 'company-recognition-grants',
    title: 'Institutional Recognition, Grants & Credentials',
    category: 'company',
    temporalStatus: 'hybrid',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part I, Section 9',
    keywords: [
      'grants', 'funding', 'meity', 'genesis', 'dpiit', 'nvidia inception',
      'aws activate', 'google cloud', 'startup india', 'patents'
    ],
    content: `10X Technologies has accumulated verified institutional recognitions and non-dilutive support:
- MeitY Genesis Grant: Awarded ₹10,00,000 (₹10 lakh) in January 2026 by the Ministry of Electronics and Information Technology, Government of India, following technical due diligence.
- DPIIT Recognition: Officially recognized as a deep-tech startup by the Department for Promotion of Industry and Internal Trade (Government of India). Specific certificate number and date are not included in public records.
- NVIDIA Inception: Accepted as a member of the NVIDIA Inception startup accelerator programme (programme membership providing technical resources and GPU credits; not an equity investment).
- AWS Activate: A prior award at the $10,000 tier was received under Amazon Web Services' startup program; a subsequent $25,000 application was submitted via Mooreas Technologies. Note: Current AWS Activate tier and approval status remain unverified.
- Google Cloud Credits: Awarded startup compute credits from Google Cloud. Specific credit amount and current tier are unverified.
- Provisional Patents: Two provisional patent applications filed in India (including an architecture for emotionally-aware interaction, which is a filed provisional claim, not a granted patent or shipped feature). Exact application numbers and filing dates remain unverified.`
  },
  {
    id: 'company-current-stage',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part I, Section 10',
    title: 'Current Stage, Traction & What Exists Today',
    category: 'company',
    keywords: [
      'current stage', 'traction', 'what exists', 'revenue', 'status',
      'profitable', 'poc', 'qwen', 'roadmap'
    ],
    content: `10X Technologies is an early-stage deep-tech startup where foundational technical work is substantially completed and commercialization is underway:
- What exists: Working Akshara tokenizer family across Indic languages; continued-pretraining pipelines; an education proof-of-concept where a continued-pretrained Qwen3-0.6B outperforms its base model on curriculum and JEE-style problems; Libre OS voice-first software; LUCA industrial design and trademarked eyes mascot; two provisional patent filings; MeitY Genesis grant funding; and an active B2B education pipeline.
- What does not yet exist: Consumer LUCA units are not yet shipped to retail; no large-scale commercial revenue; no closed institutional equity round; no peer-reviewed paper published yet.
- Revenue status: The company is not yet profitable. Current priority is closing enterprise B2B licensing contracts in education to prove market demand.`
  },

  // =========================================================================
  // 2. TECHNICAL ARCHITECTURE & THESIS
  // =========================================================================
  {
    id: 'tech-problem-multilingual-flaws',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 11',
    title: 'Why Mainstream Multilingual AI Fails on Indian Languages',
    category: 'tech',
    keywords: [
      'multilingual models', 'flaws', 'capacity allocation', 'cultural grounding',
      'why fails', 'indic nlp', 'layers'
    ],
    content: `While global AI models claim multilingual support, their performance on Indian languages breaks down across three compounding layers:
1. The Tokenizer Layer: Major models train tokenizers predominantly on English and European text. When encountering Telugu or other Indic scripts, they lack efficient multi-character chunks and fragment words down to single characters or raw bytes.
2. Capacity Allocation: In a 7B or 70B multilingual model covering 100 languages, Telugu receives roughly 1% of the training data and parameters, sharing representational capacity with dozens of structurally unrelated languages.
3. Cultural Grounding: Generic models lack native cultural awareness — understanding honorifics (like 'అన్నయ్య'), festivals, local idioms, and natural code-switching where English nouns blend with Telugu inflections.

Fixing the tokenizer makes the model computationally efficient; dedicating capacity makes it fluent; grounding it culturally makes it genuinely usable.`
  },
  {
    id: 'tech-agglutination-and-telugu',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 12',
    title: 'Agglutination in Telugu & The Tokenization Penalty',
    category: 'tech',
    keywords: [
      'agglutination', 'agglutinative', 'telugu morphology', 'morphemes',
      'token penalty', 'context window', 'cost'
    ],
    content: `Telugu is an agglutinative language, meaning complex meaning is constructed by stacking grammatical morphemes onto a root word. A single Telugu word can express tense, negation, capability, subject, and number — content that requires an entire six-word clause in English.

English tokenizers look for repeated whole words. When applied to Telugu, they encounter constructed word forms they have never seen and shred them into meaningless byte fragments.

This imposes severe penalties on Indic users:
- Context Window Tax: A fixed context window (e.g. 4k or 8k tokens) holds far less semantic meaning in Telugu than in English.
- Cost Inflation: Per-token API billing penalizes Indic text, costing multiples more for the same meaning.
- Latency: Generating 4x more tokens requires 4x more compute time.
- Quality Degradation: Fragmented tokens make it harder for the model to attend to syntactic and semantic structure.`
  },
  {
    id: 'tech-fertility-explained',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part II, Section 12.2',
    title: 'Fertility in Tokenizers: Definition & Significance',
    category: 'tech',
    keywords: [
      'fertility', 'tokens per word', 'tokenizer metric', 'evaluation',
      'benchmark', 'akshara fertility'
    ],
    content: `Fertility is the standard natural language processing metric measuring tokenizer efficiency: the average number of tokens generated per word. Lower fertility is better. 

A fertility of 1.2 means words typically map to 1 or 2 tokens. A fertility of 4.0 or 5.0 means words are shredded into 4 to 5 pieces. Standard English tokenizers typically exhibit very high fertility on Telugu and Dravidian scripts.

Purpose-built tokenizers like Akshara are trained specifically on Indic text morphology to keep fertility low. In technical evaluations, fertility claims must always specify the test corpus and comparative baseline tokenizers rather than quoting isolated numbers.`
  },
  {
    id: 'tech-akshara-tokenizer-design',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part II, Section 13',
    title: 'Akshara Tokenizer Family: Design Principles & Open Source Posture',
    category: 'tech',
    keywords: [
      'akshara', 'tokenizer design', 'apache 2.0', 'hugging face', 'github',
      'code-switching', 'morphology', 'open source'
    ],
    content: `Akshara (derived from Sanskrit for 'syllable/letter' or 'imperishable indivisible unit') is 10X Technologies' family of tokenizers, featuring one dedicated tokenizer per Indian language.

Design principles:
- One tokenizer per language: Avoids repeating the multilingual compromise across distinct scripts and morphologies (e.g. Telugu vs Tamil).
- Morphologically aware: Designed to capture the morphemes from which words are constructed.
- Native code-switching: Evaluated on realistic Indian speech that blends English vocabulary with regional grammar and suffixes.
- Open Source (Apache 2.0): Akshara tokenizers are freely available on Hugging Face and GitHub. 

Why 10X open-sources tokenizers:
1. Tokenizers are not the proprietary moat — curated training corpora, evaluation harnesses, and trained weights are.
2. Distribution and credibility: Open tokenizers establish 10X as the default foundation for Indic NLP researchers and developers.
3. Public good: Fosters open language infrastructure for India's digital ecosystem.`
  },
  {
    id: 'tech-monolingual-thesis',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 14',
    title: 'The Monolingual Small Model Thesis vs Multilingual Giants',
    category: 'tech',
    keywords: [
      'monolingual', 'small models', 'slm', 'thesis', 'multilingual vs monolingual',
      'parameters', 'on-device', '100m to 500m'
    ],
    content: `Most Indian AI labs train one large multilingual model (e.g. 7B to 70B parameters) across 22 languages. 10X Technologies takes a contrarian bet: training many small, dedicated monolingual models (roughly 100M to 500M parameters each), coordinated by a lightweight orchestration layer.

The core advantages:
1. 100% Dedicated Capacity: A 400M Telugu model allocates 100% of its parameters to Telugu, often matching or outperforming Telugu capacity in a divided 7B multilingual model.
2. No Negative Transfer: Eliminates cross-lingual interference between structurally disparate languages.
3. Native Akshara Tokenizer: Uses an uncompromised single-language tokenizer.
4. Edge/Device Feasibility: A quantized 400M model runs locally on a ₹6,000 smart speaker or device without an internet connection.
5. Independent Shipping: Upgrading one language requires retraining only that specific model without regression-testing 21 other languages.`
  },
  {
    id: 'tech-monolingual-counterarguments',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 14.2',
    title: 'Counter-Arguments to the Monolingual Thesis & 10X Answers',
    category: 'tech',
    keywords: [
      'counter-arguments', 'objections', 'cross-lingual transfer', 'general reasoning',
      'falsification', 'what proves wrong'
    ],
    content: `10X Technologies openly addresses the legitimate objections to small monolingual models:

1. Objection: Loss of cross-lingual transfer between languages.
Answer: A real trade-off. 10X shares tokenizer architectures and pretraining pipelines across languages while accepting the boundary between weights.
2. Objection: Small models cannot do complex multi-step reasoning or coding like 70B models.
Answer: 10X does not compete on general mathematics, coding, or frontier reasoning. 10X competes on spoken fluency, low latency, offline execution, and cultural grounding for everyday interactions.
3. Objection: N languages require N times the training runs.
Answer: Training a 400M parameter model is orders of magnitude cheaper than a 70B model, making multiple runs manageable for a small team.

Falsification Criteria (What would prove 10X wrong):
- If edge hardware becomes cheap enough to run 7B models on ₹6,000 devices offline.
- If a deployable-size multilingual model matches dedicated Akshara models on native fluency.
- If institutional buyers abandon data residency and sovereignty requirements.`
  },
  {
    id: 'tech-orchestration-layer',
    temporalStatus: 'planned',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part II, Section 15',
    title: 'The Orchestration Layer: Multi-Model Routing & Composition',
    category: 'tech',
    keywords: [
      'orchestration layer', 'routing', 'language identification', 'composition',
      'escalation', 'multi-model'
    ],
    content: `The orchestration layer is the software system that unifies multiple monolingual models into a seamless user experience.

Key responsibilities:
1. Language Identification (LID): Detects the spoken language and register, including mixed code-switching.
2. Routing: Directs the prompt to the appropriate language model (or models).
3. Composition: Combines outputs into a unified response matching the user's conversational register.
4. Escalation Management: Determines if a query exceeds the scope of an on-device model and requires fallback or polite boundaries, respecting privacy constraints.`
  },
  {
    id: 'tech-cpt-education-poc',
    title: 'Continued Pre-Training (CPT) & Education Proof-of-Concept',
    category: 'tech',
    temporalStatus: 'historical',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part II, Section 16',
    keywords: [
      'continued pre-training', 'cpt', 'qwen', 'qwen3-0.6b', 'education poc',
      'jee', 'curriculum', 'proof of concept'
    ],
    content: `10X Technologies verified its domain-adaptation methodology using an education proof-of-concept:
- Baseline Model: Qwen3-0.6B (an open, lightweight base model).
- Process: Continued pre-training (CPT) on 10X's curated K-12 Indic curriculum dataset.
- Outcome: The adapted model demonstrated superior accuracy on curriculum-specific and JEE-style questions compared to the base model.
- Significance: Confirms that small models can be effectively specialized for targeted domains and Indian languages rapidly and cost-effectively.
- Guardrail: Exact numerical benchmark accuracy scores, question counts, and evaluation split numbers remain unverified in the public corpus.`
  },
  {
    id: 'tech-five-stage-pipeline',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 17',
    title: '10X AI Model Training & Fine-Tuning Stack',
    category: 'tech',
    keywords: [
      'training pipeline', 'fine-tuning stack', 'tokenizer', 'cpt', 'sft',
      'alignment', 'quantisation'
    ],
    content: `The 10X model development pipeline follows five disciplined stages:
1. Stage 1 — Tokenizer: Build language-specific Akshara tokenizer to eliminate token fragmentation.
2. Stage 2 — Continued Pre-Training (CPT): Unsupervised knowledge injection on large curated domain/language corpora.
3. Stage 3 — Supervised Fine-Tuning (SFT): Behavioral alignment using high-quality instruction-response pairs to teach concise, direct conversational responses.
4. Stage 4 — Alignment & Safety: Safety boundaries, hallucination suppression, and age-appropriate handling for children.
5. Stage 5 — Quantisation & Edge Deployment: Compressing weights (e.g. 4-bit precision) to enable sub-200ms inference on local device hardware.`
  },
  {
    id: 'tech-lfm-definition',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part II, Section 18',
    title: 'Language Fluency Model (LFM) Explained',
    category: 'tech',
    keywords: [
      'lfm', 'language fluency model', 'definition', 'distinction',
      'liquid ai', 'slm', 'small language model'
    ],
    content: `10X Technologies uses the designation Language Fluency Model (LFM) to distinguish its models from general-purpose Large Language Models (LLMs).

An LFM is an on-device Small Language Model (SLM) optimized specifically for linguistic depth, cultural grounding, honorific accuracy, and code-switching in a single target language, rather than broad encyclopedic reasoning across all world subjects.

Note: The abbreviation 'LFM' is also used commercially by Liquid AI for its liquid neural network models. 10X uses the term descriptively for its architectural philosophy of language-specific on-device fluency.`
  },

  // =========================================================================
  // 3. PRODUCTS: AKSHARA, LIBRE OS, LUCA
  // =========================================================================
  {
    id: 'product-three-layer-stack',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part III, Section 19',
    title: 'What 10X Builds: The Three-Layer Stack (Akshara, Libre OS, LUCA)',
    category: 'products',
    keywords: [
      'what 10x builds', 'what does 10x build', 'build', 'builds', 'product stack',
      'three layers', 'luca', 'libre os', 'akshara', 'hardware', 'os', 'models'
    ],
    content: `10X Technologies builds three distinct, interconnected layers:
1. Akshara (Intelligence Layer): A family of Indic tokenizers and small monolingual Language Fluency Models (LFMs), one per Indian language. Akshara is the foundational enterprise asset.
2. Libre OS (System Software / Interaction Layer): A voice-first operating layer organized around user intent rather than app grids.
3. LUCA (Hardware Layer): A smart speaker with a circular display and trademarked animated eyes, built for Indian households where multiple generations share one room and several languages.

Read bottom-up, Akshara is the core asset; Libre OS makes the intelligence practical; LUCA packages the complete system for families.`
  },
  {
    id: 'product-libre-os',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part III, Section 20',
    title: 'Libre OS: The Voice-First Intent Operating Layer',
    category: 'products',
    keywords: [
      'libre os', 'operating system', 'voice-first', 'intent', 'multi-user',
      'no apps', 'local-first'
    ],
    content: `Libre OS is 10X Technologies' voice-first operating layer running on LUCA, evolved from early custom operating system research.

Core characteristics:
- Intent over App Grids: Eliminates complex icon grids and app silos. Users simply speak their intent, and the OS resolves it directly. This removes digital literacy barriers for users who struggle with abstract smartphone interfaces.
- Continuous Multi-User Awareness: Distinguishes between different household members by voice, maintaining individual context and preferences automatically.
- Local-First Architecture: Speech processing and model inference run locally on hardware by default.
- Dynamic Language Recognition: Language is treated as an attribute of the speaker rather than a fixed global system setting.`
  },
  {
    id: 'product-luca-smart-speaker',
    title: 'LUCA Smart Speaker: Features & Household Design',
    category: 'products',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part III, Section 21',
    keywords: [
      'luca', 'smart speaker', 'eyes', 'mascot', 'voice recognition',
      'joint family', 'offline', 'privacy'
    ],
    content: `LUCA is 10X Technologies' proprietary smart speaker designed specifically for Indian household dynamics:
- Circular Display & Trademarked Eyes: Features an expressive animated eyes mascot that gives the device a friendly face, signaling when it is listening and creating an intuitive connection for non-technical users.
- Per-User Voice Recognition: Recognizes distinct family members automatically. If a grandmother asks a question in Telugu, it responds in Telugu; if a grandchild asks in English, it responds in English.
- Built for Multi-Generational Shared Rooms: Tuned for the acoustic realities of Indian living rooms with background ambient noise and overlapping conversations.
- Offline Capability: Core conversational functions execute on-device without requiring continuous internet connectivity.
- Privacy by Architecture: Audio and voice interactions are processed locally rather than uploaded to remote cloud data centers.
- Availability Status: Consumer LUCA units are not yet shipped to retail; prototypes and industrial design exist, but consumer units are not currently available for commercial purchase.`
  },
  {
    id: 'product-luca-roadmap-and-positioning',
    temporalStatus: 'planned',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part III, Section 22',
    title: 'LUCA Positioning & Hardware Roadmap',
    category: 'products',
    keywords: [
      'luca positioning', 'premium', 'not boat', 'echo', 'nest',
      'roadmap', 'earbuds', 'smartwatch', 'smartphone'
    ],
    content: `LUCA Positioning:
LUCA is positioned as a premium, design-led domestic AI companion rather than a budget audio speaker. It does not compete with low-cost Bluetooth speakers (like boAt). Its benchmark competitors are Amazon Echo and Google Nest, against which LUCA differentiates on true Indic fluency, multi-user household recognition, and offline data privacy.

Hardware Roadmap:
Smart Speakers (LUCA) → Earbuds → Smartwatches → Smartphones.
Each device category scales supply-chain capabilities and software maturity, with the smartphone remaining the long-term destination.`
  },
  {
    id: 'product-provisional-patents',
    title: 'Patent Portfolio: Two Provisional Filings',
    category: 'products',
    temporalStatus: 'historical',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part IV, Section 23',
    keywords: [
      'patents', 'provisional patents', 'intellectual property', 'emotionally aware',
      'status', 'filings'
    ],
    content: `10X Technologies has filed two provisional patent applications in India. One filing covers an architecture for emotionally-aware voice interaction.

Factual Guardrails:
- These are provisional filings, not granted patents.
- Emotionally-aware interaction is a filed provisional claim, not a currently shipped feature.
- Specific application numbers, filing dates, and precise claim scope remain unverified in public records.`
  },
  {
    id: 'product-brand-identity',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part IV, Section 24',
    title: 'Brand Identity, Taglines & Palette',
    category: 'products',
    keywords: [
      'brand', 'color', 'purple', 'talks like you', 'tagline', 'palette',
      'technology redefined'
    ],
    content: `The 10X Technologies brand architecture is minimal and deliberate:
- Primary Color Palette: Deep Purple (\`#512DA8\`), Pure White (\`#FFFFFF\`), Deep Black (\`#000000\`).
- Primary Tagline: "Talks like you" — capturing genuine conversational fluency, cultural nuances, and natural code-switching.
- Secondary Tagline: "Technology, redefined".
- Mascot: The trademarked animated LUCA eyes.`
  },

  // =========================================================================
  // 4. TEAM & ADVISORS
  // =========================================================================
  {
    id: 'team-core-members',
    title: 'Core Leadership & Engineering Team',
    category: 'team',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part V, Sections 24-28',
    keywords: [
      'team', 'leadership', 'mani bhavan', 'irfan abidi', 'vyshnavi',
      'dina', 'co-founder', 'vp of ai', 'who works at 10x'
    ],
    content: `10X Technologies has a compact core team:
- Mani Bhavan: Founder, CEO, and Chief Engineer. Sets vision, architecture, hardware design, and business development.
- Irfan Abidi: Co-founder and Software Lead. Directs system architecture and engineering. (Prior open-source Android experience is his personal background, not 10X company traction).
- Vyshnavi: Vice President of AI. Leads tokenization, dataset curation, model training, evaluation, and intern mentorship.
- Dina: Software engineer contributing to system software and infrastructure at 10X. (Detailed personal background, exact title, and start date remain unverified in public records).
- Paid Interns: Structured engineering interns sourced from universities including VIT.`
  },
  {
    id: 'team-advisors-network',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part V, Section 29',
    title: 'Advisors & Academic Collaborators',
    category: 'team',
    keywords: [
      'advisors', 'dr hariharan', 'vit', 'sohan basak', 'amazon alexa',
      'dr muralidhar', 'abhiram meenan', 'collaborators'
    ],
    content: `10X Technologies is guided by experienced advisors:
- Dr. Hariharan (VIT): Senior academic collaborator, arXiv endorser for 10X research papers, collaborator in the DravidianLangTech NLP research community, and bridge to academic talent.
- Sohan Basak: Industry advisor with direct product background from Amazon Alexa, providing smart speaker product experience.
- Dr. Muralidhar: Key advisor instrumental in securing the MeitY Genesis Grant and navigating government innovation programs.
- Abhiram Meenan: Early advisor holding 2% equity.`
  },
  {
    id: 'team-internship-program',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part V, Section 30',
    title: 'Structured Paid Internship Program',
    category: 'team',
    keywords: [
      'internship', 'interns', 'vit', 'compensation', 'nda',
      'ip assignment', 'vyshnavi'
    ],
    content: `10X Technologies operates a legally formalized paid internship program:
- Structure: A 10-day unpaid calibration period with a ₹2,000 completion bonus, followed by a two-month term at ₹20,000 total compensation for 90 hours/month with daily timesheets.
- Legal Infrastructure: Interns sign formal Offer Letters, Non-Disclosure Agreements (NDAs), and IP Assignment Agreements under Pikachu Global Technologies Pvt Ltd.
- Management: Vyshnavi serves as the reporting manager and authorized signatory.`
  },
  {
    id: 'team-governance-posture',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part V, Section 31',
    title: 'Governance & Cap Table Structure',
    category: 'team',
    keywords: [
      'governance', 'equity', 'cap table', 'vesting', 'board', 'fundraising rules'
    ],
    content: `10X Technologies maintains an open and transparent stance regarding early-stage governance:
- Cap Table: Mani Bhavan currently holds approximately 98% of equity; formal vesting schedules and co-founder allocations are slated for finalization prior to an institutional equity round.
- Board: No formal fiduciary board has been established at this early stage; governance is guided by advisors.
- Fundraising Policy: The company maintains a strict rule not to solicit investments from personal family high-net-worth connections.`
  },

  // =========================================================================
  // 5. BUSINESS MODEL & GO-TO-MARKET
  // =========================================================================
  {
    id: 'business-revenue-models',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 32',
    title: 'Revenue Streams & Commercial Strategy',
    category: 'business',
    keywords: [
      'business model', 'revenue streams', 'enterprise licensing', 'hardware',
      'custom models', 'maintenance'
    ],
    content: `10X Technologies structures revenue across four progressive streams:
1. Enterprise Model Licensing (Current focus): Licensing specialized Indic language models to institutions (schools, colleges, government bodies) running on their local hardware.
2. Hardware Sales (LUCA): Retail consumer sales of the LUCA smart speaker.
3. Custom Model Development: Fine-tuning and adapting proprietary models on private client curricula and institutional datasets.
4. Support & Maintenance: Mandatory recurring annual maintenance contracts providing continuous updates and support.`
  },
  {
    id: 'business-education-beachhead',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 33',
    title: 'B2B Education: The Beachhead Market',
    category: 'business',
    keywords: [
      'education', 'beachhead', 'schools', 'andhra pradesh', 'telangana',
      'bilingual', 'b2b', 'data residency'
    ],
    content: `K-12 education and private school networks in Andhra Pradesh and Telangana represent 10X's primary go-to-market beachhead:
- Scale: Large regional educational chains serve hundreds of thousands of students.
- Language Need: Students and parents communicate in blended Telugu and English; English-only AI leaves students behind.
- Data Privacy & Minors: Educational institutions must strictly protect minors' academic data. Local on-premise model execution guarantees zero student data leaves the campus.
- Definite Curriculum: Educational content is structured, standardized, and bounded, making model verification tractable.
- Sales Cycle: Proof-of-concept demonstration first → Signed enterprise contract → Deployment of custom model.`
  },
  {
    id: 'business-pitch-evolution',
    temporalStatus: 'historical',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 34',
    title: 'Evolution of the B2B Value Proposition: Beyond Cheap Pricing',
    category: 'business',
    keywords: [
      'b2b pitch', 'value proposition', 'cost savings mistake', 'gemini pricing',
      'predictable cost', 'data residency', 'personalisation'
    ],
    content: `10X Technologies initially pitched B2B education on cost reduction against cloud AI providers. However, direct verification revealed that frontier cloud models (like Gemini 2.5 Flash-Lite) are already low-cost, meaning AI query fees are not an institution's primary budget pain point.

10X rebuilt its commercial pitch around three genuine institutional needs:
1. Fixed, Predictable Cost: Replacing open-ended, usage-based per-token cloud bills with predictable fixed annual seat licensing.
2. Strict On-Premise Data Residency: Student and minor data remains inside the school's local firewalls, eliminating legal third-party cloud data risks.
3. Deep Local Personalization: Models trained on the school's exact textbooks, marks, timetables, and teacher assignments, enabling parents to ask progress questions naturally in Telugu.`
  },
  {
    id: 'business-pricing-philosophy',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 35',
    title: 'Pricing Architecture: Floating Seat Licenses',
    category: 'business',
    keywords: [
      'pricing', 'seat license', 'floating perpetual', 'maintenance fee',
      'pricing philosophy'
    ],
    content: `10X Technologies employs a floating perpetual seat license with mandatory annual maintenance:
- Perpetual License: Grants perpetual rights to run the deployed model on local hardware.
- Floating Seats: Accommodates concurrent user peaks without requiring individual student account charges.
- Mandatory Annual Maintenance: Sustains recurring revenue while funding continuous model updates and performance tuning.
- Derivation: Prices are calculated between the true internal cost-to-serve (floor) and the customer's next-best alternative (ceiling). Deal-specific terms remain private.`
  },
  {
    id: 'business-competitive-landscape',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 36',
    title: 'Competitive Positioning: AI4Bharat, Sarvam AI, Global Labs',
    category: 'business',
    keywords: [
      'competitors', 'sarvam ai', 'ai4bharat', 'openai', 'google',
      'bhashini', 'amazon echo', 'competitive landscape'
    ],
    content: `10X Technologies differentiates clearly across the AI landscape:
- Sarvam AI: Well-funded commercial lab focused on large multilingual cloud models. 10X focuses on small, dedicated monolingual models running on-premise and on-device. Sarvam has significantly more funding; 10X targets distinct offline and sovereign deployment niches.
- AI4Bharat (IIT Madras): World-class academic research lab building open multilingual Indic models. 10X maintains respect for their academic work while focusing on commercial hardware and specialized on-premise deployments.
- Global Frontier Labs (OpenAI, Google, Meta): Build massive cloud models whose tokenizers remain compromised for Indic languages and require data to be transmitted to cloud data centers.
- Bhashini (Government of India): National public digital infrastructure for translation. 10X is complementary, focusing on conversational fluency rather than basic translation.
- Amazon Echo & Google Nest: Incumbent cloud smart speakers tuned for English-first Western households with high cloud dependency.`
  },
  {
    id: 'business-investment-case',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VI, Section 37',
    title: 'Investment Thesis, Risks & Financing Hierarchy',
    category: 'business',
    keywords: [
      'investment case', 'investor', 'risks', 'fundraising', 'capital hierarchy',
      'valuation', 'pre-money', 'post-money'
    ],
    content: `Investment Thesis:
- Enormous addressable market of over 1 billion non-English first language speakers in India.
- Contrarian, defensible focus on small monolingual on-device models with compounding tokenizer IP.
- Policy tailwinds from Indian data sovereignty and the Digital Personal Data Protection (DPDP) Act.
- Capital efficiency proven by five years of development from Ongole on grants and savings.

Acknowledged Risks:
- Key-person dependency on the founder.
- Cap table vesting schedules to be formalized.
- Consumer hardware adoption requires significant manufacturing capital (mitigated by prioritizing B2B software contracts).

Financing Hierarchy:
1. Non-dilutive government grants (e.g. MeitY Genesis).
2. Selective startup accelerators.
3. Angel investors.
4. Institutional venture capital following proven B2B contract traction.`
  },

  // =========================================================================
  // 6. RESEARCH & OPEN SCIENCE
  // =========================================================================
  {
    id: 'research-agenda-and-publications',
    title: 'Research Strategy, Agenda & Academic Publication Path',
    category: 'research',
    temporalStatus: 'planned',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part VI, Section 34 & 35',
    keywords: [
      'research', 'publication', 'dr hariharan', 'vit', 'dravidianlangtech',
      'arxiv', 'iclr', 'open science', 'papers'
    ],
    content: `Research Strategy:
10X Technologies conducts research to establish verified technical credibility, attract specialized Indic NLP researchers, and publicly timestamp its intellectual property.

Research Agenda:
- Tokenizer design for morphologically rich and agglutinative Indic languages.
- Empirical bounds of small monolingual models vs large multilingual baselines.
- Real-world code-switching benchmarks and evaluation metrics.
- On-device quantisation and inference latency on low-cost hardware.

Publication Roadmap (developed with Dr. Hariharan at VIT):
- Step 1: Post detailed flagship preprint on arXiv (timestamping priority).
- Step 2: Submit to DravidianLangTech (peer-reviewed Dravidian NLP workshop).
- Venue Choice: Avoids general venues like ICLR that reject language resource papers on scope; targets specialist communities where Dravidian NLP work has direct impact.
- Status: The company never describes an unpublished paper as published. Current publication status (whether preprint posted, submitted, or accepted) is unverified in public records; no peer-reviewed paper has been published yet.`
  },

  // =========================================================================
  // 7. INDIA CONTEXT & DATA SOVEREIGNTY
  // =========================================================================
  {
    id: 'india-sovereignty-and-dpdp',
    title: 'Data Sovereignty, DPDP Act & Tier-2 Innovation',
    category: 'india',
    temporalStatus: 'current',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part VII, Section 45 & 55',
    keywords: [
      'data sovereignty', 'dpdp act', 'privacy', 'on-premise', 'tier-2',
      'indiaai mission', 'meity genesis'
    ],
    content: `Data Sovereignty & Legal Tailwinds:
The Digital Personal Data Protection (DPDP) Act imposes strict responsibilities regarding Indian citizens' and children's data. For cloud AI vendors, transmitting school or hospital queries abroad presents compliance risks. 10X's local on-device and on-premise execution keeps all data strictly inside the customer's physical premises.

IndiaAI Mission Alignment:
10X's technical roadmap aligns with the pillars of the Government of India's IndiaAI Mission (indigenous language models, local datasets, education applications, and trusted AI). 10X holds a MeitY Genesis Grant (₹10 lakh) from the ministry administering the Mission. 10X maintains strict transparency and does not have a formal IndiaAI Mission award or partnership.`
  },

  // =========================================================================
  // 8. GLOSSARY OF CORE TERMINOLOGY
  // =========================================================================
  {
    id: 'glossary-terms',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VIII',
    title: '10X Technologies Core Terminology Glossary',
    category: 'glossary',
    keywords: [
      'glossary', 'definitions', 'akshara', 'luca', 'libre os', 'lfm',
      'fertility', 'agglutinative', 'code-switching', 'cpt', 'sft', 'meity'
    ],
    content: `Key Definitions:
- Agglutinative: Languages (like Telugu, Tamil, Kannada) where grammatical meaning is constructed by affixing morphemes to roots.
- Akshara: 10X's family of Indic tokenizers and monolingual Language Fluency Models (from Sanskrit for 'imperishable syllable').
- Code-switching: Blending two or more languages in one sentence (e.g. Telugu verbs with English nouns).
- Continued Pre-Training (CPT): Unsupervised training of an existing model on domain/language text to inject knowledge.
- Fertility: Average tokens produced per word; lower numbers indicate higher efficiency.
- LFM (Language Fluency Model): A compact model optimized for linguistic fluency and cultural grounding in one language.
- Libre OS: 10X's voice-first, intent-driven interaction operating layer.
- LUCA: 10X's smart speaker featuring per-user voice recognition and trademarked animated eyes.
- MeitY Genesis Grant: Non-dilutive grant of ₹10,00,000 awarded to 10X in January 2026.
- Supervised Fine-Tuning (SFT): Training on instruction-response pairs to shape response format and demeanor.`
  },

  // =========================================================================
  // 9. VERIFIED DIRECT QUESTION & ANSWER PAIRS (FROM PART VIII)
  // =========================================================================
  {
    id: 'qa-quick-direct-facts',
    title: 'Verified Quick Facts About 10X Technologies',
    category: 'qa',
    temporalStatus: 'hybrid',
    verificationSensitivity: 'sensitive',
    factualStatus: 'guarded',
    sourceSection: 'Part VIII, Direct Answers',
    keywords: [
      'quick facts', 'entity name', 'headquarters', 'ceo', 'tagline', 'brand color',
      'can i buy luca', 'is 10x funded', 'patents', 'team size'
    ],
    content: `Verified Quick Answers:
- What is the legal entity name? Pikachu Global Technologies Private Limited.
- Where is 10X located? Ongole, Andhra Pradesh, India.
- Who is the founder and CEO? Mani Bhavan (22 years old, Chief Engineer, left Computer Science degree at VIT-AP).
- What are the core products? Akshara (tokenizers and language fluency models), Libre OS (voice-first OS), and LUCA (smart speaker).
- What does "Talks like you" mean? It reflects conversational fluency — speaking in the user's authentic language, dialect, and natural English-Indic code-switching.
- What is the primary brand color? Deep purple (\`#512DA8\`), paired with white and black.
- Can I buy LUCA today? Not yet. Hardware definition and prototypes are built, but consumer units have not yet shipped to retail.
- Are the tokenizers open source? Yes, Apache 2.0 on Hugging Face and GitHub. Training datasets remain private.
- Does 10X have external funding? A ₹10 lakh MeitY Genesis Grant, a prior AWS Activate award ($10,000), and Google Cloud credits. Current AWS Activate tier and institutional equity rounds remain unclosed or unverified.
- Are there patents? Two provisional patent applications have been filed (provisional filings, not granted patents). One covers emotionally-aware voice interaction (a filed claim, not a currently shipped feature). Specific filing numbers and dates remain unverified.`
  },
  {
    id: 'qa-luca-eyes-and-design',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VIII, Hardware FAQ',
    title: 'Why Does LUCA Have Eyes & Hardware Form Factor FAQ',
    category: 'qa',
    keywords: [
      'why eyes', 'luca eyes', 'mascot', 'hardware', 'circular display',
      'face', 'not app'
    ],
    content: `Q: Why does LUCA have eyes?
A: The trademarked animated eyes serve as LUCA's face. For non-technical users, children, and elders who have never used a computer, a device with expressive eyes that look at you and react is intuitive and friendly. It visibly confirms that the device is listening and ready, replacing cold hardware status lights with an approachable domestic companion.

Q: Why build a smart speaker instead of just a mobile app?
A: A smartphone is an individual personal device assuming one user, one account, and one language setting. In contrast, Indian households are shared spaces where multiple generations (grandparents, parents, children) live in one room and speak three or four languages. A smart speaker sits in the living room and naturally accommodates shared multi-user, multi-lingual family interactions.`
  },
  {
    id: 'qa-small-models-and-competition',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VIII, Competition FAQ',
    title: 'Small Models vs Tech Giants & Competitors FAQ',
    category: 'qa',
    keywords: [
      'why small models', 'competing with giants', 'openai', 'google',
      'sarvam', 'ai4bharat', 'offline', 'cheap hardware'
    ],
    content: `Q: Why won't global labs (OpenAI, Google) crush 10X?
A: 10X is not competing in the frontier general-purpose cloud reasoning race. Global labs build massive models requiring cloud infrastructure and credit-card billing. 10X builds compact, dedicated single-language models that run offline on cheap ₹6,000 hardware with complete on-premise data privacy. Serving that offline domestic and school segment would require frontier labs to change their entire business model.

Q: How does 10X compare to Sarvam AI and AI4Bharat?
A: Sarvam AI is a well-capitalized company focusing on large multilingual cloud models. 10X focuses on small monolingual on-device models. AI4Bharat (IIT Madras) is an academic research institution doing foundational Indic work; 10X respects their academic contributions and focuses on commercial on-premise and hardware deployments.`
  },
  {
    id: 'qa-education-schools-parents',
    temporalStatus: 'current',
    verificationSensitivity: 'none',
    factualStatus: 'verified',
    sourceSection: 'Part VIII, Education FAQ',
    title: 'Education Deployments: Value for Schools, Students & Parents FAQ',
    category: 'qa',
    keywords: [
      'education faq', 'schools', 'parents', 'students', 'curriculum',
      'data privacy', 'telugu parent'
    ],
    content: `Q: What does 10X offer for schools and students?
A: It provides curriculum-grounded AI assistance in the student's natural language (including Telugu-English mixed speech). Unlike generic online chatbots, 10X models are adapted to the institution's verified syllabus, textbooks, and JEE/state exam questions.

Q: Can parents interact in Telugu?
A: Yes. Parents who may not be comfortable reading English can ask questions about exam schedules, student marks, attendance, and teacher details in conversational Telugu.

Q: Is student data safe?
A: Yes. The system runs on-premise on the school's own local infrastructure. Student and minor academic records never leave the school's physical premises, ensuring strict compliance with data privacy mandates.`
  }
];

