import React, { useState } from 'react';

const generateStars = () => {
  const newStars = [];
  for (let i = 0; i < 200; i++) {
    newStars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.8,
      opacity: Math.random() * 0.3 + 0.6,
      hasGlow: Math.random() > 0.6,
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 2 // Smoother, more consistent range
    });
  }
  return newStars;
};

const Starfield = () => {
  const [stars] = useState(() => generateStars());

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${star.hasGlow ? 'animate-static-glow' : 'opacity-40'}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--base-opacity': star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default Starfield;
