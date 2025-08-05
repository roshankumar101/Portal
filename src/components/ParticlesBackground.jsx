import React from 'react';

const ParticlesBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F2F0D6] via-[#F5F3E0] to-[#F8F6EA] animate-gradient-xy"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {/* Large floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Medium floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`medium-${i}`}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full animate-float-medium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
            }}
          />
        ))}
        
        {/* Small floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute w-1 h-1 bg-white/15 rounded-full animate-float-fast"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticlesBackground;

