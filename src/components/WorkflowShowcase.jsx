import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  {
    title: "Local Inference Pipelines",
    text: "Execute complex reasoning tasks directly on secure, on-premise hardware without exposing sensitive data to external networks. Predictable latency for mission-critical operations.",
    image: "/workflow_local.png"
  },
  {
    title: "Secure Knowledge Retrieval",
    text: "Connect your private enterprise documents to a highly optimized retrieval-augmented generation (RAG) system. Ensure proprietary knowledge stays strictly within your perimeter.",
    image: "/workflow_secure.png"
  },
  {
    title: "Enterprise Intelligence",
    text: "Deploy customized intelligence layers across departments. From legal analysis to automated compliance, embed specialized AI agents directly into your daily workflows.",
    image: "/workflow_intel.png"
  }
];

const WorkflowShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative w-full py-8 lg:py-12 bg-[#050505] flex flex-col items-center border-t border-white/[0.05]">
      <div className="w-full max-w-[1360px] mx-auto px-6 mb-6 lg:mb-8 flex flex-col items-center text-center">
        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2">
          Purpose beats scale.
        </h2>
        
        {/* Subtitle */}
        <p className="text-[#888] text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed font-light">
          Rig is a closed system — model, context, tools, and inference — engineered together for one job: real coding work.
        </p>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Architectural Grid Container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/[0.08] rounded-[24px] overflow-hidden bg-[#050505]">
          
          {/* Left Side: Cards Column (40%) */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#050505]">
            {cards.map((card, idx) => {
              const isActive = activeIndex === idx;
              const isPast = activeIndex > idx;
              const isLast = idx === cards.length - 1;
              
              return (
                <div 
                  key={idx}
                  className={`relative p-4 sm:p-5 lg:p-6 xl:p-7 flex flex-col justify-center transition-colors duration-500 cursor-pointer`}
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
                        setActiveIndex((activeIndex + 1) % cards.length);
                      }
                    }}
                  />

                  <div className="pl-2">
                    <span className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-semibold mb-1.5 block">
                      PHASE 0{idx + 1}
                    </span>
                    <h3 className={`text-base sm:text-lg lg:text-xl font-medium tracking-tight transition-colors duration-500 ${isActive ? 'text-white' : 'text-[#555]'}`}>
                      {card.title}
                    </h3>
                    
                    {/* Height-animated text container */}
                    <motion.div 
                      initial={false}
                      animate={{ 
                        height: isActive ? 'auto' : 0, 
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? 8 : 0
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-[13px] text-[#999] leading-relaxed max-w-[95%]">
                        {card.text}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Image Container (60%) */}
          <div className="lg:col-span-7 relative bg-[#050505] p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[280px] sm:min-h-[340px] lg:min-h-[380px]">
            {/* Inner Frame */}
            <div className="relative w-full h-full min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#0a0a0f]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ y: "8%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-8%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Subtle dark overlay for premium matte finish */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent z-10 pointer-events-none"></div>
                  <img 
                    src={cards[activeIndex].image} 
                    alt={cards[activeIndex].title}
                    className="w-full h-full object-cover mix-blend-luminosity opacity-60"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkflowShowcase;
