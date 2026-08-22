import React from 'react';
import { motion } from 'framer-motion';

const CloudChatBubble = ({ 
  text = '',
  isUser = false, // true = right (user), false = left (luca)
  isVisible = false,
  className = ''
}) => {
  return (
    <div className={`relative inline-block max-w-md sm:max-w-lg md:max-w-xl ${className}`}>
      <motion.div
        initial={{ 
          opacity: 0, 
          x: isUser ? 18 : -18, 
          filter: 'blur(10px)',
          scale: 0.97
        }}
        animate={isVisible ? { 
          opacity: 1, 
          x: 0, 
          filter: 'blur(0px)',
          scale: 1
        } : { 
          opacity: 0, 
          x: isUser ? 18 : -18, 
          filter: 'blur(10px)',
          scale: 0.97
        }}
        transition={{ 
          duration: 0.55, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className={`px-5 py-3.5 sm:px-6 sm:py-4 rounded-[22px] text-left transition-shadow duration-300 ${
          isUser
            ? 'bg-[#3b2361] text-white rounded-tr-md shadow-[0_4px_25px_rgba(59,35,97,0.45)] border border-purple-400/25'
            : 'bg-[#15151e] text-zinc-100 rounded-tl-md shadow-[0_4px_25px_rgba(0,0,0,0.7)] border border-white/10'
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed font-normal">
          {text}
        </p>
      </motion.div>
    </div>
  );
};

export default CloudChatBubble;
