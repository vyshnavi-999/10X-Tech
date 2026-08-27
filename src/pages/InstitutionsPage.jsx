import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import lottie from 'lottie-web';
import mouseScrollAnimationData from '../assets/mouse_scroll_animation.json';

const SCRAMBLE_CHARS = '+?84564XERS';

function ScrambleText({ text, speed = 40, duration = 1.2, delay = 0 }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let timeout;
    let interval;
    const startScramble = () => {
      let frame = 0;
      const totalFrames = (duration * 1000) / speed;
      interval = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ' || char === '.' || char === "'" || char === '[' || char === ']' || char === '+' || char === '/' || char === '$' || char === '-' || char === '>') return char;
              if (i < (frame / totalFrames) * text.length) return text[i];
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join('')
        );
        frame++;
        if (frame >= totalFrames) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);
    };

    timeout = setTimeout(() => {
      startScramble();
      const loop = setInterval(startScramble, 6000);
      return () => clearInterval(loop);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, duration, delay]);

  return <span>{display}</span>;
}

function LottieScrollIndicator() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: mouseScrollAnimationData,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-[72px] h-[78px] flex items-center justify-center select-none pointer-events-none"
    />
  );
}

// Partner Logos (Static 4 Logos in strict order: MeitY, AWS, NVIDIA, Bharat AI Mission)
const PARTNER_LOGOS = [
  { 
    id: 1, 
    name: 'Ministry of Electronics', 
    src: `${import.meta.env.BASE_URL}partners/meity.png?v=5`, 
    alt: 'Ministry of Electronics and Information Technology (MeitY)',
    imgClass: 'h-13 sm:h-16 md:h-18 lg:h-20 max-w-[200px] sm:max-w-[240px]'
  },
  { 
    id: 2, 
    name: 'AWS', 
    src: `${import.meta.env.BASE_URL}partners/aws.png?v=6`, 
    alt: 'Amazon Web Services (AWS)',
    imgClass: 'h-10 sm:h-12 md:h-14 lg:h-16 max-w-[150px] sm:max-w-[180px]'
  },
  { 
    id: 3, 
    name: 'NVIDIA', 
    src: `${import.meta.env.BASE_URL}partners/nvidia.png?v=5`, 
    alt: 'NVIDIA Inception Program',
    imgClass: 'h-11 sm:h-13 md:h-15 lg:h-17 max-w-[170px] sm:max-w-[200px]'
  },
  { 
    id: 4, 
    name: 'Bharat AI Mission', 
    src: `${import.meta.env.BASE_URL}partners/bharat_ai_mission.png?v=5`, 
    alt: 'Bharat AI Mission',
    imgClass: 'h-13 sm:h-16 md:h-18 lg:h-20 max-w-[180px] sm:max-w-[220px]'
  },
];

// Product Steps (01: YOUR Data, 02: YOUR Requirement, 03: YOUR Model, 04: YOUR Inference)
const PLATFORM_STEPS = [
  {
    id: '01',
    word: 'Data',
    desc: 'We start with what you already have. Your documents, your records, your domain. We curate it specifically for your use case, not scraped.',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f258b8e73d7666537_bar-chart.png',
    alt: 'Your data icon'
  },
  {
    id: '02',
    word: 'Requirement',
    desc: 'We train a small AI model for your exact task, purpose-built to do that one thing well, while still outperforming bigger models at a fraction of the cost.',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952afed8d4ca6576fcbdedf_linked-services.png',
    alt: 'Your requirement icon'
  },
  {
    id: '03',
    word: 'Model',
    desc: 'Your small AI model is licensed exclusively to you, giving you control over its deployment and use. The model trained for your organization is never shared with another customer.',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f1c8555865fea32ed_auto-renew.png',
    alt: 'Your model icon'
  },
  {
    id: '04',
    word: 'Inference',
    desc: 'Run your small AI model on your own server, hardware, smartphone, or device, fully offline, with one fixed cost and unlimited usage forever.',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f0b7d0e5d63ed20fb_encrypted.png',
    alt: 'Your inference icon'
  }
];

// Workflow Steps Exact Copy
const WORKFLOW_STEPS = [
  {
    id: '01',
    title: 'Collect Data',
    desc: 'AI gathers structured and unstructured data from connected sources in real time.',
    highlight: 'connected sources in real time.',
    icon: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/69578490882419fc1e01db35_send-money.png',
  },
  {
    id: '02',
    title: 'Process Data',
    desc: 'Inputs are validated, normalized, and prepared for intelligent analysis.',
    highlight: 'intelligent analysis.',
    icon: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848775e47cb93705303b_input-circle.png',
  },
  {
    id: '03',
    title: 'Analyze Data',
    desc: 'Advanced models extract insights, patterns, and predictive signals.',
    highlight: 'predictive signals.',
    icon: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848775e47cb93705303f_pie-chart.png',
  },
  {
    id: '04',
    title: 'Deliver Data',
    desc: 'Insights are transformed into clear, actionable outcomes.',
    highlight: 'actionable outcomes.',
    icon: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848757af7f496852add3_data.png',
  }
];

