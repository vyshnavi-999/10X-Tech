import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowRight, Sparkles } from 'lucide-react';
import { prewarmQwen } from '../services/qwenService.js';

const LucaProductSurface = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    navigate('/try', { 
      state: { 
        url: 'https://shesettipavankumarswamy-luca.hf.space/', 
        title: 'LUCA AI',
        initialQuery: query
      } 
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="relative z-20 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="flex flex-col items-center text-center">
        
        {/* Section Heading */}
        <div className="mb-8">
          <span className="text-tagline-02 text-purple-400 uppercase tracking-widest font-mono text-xs mb-2 block">
            SEE IT WORK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
            A Model Built by 10X.
          </h2>
          <p className="text-body-01 text-white/60 text-sm sm:text-base font-normal">
            Try the live interactive prototype model built on our LFM architecture.
          </p>
        </div>

        {/* Authentic Product Surface Container */}
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Top Status Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-[#090912] border border-white/10 rounded-t-[24px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono font-semibold text-white/80 tracking-wider">
                LUCA · 10X Technologies
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-300/70">
              LFM Active
            </span>
          </div>

          {/* Interactive Search & Prompt Surface */}
          <div className="relative flex items-center p-3 sm:p-4 bg-[#05050a] border-x border-b border-white/10 rounded-b-[24px] shadow-2xl group">
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={prewarmQwen}
              onPointerEnter={prewarmQwen}
              placeholder="Ask Luca a question or describe a task..."
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/35 px-3 py-2 text-sm sm:text-base font-sans"
            />

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                aria-label="Voice input"
                onClick={handleSubmit}
                className="p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Mic className="w-4 h-4 text-purple-300" />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                onPointerEnter={prewarmQwen}
                onFocus={prewarmQwen}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#512da8] to-[#4c1d95] text-white text-xs font-bold uppercase tracking-wider hover:from-[#6d28d9] hover:to-[#512da8] transition-all shadow-[0_0_20px_rgba(81,45,168,0.3)]"
              >
                <span>Launch Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Verification Caption */}
          <div className="mt-4 text-center">
            <p className="text-xs font-mono text-white/40">
              Direct gateway to live Hugging Face model space • Verified 10X LFM Prototype
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LucaProductSurface;
