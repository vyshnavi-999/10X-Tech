import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const assetParts = [
  {
    number: "01",
    title: "A Model file",
    text: "Trained on your data, for your work. It sits on your server the way any other piece of software does.",
  },
  {
    number: "02",
    title: "A License exclusive to you",
    text: "It does not expire, and it is not shared with another customer. The weights are yours to keep.",
  },
  {
    number: "03",
    title: "A deployment on your own hardware",
    text: "Your own servers, your existing machines, or a device at the edge. We deploy it to match how your infrastructure already works.",
  },
  {
    number: "04",
    title: "Someone to call",
    text: "Retraining as your data changes, and support for the deployment itself.",
  }
];

const AssetShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative w-full pt-4 sm:pt-6 pb-2 sm:pb-4 bg-[#000000] flex flex-col items-center z-10">
      <div className="w-full max-w-[1360px] mx-auto px-6 mb-6 lg:mb-8 flex flex-col items-center text-center">
        {/* Top Tag with Glitch Scramble matching 'BACKED BY' */}
        <span 
          className="text-xs sm:text-[13px] font-normal tracking-[0.2em] text-white/70 uppercase mb-3 block"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <ScrambleText text="WHAT YOU GET" duration={1.6} speed={60} delay={600} />
        </span>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-3 leading-tight">
          <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7E22CE] bg-clip-text text-transparent">
            You are buying an asset,
          </span>{' '}
          <span className="text-white">not just an access.</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-[#888] text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed font-light">
          Most AI purchases are a login and a monthly bill. This is a model made for your organization from the ground up and <span className="text-white/90 font-medium">YOU OWN IT!</span>
        </p>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Architectural Grid Container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/[0.08] rounded-[24px] overflow-hidden bg-[#050505]">
          
          {/* Left Side: 4 Parts Column (45%) */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#050505]">
            {assetParts.map((part, idx) => {
              const isActive = activeIndex === idx;
              const isLast = idx === assetParts.length - 1;
              
              return (
                <div 
                  key={idx}
                  className="relative p-4 sm:p-5 lg:p-5 xl:p-6 flex flex-col justify-center transition-colors duration-500 cursor-pointer"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                >
                  {/* Absolute Bottom Border */}
                  {!isLast && (
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.08] z-0"></div>
                  )}

                  {/* Independent Animated Progress Bar */}
                  <motion.div 
                    className="absolute left-0 top-0 w-[2px] bg-[#7c3aed] origin-top z-20"
                    initial={{ height: "0%" }}
                    animate={{ 
                      height: isActive ? "100%" : "0%" 
                    }}
                    transition={{ 
                      duration: isActive && !isPaused ? 4 : 0.3, 
                      ease: isActive && !isPaused ? "linear" : "easeInOut" 
                    }}
                    onAnimationComplete={() => {
                      if (isActive && !isPaused) {
                        setActiveIndex((activeIndex + 1) % assetParts.length);
                      }
                    }}
                  />

                  <div className="pl-2">
                    <span 
                      className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-semibold mb-1 block"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {part.number}
                    </span>
                    <h3 className={`text-base sm:text-lg font-medium tracking-tight transition-colors duration-500 ${isActive ? 'text-white' : 'text-[#555]'}`}>
                      {part.title}
                    </h3>
                    
                    {/* Height-animated text container */}
                    <motion.div 
                      initial={false}
                      animate={{ 
                        height: isActive ? 'auto' : 0, 
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? 6 : 0
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-[13px] text-[#999] leading-relaxed max-w-[95%]">
                        {part.text}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Blank Container (ready for upcoming instruction) */}
          <div className="lg:col-span-7 relative bg-[#050505] p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[280px] sm:min-h-[340px] lg:min-h-[380px]">
            {/* Inner Frame */}
            <div className="relative w-full h-full min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#0a0a0f] flex items-center justify-center">
              {/* Left blank as requested */}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AssetShowcase;
