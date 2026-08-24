import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
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
              if (char === ' ' || char === '.' || char === '[' || char === ']' || char === '+') return char;
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

const PARTNER_LOGOS = [
  { src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6951ecc0730eaa0ec919b104_logo-1.png', alt: 'Logoipsum 1' },
  { src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6951ecc01fac44e8c729460f_logo-2.png', alt: 'Logoipsum 2' },
  { src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6951ecc020de041e30e7449c_logo-3.png', alt: 'Logoipsum 3' },
  { src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6951ecc0251f9ab52dfc8472_logo-4.png', alt: 'Logoipsum 4' },
  { src: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6951ecc0994da8e11b711573_logo-5.png', alt: 'Logoipsum 5' },
];

const PLATFORM_STEPS = [
  {
    id: '01',
    title: 'Analytics',
    subtitle: 'Advanced Intelligent\nAnalytics Platform',
    system: 'REAL-TIME',
    performance: 'PREDICTIVE',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f258b8e73d7666537_bar-chart.png',
    alt: 'Bar chart icon'
  },
  {
    id: '02',
    title: 'Data',
    subtitle: 'Unified Data Intelligence\nFoundation',
    system: 'CONNECTED',
    performance: 'SINGLE SOURCE',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952afed8d4ca6576fcbdedf_linked-services.png',
    alt: 'Linked services network icon'
  },
  {
    id: '03',
    title: 'Auto',
    subtitle: 'Adaptive Automation\nWorkflow System',
    system: 'SMART',
    performance: 'EFFICIENCY',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f1c8555865fea32ed_auto-renew.png',
    alt: 'Auto renew loop icon'
  },
  {
    id: '04',
    title: 'Security',
    subtitle: 'Secure and Scalable\nCore Infrastructure',
    system: 'ENTERPRISE',
    performance: 'SEAMLESS',
    iconSrc: 'https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f0b7d0e5d63ed20fb_encrypted.png',
    alt: 'Encrypted shield keyhole icon'
  }
];

export default function ModelsPage() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualStep, setManualStep] = useState(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  
  const heroRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine active step from scroll progress
  let calculatedStep = -1; // -1 represents Intro state
  if (scrollProgress < 0.12) {
    calculatedStep = -1;
  } else if (scrollProgress < 0.35) {
    calculatedStep = 0; // 01: Analytics
  } else if (scrollProgress < 0.58) {
    calculatedStep = 1; // 02: Data
  } else if (scrollProgress < 0.80) {
    calculatedStep = 2; // 03: Auto
  } else {
    calculatedStep = 3; // 04: Security
  }

  const activeStep = manualStep !== null ? manualStep : calculatedStep;
  const currentStep = activeStep >= 0 ? PLATFORM_STEPS[activeStep] : null;

  const scrollToStep = (idx) => {
    setManualStep(idx);
    if (!trackRef.current) return;
    const totalScrollable = trackRef.current.offsetHeight - window.innerHeight;
    const stepTargetProgress = 0.18 + idx * 0.23;
    const targetY = trackRef.current.offsetTop + totalScrollable * stepTargetProgress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans select-none">
      {/* 10X Standard Global Navbar */}
      <Navbar />

      {/* Hero Section 1 — Exact Quantara Replica */}
      <section 
        ref={heroRef}
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
              <ScrambleText text="AI THAT WORKS." duration={1.2} speed={45} delay={100} />
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-[-0.025em] leading-[1.08] text-white max-w-[760px] mx-auto text-center"
            style={{ 
              fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: '0.288px'
            }}
          >
            Automate decisions<br />with confidence.
          </h1>
        </div>

        {/* Orbital Perspective Badges with subtle Parallax */}

        {/* 1. VISION (Top-Left) */}
        <div 
          className="absolute z-20 flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            top: '18%', 
            left: '17%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c97caa6687a94160b05_Square.png" 
            alt="VISION Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="VISION" duration={1.2} speed={50} delay={400} />
          </span>
        </div>

        {/* 2. SMART (Middle-Right) */}
        <div 
          className="absolute z-20 flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            top: '47%', 
            right: '13%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c973c0be5bb32690004_Circle.png" 
            alt="SMART Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="SMART" duration={1.5} speed={60} delay={800} />
          </span>
        </div>

        {/* 3. PRECISE (Bottom-Left) */}
        <div 
          className="absolute z-20 flex flex-col items-center gap-1.5 pointer-events-auto transition-transform duration-300 hover:scale-110 ease-out"
          style={{ 
            bottom: '15%', 
            left: '22%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
          }}
        >
          <img 
            src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/694f9c9735e4184a62ba66f7_Triangle.png" 
            alt="PRECISE Icon" 
            className="w-3.5 h-3.5 object-contain opacity-90"
          />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9f9f9f] font-normal"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ScrambleText text="PRECISE" duration={1.8} speed={65} delay={1200} />
          </span>
        </div>

        {/* Bottom Scroll Pill Indicator (Exact Lottie Animation) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <LottieScrollIndicator />
        </div>
      </section>

      {/* Section 2 — Ecosystem / Partner Section (Exact Quantara Replica) */}
      <section className="relative w-full bg-[#000000] z-10 py-[150px] overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-14 flex flex-col">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-[60px] flex-wrap gap-6">
            {/* Left Title: 2-Line arrangement */}
            <div 
              className="text-[21.6px] font-light text-white leading-[28.8px] max-w-md tracking-normal"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Where Technology Meets<br />Partnership
            </div>

            {/* Right Indicator: ECOSYSTEM + 5-dot cross icon */}
            <div className="flex items-center gap-3">
              <span 
                className="text-[14.4px] font-normal tracking-[0.2em] text-white uppercase"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <ScrambleText text="ECOSYSTEM" duration={1.6} speed={60} delay={600} />
              </span>
              {/* 5-dot cross micro graphic */}
              <div className="w-3.5 h-3.5 flex items-center justify-center text-white">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M7 1h2v5h5v2H9v5H7V8H2V6h5V1z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Partners Infinite Seamless Ticker */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Left Edge Gradient Fade Mask */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-10 pointer-events-none" />
            
            {/* Right Edge Gradient Fade Mask */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#000000] via-[#000000]/80 to-transparent z-10 pointer-events-none" />

            {/* Infinite Marquee Track with exact 115px gap */}
            <div className="flex items-center gap-[115px] w-max animate-quantara-marquee">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, idx) => (
                <div key={idx} className="shrink-0 flex items-center justify-center py-2 transition-all duration-300">
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-10 sm:h-11 w-auto object-contain brightness-[0.45] hover:brightness-100 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Dashed Divider Line */}
          <div className="w-full mt-[60px] border-b border-dashed border-[#5d5d5d]" />
        </div>
      </section>

      {/* Section 3 — The Core Platform Powering Tools (Exact 1:1 Quantara Track Replica) */}
      <section 
        ref={trackRef} 
        id="product" 
        className="relative w-full h-[450vh] bg-[#000000] z-10"
      >
        {/* Sticky Viewport Frame Container */}
        <div className="sticky top-0 w-full h-screen flex flex-col justify-between px-6 md:px-12 pt-[104px] pb-8 max-w-[1440px] mx-auto overflow-hidden">
          
          {/* Top Title Row: EXACT Live Spacing & Indentation */}
          <div className="flex items-start justify-between w-full z-30 pt-2">
            
            {/* Left Block: 4x4 Plus Grid + Monospace ABOUT US Badge */}
            <div className="flex items-start gap-12 sm:gap-24">
              {/* 4x4 Color-Coded Plus Grid in 4 Columns */}
              <div className="flex items-start gap-4 select-none font-mono tracking-widest">
                {[0, 1, 2, 3].map((colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1.5">
                    <span className="text-[#fafafa] font-normal text-base">+</span>
                    <span className="text-[#c2d6e5] font-normal text-base">+</span>
                    <span className="text-[#5dafee] font-normal text-base">+</span>
                    <span className="text-[#22affc] font-normal text-base">+</span>
                  </div>
                ))}
              </div>

              {/* ABOUT US badge with exact padding */}
              <div className="pt-2">
                <span 
                  className="text-xs uppercase tracking-[0.2em] text-[#9f9f9f] font-mono"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <ScrambleText text="ABOUT US" duration={1.2} speed={45} delay={100} />
                </span>
              </div>
            </div>

            {/* Right Block: Exact Headline with Indented Second Line */}
            <div className="flex flex-col items-start min-w-[340px] md:min-w-[480px]">
              {activeStep === -1 ? (
                <div 
                  className="flex flex-col text-left font-normal leading-[1.12] tracking-tight transition-all duration-500 text-3xl sm:text-4xl md:text-[56px]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {/* Line 1 */}
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'rgb(210, 194, 229)' }}>The</span>
                    <span style={{ color: 'rgb(253, 252, 253)' }}>Core</span>
                    <span style={{ color: '#ffffff' }}>Platform</span>
                  </div>
                  {/* Line 2 with Exact Webflow Indentation (starts under 'Platform') */}
                  <div className="flex items-center gap-3 ml-[6vw] sm:ml-[8vw] md:ml-[140px]">
                    <span style={{ color: 'rgb(44, 151, 252)' }}>Powering</span>
                    <span style={{ color: '#ffffff' }}>Tools</span>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-right w-full text-lg sm:text-xl md:text-2xl font-light text-white/80 leading-snug tracking-tight transition-all duration-500 whitespace-pre-line"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {currentStep.subtitle}
                </div>
              )}
            </div>

          </div>

          {/* Center Interactive Layout: Vertical Pill Indicator (Left) + 3D Isometric Center + Big Animated Title (Right) */}
          <div className="relative w-full flex-1 flex items-center justify-between z-20 my-auto">
            
            {/* Left: Vertical Step Pill Bar (01 - 02 - 03 - 04) */}
            <div className={`flex flex-col items-center gap-3 z-30 transition-opacity duration-500 ${activeStep === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {PLATFORM_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => scrollToStep(idx)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-xs md:text-sm font-mono transition-all duration-500 cursor-pointer border ${
                        isActive
                          ? 'bg-[#24a0ff]/25 border-[#24a0ff] text-white font-bold shadow-[0_0_24px_rgba(36,160,255,0.6)] scale-110'
                          : 'bg-[#111115]/60 border-white/20 text-white/50 hover:text-white hover:border-white/50'
                      }`}
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {step.id}
                    </button>
                    {idx < PLATFORM_STEPS.length - 1 && (
                      <div className="w-[1px] h-4 bg-white/20" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Center: EXACT Webflow Diamond Geometry & Interactive Elevation */}
            <div 
              className="relative flex flex-col items-center justify-start mx-auto w-[55vw] max-w-[845px] h-[40vw] max-h-[615px] pt-[3.8vw]"
              style={{
                backgroundImage: 'url("https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a960f6d8b19db76f89a9_extrude-group-ground.png")',
                backgroundPosition: '50% 50%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            >
              {/* Top Block: 01 (Analytics - Bar Chart) */}
              <div 
                onClick={() => scrollToStep(0)}
                onMouseEnter={() => setHoveredBlock(0)}
                onMouseLeave={() => setHoveredBlock(null)}
                className={`relative flex flex-col justify-start items-center w-[18vw] max-w-[276px] h-[12vw] max-h-[184px] cursor-pointer transition-all duration-600 ease-out z-10 ${
                  activeStep === 0 
                    ? '-translate-y-5 scale-105 z-30' 
                    : hoveredBlock === 0 
                      ? '-translate-y-2 opacity-90' 
                      : 'translate-y-0 opacity-40 grayscale'
                }`}
                style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 1"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[0].iconSrc}
                  alt={PLATFORM_STEPS[0].alt}
                  className={`relative z-10 w-[7.5vw] max-w-[115px] h-[7.5vw] max-h-[115px] mt-[0.8vw] object-contain transition-all duration-600 ${
                    activeStep === 0
                      ? 'filter drop-shadow-[0_0_20px_rgba(36,160,255,0.9)] brightness-125'
                      : 'grayscale brightness-75'
                  }`}
                />
              </div>

              {/* Middle Row: 03 (Auto - Left) & 02 (Data - Right) with -6vw margin-top */}
              <div className="relative flex justify-between items-center w-[36vw] max-w-[553px] h-[12vw] max-h-[184px] -mt-[6vw] z-20">
                {/* 03: Left (Auto - Refresh Loop) */}
                <div 
                  onClick={() => scrollToStep(2)}
                  onMouseEnter={() => setHoveredBlock(2)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className={`relative flex flex-col justify-start items-center w-[18vw] max-w-[276px] h-[12vw] max-h-[184px] cursor-pointer transition-all duration-600 ease-out ${
                    activeStep === 2 
                      ? '-translate-y-5 scale-105 z-30' 
                      : hoveredBlock === 2 
                        ? '-translate-y-2 opacity-90' 
                        : 'translate-y-0 opacity-40 grayscale'
                  }`}
                  style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                    alt="Base Block 3"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <img 
                    src={PLATFORM_STEPS[2].iconSrc}
                    alt={PLATFORM_STEPS[2].alt}
                    className={`relative z-10 w-[7.5vw] max-w-[115px] h-[7.5vw] max-h-[115px] mt-[0.8vw] object-contain transition-all duration-600 ${
                      activeStep === 2
                        ? 'filter drop-shadow-[0_0_20px_rgba(36,160,255,0.9)] brightness-125'
                        : 'grayscale brightness-75'
                    }`}
                  />
                </div>

                {/* 02: Right (Data - Linked Services) */}
                <div 
                  onClick={() => scrollToStep(1)}
                  onMouseEnter={() => setHoveredBlock(1)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className={`relative flex flex-col justify-start items-center w-[18vw] max-w-[276px] h-[12vw] max-h-[184px] cursor-pointer transition-all duration-600 ease-out ${
                    activeStep === 1 
                      ? '-translate-y-5 scale-105 z-30' 
                      : hoveredBlock === 1 
                        ? '-translate-y-2 opacity-90' 
                        : 'translate-y-0 opacity-40 grayscale'
                  }`}
                  style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <img 
                    src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                    alt="Base Block 2"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <img 
                    src={PLATFORM_STEPS[1].iconSrc}
                    alt={PLATFORM_STEPS[1].alt}
                    className={`relative z-10 w-[7.5vw] max-w-[115px] h-[7.5vw] max-h-[115px] mt-[0.8vw] object-contain transition-all duration-600 ${
                      activeStep === 1
                        ? 'filter drop-shadow-[0_0_20px_rgba(36,160,255,0.9)] brightness-125'
                        : 'grayscale brightness-75'
                    }`}
                  />
                </div>
              </div>

              {/* Bottom Block: 04 (Security - Encrypted Shield) with -6vw margin-top */}
              <div 
                onClick={() => scrollToStep(3)}
                onMouseEnter={() => setHoveredBlock(3)}
                onMouseLeave={() => setHoveredBlock(null)}
                className={`relative flex flex-col justify-start items-center w-[18vw] max-w-[276px] h-[12vw] max-h-[184px] -mt-[6vw] cursor-pointer transition-all duration-600 ease-out z-30 ${
                  activeStep === 3 
                    ? '-translate-y-5 scale-105 z-30' 
                    : hoveredBlock === 3 
                      ? '-translate-y-2 opacity-90' 
                      : 'translate-y-0 opacity-40 grayscale'
                }`}
                style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6952a95f02127800ad2c8e76_extrude-group-block.png"
                  alt="Base Block 4"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <img 
                  src={PLATFORM_STEPS[3].iconSrc}
                  alt={PLATFORM_STEPS[3].alt}
                  className={`relative z-10 w-[7.5vw] max-w-[115px] h-[7.5vw] max-h-[115px] mt-[0.8vw] object-contain transition-all duration-600 ${
                    activeStep === 3
                      ? 'filter drop-shadow-[0_0_20px_rgba(36,160,255,0.9)] brightness-125'
                      : 'grayscale brightness-75'
                  }`}
                />
              </div>
            </div>

            {/* Right: Huge Animated Title (`Analytics` / `Data` / `Auto` / `Security`) */}
            <div className="w-[280px] text-right flex justify-end z-20">
              {currentStep && (
                <div 
                  key={currentStep.id + '_big'}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-white/90 tracking-tight transition-all duration-500 animate-fadeIn"
                  style={{ 
                    fontFamily: "'Inter Tight', sans-serif",
                    backgroundImage: 'linear-gradient(325deg, #71717a, #ffffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {currentStep.title}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Empty Left / SYSTEM & PERFORMANCE specs (Bottom Right) */}
          <div className="flex items-end justify-between w-full z-30 pb-2">
            <div />

            {currentStep && (
              <div className="flex items-start gap-12 font-mono">
                {/* SYSTEM */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#888888]">
                    SYSTEM
                  </span>
                  <span className="text-xs sm:text-sm uppercase tracking-[0.15em] text-white font-medium">
                    <ScrambleText text={currentStep.system} duration={1.0} speed={40} key={currentStep.id + '_sys'} />
                  </span>
                </div>

                {/* PERFORMANCE */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#888888]">
                    PERFOMANCE
                  </span>
                  <span className="text-xs sm:text-sm uppercase tracking-[0.15em] text-white font-medium">
                    <ScrambleText text={currentStep.performance} duration={1.0} speed={40} key={currentStep.id + '_perf'} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scoped CSS for Infinite Continuous Ticker */}
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