// Integration Cards Exact 7-Node Sequence
const INTEGRATION_CARDS = [
  { id: 1, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e6cda1499b340dfc03_logoipsum-374.png', alt: 'Chevron diamond' },
  { id: 2, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e5aec85a190a0e0971_logoipsum-376.png', alt: '4 Arrow points' },
  { id: 3, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e5c7e7f8c67aa1e697_logoipsum-407.png', alt: 'Hexagonal arrows' },
  { id: 4, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e6e561a98bc4f3b602_logoipsum-411.png', alt: 'Star trapezoid center' },
  { id: 5, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e6ba2de3fdc98386ac_logoipsum-368.png', alt: 'Angular loop block' },
  { id: 6, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e54e7ff8ad99482a54_logoipsum-381.png', alt: 'Stylized D slashes' },
  { id: 7, src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6958c8e6b2b4c25b9b8a81a1_logoipsum-386.png', alt: 'Hexagonal ring' },
];

export default function InstitutionsPage() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualStep, setManualStep] = useState(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  
  // Section 3 4x4 Plus Grid Rhythm State
  const [plusRhythm, setPlusRhythm] = useState(0);

  // Section 4 Counter Dial state
  const [dialCount, setDialCount] = useState(0);

  // Section 5 Lab animated state
  const [labMode, setLabMode] = useState('manual'); // 'manual' | 'intelegent'
  const labModeRef = useRef('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [efficiencyDisplay, setEfficiencyDisplay] = useState(67);
  const [laserPos, setLaserPos] = useState(0); // 0 to 100%

  // Section 6 Workflow active step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Section 7 Pricing removed

  // Section 8 Integration scroll expansion progress (0 to 1)
  const [integrationProgress, setIntegrationProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const heroRef = useRef(null);
  const trackRef = useRef(null);
  const labRef = useRef(null);
  const workflowRef = useRef(null);
  const integrationRef = useRef(null);
  const scrollRaf = useRef(null);
  const scrollLockTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      
      setMouseOffset({
        x: normX * 18,
        y: normY * 14,
        rotX: -normY * 4,
        rotY: normX * 4
      });
    };

    const handleUserScrollInteraction = () => {
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
      setManualStep(null);
    };

    const handleScroll = () => {
      if (scrollRaf.current) return;
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = null;

        // Product Track progress
        if (trackRef.current) {
          const rect = trackRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            setScrollProgress(progress);
          }
        }

        // Lab Track progress (Fast Snappy Trigger)
        if (labRef.current) {
          const rect = labRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = currentScroll / totalScrollable;
            if (progress >= 0.25 && labModeRef.current !== 'intelegent') {
              triggerLabMode('intelegent');
            } else if (progress < 0.15 && labModeRef.current !== 'manual') {
              triggerLabMode('manual');
            }
          }
        }

        // Workflow Track progress
        if (workflowRef.current) {
          const rect = workflowRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            const step = Math.min(3, Math.floor(progress * 4));
            setActiveWorkflowStep(step);
          }
        }

        // Integration Track progress
        if (integrationRef.current) {
          const rect = integrationRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            setIntegrationProgress(progress);
          }
        }
      });
    };

    // Circular counter dial interval
    const counterInterval = setInterval(() => {
      setDialCount(prev => (prev >= 100 ? 0 : prev + 1));
    }, 45);

    // 4x4 Plus Grid Rhythmic Color Pulse Interval
    const rhythmInterval = setInterval(() => {
      setPlusRhythm(prev => (prev + 1) % 6);
    }, 850);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserScrollInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserScrollInteraction, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserScrollInteraction);
      window.removeEventListener('touchmove', handleUserScrollInteraction);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);
      clearInterval(counterInterval);
      clearInterval(rhythmInterval);
    };
  }, []);

  // Section 3 Product Step Calculation
  let calculatedStep = -1;
  if (scrollProgress < 0.12) {
    calculatedStep = -1;
  } else if (scrollProgress < 0.35) {
    calculatedStep = 0;
  } else if (scrollProgress < 0.58) {
    calculatedStep = 1;
  } else if (scrollProgress < 0.80) {
    calculatedStep = 2;
  } else {
    calculatedStep = 3;
  }

  const activeStep = manualStep !== null ? manualStep : calculatedStep;
  const currentStep = activeStep >= 0 ? PLATFORM_STEPS[activeStep] : null;

  const scrollToStep = (idx) => {
    setManualStep(idx);
    if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);

    if (trackRef.current) {
      const totalScrollable = trackRef.current.offsetHeight - window.innerHeight;
      const stepCenters = [0.23, 0.46, 0.69, 0.90];
      const stepTargetProgress = stepCenters[idx] ?? (0.18 + idx * 0.23);
      const targetY = trackRef.current.offsetTop + totalScrollable * stepTargetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    // Auto-release manual lock after smooth scrolling finishes
    scrollLockTimeoutRef.current = setTimeout(() => {
      setManualStep(null);
    }, 700);
  };

  // Snappy Butter-Smooth Lab Trigger Function
  const triggerLabMode = (targetMode) => {
    labModeRef.current = targetMode;
    setLabMode(targetMode);
    setIsScanning(true);
    
    // Fast laser sweep animation (0 -> 100% in 380ms)
    setLaserPos(targetMode === 'intelegent' ? 0 : 100);
    setTimeout(() => {
      setLaserPos(targetMode === 'intelegent' ? 100 : 0);
    }, 20);

    // Smooth numerical countup/countdown
    const startVal = targetMode === 'intelegent' ? 67 : 99;
    const endVal = targetMode === 'intelegent' ? 99 : 67;
    const duration = 380;
    const startTime = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.round(startVal + (endVal - startVal) * ease);
      setEfficiencyDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setEfficiencyDisplay(endVal);
        setTimeout(() => setIsScanning(false), 80);
      }
    };
    requestAnimationFrame(animateCount);
  };

  const toggleLabMode = () => {
    const nextMode = labModeRef.current === 'intelegent' ? 'manual' : 'intelegent';
    triggerLabMode(nextMode);
  };

  const isLabIntelegent = labMode === 'intelegent';

  const scrollToWorkflowStep = (idx) => {
    setActiveWorkflowStep(idx);
    if (!workflowRef.current) return;
    const totalScrollable = workflowRef.current.offsetHeight - window.innerHeight;
    const targetY = workflowRef.current.offsetTop + totalScrollable * (idx / 3.2);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Section 8 Arc Card Interpolation Functions
  const p = integrationProgress;
  const screenScale = Math.min(1, Math.max(0.40, (windowWidth || 1200) / 1280));
  const cardTransforms = [
    {
      x: (-38 + (-607 * p)) * screenScale,
      y: (9 + (144 * p)) * screenScale,
      rot: -1.2 + (-18.8 * p),
      scale: (0.62 + (0.38 * p)) * (windowWidth < 640 ? 0.72 : 1),
      zIndex: 10
    },
    {
      x: (0 + (-430 * p)) * screenScale,
      y: (0 + (76 * p)) * screenScale,
      rot: 0 + (-16 * p),
      scale: (0.80 + (0.20 * p)) * (windowWidth < 640 ? 0.76 : 1),
      zIndex: 20
    },
    {
      x: (0 + (-215 * p)) * screenScale,
      y: (0 + (23 * p)) * screenScale,
      rot: 0 + (-8 * p),
      scale: 1.0 * (windowWidth < 640 ? 0.82 : 1),
      zIndex: 30
    },
    {
      x: 0,
      y: 0,
      rot: 0,
      scale: (2.45 - (1.45 * p)) * (windowWidth < 640 ? 0.85 : 1),
      zIndex: 40
    },
    {
      x: (0 + (215 * p)) * screenScale,
      y: (0 + (23 * p)) * screenScale,
      rot: 0 + (8 * p),
      scale: 1.0 * (windowWidth < 640 ? 0.82 : 1),
      zIndex: 30
    },
    {
      x: (0 + (430 * p)) * screenScale,
      y: (0 + (76 * p)) * screenScale,
      rot: 0 + (16 * p),
      scale: (0.80 + (0.20 * p)) * (windowWidth < 640 ? 0.76 : 1),
      zIndex: 20
    },
    {
      x: (38 + (607 * p)) * screenScale,
      y: (9 + (144 * p)) * screenScale,
      rot: 1.2 + (18.8 * p),
      scale: (0.62 + (0.38 * p)) * (windowWidth < 640 ? 0.72 : 1),
      zIndex: 10
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans select-none overflow-x-clip">
      {/* 10X Standard Global Navbar */}
      <Navbar />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO — Exact Quantara Replica                                  */}
      {/* ========================================================================= */}
      <section 
        ref={heroRef}
        id="hero"
        className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* 3D Wireframe Curved Coordinate Mesh Background with Cursor Parallax */}
        <div 
          className="absolute inset-[-40px] pointer-events-none z-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `
              linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(51, 51, 51, 0) 21%),
              radial-gradient(circle at 50% 100%, rgba(51, 51, 51, 0) 60%, rgb(0, 0, 0) 88%),
              radial-gradient(circle at 50% 0%, rgba(51, 51, 51, 0) 20%, rgb(0, 0, 0) 88%),
              url("https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f839301ce2244c1bdadcf_Clip%20path%20group.png")
            `,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) rotateX(${mouseOffset.rotX || 0}deg) rotateY(${mouseOffset.rotY || 0}deg) scale(1.04)`,
            transformOrigin: '50% 50%',
            opacity: 0.95,
          }}
        />

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center pt-8">
          {/* Top Monospace Subtitle Badge */}
          <div className="mb-6 inline-flex items-center justify-center">
            <span 
              className="text-xs sm:text-sm uppercase tracking-[0.18em] text-white font-normal"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              <ScrambleText text="AI THAT'S YOURS." duration={1.2} speed={45} delay={100} />
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-[-0.025em] leading-[1.08] text-white max-w-[700px] mx-auto text-center"
            style={{ 
              fontFamily: "'REM', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: '0.288px'
            }}
          >
            <span className="text-violet-drift" style={{ animationDelay: '6s' }}>AI models built for</span><br /><span style={{ color: 'white' }}>your institution.</span>
          </h1>
        </div>

        {/* Orbital Perspective Badges with subtle Parallax */}

        {/* 1. WORKS OFFLINE (Top-Left) */}
        <div 
          className="absolute z-20 hidden sm:flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            top: '18%', 
            left: '17%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c97caa6687a94160b05_Square.png" 
            alt="WORKS OFFLINE Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="WORKS OFFLINE" duration={1.2} speed={50} delay={400} />
          </span>
        </div>

        {/* 2. OWNED (Middle-Right) */}
        <div 
          className="absolute z-20 hidden sm:flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            top: '47%', 
            right: '13%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c973c0be5bb32690004_Circle.png" 
            alt="OWNED Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="OWNED" duration={1.5} speed={60} delay={800} />
          </span>
        </div>

        {/* 3. TASK-SPECIFIC (Bottom-Left) */}
        <div 
          className="absolute z-20 hidden sm:flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            bottom: '15%', 
            left: '22%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c9735e4184a62ba66f7_Triangle.png" 
            alt="TASK-SPECIFIC Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="TASK-SPECIFIC" duration={1.8} speed={65} delay={1200} />
          </span>
        </div>

        {/* Bottom Scroll Pill Indicator (Exact Lottie Animation) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <LottieScrollIndicator />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: BACKED BY / PARTNERS                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#000000] z-10 py-10 sm:py-12 md:py-16 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-14 flex flex-col">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-6 sm:mb-8 flex-wrap gap-4">
            {/* Left Title */}
            <div 
              className="text-base sm:text-lg md:text-[20px] font-light text-white/90 leading-tight tracking-normal"
              style={{ fontFamily: "'REM', sans-serif" }}
            >
              Building in partnership with
            </div>

            {/* Right Indicator: BACKED BY */}
            <div className="flex items-center gap-3">
              <span 
                className="text-xs sm:text-[13px] font-normal tracking-[0.2em] text-white/70 uppercase"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <ScrambleText text="BACKED BY" duration={1.6} speed={60} delay={600} />
              </span>
            </div>
          </div>

          {/* Static 4-Logos Grid: Prominent Logos with Compact Tight Padding */}
          <div className="w-full py-2 sm:py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 sm:gap-8 lg:gap-12 w-full">
              {PARTNER_LOGOS.map((logo) => (
                <div 
                  key={logo.id} 
                  className="flex items-center justify-center p-2 w-full h-16 sm:h-20 md:h-24 transition-all duration-300 group cursor-pointer"
                >
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`${logo.imgClass} w-auto object-contain transition-all duration-500 opacity-70 group-hover:opacity-100 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 group-hover:scale-105`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Subtle Divider Line */}
          <div className="w-full mt-6 sm:mt-8 border-b border-dashed border-white/15" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE CORE PLATFORM — Exact Quantara Diamond Track Replica       */}
      {/* ========================================================================= */}
      <section 
        ref={trackRef} 
        id="product" 
        className="relative w-full h-[450vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen min-h-[580px] overflow-hidden">
          
          {/* Centered Content Container */}
          <div className="relative w-full h-full flex flex-col justify-between px-4 sm:px-6 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-4 max-w-[1300px] mx-auto z-10">

          {/* Top Title Row: EXACT Live Spacing & Indentation */}
          <div className="flex items-start justify-between w-full z-30 pt-1 flex-wrap gap-3">
            <div className="flex items-start gap-4 sm:gap-8 md:gap-16">
              
              {/* 4x4 Plus Grid with Animated Rhythmic Color Waves matching Spendly Purple Theme */}
              <div className="flex items-start gap-2 sm:gap-3 select-none font-mono tracking-widest">
                {[0, 1, 2, 3].map((colIdx) => {
                  const PLUS_RHYTHM_PALETTES = [
                    ['#9575CD', '#7E57C2', '#673AB7', '#512DA8'],
                    ['#B39DDB', '#9575CD', '#7E57C2', '#673AB7'],
                    ['#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2'],
                    ['#7E57C2', '#673AB7', '#512DA8', '#9575CD'],
                    ['#673AB7', '#512DA8', '#9575CD', '#B39DDB'],
                    ['#512DA8', '#9575CD', '#B39DDB', '#7E57C2'],
                  ];
                  const currentPalette = PLUS_RHYTHM_PALETTES[plusRhythm % PLUS_RHYTHM_PALETTES.length];

                  return (
                    <div key={colIdx} className="flex flex-col gap-1">
                      {[0, 1, 2, 3].map((rowIdx) => {
                        let color = currentPalette[rowIdx];
                        if (rowIdx === 3) {
                          const row4Gradients = ['#512DA8', '#673AB7', '#7E57C2', '#9575CD'];
                          color = row4Gradients[(colIdx + plusRhythm) % row4Gradients.length];
                        }
                        return (
                          <span 
                            key={rowIdx} 
                            className="font-normal text-xs sm:text-sm leading-none select-none"
                            style={{
                              color: color,
                              textShadow: `0 0 6px ${color}60`,
                              transition: 'color 0.6s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.6s ease',
                            }}
                          >
                            +
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <span 
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#9f9f9f] font-mono"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <ScrambleText text="HOW IT WORKS" duration={1.2} speed={45} delay={100} />
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start min-w-[240px] sm:min-w-[300px] md:min-w-[420px]">
              {activeStep === -1 && (
                <div 
                  className="flex flex-col text-left font-normal leading-[1.12] tracking-tight transition-all duration-500 text-xl sm:text-3xl md:text-[46px]"
                  style={{ fontFamily: "'REM', sans-serif" }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span style={{ color: '#B39DDB' }}>The</span>
                    <span style={{ color: 'rgb(253, 252, 253)' }}>Core</span>
                    <span style={{ color: '#ffffff' }}>Platform</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 ml-[20px] sm:ml-[40px] md:ml-[110px]">
                    <span style={{ color: '#9575CD' }}>Powering</span>
                    <span style={{ color: '#ffffff' }}>Tools</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Interactive Layout: Step Nav + 3D Diamond Center + Big Title */}
          <div className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-center md:justify-between z-20 my-auto gap-3 sm:gap-4 md:gap-8">
            
            {/* Step Selector: Horizontal on small mobile, Vertical on md+ */}
            <div className={`flex flex-row md:flex-col items-center justify-center gap-2 sm:gap-3 z-30 transition-opacity duration-500 shrink-0 ${activeStep === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {PLATFORM_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => scrollToStep(idx)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-mono transition-all duration-500 cursor-pointer border ${
                        isActive
                          ? 'bg-[#512DA8] text-white font-bold border-[#7E57C2] shadow-[0_0_16px_rgba(103,58,183,0.7)] scale-105'
                          : 'bg-[#09090c] border-white/20 text-white/50 hover:text-white hover:border-white/50'
                      }`}
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {step.id}
                    </button>
                    {idx < PLATFORM_STEPS.length - 1 && (
                      <>
                        <div className="hidden md:block w-[1px] h-3.5 bg-white/20" />
                        <div className="block md:hidden w-3 h-[1px] bg-white/20" />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* 3D Isometric Diamond Layout — Symmetrical Grid Matching Reference */}
            <div 
              className="relative mx-auto w-[min(340px,80vw)] sm:w-[450px] md:w-[min(600px,42vw)] lg:w-[min(640px,44vw)] max-w-[650px] aspect-[845/615] shrink-0"
              style={{
                backgroundImage: 'url("https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a960f6d8b19db76f89a9_extrude-group-ground.png")',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            >
              {/* Block 01: Top Quadrant (Data) */}
              <div 
                onClick={() => scrollToStep(0)}
                onMouseEnter={() => setHoveredBlock(0)}
                onMouseLeave={() => setHoveredBlock(null)}
                className="absolute cursor-pointer transition-all duration-500 ease-out"
                style={{
                  left: '50%',
                  top: '21.0%',
                  width: '37.0%',
                  aspectRatio: '276 / 184',
                  transform: (activeStep === 0 || hoveredBlock === 0)
                    ? 'translate(-50%, calc(-50% - 16px))'
                    : 'translate(-50%, -50%)',
                  zIndex: 10,
                  filter: (activeStep === 0 || hoveredBlock === 0) ? 'drop-shadow(0 10px 20px rgba(81, 45, 168, 0.3))' : 'none',
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 1"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[0].iconSrc}
                  alt={PLATFORM_STEPS[0].alt}
                  className="absolute object-contain pointer-events-none transition-all duration-500"
                  style={{
                    left: '50%',
                    top: '37%',
                    width: '53%',
                    height: '53%',
                    transform: 'translate(-50%, -50%)',
                    filter: (activeStep === 0 || hoveredBlock === 0)
                      ? 'hue-rotate(58deg) saturate(1.2) brightness(0.95) drop-shadow(0 0 6px rgba(126, 87, 194, 0.5))' 
                      : 'grayscale(100%) brightness(0.4) opacity(0.6)',
                  }}
                />
              </div>

              {/* Block 03: Left Quadrant (Model) */}
              <div 
                onClick={() => scrollToStep(2)}
                onMouseEnter={() => setHoveredBlock(2)}
                onMouseLeave={() => setHoveredBlock(null)}
                className="absolute cursor-pointer transition-all duration-500 ease-out"
                style={{
                  left: '32.0%',
                  top: '35.5%',
                  width: '37.0%',
                  aspectRatio: '276 / 184',
                  transform: (activeStep === 2 || hoveredBlock === 2)
                    ? 'translate(-50%, calc(-50% - 16px))'
                    : 'translate(-50%, -50%)',
                  zIndex: 20,
                  filter: (activeStep === 2 || hoveredBlock === 2) ? 'drop-shadow(0 10px 20px rgba(81, 45, 168, 0.3))' : 'none',
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 3"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[2].iconSrc}
                  alt={PLATFORM_STEPS[2].alt}
                  className="absolute object-contain pointer-events-none transition-all duration-500"
                  style={{
                    left: '50%',
                    top: '37%',
                    width: '53%',
                    height: '53%',
                    transform: 'translate(-50%, -50%)',
                    filter: (activeStep === 2 || hoveredBlock === 2)
                      ? 'hue-rotate(58deg) saturate(1.2) brightness(0.95) drop-shadow(0 0 6px rgba(126, 87, 194, 0.5))' 
                      : 'grayscale(100%) brightness(0.4) opacity(0.6)',
                  }}
                />
              </div>

              {/* Block 02: Right Quadrant (Requirement) */}
              <div 
                onClick={() => scrollToStep(1)}
                onMouseEnter={() => setHoveredBlock(1)}
                onMouseLeave={() => setHoveredBlock(null)}
                className="absolute cursor-pointer transition-all duration-500 ease-out"
                style={{
                  left: '68.0%',
                  top: '35.5%',
                  width: '37.0%',
                  aspectRatio: '276 / 184',
                  transform: (activeStep === 1 || hoveredBlock === 1)
                    ? 'translate(-50%, calc(-50% - 16px))'
                    : 'translate(-50%, -50%)',
                  zIndex: 20,
                  filter: (activeStep === 1 || hoveredBlock === 1) ? 'drop-shadow(0 10px 20px rgba(81, 45, 168, 0.3))' : 'none',
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 2"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[1].iconSrc}
                  alt={PLATFORM_STEPS[1].alt}
                  className="absolute object-contain pointer-events-none transition-all duration-500"
                  style={{
                    left: '50%',
                    top: '37%',
                    width: '53%',
                    height: '53%',
                    transform: 'translate(-50%, -50%)',
                    filter: (activeStep === 1 || hoveredBlock === 1)
                      ? 'hue-rotate(58deg) saturate(1.2) brightness(0.95) drop-shadow(0 0 6px rgba(126, 87, 194, 0.5))' 
                      : 'grayscale(100%) brightness(0.4) opacity(0.6)',
                  }}
                />
              </div>

              {/* Block 04: Bottom Quadrant (Inference) */}
              <div 
                onClick={() => scrollToStep(3)}
                onMouseEnter={() => setHoveredBlock(3)}
                onMouseLeave={() => setHoveredBlock(null)}
                className="absolute cursor-pointer transition-all duration-500 ease-out"
                style={{
                  left: '50%',
                  top: '50.0%',
                  width: '37.0%',
                  aspectRatio: '276 / 184',
                  transform: (activeStep === 3 || hoveredBlock === 3)
                    ? 'translate(-50%, calc(-50% - 16px))'
                    : 'translate(-50%, -50%)',
                  zIndex: 30,
                  filter: (activeStep === 3 || hoveredBlock === 3) ? 'drop-shadow(0 10px 20px rgba(81, 45, 168, 0.3))' : 'none',
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 4"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[3].iconSrc}
                  alt={PLATFORM_STEPS[3].alt}
                  className="absolute object-contain pointer-events-none transition-all duration-500"
                  style={{
                    left: '50%',
                    top: '37%',
                    width: '53%',
                    height: '53%',
                    transform: 'translate(-50%, -50%)',
                    filter: (activeStep === 3 || hoveredBlock === 3)
                      ? 'hue-rotate(58deg) saturate(1.2) brightness(0.95) drop-shadow(0 0 6px rgba(126, 87, 194, 0.5))' 
                      : 'grayscale(100%) brightness(0.4) opacity(0.6)',
                  }}
                />
              </div>
            </div>

            {/* Right: Dynamic YOUR {word} Heading + Paragraph Description */}
            <div className="w-full md:w-[380px] lg:w-[460px] shrink-0 flex flex-col items-center md:items-start text-center md:text-left z-20 transition-all duration-500 px-2 md:px-0">
              {currentStep ? (
                <div key={currentStep.id} className="flex flex-col items-center md:items-start animate-fadeIn w-full">
                  {/* Fixed YOUR in Purple Gradient + Changing Word in White — Single Line Always */}
                  <h3 
                    className="text-2xl sm:text-3xl md:text-[34px] lg:text-[42px] xl:text-[48px] font-normal tracking-tight leading-[1.1] flex flex-nowrap whitespace-nowrap items-baseline justify-center md:justify-start gap-x-2 sm:gap-x-2.5 select-none"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    <span 
                      className="font-bold tracking-tight"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #7E22CE 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      YOUR
                    </span>
                    <span className="text-white font-medium">
                      {currentStep.word}
                    </span>
                  </h3>

                  {/* Body description text directly below YOUR Data / Requirement / Model / Inference */}
                  <p 
                    className="mt-2 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-[15px] lg:text-[16px] text-[#b0b0b8] font-light leading-relaxed max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] text-center md:text-left"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {currentStep.desc}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom Row Spacing */}
          <div className="w-full z-30 pb-2" />
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* SECTION 4: THE FEATURES / ORBIT / CIRCULAR DIAL                           */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#000000] z-10 py-[120px] overflow-hidden border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-14 flex flex-col">
          
          {/* Header Row: Bars + The Features + Badges */}
          <div className="flex items-start justify-between mb-16 flex-wrap gap-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 h-6">
                <div className="w-1 h-6 bg-white/40" />
                <div className="w-1 h-4 bg-white/60" />
                <div className="w-1 h-8 bg-[#7E57C2]" />
                <div className="w-1 h-5 bg-white/30" />
              </div>
              <h2 
                className="text-4xl sm:text-5xl md:text-[56px] font-normal text-white tracking-tight leading-none"
                style={{ fontFamily: "'REM', sans-serif" }}
              >
                <span className="text-violet-drift-b" style={{ animationDelay: '4s' }}>The Features</span>
              </h2>
              <div className="ml-4 px-3 py-1 bg-white/5 border border-white/15 rounded text-xs font-mono tracking-widest text-[#9f9f9f]">
                <ScrambleText text="RELIABLE" speed={50} />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <img src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c973c0be5bb32690004_Circle.png" alt="Circle Icon" className="w-3 h-3 object-contain" />
                <span>SCALABLE</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <img src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c97caa6687a94160b05_Square.png" alt="Square Icon" className="w-3 h-3 object-contain" />
                <span>AUTOMATED</span>
              </div>
            </div>
          </div>

          {/* 3-Column Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Multi-Orbit Planetary System */}
            <div className="relative bg-[#070709] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
              <div className="relative w-full h-[220px] flex items-center justify-center">
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/69538ffea86737e86bae05ee_Orbit%201.png" 
                  alt="Orbit 1" 
                  className="absolute w-[200px] h-[200px] object-contain animate-spin-slow opacity-90"
                  style={{ animationDuration: '30s' }}
                />
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/69538ffeba1a2dd90140985a_Orbit%202.png" 
                  alt="Orbit 2" 
                  className="absolute w-[150px] h-[150px] object-contain animate-spin-reverse opacity-80"
                  style={{ animationDuration: '22s' }}
                />
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/69538ffe23edbd29a59fc72b_Orbit%203.png" 
                  alt="Orbit 3" 
                  className="absolute w-[90px] h-[90px] object-contain animate-spin-slow"
                  style={{ animationDuration: '14s' }}
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <div className="text-lg font-medium text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                  Autonomous Logic
                </div>
                <div className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                  Continuous self-orchestrating decision graphs that adapt to shifting inputs in milliseconds.
                </div>
              </div>
            </div>

            {/* Card 2: Futuristic Device Showcase */}
            <div className="relative bg-[#070709] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
              <div className="relative w-full h-[220px] flex items-center justify-center">
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/695486b1759333fb17c32adb_Futuristic%20Device%20Design.webp" 
                  alt="Futuristic Device Design" 
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <div className="text-lg font-medium text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                  Intelligent Automation
                </div>
                <div className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                  Smart workflows that adapt, execute, and optimize operational pipelines with verifiable integrity.
                </div>
              </div>
            </div>

            {/* Card 3: Interactive Clock Counter Dial */}
            <div className="relative bg-[#070709] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
              <div className="relative w-full h-[220px] flex items-center justify-center">
                {/* Circular Clock Dial Layers */}
                <div className="relative w-[190px] h-[190px] flex items-center justify-center">
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/695491ded7d559ac2df1a9ab_Circle%20Empty.png" 
                    alt="Circle Empty" 
                    className="absolute inset-0 w-full h-full object-contain opacity-40"
                  />
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/695491de5df609a677bc1e98_Circle%20Fill.png" 
                    alt="Circle Fill" 
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-75"
                    style={{ transform: `rotate(${dialCount * 3.6}deg)` }}
                  />
                  <div className="relative z-10 w-20 h-20 rounded-full bg-[#000000]/80 border border-white/20 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-[#9575CD]">{dialCount}</span>
                    <span className="text-[9px] font-mono text-white/50 tracking-widest">INDEX</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                    Continuous Evolution
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9575CD]">
                    <ScrambleText text="EVOLVING" speed={45} />
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                  Self-refining learning loops that benchmark throughput across live production topologies.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: LAB TRACK — Fast, Snappy & Butter-Smooth Scan Transition       */}
      {/* ========================================================================= */}
      <section 
        ref={labRef}
        id="lab" 
        className="relative w-full h-[160vh] bg-[#000000] z-10 border-t border-white/10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center px-6 md:px-14 py-6 max-w-[1440px] mx-auto overflow-hidden">
          
          {/* Header with Dual-State Indicator: From Manual [O] Intelegent */}
          <div className="flex items-center justify-center flex-wrap gap-4 mb-6 z-30">
            <h2 
              className="text-4xl sm:text-5xl md:text-[56px] font-normal leading-none tracking-tight flex items-center flex-wrap justify-center gap-3 select-none"
              style={{ fontFamily: "'REM', sans-serif" }}
            >
              <span className="text-[#888888] font-light">From</span>
              <span className={!isLabIntelegent ? "text-white font-normal transition-colors duration-300" : "text-[#888888] font-light transition-colors duration-300"}>
                Manual
              </span>
              
              {/* Interactive Pill Toggle Switch */}
              <div 
                onClick={toggleLabMode}
                className="w-16 h-8 rounded-full border border-white/30 bg-[#070709] flex items-center p-1 cursor-pointer mx-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white"
              >
                <div 
                  className={`w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-transform duration-300 ease-out ${
                    isLabIntelegent ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </div>

              <span className={isLabIntelegent ? "text-[#9575CD] font-normal transition-colors duration-300" : "text-[#888888] font-light transition-colors duration-300"}>
                Intelligent
              </span>
            </h2>
          </div>

          {/* 4 Floating Metric Cards Arrangement with Laser Scan Curtain */}
          <div className="relative w-full my-auto z-20">
            
            {/* The 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-start">
              
              {/* Card 1: Bottleneck Detected (4-Quadrant Donut Ring) */}
              <div className="bg-[#070709] border border-[#222226] rounded-lg p-0 flex flex-col justify-between overflow-hidden min-h-[380px] shadow-2xl transition-all duration-300">
                {/* Header Bar */}
                <div className="bg-[#0e0e12] px-6 py-4 border-b border-[#1c1c20] text-white/90 text-sm font-normal" style={{ fontFamily: "'REM', sans-serif" }}>
                  Bottleneck Detected
                </div>

                {/* 4-Quadrant Segmented Donut Ring SVG */}
                <div className="relative w-full h-[240px] flex items-center justify-center p-4 my-auto">
                  <svg viewBox="0 0 200 200" className="w-[170px] h-[170px] drop-shadow-[0_0_15px_rgba(103,58,183,0.4)]">
                    {/* Top-Right Quadrant Arc */}
                    <path 
                      d="M 108 20 A 76 76 0 0 1 180 92 L 148 92 A 44 44 0 0 0 108 52 Z" 
                      fill={isLabIntelegent ? "#2A1454" : "none"} 
                      stroke={isLabIntelegent ? "#7E57C2" : "#333333"} 
                      strokeWidth={isLabIntelegent ? "1.5" : "1"}
                      className="transition-all duration-300"
                    />
                    {/* Bottom-Right Quadrant Arc */}
                    <path 
                      d="M 180 108 A 76 76 0 0 1 108 180 L 108 148 A 44 44 0 0 0 148 108 Z" 
                      fill={isLabIntelegent ? "#2A1454" : "none"} 
                      stroke={isLabIntelegent ? "#7E57C2" : "#222222"} 
                      strokeWidth={isLabIntelegent ? "1.5" : "1"}
                      className="transition-all duration-300"
                    />
                    {/* Bottom-Left Quadrant Arc */}
                    <path 
                      d="M 92 180 A 76 76 0 0 1 20 108 L 52 108 A 44 44 0 0 0 92 148 Z" 
                      fill={isLabIntelegent ? "#2A1454" : "none"} 
                      stroke={isLabIntelegent ? "#7E57C2" : "#222222"} 
                      strokeWidth={isLabIntelegent ? "1.5" : "1"}
                      className="transition-all duration-300"
                    />
                    {/* Top-Left Quadrant Arc */}
                    <path 
                      d="M 20 92 A 76 76 0 0 1 92 20 L 92 52 A 44 44 0 0 0 52 92 Z" 
                      fill={isLabIntelegent ? "#2A1454" : "none"} 
                      stroke={isLabIntelegent ? "#7E57C2" : "#222222"} 
                      strokeWidth={isLabIntelegent ? "1.5" : "1"}
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
              </div>

              {/* Middle Column: Stacked Cards 2 & 3 */}
              <div className="lg:col-span-2 flex flex-col gap-6 w-full">
                
                {/* Card 2: Process Efficiency (Fast Smooth Animated 67% -> 99%) */}
                <div className="bg-[#070709] border border-[#222226] rounded-lg p-6 flex flex-col justify-between shadow-2xl transition-all duration-300">
                  <div className="text-white/80 text-sm font-normal mb-6" style={{ fontFamily: "'REM', sans-serif" }}>
                    Process Efficiency
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-normal text-white font-mono tracking-tight transition-all duration-75">
                      {efficiencyDisplay}%
                    </span>
                    <span className="px-3 py-1.5 bg-[#111116] border border-white/10 rounded text-xs font-mono text-white/60">
                      Partially / Manual
                    </span>
                  </div>
                </div>

                {/* Card 3: Data Sync, Validation, and Report Rows */}
                <div className="bg-[#070709] border border-[#222226] rounded-lg p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                      Data Sync
                    </span>
                    <span className="px-5 py-1 bg-[#2A1454] border border-[#673AB7] text-[#B39DDB] text-xs font-mono rounded font-medium shadow-[0_0_12px_rgba(103,58,183,0.5)]">
                      Success
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                      Validation
                    </span>
                    {isLabIntelegent ? (
                      <span className="px-5 py-1 bg-[#2A1454] border border-[#673AB7] text-[#B39DDB] text-xs font-mono rounded font-medium shadow-[0_0_12px_rgba(103,58,183,0.5)] transition-all duration-300">
                        Success
                      </span>
                    ) : (
                      <span className="px-5 py-1 bg-[#450a0a] border border-[#dc2626]/80 text-[#f87171] text-xs font-mono rounded font-medium shadow-[0_0_12px_rgba(220,38,38,0.5)] transition-all duration-300">
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-white" style={{ fontFamily: "'REM', sans-serif" }}>
                      Report
                    </span>
                    <span className="px-5 py-1 bg-[#2A1454] border border-[#673AB7] text-[#B39DDB] text-xs font-mono rounded font-medium shadow-[0_0_12px_rgba(103,58,183,0.5)]">
                      Success
                    </span>
                  </div>
                </div>

              </div>

              {/* Card 4: Data Scatter (Chaotic vs Linear Regression) */}
              <div className="bg-[#070709] border border-[#222226] rounded-lg p-0 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-2xl transition-all duration-300">
                {/* Header Bar */}
                <div className="bg-[#0e0e12] px-6 py-4 border-b border-[#1c1c20] text-white/90 text-sm font-normal" style={{ fontFamily: "'REM', sans-serif" }}>
                  Data Scatter
                </div>

                {/* Scatter Plot Chart Image Crossfade */}
                <div className="p-4 flex items-center justify-center my-auto relative w-full h-[180px]">
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/69568fff2c8b026b2c4ca369_Chart%26Axis.png" 
                    alt="Chaotic Data Scatter" 
                    className={`absolute inset-0 m-auto w-full h-auto object-contain transition-all duration-300 ${
                      !isLabIntelegent ? 'opacity-100 filter grayscale' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957360e9a68d374e7cf6424_Chart%26AxisFinal.png" 
                    alt="Linear Regression Data Scatter" 
                    className={`absolute inset-0 m-auto w-full h-auto object-contain transition-all duration-300 ${
                      isLabIntelegent ? 'opacity-100 filter hue-rotate-[58deg] saturate-[1.4]' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                </div>
              </div>

            </div>

          {/* Fast Butter-Smooth Laser Scan Curtain Wipe Line */}
          {isScanning && (
            <div 
              className="absolute inset-y-0 pointer-events-none z-40 flex items-stretch transition-all duration-300 ease-out"
              style={{ 
                left: `${laserPos}%`,
                width: `${100 - laserPos}%`
              }}
            >
              {/* Laser Line */}
              <div 
                className="w-[3px] bg-[#9575CD] shadow-[0_0_20px_#7E57C2,0_0_40px_#512DA8] shrink-0" 
              />
              {/* Purple Overlay Curtain Body */}
              <div 
                className="w-full h-full opacity-60"
                style={{
                  background: 'linear-gradient(90deg, rgba(42, 20, 84, 0.7) 0%, rgba(20, 10, 40, 0.45) 60%, transparent 100%)'
                }}
              />
            </div>
          )}

          </div>

          <div />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: WORKFLOW TRACK — Exact Quantara 3D Diagonal Cascade Track      */}
      {/* ========================================================================= */}
      <section 
        ref={workflowRef} 
        id="workflow" 
        className="relative w-full h-[350vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-14 max-w-[1440px] mx-auto overflow-hidden">
          
          {/* Left Column: Vertical Ruler + Circular Radial Spotlight + Text Content */}
          <div className="relative w-full lg:w-[48%] h-auto lg:h-full flex flex-col justify-between pt-8 sm:pt-12 lg:pt-[110px] pb-4 lg:pb-12 z-20">
            
            {/* Top Scramble Badge: PARTIAL >>> TASK [04] */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-[#111116] border border-white/15 rounded text-xs font-mono tracking-widest text-[#9f9f9f] flex items-center gap-2">
                <span>PARTIAL</span>
                <span className="text-[#9575CD]">&gt;&gt;&gt;</span>
                <span><ScrambleText text={`TASK [0${activeWorkflowStep + 1}]`} speed={40} key={activeWorkflowStep} /></span>
              </div>
            </div>

            {/* Center Area: Ruler Column + Radial Glow + Big Title & Description */}
            <div className="relative my-4 lg:my-auto flex items-start gap-4 sm:gap-8">
              
              {/* Vertical Tick Ruler Column */}
              <div className="flex flex-col items-center gap-2 font-mono text-[10px] text-white/30 select-none pt-2">
                <span className="text-[#9575CD] font-bold text-xs">0{activeWorkflowStep + 1}</span>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
                  <div key={t} className="w-2.5 h-[1px] bg-white/20" />
                ))}
              </div>

              {/* Large Radial Purple Spotlight / Curved Light Rays */}
              <div 
                className="absolute -left-28 -top-32 w-[650px] h-[650px] rounded-full pointer-events-none opacity-45 filter blur-3xl z-0"
                style={{
                  background: 'radial-gradient(circle, rgba(103, 58, 183, 0.45) 0%, rgba(81, 45, 168, 0.2) 50%, transparent 80%)'
                }}
              />

              {/* Dynamic Title and Description */}
              <div className="relative z-10 flex flex-col gap-2 sm:gap-4">
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[62px] font-normal leading-[1.08] tracking-tight text-white transition-all duration-500 animate-fadeIn"
                  style={{ 
                    fontFamily: "'REM', sans-serif",
                    backgroundImage: 'linear-gradient(325deg, rgb(160, 160, 160), rgb(255, 255, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  key={activeWorkflowStep + '_wftitle'}
                >
                  {WORKFLOW_STEPS[activeWorkflowStep].title}
                </h2>

                <p 
                  className="text-xs sm:text-sm md:text-base text-white/70 max-w-md font-light leading-relaxed transition-all duration-500"
                  key={activeWorkflowStep + '_wfdesc'}
                >
                  {WORKFLOW_STEPS[activeWorkflowStep].desc.replace(WORKFLOW_STEPS[activeWorkflowStep].highlight, '')}
                  <span className="text-white font-normal">{WORKFLOW_STEPS[activeWorkflowStep].highlight}</span>
                </p>
              </div>
            </div>

            {/* Bottom Step Pills Selector */}
            <div className="flex items-center gap-2 sm:gap-3">
              {WORKFLOW_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => scrollToWorkflowStep(idx)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono transition-all cursor-pointer border ${
                    activeWorkflowStep === idx
                      ? 'bg-[#512DA8] text-white font-bold border-[#7E57C2] shadow-[0_0_18px_rgba(103,58,183,0.8)] scale-110'
                      : 'bg-[#111116] border-white/20 text-white/50 hover:text-white hover:border-white/50'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: 3D Diagonal Isometric Cascade Cards */}
          <div 
            className="relative w-full lg:w-[52%] h-auto lg:h-full flex items-center justify-center z-10 scale-[0.62] sm:scale-[0.80] lg:scale-100 origin-center my-auto py-4 lg:py-0"
            style={{
              backgroundImage: 'url("https://cdn.prod.website-files.com/694f372b123017b1e0a43316/695784b8fedf0b3103908ec2_grid%20bg.png")',
              backgroundPosition: '30% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1100px',
            }}
          >
            {/* 3D Diagonal Stack of 4 Extruded Cards */}
            <div className="relative flex items-center justify-center w-[560px] h-[490px]">
              
              {/* Card 1: Bottom Left (01 - Collect Data) — FRONT / FOREGROUND CARD */}
              <div 
                onClick={() => scrollToWorkflowStep(0)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out ${
                  activeWorkflowStep === 0
                    ? 'z-50 -translate-y-7 scale-[1.02] drop-shadow-[0_12px_24px_rgba(81,45,168,0.4)] opacity-100'
                    : 'z-40 translate-y-0 opacity-45 grayscale hover:opacity-85'
                }`}
                style={{
                  top: '170px',
                  left: '20px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 1" 
                  className="w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={WORKFLOW_STEPS[0].icon} 
                  alt="Collect Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 0
                      ? 'filter drop-shadow-[0_0_8px_rgba(126,87,194,0.55)] hue-rotate-[58deg] saturate-[1.2] brightness-95'
                      : 'grayscale brightness-50 opacity-60'
                  }`}
                />
              </div>

              {/* Card 2: Middle Lower (02 - Process Data) — Layer 2 */}
              <div 
                onClick={() => scrollToWorkflowStep(1)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out ${
                  activeWorkflowStep === 1
                    ? 'z-35 -translate-y-7 scale-[1.02] drop-shadow-[0_12px_24px_rgba(81,45,168,0.4)] opacity-100'
                    : 'z-30 translate-y-0 opacity-45 grayscale hover:opacity-85'
                }`}
                style={{
                  top: '102px',
                  left: '124px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 2" 
                  className="w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={WORKFLOW_STEPS[1].icon} 
                  alt="Process Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 1
                      ? 'filter drop-shadow-[0_0_8px_rgba(126,87,194,0.55)] hue-rotate-[58deg] saturate-[1.2] brightness-95'
                      : 'grayscale brightness-50 opacity-60'
                  }`}
                />
              </div>

              {/* Card 3: Middle Upper (03 - Analyze Data) — Layer 3 */}
              <div 
                onClick={() => scrollToWorkflowStep(2)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out ${
                  activeWorkflowStep === 2
                    ? 'z-25 -translate-y-7 scale-[1.02] drop-shadow-[0_12px_24px_rgba(81,45,168,0.4)] opacity-100'
                    : 'z-20 translate-y-0 opacity-45 grayscale hover:opacity-85'
                }`}
                style={{
                  top: '34px',
                  left: '228px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 3" 
                  className="w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={WORKFLOW_STEPS[2].icon} 
                  alt="Analyze Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 2
                      ? 'filter drop-shadow-[0_0_8px_rgba(126,87,194,0.55)] hue-rotate-[58deg] saturate-[1.2] brightness-95'
                      : 'grayscale brightness-50 opacity-60'
                  }`}
                />
              </div>

              {/* Card 4: Top Right (04 - Deliver Data) — REAR / BACKGROUND CARD */}
              <div 
                onClick={() => scrollToWorkflowStep(3)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out ${
                  activeWorkflowStep === 3
                    ? 'z-15 -translate-y-7 scale-[1.02] drop-shadow-[0_12px_24px_rgba(81,45,168,0.4)] opacity-100'
                    : 'z-10 translate-y-0 opacity-45 grayscale hover:opacity-85'
                }`}
                style={{
                  top: '-34px',
                  left: '332px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 4" 
                  className="w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={WORKFLOW_STEPS[3].icon} 
                  alt="Deliver Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 3
                      ? 'filter drop-shadow-[0_0_8px_rgba(126,87,194,0.55)] hue-rotate-[58deg] saturate-[1.2] brightness-95'
                      : 'grayscale brightness-50 opacity-60'
                  }`}
                />
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* ========================================================================= */}
      {/* SECTION 8: INTEGRATION TRACK — Exact 7-Node Parabolic Arc Fan Track       */}
      {/* ========================================================================= */}
      <section 
        ref={integrationRef} 
        id="integration" 
        className="relative w-full h-[350vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col justify-between items-center px-6 md:px-14 pt-[110px] pb-14 max-w-[1440px] mx-auto overflow-hidden">
          
          {/* Top Badge: INTEGRATION --- ACTIVE MODULES */}
          <div className="flex items-center gap-3 z-30">
            <div className="px-3 py-1 bg-[#111116] border border-white/15 rounded text-xs font-mono tracking-widest text-[#9f9f9f] flex items-center gap-2">
              <span>INTEGRATION</span>
              <span className="text-[#9575CD]">---</span>
              <span><ScrambleText text="ACTIVE MODULES" speed={40} /></span>
            </div>
          </div>

          {/* Center Stage: 7-Card Parabolic Fan Arc Expansion */}
          <div className="relative w-full flex-1 flex items-center justify-center z-20 my-auto">
            
            {/* Center Vertical Axis Guideline Line (visible as arc expands) */}
            <div 
              className="absolute w-[1px] h-[220px] bg-white/20 z-0 pointer-events-none transition-opacity duration-300"
              style={{ opacity: Math.max(0, (integrationProgress - 0.2) * 1.5) }}
            />

            {/* 7 Interactive Logo Cards Array */}
            <div className="relative flex items-center justify-center w-[120px] h-[120px]">
              {INTEGRATION_CARDS.map((card, idx) => {
                const t = cardTransforms[idx];
                return (
                  <div
                    key={card.id}
                    className="absolute w-[105px] sm:w-[125px] h-[105px] sm:h-[125px] rounded-2xl bg-[#0c0c0e] border border-white/15 p-5 flex items-center justify-center shadow-2xl transition-all duration-150 ease-out hover:border-[#7E57C2] hover:shadow-[0_0_30px_rgba(103,58,183,0.5)]"
                    style={{
                      transform: `translate3d(${t.x}px, ${t.y}px, 0px) rotate(${t.rot}deg) scale(${t.scale})`,
                      zIndex: t.zIndex,
                      willChange: 'transform',
                    }}
                  >
                    <img 
                      src={card.src} 
                      alt={card.alt} 
                      className="w-full h-full object-contain brightness-[0.9] hover:brightness-100 transition-all"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Headline: Connected Systems. Unified Intelligence. */}
          <div 
            className="flex flex-col items-center text-center z-30 transition-all duration-500"
            style={{
              opacity: Math.max(0, (integrationProgress - 0.1) * 1.3),
              transform: `translateY(${(1 - Math.min(1, integrationProgress * 1.4)) * 20}px)`
            }}
          >
            <h2 
              className="text-4xl sm:text-5xl md:text-[56px] font-normal leading-[1.1] text-white tracking-tight"
              style={{ fontFamily: "'REM', sans-serif" }}
            >
              Connected Systems.<br />
              <span className="text-violet-drift-b" style={{ animationDelay: '2s' }}>
                Unified Intelligence.
              </span>
            </h2>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER — Shared Spendly Footer Component                                  */}
      {/* ========================================================================= */}
      <div className="bg-[#030305] border-t border-white/10">
        <Footer minimal={true} />
      </div>

      {/* Scoped CSS for Infinite Continuous Ticker & Animations */}
      <style>{`
        @keyframes quantaraMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-quantara-marquee {
          animation: quantaraMarquee 32s linear infinite;
        }
        .animate-quantara-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }
        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spinReverse 25s linear infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
