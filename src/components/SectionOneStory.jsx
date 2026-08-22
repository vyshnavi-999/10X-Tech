import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, X, Sparkles, ChevronRight } from 'lucide-react';
import Logo10X from './Logo10X';

const getAssetUrl = (path) => {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

// 6 Curated Domain Hubs with individual multi-harmonic autonomous physics parameters
const QUESTION_HUBS = [
  {
    id: 'tokenization',
    number: '02',
    category: 'TOKENIZATION & NLP',
    tag: 'BREAKTHROUGH ALGORITHM',
    title: 'Akshara Tokenizer: Native Indic Subword Engine',
    question: 'How is Indic language\nprocessed?',
    shortDesc: 'Eliminating subword fragmentation across 22+ scheduled languages.',
    leadStory: 'Standard Byte-Pair Encoding (BPE) tokenizers trained on English-dominant corpora severely fragment Dravidian and Devanagari text—frequently splitting a single Telugu or Hindi word into 4 to 6 arbitrary byte tokens. This quadruples inference latency and exhausts context windows.',
    solutionStory: '10X engineered the Akshara Tokenizer, a grammar-aware morphological subword engine. By combining native syllable boundary recognition with an optimized 64,000 Indic vocabulary matrix, Akshara achieves a 3.2x higher compression ratio, enabling small models to process regional languages with extreme speed on low-power devices.',
    specs: [
      { label: 'Compression', value: '3.2x Higher Token Efficiency' },
      { label: 'Vocabulary', value: '64k Native Indic Tokens' },
      { label: 'Latency', value: '70% Lower Memory Bandwidth' }
    ],
    themes: ['SLM Architecture', 'Conversational AI', 'Local Deployment'],
    ctaText: 'Launch Akshara Workbench',
    route: '/tokenizer-prototype',
    pos: { x: 21, y: 23 },
    motion: {
      wX1: 0.00075, phiX1: 1.2, aX1: 0.65,
      wX2: 0.00045, phiX2: 3.4, aX2: 0.25,
      wY1: 0.00065, phiY1: 0.8, aY1: 0.60,
      wY2: 0.00035, phiY2: 2.1, aY2: 0.20
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'tok-1',
        title: 'Akshara Workbench UI',
        subtitle: 'Live Tokenization & Morphological Analysis',
        image: '/akshara_tokenizer_ui.png',
        pos: { x: 7, y: 13 },
        attachTo: 'left',
        width: 114,
        height: 75,
        motion: {
          wX1: 0.00095, phiX1: 2.4, aX1: 0.90,
          wX2: 0.00055, phiX2: 0.6, aX2: 0.35,
          wY1: 0.00085, phiY1: 1.9, aY1: 0.80,
          wY2: 0.00040, phiY2: 4.1, aY2: 0.30
        }
      },
      {
        id: 'tok-2',
        title: 'Vocab Matrix',
        subtitle: 'Subword Probability Distribution',
        image: '/resolution chnaged tokenization.png',
        pos: { x: 21, y: 6 },
        attachTo: 'top',
        width: 78,
        height: 78,
        motion: {
          wX1: 0.00080, phiX1: 4.1, aX1: 0.75,
          wX2: 0.00040, phiX2: 1.8, aX2: 0.30,
          wY1: 0.00105, phiY1: 3.2, aY1: 0.85,
          wY2: 0.00050, phiY2: 0.9, aY2: 0.25
        }
      }
    ]
  },
  {
    id: 'models',
    number: '01',
    category: 'SLM ARCHITECTURE',
    tag: 'CORE FOUNDATION',
    title: 'Distilled Small Language Models (0.5B – 4B)',
    question: 'Why small language\nmodels?',
    shortDesc: 'Task-specific intelligence engineered for hardware-native execution.',
    leadStory: 'Frontier 70B+ LLMs require massive multi-GPU server clusters, introducing severe datacenter latency, cloud egress vulnerabilities, and high recurring API costs that make edge deployment impossible.',
    solutionStory: '10X develops specialized Small Language Models (0.5B to 4B parameters). Using deep knowledge distillation, non-Euclidean parameter pruning, and localized attention heads, 10X models match frontier accuracy on vertical domains while executing locally on consumer NPUs in under 15 milliseconds.',
    specs: [
      { label: 'Model Scale', value: '0.5B – 4.0B Parameters' },
      { label: 'First Token', value: '< 15ms TTFT on Mobile' },
      { label: 'Footprint', value: 'Runs on 2GB RAM / Edge NPU' }
    ],
    themes: ['Local Deployment', 'Tokenization & NLP', 'Geometric Research'],
    ctaText: 'Explore Model Catalog',
    route: '/models',
    pos: { x: 21, y: 50 },
    motion: {
      wX1: 0.00060, phiX1: 0.4, aX1: 0.60,
      wX2: 0.00035, phiX2: 2.8, aX2: 0.20,
      wY1: 0.00080, phiY1: 4.5, aY1: 0.70,
      wY2: 0.00045, phiY2: 1.3, aY2: 0.25
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'mod-1',
        title: 'LFM™ Constellation',
        subtitle: 'Multi-Tier Parameter Architecture',
        image: '/resolution changed lfm image.png',
        pos: { x: 7, y: 39 },
        attachTo: 'left',
        width: 114,
        height: 75,
        motion: {
          wX1: 0.00110, phiX1: 1.5, aX1: 0.85,
          wX2: 0.00060, phiX2: 3.7, aX2: 0.30,
          wY1: 0.00090, phiY1: 0.3, aY1: 0.75,
          wY2: 0.00045, phiY2: 2.9, aY2: 0.35
        }
      },
      {
        id: 'mod-2',
        title: 'Telugu Script Model',
        subtitle: 'Domain-Trained Specialized Weights',
        image: '/luca-telugu.png',
        pos: { x: 7, y: 59 },
        attachTo: 'left',
        width: 76,
        height: 76,
        motion: {
          wX1: 0.00075, phiX1: 3.8, aX1: 0.70,
          wX2: 0.00045, phiX2: 0.9, aX2: 0.25,
          wY1: 0.00100, phiY1: 2.6, aY1: 0.80,
          wY2: 0.00050, phiY2: 5.1, aY2: 0.30
        }
      }
    ]
  },
  {
    id: 'deployment',
    number: '03',
    category: 'LOCAL DEPLOYMENT',
    tag: 'SOVEREIGN INFRASTRUCTURE',
    title: 'Air-Gapped On-Device & Edge Execution',
    question: 'Where does local inference\nexecute?',
    shortDesc: 'Complete sovereign silicon execution with zero cloud telemetry.',
    leadStory: 'Enterprises and consumers are increasingly wary of transmitting proprietary code, financial records, and medical dialogues to third-party cloud servers where data can be logged or intercepted.',
    solutionStory: '10X models execute 100% locally on Apple Silicon Neural Engines, Qualcomm Snapdragon NPUs, NVIDIA Jetson modules, or on-premise air-gapped server racks. With custom INT4 and FP8 hardware quantization kernels, zero telemetry leaves your private network.',
    specs: [
      { label: 'Privacy', value: '100% Air-Gapped / Zero Egress' },
      { label: 'Quantization', value: 'INT4 / INT8 / FP8 Kernels' },
      { label: 'Compatibility', value: 'Apple NPU, Snapdragon, ARM' }
    ],
    themes: ['SLM Architecture', 'Physical Vehicles', 'Geometric Research'],
    ctaText: 'View Deployment Architecture',
    route: '/ai',
    pos: { x: 21, y: 77 },
    motion: {
      wX1: 0.00070, phiX1: 5.1, aX1: 0.65,
      wX2: 0.00040, phiX2: 1.6, aX2: 0.25,
      wY1: 0.00075, phiY1: 3.7, aY1: 0.65,
      wY2: 0.00035, phiY2: 0.2, aY2: 0.20
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'dep-1',
        title: 'On-Device Silicon',
        subtitle: 'Hardware-Accelerated Neural Kernels',
        image: '/resolution changed on device new.png',
        pos: { x: 7, y: 73 },
        attachTo: 'left',
        width: 110,
        height: 72,
        motion: {
          wX1: 0.00115, phiX1: 0.8, aX1: 0.95,
          wX2: 0.00065, phiX2: 4.2, aX2: 0.35,
          wY1: 0.00085, phiY1: 2.1, aY1: 0.80,
          wY2: 0.00040, phiY2: 1.5, aY2: 0.30
        }
      },
      {
        id: 'dep-2',
        title: 'Air-Gapped Server Rack',
        subtitle: 'Enterprise Sovereign Inference Cluster',
        image: '/enterprise_server.png',
        pos: { x: 21, y: 91.5 },
        attachTo: 'bottom',
        width: 78,
        height: 78,
        motion: {
          wX1: 0.00085, phiX1: 3.3, aX1: 0.70,
          wX2: 0.00045, phiX2: 5.7, aX2: 0.25,
          wY1: 0.00100, phiY1: 0.9, aY1: 0.85,
          wY2: 0.00050, phiY2: 3.8, aY2: 0.30
        }
      }
    ]
  },
  {
    id: 'research',
    number: '04',
    category: 'GEOMETRIC RESEARCH',
    tag: 'THEORETICAL PREPRINT',
    title: 'Quantum Funnel & Hyperbolic Manifold Projections',
    question: 'What computational geometry\npowers SLMs?',
    shortDesc: 'Compressing semantic spaces into non-Euclidean manifolds.',
    leadStory: 'Standard transformer self-attention computes Euclidean dot-product relationships, requiring exponential memory as context expands. Compressing models typically causes catastrophic loss of multi-hop logical reasoning.',
    solutionStory: '10X researchers designed the Quantum Funnel framework, projecting high-dimensional token representations into structured hyperbolic Riemannian manifolds. This preserves hierarchal concepts in compact vector spaces, allowing 1B models to achieve reasoning depth previously restricted to 7B+ systems.',
    specs: [
      { label: 'Mathematical Model', value: 'Quantum Funnel Projections' },
      { label: 'Latent Space', value: 'Hyperbolic Manifold Compression' },
      { label: 'Publication', value: '10X Lab Preprints & Open Specs' }
    ],
    themes: ['SLM Architecture', 'Tokenization & NLP', 'Conversational AI'],
    ctaText: 'Read Research Papers',
    route: '/blog',
    pos: { x: 79, y: 23 },
    motion: {
      wX1: 0.00080, phiX1: 2.1, aX1: 0.65,
      wX2: 0.00045, phiX2: 4.8, aX2: 0.25,
      wY1: 0.00070, phiY1: 1.4, aY1: 0.60,
      wY2: 0.00035, phiY2: 3.6, aY2: 0.20
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'res-1',
        title: 'Quantum Funnel',
        subtitle: 'Hyperbolic Projection Architecture',
        image: '/quantum_funnel_10x.png',
        pos: { x: 93, y: 13 },
        attachTo: 'right',
        width: 114,
        height: 75,
        motion: {
          wX1: 0.00105, phiX1: 3.6, aX1: 0.90,
          wX2: 0.00055, phiX2: 1.1, aX2: 0.35,
          wY1: 0.00095, phiY1: 4.8, aY1: 0.80,
          wY2: 0.00045, phiY2: 2.3, aY2: 0.30
        }
      },
      {
        id: 'res-2',
        title: 'Research Lab',
        subtitle: 'Experimental Validation Cluster',
        image: '/resolution changed reserach container.png',
        pos: { x: 79, y: 6 },
        attachTo: 'top',
        width: 78,
        height: 78,
        motion: {
          wX1: 0.00075, phiX1: 0.7, aX1: 0.70,
          wX2: 0.00040, phiX2: 3.2, aX2: 0.25,
          wY1: 0.00110, phiY1: 2.2, aY1: 0.85,
          wY2: 0.00055, phiY2: 5.4, aY2: 0.30
        }
      }
    ]
  },
  {
    id: 'luca',
    number: '05',
    category: 'CONVERSATIONAL AI',
    tag: 'FLAGSHIP AGENT',
    title: 'LUCA: The Autonomous On-Device Conversational Engine',
    question: 'How does on-device\nintelligence manifest?',
    shortDesc: 'Instant bilingual streaming dialogue running entirely in-browser and on-chip.',
    leadStory: 'Most voice assistants are thin wrappers over cloud APIs that introduce 800ms+ acoustic delays, fail completely without Wi-Fi, and struggle with code-mixed vernacular languages like Telugu and Hindi.',
    solutionStory: 'LUCA is our flagship conversational SLM. Engineered to run completely within WebAssembly or direct NPU runtimes, LUCA offers instantaneous streaming dialogue, fluent English/Telugu comprehension, and local tool execution with zero cloud dependency.',
    specs: [
      { label: 'Voice Streaming', value: 'Zero-Latency Local TTS / ASR' },
      { label: 'Vernacular', value: 'Native Indic + English Dialect' },
      { label: 'Runtime', value: 'Runs Client-Side in WebAssembly' }
    ],
    themes: ['Tokenization & NLP', 'Physical Vehicles', 'Local Deployment'],
    ctaText: 'Test LUCA Live in Browser',
    route: '/try',
    pos: { x: 79, y: 50 },
    motion: {
      wX1: 0.00065, phiX1: 4.3, aX1: 0.60,
      wX2: 0.00035, phiX2: 0.8, aX2: 0.20,
      wY1: 0.00085, phiY1: 2.9, aY1: 0.70,
      wY2: 0.00045, phiY2: 4.7, aY2: 0.25
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'luc-1',
        title: 'LUCA AI Engine',
        subtitle: 'Real-Time Neural Conversational Core',
        image: '/resolution changed luca ai  image.png',
        pos: { x: 93, y: 39 },
        attachTo: 'right',
        width: 114,
        height: 75,
        motion: {
          wX1: 0.00100, phiX1: 5.4, aX1: 0.85,
          wX2: 0.00050, phiX2: 2.7, aX2: 0.30,
          wY1: 0.00090, phiY1: 1.1, aY1: 0.75,
          wY2: 0.00040, phiY2: 3.9, aY2: 0.35
        }
      },
      {
        id: 'luc-2',
        title: 'Interactive Model Space',
        subtitle: 'Dynamic Local Token Streamer',
        image: '/LUCA AI image.png',
        pos: { x: 93, y: 59 },
        attachTo: 'right',
        width: 76,
        height: 76,
        motion: {
          wX1: 0.00085, phiX1: 1.9, aX1: 0.75,
          wX2: 0.00045, phiX2: 4.6, aX2: 0.25,
          wY1: 0.00105, phiY1: 3.8, aY1: 0.80,
          wY2: 0.00055, phiY2: 0.5, aY2: 0.30
        }
      }
    ]
  },
  {
    id: 'hardware',
    number: '06',
    category: 'PHYSICAL VEHICLES',
    tag: 'EMBEDDED HARDWARE',
    title: 'Turnkey Smart Form Factors & Edge Gateways',
    question: 'What physical vehicles\napply intelligence?',
    shortDesc: 'Standalone acoustic form factors with integrated offline NPU silicon.',
    leadStory: 'Ambient intelligence must be physically embedded into consumer and industrial environments to respond instantly without relying on continuous cloud subscriptions or external internet pipelines.',
    solutionStory: '10X designs integrated hardware vehicles—such as the 10X Smart Speaker and localized IoT micro-gateways—embedded with specialized neural silicon to bring continuous, private, offline intelligence into everyday physical spaces.',
    specs: [
      { label: 'Form Factor', value: '10X Ambient Smart Speaker' },
      { label: 'Autonomy', value: '100% Offline Continuous Mode' },
      { label: 'Acoustics', value: 'Far-Field Directional Array' }
    ],
    themes: ['Local Deployment', 'Conversational AI', 'SLM Architecture'],
    ctaText: 'Explore Hardware Devices',
    route: '/product',
    pos: { x: 79, y: 77 },
    motion: {
      wX1: 0.00075, phiX1: 3.5, aX1: 0.65,
      wX2: 0.00040, phiX2: 1.2, aX2: 0.25,
      wY1: 0.00070, phiY1: 5.6, aY1: 0.65,
      wY2: 0.00035, phiY2: 2.8, aY2: 0.20
    },
    ports: {
      left: { offsetX: -8.5, offsetY: -1.0 },
      top: { offsetX: 0, offsetY: -7.5 },
      bottom: { offsetX: 0, offsetY: 7.5 },
      right: { offsetX: 8.5, offsetY: -1.0 }
    },
    leaves: [
      {
        id: 'hw-1',
        title: '10X Smart Speaker',
        subtitle: 'Ambient Physical AI Prototype',
        image: '/resolution changed hardware image.png',
        pos: { x: 93, y: 73 },
        attachTo: 'right',
        width: 110,
        height: 72,
        motion: {
          wX1: 0.00120, phiX1: 2.8, aX1: 0.95,
          wX2: 0.00060, phiX2: 0.4, aX2: 0.35,
          wY1: 0.00085, phiY1: 4.1, aY1: 0.80,
          wY2: 0.00045, phiY2: 1.7, aY2: 0.30
        }
      },
      {
        id: 'hw-2',
        title: 'Edge Silicon NPU',
        subtitle: 'Low-Power Embedded Accelerator',
        image: '/hardware_gateway_card.png',
        pos: { x: 79, y: 91.5 },
        attachTo: 'bottom',
        width: 78,
        height: 78,
        motion: {
          wX1: 0.00080, phiX1: 0.3, aX1: 0.70,
          wX2: 0.00045, phiX2: 3.9, aX2: 0.25,
          wY1: 0.00100, phiY1: 1.7, aY1: 0.85,
          wY2: 0.00050, phiY2: 4.4, aY2: 0.30
        }
      }
    ]
  }
];

