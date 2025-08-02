import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BannerGsap = () => {
  const getsItRef = useRef(null);
  const getItDoneRef = useRef(null);

  useEffect(() => {
    const getsIt = getsItRef.current;
    const getItDone = getItDoneRef.current;

    // Initial state - "GETS IT" visible, "GET IT DONE" hidden
    gsap.set(getsIt, { opacity: 1 });
    gsap.set(getItDone, { 
      opacity: 0,
      scale: 0.5,
      transformOrigin: "center center"
    });

    // "GET IT DONE" smash punch animation
    const punchTimeline = gsap.timeline({
      delay: 0.7,
      repeat: 0
    });

    punchTimeline.to(getItDone, {
      opacity: 1,
      scale: 1.2,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(getItDone, {
      scale: 0.9,
      duration: 0.4
    })
    .to(getItDone, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)"
    });

    // Hover effects
    const handleGetsItEnter = () => {
      gsap.to(getsIt, {
        textDecorationThickness: '2px',
        duration: 0.3
      });
    };

    const handleGetsItLeave = () => {
      gsap.to(getsIt, {
        textDecorationThickness: '1px',
        duration: 0.3
      });
    };

    const handleGetItDoneEnter = () => {
      gsap.to(getItDone, {
        textDecorationThickness: '3px',
        duration: 0.3
      });
    };

    const handleGetItDoneLeave = () => {
      gsap.to(getItDone, {
        textDecorationThickness: '1px',
        duration: 0.3
      });
    };

    getsIt.addEventListener('mouseenter', handleGetsItEnter);
    getsIt.addEventListener('mouseleave', handleGetsItLeave);
    getItDone.addEventListener('mouseenter', handleGetItDoneEnter);
    getItDone.addEventListener('mouseleave', handleGetItDoneLeave);

    return () => {
      getsIt.removeEventListener('mouseenter', handleGetsItEnter);
      getsIt.removeEventListener('mouseleave', handleGetsItLeave);
      getItDone.removeEventListener('mouseenter', handleGetItDoneEnter);
      getItDone.removeEventListener('mouseleave', handleGetItDoneLeave);
      punchTimeline.kill();
    };
  }, []);

  return (
    <div className="text-center max-w-4xl mx-auto p-5">
      <div className="text-2xl sm:text-xl md:text-2xl lg:text-4xl font-bold text-blue-800 mb-0 leading-tight text-nowrap">
        You need the talent who
      </div>
      <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-0 leading-tight">
        <span 
          ref={getsItRef}
          className="inline-block italic font-black underline decoration-blue-900 text-blue-900 text-nowrap relative cursor-default"
        >
          GETS IT
        </span>
      </div>
      <div className="text-2xl sm:text-xl md:text-2xl lg:text-4xl text-nowrap font-bold text-blue-800 mb-0 leading-tight">
        We build those who
      </div>
      <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-0 leading-tight">
        <span 
          ref={getItDoneRef}
          className="sm:text-2xl md:text-3xl lg:text-4xl inline-block italic font-black underline text-nowrap decoration-blue-900 text-blue-900 relative cursor-default"
        >
          GET IT DONE
        </span>
      </div>
    </div>
  );
};

export default BannerGsap;