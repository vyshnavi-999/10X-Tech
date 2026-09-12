import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

const ProductShowcase = ({ openContactModal }) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Text Animation: "Coming Soon" and "KEEP SCROLLING"
  // Fades out promptly between 0.04 and 0.20
  const textOpacity = useTransform(scrollYProgress, [0.04, 0.20], [1, 0]);
  const textDisplay = useTransform(scrollYProgress, (v) => (v >= 0.22 ? 'none' : 'inline-block'));
  const textLeftX = useTransform(scrollYProgress, [0, 0.20], [0, -30]);
  const textRightX = useTransform(scrollYProgress, [0, 0.20], [0, 30]);

  // 2. Expanding Pill Geometry:
  // Starts as a 140x64 pill and smoothly expands to a full framed card by 0.60
  const expandProgress = useTransform(scrollYProgress, [0.08, 0.60], [0, 1]);
  const width = useMotionTemplate`calc(130px + (min(100vw - 48px, 1280px) - 130px) * ${expandProgress})`;
  const height = useMotionTemplate`calc(60px + (min(100vh - 160px, 720px) - 60px) * ${expandProgress})`;
  const borderRadius = useTransform(scrollYProgress, [0.08, 0.60], ["30px", "24px"]);

  // 3. Inner Image & Vignette:
  const imageScale = useTransform(scrollYProgress, [0.08, 0.70], [1.14, 1.0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[220vh] bg-black z-20"
    >
      {/* Sticky viewport container cleanly positioned BELOW the navbar (top-[88px] sm:top-[96px]) */}
      <div 
        className="sticky top-[88px] sm:top-[96px] h-[calc(100vh-88px)] sm:h-[calc(100vh-96px)] w-full overflow-hidden flex flex-col items-center justify-center pointer-events-none select-none"
      >
        {/* KEEP SCROLLING Indicator: positioned cleanly below navbar */}
        <motion.div 
          style={{ opacity: textOpacity, display: textDisplay }}
          className="absolute top-4 sm:top-6 left-0 w-full flex justify-center z-30 pointer-events-none px-4"
        >
          <span className="text-gray-400/80 text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase text-center">
            Keep Scrolling
          </span>
        </motion.div>

        {/* STATE 1: Centered "Coming [Pill Slot] Soon" Composition */}
        <motion.div 
          style={{ opacity: textOpacity, display: textDisplay }}
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none px-4 sm:px-8 max-w-full overflow-hidden"
        >
          <div className="relative flex items-center justify-center gap-3 sm:gap-5 md:gap-8 max-w-full">
            {/* "Coming" - Left word */}
            <motion.h1 
              style={{ x: textLeftX, opacity: textOpacity, display: textDisplay }}
              className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            >
              Coming
            </motion.h1>

            {/* Spacer reserved for the central pill */}
            <div className="w-[110px] sm:w-[130px] shrink-0 pointer-events-none" aria-hidden="true" />

            {/* "Soon" - Right word */}
            <motion.h1 
              style={{ x: textRightX, opacity: textOpacity, display: textDisplay }}
              className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            >
              Soon
            </motion.h1>
          </div>
        </motion.div>

        {/* The Expanding Hardware Card Container */}
        <motion.div 
          style={{ 
            width, 
            height, 
            borderRadius,
            willChange: 'width, height, border-radius'
          }}
          className="relative z-20 overflow-hidden flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#080808] border border-white/15"
        >
          {/* Hardware Product Showcase Image - Aperture Window Reveal */}
          <motion.div 
            style={{ scale: imageScale }}
            className="absolute w-[min(calc(100vw-48px),1280px)] h-[min(calc(100vh-160px),720px)] shrink-0 flex items-center justify-center pointer-events-none"
          >
            <img 
              src="/resolution%20changed%20hardware%20image.png"
              alt="LUCA Hardware Showcase"
              className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.04]"
              loading="eager"
            />
          </motion.div>
          
          {/* Inner Vignette for High-End Depth */}
          <motion.div 
            style={{ opacity: vignetteOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.75)_100%)] z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
