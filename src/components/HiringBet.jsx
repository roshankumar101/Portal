import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HiringBet = ({ userSelection = 'SOT' }) => {
  const techWordRef = useRef(null);
  const underlineRef = useRef(null);
  const nahRef = useRef(null);
  const techLineRef = useRef(null);

  // Define different word sets based on user selection
  const getWordsBySelection = (selection) => {
    switch (selection) {
      case 'SOT': // Software Development
        return ["framework", "API", "languages"];
      case 'SOM': // Software Management
        return ["dashboard", "algorithm", "metric"];
      case 'SOH': // Software Healthcare
        return ["EMR", "procedure", "protocols"];
    }
  };

  useEffect(() => {
    const techWords = getWordsBySelection(userSelection);
    const techWordElement = techWordRef.current;
    const underline = underlineRef.current;
    const nahElement = nahRef.current;
    const techLine = techLineRef.current;

    // Animation timeline
    const tl = gsap.timeline({ 
      repeat: -1,
      defaults: { duration: 0.8, ease: "power2.inOut" }
    });
    
    // Word cycling animation with smoother transitions
    techWords.forEach((word) => {
      tl.to(techWordElement, { 
        duration: 0.4,
        opacity: 0,
        y: -10,
        ease: "power2.in",
        onComplete: () => techWordElement.textContent = word
      })
      .to(techWordElement, { 
        opacity: 1, 
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(underline, { 
        scaleX: 1, 
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.2")
      .to(underline, { 
        scaleX: 0, 
        duration: 0.3,
        ease: "power2.in"
      }, "+=1.5");
    });
    
    // Hover effect for underline
    const handleMouseEnter = () => {
      gsap.to(underline, { 
        scaleX: 1,
        height: "100%",
        opacity: 0.2,
        duration: 0.3
      });
      gsap.to(nahElement, {
        scale: 1.1,
        duration: 0.2
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(underline, { 
        scaleX: 0,
        height: 3,
        opacity: 1,
        duration: 0.3
      });
      gsap.to(nahElement, {
        scale: 1,
        duration: 0.2
      });
    };
    
    techLine.addEventListener('mouseenter', handleMouseEnter);
    techLine.addEventListener('mouseleave', handleMouseLeave);
    
    // Continuous slight rotation animation for "NAH!"
    gsap.to(nahElement, {
      rotation: "+=5",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      techLine.removeEventListener('mouseenter', handleMouseEnter);
      techLine.removeEventListener('mouseleave', handleMouseLeave);
      tl.kill();
    };
  }, [userSelection]); // Add userSelection as dependency

  return (
    <div className="max-w-4xl mx-auto my-12 text-center text-gray-200">
      <div className="flex justify-center items-center flex-wrap gap-2 text-4xl leading-tight mb-2">
        <span className="font-bold relative inline-block">Do we bet they know every</span>
        <div ref={techLineRef} className="flex items-center">
          <div className="font-bold -rotate-1 relative inline-block w-[190px] text-center">
            <span ref={techWordRef}>
              {getWordsBySelection(userSelection)[0]}
            </span>
            <div 
              ref={underlineRef}
              className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 origin-left scale-x-0"
            />
          </div>
          <span 
            ref={nahRef}
            className="font-black rotate-1 text-blue-600 drop-shadow-lg inline-block ml-3"
          >
            : NAH !
          </span>
        </div>
      </div>
      
      <div className="flex justify-center items-center flex-wrap gap-2 text-4xl leading-tight">
        <span className="font-bold relative inline-block">but they're</span>
        <span className="font-black text-4xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          passionate learners
        </span>
      </div>
    </div>
  );
};

export default HiringBet; 