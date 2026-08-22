import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CloudCtaButton = ({ 
  isVisible = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => {
      navigate('/try', { 
        state: { 
          url: 'https://shesettipavankumarswamy-luca.hf.space/', 
          title: 'LUCA AI'
        } 
      });
    }, 180);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)', scale: 0.97 }}
        animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : { opacity: 0, y: 12, filter: 'blur(8px)', scale: 0.97 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          onClick={handleClick}
          className={`group relative z-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-purple-50 hover:shadow-[0_0_35px_rgba(192,132,252,0.5)] active:scale-95 cursor-pointer ${
            isClicked ? 'scale-90 opacity-70' : ''
          }`}
        >
          <span>TRY LUCA</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
};

export default CloudCtaButton;
