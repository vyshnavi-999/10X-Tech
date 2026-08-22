import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = ({ openContactModal }) => {
  const navigate = useNavigate();
  const eyesContainerRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftReflectionRef = useRef(null);
  const rightReflectionRef = useRef(null);

  // Multi-layered organic gaze physics references
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const lastMouseMoveTimeRef = useRef(Date.now());
  const isBlinkingRef = useRef(false);
  const animIdRef = useRef(null);

  // 60fps Direct DOM GPU Animation Loop (Zero React re-render overhead)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateGaze = (now) => {
      const isIdle = Date.now() - lastMouseMoveTimeRef.current > 1000;

      // Layer 1: Biological micro-drift when cursor is stationary
      let idleDriftX = 0;
      let idleDriftY = 0;
      if (isIdle) {
        idleDriftX = Math.sin(now * 0.0011) * 2.2 + Math.cos(now * 0.0022) * 0.8;
        idleDriftY = Math.cos(now * 0.0014) * 1.6 + Math.sin(now * 0.0026) * 0.6;
      }

      // Layer 2: Smooth non-linear interpolation with natural deceleration
      const targetX = targetOffsetRef.current.x + idleDriftX;
      const targetY = targetOffsetRef.current.y + idleDriftY;

      currentOffsetRef.current.x = lerp(currentOffsetRef.current.x, targetX, 0.1);
      currentOffsetRef.current.y = lerp(currentOffsetRef.current.y, targetY, 0.1);

      const eyeTransformStr = isBlinkingRef.current
        ? 'scaleY(0.06)'
        : `translate3d(${currentOffsetRef.current.x.toFixed(2)}px, ${currentOffsetRef.current.y.toFixed(2)}px, 0)`;

      const reflectionTransformStr = isBlinkingRef.current
        ? 'scaleY(0.1) scaleX(0.95)'
        : `translate3d(${(currentOffsetRef.current.x * 0.95).toFixed(2)}px, ${(currentOffsetRef.current.y * 0.35).toFixed(2)}px, 0)`;

      if (leftEyeRef.current) {
        leftEyeRef.current.style.transform = eyeTransformStr;
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.style.transform = eyeTransformStr;
      }
      if (leftReflectionRef.current) {
        leftReflectionRef.current.style.transform = reflectionTransformStr;
      }
      if (rightReflectionRef.current) {
        rightReflectionRef.current.style.transform = reflectionTransformStr;
      }

      animIdRef.current = requestAnimationFrame(animateGaze);
    };

    animIdRef.current = requestAnimationFrame(animateGaze);
    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  // Window mouse movement listener (calculates gaze vector toward cursor)
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMouseMoveTimeRef.current = Date.now();

      if (!eyesContainerRef.current) return;
      const rect = eyesContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Restrained biological eye travel range (human gaze rather than object tracking)
      const maxTravel = 22;
      const intensity = Math.min(distance / 350, 1) * 0.95;

      targetOffsetRef.current = {
        x: Math.cos(angle) * (maxTravel * intensity),
        y: Math.sin(angle) * (maxTravel * intensity * 0.78)
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic natural autonomous blinking at organic intervals
  useEffect(() => {
    let blinkTimeout;
    const scheduleNextBlink = () => {
      const nextInterval = 4500 + Math.random() * 4500;
      blinkTimeout = setTimeout(() => {
        isBlinkingRef.current = true;
        setTimeout(() => {
          isBlinkingRef.current = false;
          scheduleNextBlink();
        }, 150);
      }, nextInterval);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Click / Tap -> instant natural blink
  const handleEyeClick = (e) => {
    e.stopPropagation();
    isBlinkingRef.current = true;
    setTimeout(() => {
      isBlinkingRef.current = false;
    }, 180);
  };

  const handleSeeItWork = () => {
    navigate('/try', { 
      state: { 
        url: 'https://shesettipavankumarswamy-luca.hf.space/', 
        title: 'LUCA AI'
      } 
    });
  };

  const handleInstitutions = () => {
    if (openContactModal) {
      openContactModal();
    } else {
      navigate('/product');
    }
  };

  return (
    <section className="relative w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-28 pt-44 sm:pt-48 md:pt-52 lg:pt-56 xl:pt-60 pb-4 sm:pb-6 md:pb-8 z-10 flex items-center">
      
      {/* ── FULL WIDTH FLEX CONTAINER (OCCUPIES FULL VIEWPORT WIDTH) ── */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* ── LEFT COLUMN: ANCHORED DIRECTLY TO LEFT SIDE ── */}
        <div className="w-full lg:w-[54%] xl:w-[52%] flex flex-col items-start text-left z-20">
          
          {/* 1. Small contextual / credibility line */}
          <div className="flex items-center gap-2 flex-wrap mb-5 sm:mb-6">
            <span className="text-xs sm:text-sm font-normal text-zinc-400">
              Recognised by MeitY
            </span>
            <span className="text-purple-400 text-xs font-bold">•</span>
            <span className="text-xs sm:text-sm font-normal text-zinc-400">
              NVIDIA Inception
            </span>
            <span className="text-purple-400 text-xs font-bold">•</span>
            <span className="text-xs sm:text-sm font-normal text-zinc-400">
              AWS
            </span>
            <span className="text-purple-400 text-xs font-bold">•</span>
            <span className="text-xs sm:text-sm font-normal text-zinc-400">
              DPIIT
            </span>
          </div>

          {/* 2. Large headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[80px] font-bold tracking-tight text-white leading-[1.04] mb-5 sm:mb-6">
            Small language<br />
            models for<br />
            Indian languages.
          </h1>

          {/* 3. Short supporting description */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed mb-4 sm:mb-5 max-w-xl">
            Building small language models that run on<br className="hidden sm:inline" />
            {' '}your own server — or inside a device on your desk.
          </p>

          {/* 4. Short purple statement */}
          <p className="text-sm sm:text-base md:text-lg text-purple-400 font-medium tracking-normal mb-8 sm:mb-9">
            You do not need frontier AI for every workflow.
          </p>

          {/* 5. Two CTA buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Primary CTA (Filled Purple Pill) */}
            <button
              type="button"
              onClick={handleSeeItWork}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white text-sm sm:text-[15px] font-medium transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(109,40,217,0.35)] active:scale-95 group"
            >
              <span>See it work</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            {/* Secondary CTA (Restrained Outline Pill) */}
            <button
              type="button"
              onClick={handleInstitutions}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 text-zinc-200 hover:text-white text-sm sm:text-[15px] font-medium transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>For institutions</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>

        {/* ── RIGHT COLUMN: ANCHORED DIRECTLY TO RIGHT SIDE ── */}
        <div className="w-full lg:w-[46%] xl:w-[48%] flex flex-col items-center lg:items-end justify-center relative select-none mt-8 lg:mt-0">
          
          <div 
            ref={eyesContainerRef}
            onClick={handleEyeClick}
            title="Click to blink"
            className="relative cursor-pointer py-6 px-4 flex flex-col items-center justify-center group"
          >
            {/* Ambient Soft Halo Glow Behind Eyes */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[420px] h-40 sm:h-52 md:h-60 rounded-full blur-[85px] opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(168,85,247,0.15) 50%, transparent 80%)'
              }}
            />

            {/* The Two Pure White Circular LUCA Eyes */}
            <div className="flex items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 relative z-10">
              
              {/* Left Eye */}
              <div 
                ref={leftEyeRef}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-34 md:h-34 lg:w-[142px] lg:h-[142px] xl:w-[156px] xl:h-[156px] rounded-full bg-white transition-transform duration-75 ease-out shadow-[0_0_24px_rgba(255,255,255,0.28)]"
              />

              {/* Right Eye */}
              <div 
                ref={rightEyeRef}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-34 md:h-34 lg:w-[142px] lg:h-[142px] xl:w-[156px] xl:h-[156px] rounded-full bg-white transition-transform duration-75 ease-out shadow-[0_0_24px_rgba(255,255,255,0.28)]"
              />

            </div>

            {/* Natural Ground Surface Reflection Blur Beneath Eyes (Moves in sync with eyes) */}
            <div className="flex items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 mt-4 opacity-25 pointer-events-none">
              <div 
                ref={leftReflectionRef}
                className="w-24 sm:w-28 md:w-34 lg:w-[142px] xl:w-[156px] h-12 rounded-full blur-md transition-transform duration-75 ease-out"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 100%)'
                }}
              />
              <div 
                ref={rightReflectionRef}
                className="w-24 sm:w-28 md:w-34 lg:w-[142px] xl:w-[156px] h-12 rounded-full blur-md transition-transform duration-75 ease-out"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 100%)'
                }}
              />
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;
