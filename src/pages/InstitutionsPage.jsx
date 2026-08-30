import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssetShowcase from '../components/AssetShowcase';
import ApiCostCalculator from '../components/ApiCostCalculator';
import TechnicalFiller from '../components/TechnicalFiller';
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

  // Section 5 Toggle Deployment state: 'cloud' (Cloud API) | 'local' (Local deployment)
  const [deploymentMode, setDeploymentMode] = useState('cloud'); // 'cloud' | 'local'
  const deploymentModeRef = useRef('cloud');
  const [isScanning, setIsScanning] = useState(false);
  const [laserPos, setLaserPos] = useState(0); // 0 to 100%

  // Section 8 Integration scroll expansion progress (0 to 1)
  const [integrationProgress, setIntegrationProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const heroRef = useRef(null);
  const trackRef = useRef(null);
  const labRef = useRef(null);
  const labManualOverrideRef = useRef(false);
  const labManualTimeoutRef = useRef(null);
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

        // Section 5 Cloud API -> Local Deployment Auto-Switch on Scroll Track
        if (labRef.current && !labManualOverrideRef.current) {
          const rect = labRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            
            // Switch to 'local' after ~35% scroll inside the section (approx 2 scrolls after entering)
            if (progress >= 0.35) {
              if (deploymentModeRef.current !== 'local') {
                triggerDeploymentMode('local');
              }
            } else {
              if (deploymentModeRef.current !== 'cloud') {
                triggerDeploymentMode('cloud');
              }
            }
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
      if (labManualTimeoutRef.current) clearTimeout(labManualTimeoutRef.current);
      clearInterval(rhythmInterval);
    };
  }, []);

  // Section 3 Product Step Calculation — 6 total states:
  // State 0: Resting Initial (01-04 hidden, resting text visible, blocks resting)
  // State 1: Interactive Mode (01-04 visible unselected, resting text fades out, blocks resting)
  // State 2: Step 01 active (YOUR Data)
  // State 3: Step 02 active (YOUR Requirement)
  // State 4: Step 03 active (YOUR Model)
  // State 5: Step 04 active (YOUR Inference)
  const calculatedState = Math.min(5, Math.max(0, Math.floor(scrollProgress * 6)));

  const activeStep = manualStep !== null ? manualStep : (calculatedState >= 2 ? calculatedState - 2 : -1);
  const showNav = manualStep !== null || calculatedState >= 1;
  const currentStep = activeStep >= 0 ? (PLATFORM_STEPS[activeStep] || PLATFORM_STEPS[0]) : null;

  const scrollToStep = (idx) => {
    setManualStep(idx);
    if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);

    if (trackRef.current) {
      const totalScrollable = trackRef.current.offsetHeight - window.innerHeight;
      const stepCenters = [0.40, 0.56, 0.72, 0.88];
      const stepTargetProgress = stepCenters[idx] ?? (0.40 + idx * 0.16);
      const targetY = trackRef.current.offsetTop + totalScrollable * stepTargetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    // Auto-release manual lock after smooth scrolling finishes
    scrollLockTimeoutRef.current = setTimeout(() => {
      setManualStep(null);
    }, 700);
  };

  // Butter-Smooth Deployment Toggle Trigger Function with Laser Sweep
  const triggerDeploymentMode = (targetMode) => {
    if (deploymentModeRef.current === targetMode) return;
    deploymentModeRef.current = targetMode;
    setDeploymentMode(targetMode);
    setIsScanning(true);
    
    // Set initial position
    setLaserPos(targetMode === 'local' ? 0 : 100);
    
    // Smooth laser wipe
    requestAnimationFrame(() => {
      setTimeout(() => {
        setLaserPos(targetMode === 'local' ? 100 : 0);
      }, 20);
    });

    setTimeout(() => {
      setIsScanning(false);
    }, 580);
  };

  const toggleDeploymentMode = () => {
    labManualOverrideRef.current = true;
    if (labManualTimeoutRef.current) clearTimeout(labManualTimeoutRef.current);
    labManualTimeoutRef.current = setTimeout(() => {
      labManualOverrideRef.current = false;
    }, 4500);

    const nextMode = deploymentModeRef.current === 'local' ? 'cloud' : 'local';
    triggerDeploymentMode(nextMode);
  };

  const isLocalDeployment = deploymentMode === 'local';



  // Section 8 Arc Card Interpolation Functions
  const p = integrationProgress;
  const screenScale = Math.min(1, Math.max(0.35, ((windowWidth || 1200) - 64) / 1180));
  const cardTransforms = [
    {
      x: (-25 + (-485 * p)) * screenScale,
      y: (6 + (94 * p)) * screenScale,
      rot: -1.2 + (-18.8 * p),
      scale: (0.7 + 0.3 * p) * (windowWidth < 640 ? 0.8 : 1),
      zIndex: 10
    },
    {
      x: (-15 + (-325 * p)) * screenScale,
      y: (4 + (44 * p)) * screenScale,
      rot: -0.8 + (-12.2 * p),
      scale: (0.8 + 0.2 * p) * (windowWidth < 640 ? 0.85 : 1),
      zIndex: 20
    },
    {
      x: (-8 + (-162 * p)) * screenScale,
      y: (2 + (10 * p)) * screenScale,
      rot: -0.4 + (-6.1 * p),
      scale: (0.9 + 0.1 * p) * (windowWidth < 640 ? 0.9 : 1),
      zIndex: 30
    },
    {
      x: 0,
      y: 0,
      rot: 0,
      scale: (2.0 - 1.0 * p) * (windowWidth < 640 ? 0.9 : 1),
      zIndex: 40
    },
    {
      x: (8 + (162 * p)) * screenScale,
      y: (2 + (10 * p)) * screenScale,
      rot: 0.4 + (6.1 * p),
      scale: (0.9 + 0.1 * p) * (windowWidth < 640 ? 0.9 : 1),
      zIndex: 30
    },
    {
      x: (15 + (325 * p)) * screenScale,
      y: (4 + (44 * p)) * screenScale,
      rot: 0.8 + (12.2 * p),
      scale: (0.8 + 0.2 * p) * (windowWidth < 640 ? 0.85 : 1),
      zIndex: 20
    },
    {
      x: (25 + (485 * p)) * screenScale,
      y: (6 + (94 * p)) * screenScale,
      rot: 1.2 + (18.8 * p),
      scale: (0.7 + 0.3 * p) * (windowWidth < 640 ? 0.8 : 1),
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

        {/* 2. EDGE DEPLOYED (Middle-Right) */}
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
            alt="EDGE DEPLOYED Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="EDGE DEPLOYED" duration={1.5} speed={60} delay={800} />
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

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: BACKED BY / PARTNERS                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#000000] z-10 pt-6 sm:pt-8 md:pt-10 pb-2 sm:pb-4 overflow-hidden">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col">
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
        </div>
      </section>

      {/* Dotted Separator between Partners and The Core Platform */}
      <TechnicalFiller />

      {/* ========================================================================= */}
      {/* SECTION 3: THE CORE PLATFORM — Exact Quantara Diamond Track Replica       */}
      {/* ========================================================================= */}
      <section 
        ref={trackRef} 
        id="product" 
        className="relative w-full h-[480vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen min-h-[580px] overflow-hidden">
          
          {/* Centered Content Container */}
          <div className="relative w-full h-full flex flex-col justify-between px-4 sm:px-6 pt-4 sm:pt-6 md:pt-8 pb-0 max-w-[1360px] mx-auto z-10">

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

            <div className="flex flex-col items-start min-w-[240px] sm:min-w-[300px] md:min-w-[420px]" />
          </div>

          {/* Center Interactive Layout: Step Nav + 3D Diamond Center + Big Title */}
          <div className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-center md:justify-between z-20 my-auto gap-3 sm:gap-4 md:gap-8">
            
            {/* Step Selector: Horizontal on small mobile, Vertical on md+ */}
            <div className={`flex flex-row md:flex-col items-center justify-center gap-2 sm:gap-3 z-30 transition-all duration-500 shrink-0 ${showNav ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
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

            {/* Right: Dynamic YOUR {word} Heading + Paragraph Description OR Initial Resting Title */}
            <div className="w-full md:w-[380px] lg:w-[460px] shrink-0 flex flex-col items-center md:items-start text-center md:text-left z-20 transition-all duration-500 px-2 md:px-0 min-h-[160px] justify-center">
              {activeStep === -1 ? (
                /* STATE 0: Initial resting heading — fades out when entering interactive mode (STATE 1) */
                <div 
                  className={`flex flex-col text-left font-normal leading-[1.12] tracking-tight transition-all duration-500 text-2xl sm:text-3xl md:text-[38px] lg:text-[46px] select-none ${showNav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  style={{ fontFamily: "'REM', sans-serif" }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span style={{ color: '#B39DDB' }}>The</span>
                    <span style={{ color: 'rgb(253, 252, 253)' }}>Core</span>
                    <span style={{ color: '#ffffff' }}>Platform</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 ml-[20px] sm:ml-[40px] md:ml-[60px]">
                    <span style={{ color: '#9575CD' }}>Powering</span>
                    <span style={{ color: '#ffffff' }}>Tools</span>
                  </div>
                </div>
              ) : currentStep ? (
                /* STATES 2-5: YOUR Data / Requirement / Model / Inference */
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
          <div className="w-full z-30 pb-2 flex justify-center items-center">
            <LottieScrollIndicator />
          </div>
        </div>
      </div>
    </section>

      {/* Dotted Separator between The Core Platform and Asset Showcase */}
      <TechnicalFiller />

      {/* ========================================================================= */}
      {/* SECTION 4: WHAT YOU GET / ASSET OWNERSHIP SHOWCASE                      */}
      {/* ========================================================================= */}
      <AssetShowcase />

      {/* Dotted Separator between Asset Showcase and Lab Track */}
      <TechnicalFiller />

      {/* ========================================================================= */}
      {/* SECTION 5: CLOUD API / LOCAL DEPLOYMENT TOGGLE SHOWCASE                   */}
      {/* ========================================================================= */}
      <section 
        ref={labRef} 
        id="lab" 
        className="relative w-full h-[180vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 overflow-hidden">
          <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-3.5 sm:gap-4.5 my-auto">

            {/* Top Header: From Cloud API [ TOGGLE ] Local deployment */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 z-30 text-center select-none">
              <h2 
                className="text-xl sm:text-2xl md:text-[34px] font-normal leading-none tracking-tight flex items-center flex-wrap justify-center gap-2.5 sm:gap-3"
                style={{ fontFamily: "'REM', sans-serif" }}
              >
                <span className="text-[#888888] font-light">From</span>
                <span className={!isLocalDeployment ? "text-white font-normal transition-colors duration-300" : "text-[#888888] font-light transition-colors duration-300"}>
                  Cloud API
                </span>
                
                {/* Interactive Pill Toggle Switch */}
                <div 
                  onClick={toggleDeploymentMode}
                  className="w-13 h-6.5 sm:w-15 sm:h-7.5 rounded-full border border-white/30 bg-[#070709] flex items-center p-1 cursor-pointer mx-1 sm:mx-1.5 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDeploymentMode(); } }}
                  aria-label="Toggle between Cloud API and Local Deployment"
                >
                  <div 
                    className={`w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 rounded-full transition-all duration-300 ease-out ${
                      isLocalDeployment 
                        ? 'translate-x-6 sm:translate-x-7 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] shadow-[0_0_16px_rgba(124,58,237,0.9)]' 
                        : 'translate-x-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                    }`}
                  />
                </div>

                <span className={isLocalDeployment ? "text-[#c084fc] font-normal transition-colors duration-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]" : "text-[#888888] font-light transition-colors duration-300"}>
                  Local deployment
                </span>
              </h2>

              {/* Subheader */}
              <p 
                className="text-xs sm:text-[13px] text-[#888888] font-light max-w-[620px] leading-relaxed transition-colors duration-300 px-4"
                style={{ fontFamily: "'REM', sans-serif" }}
              >
                The difference is not technical. It is what your institution can offer that it cannot offer today.
              </p>
            </div>

            {/* EXACT 3-TILE LOCKED LAYOUT: ONE LARGE LEFT + TWO EQUAL STACKED RIGHT */}
            <div className="relative w-full z-20">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 w-full items-stretch">
                
                {/* ============================================================== */}
                {/* TILE 1: LARGE FEATURE TILE (LEFT)                              */}
                {/* ============================================================== */}
                <div className="lg:col-span-7 bg-[#070709] border border-[#222226] hover:border-purple-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[380px] sm:min-h-[410px] shadow-2xl transition-all duration-300">
                  
                  {/* Background Visual Layer */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Dark subtle grid texture */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                      }}
                    />

                    <AnimatePresence mode="wait">
                      {isLocalDeployment ? (
                        /* STATE 2: LOCAL DEPLOYMENT BACKGROUND VISUAL (100% Reach / Edge Mesh) */
                        <motion.div 
                          key="bg-tile1-local"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center p-4"
                        >
                          <svg viewBox="0 0 540 280" className="w-full h-full max-w-[460px] opacity-85">
                            <defs>
                              <linearGradient id="brandPurpleCore" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#512da8" />
                              </linearGradient>
                            </defs>
                            {/* Glowing radial waves */}
                            <circle cx="270" cy="100" r="90" fill="none" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 4" />
                            <circle cx="270" cy="100" r="60" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
                            <circle cx="270" cy="100" r="32" fill="rgba(81, 45, 168, 0.45)" stroke="#c084fc" strokeWidth="1.5" />

                            {/* Solid connection lines */}
                            <line x1="270" y1="100" x2="70" y2="50" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.85" />
                            <line x1="270" y1="100" x2="80" y2="170" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.85" />
                            <line x1="270" y1="100" x2="470" y2="50" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.85" />
                            <line x1="270" y1="100" x2="460" y2="170" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.85" />
                            <line x1="270" y1="100" x2="270" y2="20" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.85" />

                            {/* Center: On-Device / Local SLM Core */}
                            <circle cx="270" cy="100" r="18" fill="url(#brandPurpleCore)" filter="drop-shadow(0 0 16px rgba(124,58,237,0.9))" />
                            <text x="270" y="103.5" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">10X</text>
                            
                            {/* Device Nodes */}
                            <circle cx="70" cy="50" r="13" fill="#140a24" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="70" y="53.5" fill="#c084fc" fontSize="9.5" textAnchor="middle">✓</text>
                            
                            <circle cx="80" cy="170" r="13" fill="#140a24" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="80" y="173.5" fill="#c084fc" fontSize="9.5" textAnchor="middle">✓</text>
                            
                            <circle cx="470" cy="50" r="13" fill="#140a24" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="470" y="53.5" fill="#c084fc" fontSize="9.5" textAnchor="middle">✓</text>
                            
                            <circle cx="460" cy="170" r="13" fill="#140a24" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="460" y="173.5" fill="#c084fc" fontSize="9.5" textAnchor="middle">✓</text>

                            <circle cx="270" cy="20" r="11" fill="#140a24" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="270" y="23" fill="#c084fc" fontSize="8.5" textAnchor="middle">✓</text>
                          </svg>
                        </motion.div>
                      ) : (
                        /* STATE 1: CLOUD API BACKGROUND VISUAL (Remote Datacenter Bottleneck / Disconnected) */
                        <motion.div 
                          key="bg-tile1-cloud"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center p-4"
                        >
                          <svg viewBox="0 0 540 280" className="w-full h-full max-w-[460px] opacity-75">
                            {/* Latency ripples */}
                            <circle cx="270" cy="100" r="95" fill="none" stroke="#450a0a" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                            <circle cx="270" cy="100" r="60" fill="none" stroke="#71717a" strokeWidth="1" strokeOpacity="0.25" />
                            <circle cx="270" cy="100" r="28" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

                            {/* Center: Remote Cloud */}
                            <circle cx="270" cy="100" r="16" fill="#27272a" stroke="#52525b" strokeWidth="1" />
                            <text x="270" y="103" fill="#a1a1aa" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">CLOUD</text>
                            
                            {/* Connected node */}
                            <line x1="270" y1="100" x2="470" y2="50" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
                            <circle cx="470" cy="50" r="11" fill="#18181b" stroke="#52525b" strokeWidth="1" />

                            {/* Disconnected Unserved Nodes */}
                            <line x1="270" y1="100" x2="70" y2="50" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.65" />
                            <circle cx="70" cy="50" r="13" fill="#200a0a" stroke="#dc2626" strokeWidth="1.5" />
                            <text x="70" y="54" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">×</text>

                            <line x1="270" y1="100" x2="80" y2="170" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.65" />
                            <circle cx="80" cy="170" r="13" fill="#200a0a" stroke="#dc2626" strokeWidth="1.5" />
                            <text x="80" y="174" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">×</text>

                            <line x1="270" y1="100" x2="460" y2="170" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.65" />
                            <circle cx="460" cy="170" r="13" fill="#200a0a" stroke="#dc2626" strokeWidth="1.5" />
                            <text x="460" y="174" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">×</text>
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Gradient wash ensuring bottom text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent z-10" />
                  </div>

                  {/* Foreground Content */}
                  <div className="relative z-20 mt-auto flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                      {isLocalDeployment ? (
                        <motion.div 
                          key="tile1-local"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.22 }}
                        >
                          <span 
                            className="text-xs font-mono tracking-widest text-[#c084fc] font-medium block mb-1"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          >
                            01
                          </span>
                          <h3 
                            className="text-xl sm:text-2xl md:text-[27px] font-normal text-white tracking-tight leading-snug mb-1.5"
                            style={{ fontFamily: "'REM', sans-serif" }}
                          >
                            Reach the people you cannot reach today
                          </h3>
                          <p 
                            className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed max-w-[540px]"
                            style={{ fontFamily: "'REM', sans-serif" }}
                          >
                            The model runs on your own hardware, or on a device in their hand. No connection required. The people your service never reached become people it does.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="tile1-cloud"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.22 }}
                        >
                          <span 
                            className="text-xs font-mono tracking-widest text-[#71717a] font-medium block mb-1"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          >
                            01
                          </span>
                          <h3 
                            className="text-xl sm:text-2xl md:text-[27px] font-normal text-white tracking-tight leading-snug mb-1.5"
                            style={{ fontFamily: "'REM', sans-serif" }}
                          >
                            Only the connected get served
                          </h3>
                          <p 
                            className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed max-w-[540px]"
                            style={{ fontFamily: "'REM', sans-serif" }}
                          >
                            Every answer needs a live connection to a datacentre. The users on a weak network, or no network at all, are the ones you already struggle to serve. They stay unserved.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* ============================================================== */}
                {/* RIGHT COLUMN: TWO EQUAL STACKED TILES                          */}
                {/* ============================================================== */}
                <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4 w-full">
                  
                  {/* ============================================================ */}
                  {/* TILE 2: TOP RIGHT TILE (Brand & Identity)                     */}
                  {/* ============================================================ */}
                  <div className="flex-1 bg-[#070709] border border-[#222226] hover:border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-end relative overflow-hidden min-h-[180px] sm:min-h-[195px] shadow-2xl transition-all duration-300">
                    
                    {/* Background Visual Layer */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <AnimatePresence mode="wait">
                        {isLocalDeployment ? (
                          /* Local State: Sovereign Brand Crest Graphic */
                          <motion.div 
                            key="bg-tile2-local"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-3 top-2 w-32 h-32 opacity-25"
                          >
                            <svg viewBox="0 0 160 160" className="w-full h-full">
                              <polygon points="80,10 145,45 145,115 80,150 15,115 15,45" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                              <polygon points="80,28 130,55 130,105 80,132 30,105 30,55" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 3" />
                              <circle cx="80" cy="80" r="24" fill="rgba(124,58,237,0.2)" stroke="#c084fc" strokeWidth="1" />
                            </svg>
                          </motion.div>
                        ) : (
                          /* Cloud State: Generic Rented Lock / 3rd Party Badge Graphic */
                          <motion.div 
                            key="bg-tile2-cloud"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-3 top-2 w-32 h-32 opacity-15"
                          >
                            <svg viewBox="0 0 160 160" className="w-full h-full">
                              <rect x="35" y="60" width="90" height="70" rx="8" fill="none" stroke="#71717a" strokeWidth="1.5" />
                              <path d="M55,60 V42 C55,28 105,28 105,42 V60" fill="none" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
                              <circle cx="80" cy="95" r="8" fill="#71717a" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Gradient wash */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent z-10" />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-20 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        {isLocalDeployment ? (
                          <motion.div 
                            key="tile2-local"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.22 }}
                          >
                            <span 
                              className="text-xs font-mono tracking-widest text-[#c084fc] font-medium block mb-1"
                              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                              02
                            </span>
                            <h3 
                              className="text-base sm:text-lg md:text-xl font-normal text-white tracking-tight leading-snug mb-1"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              It carries your name, not ours
                            </h3>
                            <p 
                              className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Deployed under your own brand. Ours appears nowhere your users can see.
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="tile2-cloud"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.22 }}
                          >
                            <span 
                              className="text-xs font-mono tracking-widest text-[#71717a] font-medium block mb-1"
                              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                              02
                            </span>
                            <h3 
                              className="text-base sm:text-lg md:text-xl font-normal text-white tracking-tight leading-snug mb-1"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Someone else's product, inside yours
                            </h3>
                            <p 
                              className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              The intelligence is rented, and the name attached to it is not yours.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* ============================================================ */}
                  {/* TILE 3: BOTTOM RIGHT TILE (Moat & Exclusivity)                */}
                  {/* ============================================================ */}
                  <div className="flex-1 bg-[#070709] border border-[#222226] hover:border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-end relative overflow-hidden min-h-[180px] sm:min-h-[195px] shadow-2xl transition-all duration-300">
                    
                    {/* Background Visual Layer */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <AnimatePresence mode="wait">
                        {isLocalDeployment ? (
                          /* Local State: Proprietary Weight Matrix Vault Graphic */
                          <motion.div 
                            key="bg-tile3-local"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-3 top-2 w-32 h-32 opacity-25"
                          >
                            <svg viewBox="0 0 160 160" className="w-full h-full">
                              <rect x="25" y="25" width="110" height="110" rx="10" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                              <circle cx="80" cy="80" r="32" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 4" />
                              <path d="M40,80 H120 M80,40 V120" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.6" />
                              <circle cx="80" cy="80" r="10" fill="#a855f7" />
                            </svg>
                          </motion.div>
                        ) : (
                          /* Cloud State: Open Replicated Public Key Wireframe */
                          <motion.div 
                            key="bg-tile3-cloud"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-3 top-2 w-32 h-32 opacity-15"
                          >
                            <svg viewBox="0 0 160 160" className="w-full h-full">
                              <circle cx="55" cy="80" r="28" fill="none" stroke="#71717a" strokeWidth="1.5" />
                              <circle cx="105" cy="80" r="28" fill="none" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
                              <line x1="83" y1="80" x2="140" y2="80" stroke="#71717a" strokeWidth="1.5" />
                              <line x1="125" y1="80" x2="125" y2="92" stroke="#71717a" strokeWidth="1.5" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Gradient wash */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent z-10" />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-20 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        {isLocalDeployment ? (
                          <motion.div 
                            key="tile3-local"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.22 }}
                          >
                            <span 
                              className="text-xs font-mono tracking-widest text-[#c084fc] font-medium block mb-1"
                              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                              03
                            </span>
                            <h3 
                              className="text-base sm:text-lg md:text-xl font-normal text-white tracking-tight leading-snug mb-1"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Your competitors cannot buy this
                            </h3>
                            <p 
                              className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Trained on your material, licensed only to you. Only you have this one.
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="tile3-cloud"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.22 }}
                          >
                            <span 
                              className="text-xs font-mono tracking-widest text-[#71717a] font-medium block mb-1"
                              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                              03
                            </span>
                            <h3 
                              className="text-base sm:text-lg md:text-xl font-normal text-white tracking-tight leading-snug mb-1"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Your competitor has the same access
                            </h3>
                            <p 
                              className="text-xs sm:text-[13px] text-[#a0a0ab] font-light leading-relaxed"
                              style={{ fontFamily: "'REM', sans-serif" }}
                            >
                              Anything you build on a public API, they can build tomorrow with the same key.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </div>

              </div>

              {/* Butter-Smooth Laser Scan Curtain Sweep Overlay */}
              {isScanning && (
                <div 
                  className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-2xl"
                >
                  {/* Glowing Vertical Laser Line */}
                  <div 
                    className="absolute inset-y-0 w-[3px] bg-white shadow-[0_0_20px_#7c3aed,0_0_40px_#512da8,0_0_60px_#4c1d95] transition-all duration-500 ease-out"
                    style={{ 
                      left: `${laserPos}%`,
                    }}
                  />
                  {/* Radiant Energy Curtain Sweep */}
                  <div 
                    className="absolute inset-y-0 transition-all duration-500 ease-out"
                    style={{ 
                      left: 0,
                      width: `${laserPos}%`,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(81, 45, 168, 0.15) 70%, rgba(124, 58, 237, 0.3) 100%)'
                    }}
                  />
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Dotted Separator between Lab Track and Cost Calculator */}
      <TechnicalFiller />

      {/* ========================================================================= */}
      {/* SECTION 6: COST CALCULATOR — Renting vs Owning Live Interactive Calculator */}
      {/* ========================================================================= */}
      <ApiCostCalculator />

      {/* Dotted Separator between Cost Calculator and Integration Track */}
      <TechnicalFiller />

      {/* ========================================================================= */}
      {/* SECTION 7: INTEGRATION TRACK — Exact 7-Node Parabolic Arc Fan Track       */}
      {/* ========================================================================= */}
      <section 
        ref={integrationRef} 
        id="integration" 
        className="relative w-full h-[220vh] bg-[#000000] z-10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col justify-between items-center px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-14 max-w-[1360px] mx-auto overflow-hidden">
          
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
                    className="absolute w-[95px] sm:w-[110px] md:w-[115px] h-[95px] sm:h-[110px] md:h-[115px] rounded-2xl bg-[#0c0c0e] border border-white/15 p-4 sm:p-4.5 flex items-center justify-center shadow-2xl transition-all duration-150 ease-out hover:border-[#7E57C2] hover:shadow-[0_0_30px_rgba(103,58,183,0.5)] cursor-pointer"
                    style={{
                      transform: `translate3d(${t.x}px, ${t.y}px, 0px) rotate(${t.rot}deg) scale(${t.scale})`,
                      zIndex: t.zIndex,
                      willChange: 'transform',
                    }}
                  >
                    <img 
                      src={card.src} 
                      alt={card.alt} 
                      className="w-full h-full object-contain brightness-[0.95] hover:brightness-100 transition-all filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none pointer-events-none"
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
      <div className="bg-black relative z-20">
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