const SectionOneStory = () => {
  const navigate = useNavigate();
  const [hoveredHub, setHoveredHub] = useState(null);
  const [hoveredLeaf, setHoveredLeaf] = useState(null);
  const [selectedHub, setSelectedHub] = useState(null);
  const [activeSpecimenIdx, setActiveSpecimenIdx] = useState(0);

  // Direct DOM refs for high-performance 60fps autonomous animation (Zero Cursor Dependent, Zero Re-render)
  const hubRefs = useRef([]);
  const leafRefs = useRef([]);
  const lineRefs = useRef([]);
  const portDotRefs = useRef([]);
  const leafDotRefs = useRef([]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedHub(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCluster = useCallback((hub, initialLeafIdx = 0, e) => {
    e?.stopPropagation();
    setSelectedHub(hub);
    setActiveSpecimenIdx(initialLeafIdx);
  }, []);

  const handleSelectTheme = (themeName) => {
    const match = QUESTION_HUBS.find(
      (h) => h.category.toLowerCase().includes(themeName.toLowerCase()) || 
             h.id.toLowerCase().includes(themeName.toLowerCase()) ||
             h.title.toLowerCase().includes(themeName.toLowerCase())
    );
    if (match) {
      setSelectedHub(match);
      setActiveSpecimenIdx(0);
    }
  };

  const handleNavigate = (route, e) => {
    e?.stopPropagation();
    if (!route) return;
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
    } else {
      navigate(route);
    }
  };

  // Pure Autonomous Multi-Harmonic Physics Simulation Loop (60fps Direct DOM Animation)
  useEffect(() => {
    let animId;
    let startTime = performance.now();

    const animateAutonomousConstellation = (now) => {
      const t = now - startTime;
      let leafGlobalIndex = 0;
      let lineGlobalIndex = 0;

      QUESTION_HUBS.forEach((hub, hIdx) => {
        // Calculate autonomous organic drift for the question hub
        const m = hub.motion;
        const hDx = Math.sin(t * m.wX1 + m.phiX1) * m.aX1 + Math.cos(t * m.wX2 + m.phiX2) * m.aX2;
        const hDy = Math.cos(t * m.wY1 + m.phiY1) * m.aY1 + Math.sin(t * m.wY2 + m.phiY2) * m.aY2;

        const liveHubX = hub.pos.x + hDx;
        const liveHubY = hub.pos.y + hDy;

        // Move Hub Question DOM node
        const hubEl = hubRefs.current[hIdx];
        if (hubEl) {
          hubEl.style.left = `${liveHubX}%`;
          hubEl.style.top = `${liveHubY}%`;
        }

        // Live Port positions
        const livePorts = {
          left: { x: liveHubX + hub.ports.left.offsetX, y: liveHubY + hub.ports.left.offsetY },
          top: { x: liveHubX + hub.ports.top.offsetX, y: liveHubY + hub.ports.top.offsetY },
          bottom: { x: liveHubX + hub.ports.bottom.offsetX, y: liveHubY + hub.ports.bottom.offsetY },
          right: { x: liveHubX + hub.ports.right.offsetX, y: liveHubY + hub.ports.right.offsetY }
        };

        // Move Leaf Cards and dynamically tether lines
        hub.leaves.forEach((leaf) => {
          const lm = leaf.motion;
          const lDx = Math.sin(t * lm.wX1 + lm.phiX1) * lm.aX1 + Math.cos(t * lm.wX2 + lm.phiX2) * lm.aX2;
          const lDy = Math.cos(t * lm.wY1 + lm.phiY1) * lm.aY1 + Math.sin(t * lm.wY2 + lm.phiY2) * lm.aY2;

          const liveLeafX = leaf.pos.x + lDx;
          const liveLeafY = leaf.pos.y + lDy;

          // Move Leaf Card DOM node
          const leafEl = leafRefs.current[leafGlobalIndex];
          if (leafEl) {
            leafEl.style.left = `${liveLeafX}%`;
            leafEl.style.top = `${liveLeafY}%`;
          }

          // Tether line
          const port = livePorts[leaf.attachTo] || livePorts.left;
          const lineEl = lineRefs.current[lineGlobalIndex];
          if (lineEl) {
            lineEl.setAttribute('x1', `${port.x}`);
            lineEl.setAttribute('y1', `${port.y}`);
            lineEl.setAttribute('x2', `${liveLeafX}`);
            lineEl.setAttribute('y2', `${liveLeafY}`);
          }

          // Tether Dots
          const pDot = portDotRefs.current[lineGlobalIndex];
          if (pDot) {
            pDot.setAttribute('cx', `${port.x}`);
            pDot.setAttribute('cy', `${port.y}`);
          }
          const lDot = leafDotRefs.current[lineGlobalIndex];
          if (lDot) {
            lDot.setAttribute('cx', `${liveLeafX}`);
            lDot.setAttribute('cy', `${liveLeafY}`);
          }

          leafGlobalIndex++;
          lineGlobalIndex++;
        });
      });

      animId = requestAnimationFrame(animateAutonomousConstellation);
    };

    animId = requestAnimationFrame(animateAutonomousConstellation);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="relative z-10 w-full min-h-[100svh] lg:min-h-[960px] text-white selection:bg-purple-500/30 font-sans overflow-hidden flex flex-col justify-between pt-20 pb-8 sm:pb-12 bg-transparent">
      
      {/* ── STYLES FOR SLEEK SCROLLBAR & HARDWARE ACCELERATION ── */}
      <style>{`
        .modal-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 9999px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.25);
          border-radius: 9999px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.5);
        }
      `}</style>

      {/* ── BACKGROUND ATMOSPHERIC COSMIC NEBULA GLOW ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] lg:w-[1200px] h-[600px] lg:h-[800px] rounded-full blur-[190px] opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(167,139,250,0.25) 0%, rgba(88,28,135,0.08) 45%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* ── DESKTOP PURE AUTONOMOUS CONSTELLATION CANVAS (1024PX+) ── */}
      <div className="hidden lg:block relative w-full h-[840px] max-w-[1560px] mx-auto px-4 z-10 select-none my-auto">
        
        {/* Real-Time Dynamically Tethered SVG Lines (Autonomous Multi-Harmonic Loop) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {(() => {
            let lineIdx = 0;
            return QUESTION_HUBS.map((hub) => {
              const isActive = hoveredHub === hub.id;

              return (
                <g key={hub.id} className="transition-opacity duration-300">
                  {hub.leaves.map((leaf) => {
                    const currentIdx = lineIdx++;

                    return (
                      <g key={leaf.id}>
                        <line
                          ref={(el) => (lineRefs.current[currentIdx] = el)}
                          x1={hub.pos.x}
                          y1={hub.pos.y}
                          x2={leaf.pos.x}
                          y2={leaf.pos.y}
                          stroke={isActive ? 'rgba(192, 132, 252, 0.95)' : 'rgba(255, 255, 255, 0.22)'}
                          strokeWidth={isActive ? '0.28' : '0.14'}
                          className="transition-colors duration-200"
                        />
                        {/* Port micro-dot */}
                        <circle
                          ref={(el) => (portDotRefs.current[currentIdx] = el)}
                          cx={hub.pos.x}
                          cy={hub.pos.y}
                          r="0.28"
                          fill={isActive ? '#C084FC' : 'rgba(255,255,255,0.4)'}
                          className="transition-colors duration-200"
                        />
                        {/* Leaf micro-dot */}
                        <circle
                          ref={(el) => (leafDotRefs.current[currentIdx] = el)}
                          cx={leaf.pos.x}
                          cy={leaf.pos.y}
                          r="0.28"
                          fill={isActive ? '#C084FC' : 'rgba(255,255,255,0.4)'}
                          className="transition-colors duration-200"
                        />
                      </g>
                    );
                  })}
                </g>
              );
            });
          })()}
        </svg>

        {/* ── 1. COMMANDING CENTRAL THESIS (UNCHANGED TRUE EXACT MIDDLE) ── */}
        <div className="absolute top-1/2 left-1/2 w-full max-w-[440px] text-center z-30 pointer-events-auto flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
          {/* Subdued 10X Wordmark with Signature Reveal */}
          <div className="flex justify-center mb-3">
            <Logo10X
              className="h-10 sm:h-12 md:h-13 w-auto object-contain max-w-full drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
              animateTechnologies={true}
              delay={300}
            />
          </div>

          {/* Core Authoritative Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold tracking-tight uppercase leading-[1.08] mb-3 text-center">
            <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.25)]">
              SMALL LANGUAGE MODELS.
            </span>
            <span className="block mt-1 bg-gradient-to-r from-white via-[#E2D8FF] to-[#A78BFA] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(167,139,250,0.35)]">
              BUILT FOR YOUR HARDWARE.
            </span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-xs mx-auto mb-5 text-center">
            Task-specific AI designed to run where your data and workloads live.
          </p>

          {/* Direct Refined Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => handleNavigate('/models', e)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-zinc-100 active:scale-95 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNavigate('/try', e)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/12 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:bg-white/10 hover:border-white/30 cursor-pointer backdrop-blur-md"
            >
              <span>Try LUCA</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        </div>

        {/* ── 2. SURROUNDING 6 DOMAIN QUESTIONS & LEAF SPECIMENS (AUTONOMOUS HARMONIC MOTION) ── */}
        {(() => {
          let leafElCounter = 0;

          return QUESTION_HUBS.map((hub, hIdx) => {
            const isActive = hoveredHub === hub.id;

            return (
              <React.Fragment key={hub.id}>
                {/* Question Anchor Typography (Autonomous Harmonic Floating) */}
                <div
                  ref={(el) => (hubRefs.current[hIdx] = el)}
                  style={{
                    left: `${hub.pos.x}%`,
                    top: `${hub.pos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute z-20 cursor-pointer max-w-[240px] select-none group will-change-transform"
                  onMouseEnter={() => setHoveredHub(hub.id)}
                  onMouseLeave={() => {
                    setHoveredHub(null);
                    setHoveredLeaf(null);
                  }}
                  onClick={(e) => handleOpenCluster(hub, 0, e)}
                >
                  <div className="flex flex-col gap-1.5 p-2 rounded-xl transition-all duration-200 group-hover:bg-white/[0.04]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-mono text-purple-400 font-bold uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                        {hub.number} · {hub.category}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-purple-400">
                        ↗
                      </span>
                    </div>
                    <h3 className="text-[17px] sm:text-[19px] font-serif font-normal italic text-zinc-100 group-hover:text-white group-hover:underline decoration-purple-400/40 underline-offset-4 transition-all leading-tight whitespace-pre-line drop-shadow-lg">
                      {hub.question}
                    </h3>
                  </div>
                </div>

                {/* 1.5x Scaled Pure Image Artifact Leaves (Autonomous Harmonic Floating) */}
                {hub.leaves.map((leaf, leafIdx) => {
                  const currentLeafIdx = leafElCounter++;
                  const isHovered = hoveredLeaf === leaf.id;

                  return (
                    <div
                      key={leaf.id}
                      ref={(el) => (leafRefs.current[currentLeafIdx] = el)}
                      style={{
                        left: `${leaf.pos.x}%`,
                        top: `${leaf.pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${leaf.width}px`,
                        height: `${leaf.height}px`
                      }}
                      className="absolute z-20 cursor-pointer select-none group will-change-transform"
                      onMouseEnter={() => {
                        setHoveredHub(hub.id);
                        setHoveredLeaf(leaf.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredHub(null);
                        setHoveredLeaf(null);
                      }}
                      onClick={(e) => handleOpenCluster(hub, leafIdx, e)}
                    >
                      <div 
                        className={`relative w-full h-full rounded-lg overflow-hidden border transition-all duration-300 shadow-lg ${
                          isHovered
                            ? 'border-purple-400 shadow-[0_6px_30px_rgba(192,132,252,0.45)] scale-[1.08] z-40 ring-1 ring-purple-400/50'
                            : isActive
                            ? 'border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.85)]'
                            : 'border-white/20 bg-[#0a0a10] hover:border-white/50'
                        }`}
                      >
                        <img
                          src={getAssetUrl(leaf.image)}
                          alt={leaf.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                          loading="lazy"
                          draggable={false}
                        />
                        {/* Hover specimen label pill */}
                        <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between">
                          <span className="text-[8.5px] font-mono text-zinc-200 truncate px-1">{leaf.title}</span>
                          <span className="text-[9px] text-purple-300 pr-1">↗</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          });
        })()}

        {/* ── BOTTOM ANTHROPIC-STYLE INTERACTIVE EXPLORE PILL ── */}
        <div className="absolute bottom-2 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10.5px] font-mono text-zinc-400 pointer-events-none backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <span>Click any question or node to explore details</span>
        </div>

      </div>

      {/* ── ANTHROPIC-STYLE INTERACTIVE EDITORIAL DETAIL CARD MODAL (PORTAL AT Z-[9999] ABOVE NAVBAR) ── */}
      {selectedHub && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 py-10 sm:py-14 bg-black/85 backdrop-blur-2xl animate-fade-in"
          onClick={() => setSelectedHub(null)}
        >
          {/* Card Container (Clean Rounded Outer Shell with Overflow Hidden) */}
          <div 
            className="relative w-full max-w-2xl max-h-[86vh] bg-[#090912] border border-white/20 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.99)] flex flex-col text-left my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Fixed Solid Top Header (Completely Opaque, Outside Scroll Area) */}
            <div className="w-full bg-[#090912] px-6 sm:px-8 pt-6 sm:pt-7 pb-4 sm:pb-5 border-b border-white/10 z-20 shrink-0 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                    {selectedHub.number} · {selectedHub.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9.5px] font-mono text-zinc-400 uppercase tracking-wide">
                    {selectedHub.tag}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                  {selectedHub.title}
                </h2>
                <span className="text-xs font-serif italic text-purple-300/80">
                  “{selectedHub.question.replace('\n', ' ')}”
                </span>
              </div>

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={() => setSelectedHub(null)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Dedicated Scrollable Body Container (Zero Visual Bleed into Header) */}
            <div className="w-full flex-1 overflow-y-auto modal-scrollbar px-6 sm:px-8 py-6 flex flex-col gap-6">

              {/* Specimen Visual Gallery & Tab Switcher */}
              <div className="flex flex-col gap-2.5">
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/15 bg-black/80 relative group shadow-xl">
                  <img
                    src={getAssetUrl(selectedHub.leaves[activeSpecimenIdx]?.image || selectedHub.leaves[0]?.image)}
                    alt={selectedHub.leaves[activeSpecimenIdx]?.title || selectedHub.leaves[0]?.title}
                    className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090912] via-transparent to-transparent opacity-75" />
                  <div className="absolute bottom-3.5 left-4 flex flex-col gap-0.5">
                    <span className="text-xs font-mono font-bold text-white drop-shadow-md">
                      {selectedHub.leaves[activeSpecimenIdx]?.title}
                    </span>
                    <span className="text-[10.5px] font-mono text-zinc-300 drop-shadow-sm">
                      {selectedHub.leaves[activeSpecimenIdx]?.subtitle}
                    </span>
                  </div>
                </div>

                {/* Multiple Specimen Thumbnail Selectors if 2+ leaves */}
                {selectedHub.leaves.length > 1 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Specimens:</span>
                    {selectedHub.leaves.map((leaf, idx) => (
                      <button
                        key={leaf.id}
                        type="button"
                        onClick={() => setActiveSpecimenIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeSpecimenIdx === idx
                            ? 'bg-purple-500/20 border border-purple-500/50 text-white font-bold'
                            : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>0{idx + 1}</span>
                        <span>{leaf.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Deep Editorial Story / Explanation */}
              <div className="flex flex-col gap-3.5 text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    The Problem Landscape
                  </span>
                  <p className="text-zinc-300">{selectedHub.leadStory}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    The 10X Breakthrough Architecture
                  </span>
                  <p className="text-zinc-200">{selectedHub.solutionStory}</p>
                </div>
              </div>

              {/* Technical Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {selectedHub.specs.map((sp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-mono uppercase text-zinc-500">{sp.label}</span>
                    <span className="text-xs font-mono font-bold text-white">{sp.value}</span>
                  </div>
                ))}
              </div>

              {/* Connected Themes / Related Nodes (Anthropic Network Feature) */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 flex-wrap">
                <span className="text-[10.5px] font-mono text-zinc-500 uppercase">Related Themes:</span>
                {selectedHub.themes.map((th, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTheme(th)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-[10px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{th}</span>
                    <ChevronRight className="w-3 h-3 text-purple-400" />
                  </button>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    setSelectedHub(null);
                    handleNavigate(selectedHub.route, e);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95"
                >
                  <span>{selectedHub.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedHub(null)}
                  className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Return to Constellation [ESC]
                </button>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ── MOBILE & TABLET EDITORIAL VERTICAL CONSTELLATION (< 1024PX) ── */}
      <div className="lg:hidden relative w-full px-4 sm:px-6 z-10 flex flex-col gap-8">
        
        {/* Mobile Central Thesis */}
        <div className="w-full text-center max-w-xl mx-auto pt-2">
          <div className="flex justify-center mb-3">
            <Logo10X
              className="h-10 sm:h-13 w-auto object-contain max-w-full"
              animateTechnologies={true}
              delay={200}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-[1.1] mb-2.5">
            <span className="block text-white">
              SMALL LANGUAGE MODELS.
            </span>
            <span className="block mt-1 bg-gradient-to-r from-white via-[#E2D8FF] to-[#A78BFA] bg-clip-text text-transparent">
              BUILT FOR YOUR HARDWARE.
            </span>
          </h1>

          <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-md mx-auto mb-4">
            Task-specific AI designed to run where your data and workloads live.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={(e) => handleNavigate('/models', e)}
              className="px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              Explore Catalog
            </button>
            <button
              type="button"
              onClick={(e) => handleNavigate('/try', e)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/12 text-white text-xs font-mono font-bold uppercase tracking-wider"
            >
              Try LUCA AI
            </button>
          </div>
        </div>

        {/* Mobile 6-Domain Ecosystem List */}
        <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              10X INTELLIGENCE ECOSYSTEM
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              6 CORE DOMAINS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {QUESTION_HUBS.map((hub) => (
              <div
                key={hub.id}
                onClick={(e) => handleOpenCluster(hub, 0, e)}
                className="p-3.5 rounded-xl bg-[#080812]/95 border border-white/10 hover:border-white/30 transition-all flex flex-col gap-2.5 cursor-pointer shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">
                    {hub.number} · {hub.category}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                <div>
                  <h4 className="text-xs font-serif italic text-white">{hub.question}</h4>
                </div>

                {/* Pure Leaf Image Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                  {hub.leaves.map((leaf, idx) => (
                    <div
                      key={leaf.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCluster(hub, idx, e);
                      }}
                      className="relative h-14 w-20 flex-shrink-0 rounded overflow-hidden border border-white/15 bg-black"
                    >
                      <img
                        src={getAssetUrl(leaf.image)}
                        alt={leaf.title}
                        className="w-full h-full object-cover opacity-90"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── SUBTLE SCROLL PROMPT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none opacity-40 animate-pulse mt-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 mb-1">
          Scroll to Explore
        </span>
        <div className="w-px h-5 bg-gradient-to-b from-purple-400 to-transparent" />
      </div>

    </section>
  );
};

export default SectionOneStory;
