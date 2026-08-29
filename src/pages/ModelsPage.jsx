import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import Starfield from '../components/Starfield';

const SCRAMBLE_CHARS = '+?84564XERS';

function ScrambleText({ text, speed = 35, duration = 0.9, delay = 0 }) {
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

export default function ModelsPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [dialCount, setDialCount] = useState(0);
  const manualTimeoutRef = useRef(null);
  
  const workflowRef = useRef(null);
  const scrollRaf = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dial count interval for The Features counter
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setDialCount(prev => (prev >= 100 ? 0 : prev + 1));
    }, 45);
    return () => clearInterval(counterInterval);
  }, []);

  // Handle scroll-based step activation
  useEffect(() => {
    const handleScroll = () => {
      if (isManualOverride) return;
      if (scrollRaf.current) return;
      
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = null;
        if (workflowRef.current) {
          const rect = workflowRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            
            let step = Math.min(3, Math.max(0, Math.floor(progress * 4)));
            setActiveWorkflowStep(step);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, [isManualOverride]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveWorkflowStep(prev => (prev < 3 ? prev + 1 : 3));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveWorkflowStep(prev => (prev > 0 ? prev - 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToWorkflowStep = (idx) => {
    setIsManualOverride(true);
    setActiveWorkflowStep(idx);
    
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualOverride(false);
    }, 900);

    if (workflowRef.current) {
      const totalScrollable = workflowRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const stepCenters = [0.12, 0.37, 0.62, 0.87];
        const targetY = workflowRef.current.offsetTop + totalScrollable * stepCenters[idx];
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-[100svh] bg-black text-white selection:bg-purple-500/30 font-sans overflow-x-clip">
      
      {/* Strict pure black body override */}
      <style>{`
        .bg-grid { display: none !important; }
        body { background-color: #000000 !important; }
      `}</style>
      
      {/* Global Noise Overlay */}
      <div className="bg-noise fixed pointer-events-none z-50"></div>

      {/* Top Ambient Starfield */}
      <div className="absolute top-0 left-0 right-0 h-[900px] w-full pointer-events-none z-0 overflow-hidden">
        <Starfield />
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navbar openContactModal={() => setIsContactModalOpen(true)} />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: WORKFLOW TRACK — Pure Black 3D Isometric Cascade                */}
      {/* ========================================================================= */}
      <section 
        ref={workflowRef} 
        id="models-workflow" 
        className="relative w-full h-[220vh] bg-black z-10"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-14 max-w-[1440px] mx-auto overflow-hidden bg-black">
          
          {/* Left Column: Vertical Ruler + Text Content */}
          <div className="relative w-full lg:w-[48%] h-auto lg:h-full flex flex-col justify-between pt-24 sm:pt-28 lg:pt-[130px] pb-8 lg:pb-14 z-20">
            
            {/* Top Scramble Badge: PARTIAL >>> TASK [0X] */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-[#09090b] border border-white/15 rounded text-xs font-mono tracking-widest text-[#9f9f9f] flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                <span className="text-white/80 font-medium">PARTIAL</span>
                <span className="text-[#9575CD] font-bold">&gt;&gt;&gt;</span>
                <span className="text-[#B39DDB] font-semibold"><ScrambleText text={`TASK [0${activeWorkflowStep + 1}]`} speed={35} key={activeWorkflowStep} /></span>
              </div>
            </div>

            {/* Center Area: Ruler Column + Big Title & Description */}
            <div className="relative my-6 lg:my-auto flex items-start gap-5 sm:gap-8">
              
              {/* Vertical Tick Ruler Column */}
              <div className="flex flex-col items-center gap-2 font-mono text-[10px] text-white/30 select-none pt-2">
                <span className="text-[#9575CD] font-bold text-sm transition-all duration-300 drop-shadow-[0_0_8px_rgba(149,117,205,0.8)]">
                  0{activeWorkflowStep + 1}
                </span>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
                  <div 
                    key={t} 
                    className={`h-[1px] transition-all duration-300 ${
                      t === activeWorkflowStep * 3 
                        ? 'w-4 bg-[#9575CD] shadow-[0_0_6px_#9575CD]' 
                        : 'w-2.5 bg-white/20'
                    }`} 
                  />
                ))}
              </div>

              {/* Dynamic Title and Description */}
              <div className="relative z-10 flex flex-col gap-3 sm:gap-4 max-w-lg">
                <h2 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal leading-[1.06] tracking-tight text-white transition-all duration-500 animate-fadeIn"
                  style={{ 
                    fontFamily: "'REM', sans-serif",
                    backgroundImage: 'linear-gradient(325deg, rgb(180, 180, 180), rgb(255, 255, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  key={activeWorkflowStep + '_wftitle'}
                >
                  {WORKFLOW_STEPS[activeWorkflowStep].title}
                </h2>

                <p 
                  className="text-sm sm:text-base md:text-[17px] text-white/70 max-w-md font-light leading-relaxed transition-all duration-500"
                  key={activeWorkflowStep + '_wfdesc'}
                >
                  {WORKFLOW_STEPS[activeWorkflowStep].desc.replace(WORKFLOW_STEPS[activeWorkflowStep].highlight, '')}
                  <span className="text-white font-medium">{WORKFLOW_STEPS[activeWorkflowStep].highlight}</span>
                </p>
              </div>
            </div>

            {/* Bottom Step Pills Selector with Horizontal Connecting Lines */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {WORKFLOW_STEPS.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <button
                    onClick={() => scrollToWorkflowStep(idx)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 cursor-pointer border shrink-0 ${
                      activeWorkflowStep === idx
                        ? 'bg-[#512DA8] text-white font-bold border-[#9575CD] shadow-[0_0_20px_rgba(149,117,205,0.85)] scale-110'
                        : 'bg-[#09090b] border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:scale-105'
                    }`}
                    aria-label={`Go to step ${s.id}: ${s.title}`}
                  >
                    {s.id}
                  </button>
                  {idx < WORKFLOW_STEPS.length - 1 && (
                    <div 
                      className={`w-3 sm:w-4 h-[1.5px] rounded-full transition-all duration-300 shrink-0 ${
                        activeWorkflowStep > idx ? 'bg-[#9575CD] shadow-[0_0_6px_rgba(149,117,205,0.8)]' : 'bg-white/25'
                      }`} 
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* Right Column: 3D Diagonal Isometric Cascade Cards on Pure Black */}
          <div 
            className="relative w-full lg:w-[52%] h-auto lg:h-full flex items-center justify-center z-10 scale-[0.68] sm:scale-[0.85] lg:scale-100 origin-center my-auto py-6 lg:py-0 bg-black"
          >
            {/* 3D Diagonal Stack of 4 Extruded Cards */}
            <div 
              className="relative flex items-center justify-center w-[560px] h-[490px]"
            >
              
              {/* Card 1: Bottom Left (01 - Collect Data) — FRONT / FOREGROUND CARD */}
              <div 
                onClick={() => scrollToWorkflowStep(0)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out group ${
                  activeWorkflowStep === 0
                    ? 'z-50 -translate-y-8 scale-[1.03] drop-shadow-[0_16px_36px_rgba(103,58,183,0.6)] opacity-100'
                    : 'z-40 translate-y-0 opacity-35 grayscale hover:opacity-80 hover:grayscale-0 hover:-translate-y-2'
                }`}
                style={{
                  top: '188px',
                  left: '20px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 1" 
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
                <img 
                  src={WORKFLOW_STEPS[0].icon} 
                  alt="Collect Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 0
                      ? 'filter drop-shadow-[0_0_14px_rgba(149,117,205,0.8)] hue-rotate-[58deg] saturate-[1.3] brightness-105 scale-105'
                      : 'grayscale brightness-50 opacity-60 group-hover:opacity-80'
                  }`}
                />
              </div>

              {/* Card 2: Middle Lower (02 - Process Data) — Layer 2 */}
              <div 
                onClick={() => scrollToWorkflowStep(1)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out group ${
                  activeWorkflowStep === 1
                    ? 'z-35 -translate-y-8 scale-[1.03] drop-shadow-[0_16px_36px_rgba(103,58,183,0.6)] opacity-100'
                    : 'z-30 translate-y-0 opacity-35 grayscale hover:opacity-80 hover:grayscale-0 hover:-translate-y-2'
                }`}
                style={{
                  top: '120px',
                  left: '124px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 2" 
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
                <img 
                  src={WORKFLOW_STEPS[1].icon} 
                  alt="Process Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 1
                      ? 'filter drop-shadow-[0_0_14px_rgba(149,117,205,0.8)] hue-rotate-[58deg] saturate-[1.3] brightness-105 scale-105'
                      : 'grayscale brightness-50 opacity-60 group-hover:opacity-80'
                  }`}
                />
              </div>

              {/* Card 3: Middle Upper (03 - Analyze Data) — Layer 3 */}
              <div 
                onClick={() => scrollToWorkflowStep(2)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out group ${
                  activeWorkflowStep === 2
                    ? 'z-25 -translate-y-8 scale-[1.03] drop-shadow-[0_16px_36px_rgba(103,58,183,0.6)] opacity-100'
                    : 'z-20 translate-y-0 opacity-35 grayscale hover:opacity-80 hover:grayscale-0 hover:-translate-y-2'
                }`}
                style={{
                  top: '52px',
                  left: '228px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 3" 
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
                <img 
                  src={WORKFLOW_STEPS[2].icon} 
                  alt="Analyze Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 2
                      ? 'filter drop-shadow-[0_0_14px_rgba(149,117,205,0.8)] hue-rotate-[58deg] saturate-[1.3] brightness-105 scale-105'
                      : 'grayscale brightness-50 opacity-60 group-hover:opacity-80'
                  }`}
                />
              </div>

              {/* Card 4: Top Right (04 - Deliver Data) — REAR / BACKGROUND CARD */}
              <div 
                onClick={() => scrollToWorkflowStep(3)}
                className={`absolute w-[180px] sm:w-[210px] h-[270px] sm:h-[310px] cursor-pointer transition-all duration-700 ease-out group ${
                  activeWorkflowStep === 3
                    ? 'z-15 -translate-y-8 scale-[1.03] drop-shadow-[0_16px_36px_rgba(103,58,183,0.6)] opacity-100'
                    : 'z-10 translate-y-0 opacity-35 grayscale hover:opacity-80 hover:grayscale-0 hover:-translate-y-2'
                }`}
                style={{
                  top: '-16px',
                  left: '332px',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src="https://cdn.prod.website-files.com/694f372b123017b1e0a43316/6957848774c9981589e6f4dd_Extrude%20Workflow.png" 
                  alt="Workflow Block 4" 
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
                <img 
                  src={WORKFLOW_STEPS[3].icon} 
                  alt="Deliver Data Icon" 
                  className={`absolute inset-0 m-auto w-[48%] h-[48%] object-contain transition-all duration-500 ${
                    activeWorkflowStep === 3
                      ? 'filter drop-shadow-[0_0_14px_rgba(149,117,205,0.8)] hue-rotate-[58deg] saturate-[1.3] brightness-105 scale-105'
                      : 'grayscale brightness-50 opacity-60 group-hover:opacity-80'
                  }`}
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE FEATURES / ORBIT / CIRCULAR DIAL                           */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-black z-20 py-[120px] overflow-hidden border-t border-white/10">
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
            <div className="relative bg-[#09090b] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
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
            <div className="relative bg-[#09090b] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
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
            <div className="relative bg-[#09090b] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[440px] group hover:border-[#7E57C2]/50 transition-all duration-500">
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

      {/* Footer */}
      <div className="bg-black relative z-20">
        <Footer minimal={true} openContactModal={() => setIsContactModalOpen(true)} />
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Scoped CSS for Animations */}
      <style>{`
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
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
          animation: spinSlow 30s linear infinite;
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
          animation: spinReverse 22s linear infinite;
        }
      `}</style>
    </div>
  );
}
