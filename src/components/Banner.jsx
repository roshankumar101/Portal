import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BannerImage1 from '../assets/IndiaMap.png'
import '../index.css'
import { TypeWriter, ScribbledText } from "./TextStyle";
import { rotate } from "three/tsl";

// Load Lottie web component
if (typeof window !== 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
  script.type = 'module';
  if (!document.head.querySelector('script[src*="dotlottie-wc"]')) {
    document.head.appendChild(script);
  }
}

const Banner = () => {
  const containerRef = useRef(null);
  const missionRef = useRef(null);
  const subtitleRef = useRef(null);
  const solutionsRef = useRef(null);
  const mapRef = useRef(null);
  const factsRef = useRef(null);
  const sloganRef = useRef(null);

  // Function to animate counting numbers
  const startCounting = (elementId, start, end, duration, suffix = '') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const increment = (end - start) / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  useEffect(() => {
    const container = containerRef.current;
    const missionEl = missionRef.current;
    const subtitleEl = subtitleRef.current;
    const solutionsEl = solutionsRef.current;
    const mapEl = mapRef.current;
    const factsEl = factsRef.current;
    const sloganEl = sloganRef.current;

    // Set initial states - hide everything except main title initially
    gsap.set([subtitleEl, solutionsEl, sloganEl], { opacity: 0, y: 30 });
    gsap.set([mapEl, factsEl], { opacity: 0, y: 30 });
    gsap.set(missionEl, { opacity: 1, y: 0 });

    // Entrance animation timeline
    const entranceTl = gsap.timeline();

    // Animate map first
    entranceTl.to(mapEl, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    });



    // Animate facts around the map
    entranceTl.to(factsEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

    // Calculate when TypeWriter will complete:
    // delay: 2s + (5 chars × 0.2s charDelay) + (0.1s charDuration × 5) = 2 + 1 + 0.5 = 3.5s
    const typewriterCompletionTime = 3.5; // Adding small buffer

    // Animate subtitle after TypeWriter completes
    entranceTl.to(subtitleEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, typewriterCompletionTime - 1.5);

    // Animate solutions section
    entranceTl.to(solutionsEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3");

    // Animate slogan
    entranceTl.to(sloganEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

    return () => {
      entranceTl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">

        {/* Left Section - India Map with Facts */}
        <div className="relative w-full h-full order-1">
          {/* India Map */}
          <div ref={mapRef} className="relative pt-10 lg:pt-8 lg:px-5 w-[80%] lg:w-[95%] mb-4">
            <img className="absolute right-[8%] top-[5%]" style={{ transform: 'rotateX(20deg) rotateY(-5deg) rotateZ(5deg)' }} src={BannerImage1} />
          </div>

          {/* India Facts */}
          <div className="absolute left-0 top-[5%] w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute right-[10%] top-[12%] space-y-1">
                <p>Lorem ipsum, dolor sit amet</p>
                <p>Lorem ipsum, dolor sit amet</p>
                <p>Lorem ipsum, dolor sit amet</p>
              </div>
              <div className="absolute right-[10%] bottom-[10%] space-y-1">
                <p>Lorem ipsum, dolor sit amet</p>
                <p>Lorem ipsum, dolor sit amet</p>
                <p>Lorem ipsum, dolor sit amet</p>
              </div>
            </div>
          </div>
        </div>


        {/* Right Section - Mission and Solutions */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-2 mt-8">
          {/* Mission Statement */}
          <div ref={missionRef} className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-gray-900 leading-tight">
              On a mission to change the
              <span className="text-blue-900"> Skilling landscape</span> of India
            </h1>


            {/* Subtitle - appears after TypeWriter completes */}
            <div ref={subtitleRef}>
              <h2 className="text-base sm:text-md lg:text-xl">
                India doesn't need more degrees, It needs <span className="text-base sm:text-lg lg:text-xl text-blue-800 font-semibold">Real Skills...</span>
              </h2>
            </div>
          </div>
          {/* Solutions */}
          <div ref={solutionsRef} className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center lg:text-left">Two simple solutions:</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">


              {/* Industry Relevant Skills */}
              <div className="flex flex-col relative hover:bg-[#E5F4FE] rounded-md h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg bg-white/50 hover:shadow-xl transition-all duration-400">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 animate-pulse rounded-full"></div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Industry Relevant Skills</h3>
                </div>

                {/* Lottie Animation */}
                <div className="absolute top-4 left-1/3 -translate-x-1/2 z-10">
                  <dotlottie-wc
                    src="https://lottie.host/dca4880a-6889-4996-b44e-9321f9e4bfa6/GRjki1SfoF.lottie"
                    speed="1"
                    style={{ width: '80px', height: '80px', transform: 'rotate(150deg) scaleX(-1) scale(0.6)' }}
                    mode="forward"
                    autoplay
                  ></dotlottie-wc>
                </div>
              </div>

              {/* Passion Aligned Opportunities */}
              <div className="flex flex-col relative hover:bg-[#E5F4FE] rounded-md h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg bg-white/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Purposeful Placements</h3>

                  <div className="absolute top-4 right-1/3 translate-x-1/2 z-10 delay-1000">
                    <dotlottie-wc
                      src="https://lottie.host/dca4880a-6889-4996-b44e-9321f9e4bfa6/GRjki1SfoF.lottie"
                      speed="1"
                      style={{ width: '80px', height: '80px', transform: 'rotate(210deg) scale(0.6)' }}
                      mode="forward"
                      autoplay
                    ></dotlottie-wc>
                  </div>
                </div>

              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row justify-around mt-4 sm:mt-6 lg:mt-8 text-center gap-4 sm:gap-0">
              <div className="flex items-center justify-center">
                <ScribbledText
                  text="We Shape Brilliance"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="-2px"
                  duration={0.6}
                  delay={3.0}
                  stagger={0.15}
                  className="font-bold text-base sm:text-md font-caveat italic cursive"
                />
              </div>
              <div className="flex items-center justify-center">
                <ScribbledText
                  text="You Spot it"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="-2px"
                  duration={0.6}
                  delay={4.0}
                  stagger={0.15}
                  className="font-bold text-base sm:text-md font-caveat italic cursive"
                />
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div ref={sloganRef} className="pt-3 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-bold text-gray-600 text-center relative">
              Hiring from us is a common sense <span className="text-gray-700 font-italic underline">Don't believe us Scroll down</span>
              <div className="absolute z-10 delay-1000 hidden sm:block">
                <dotlottie-wc
                  src="https://lottie.host/ae1d97bb-5c47-4831-9dcb-b722fa2b7aa2/HYheM2XgzN.lottie"
                  speed="1"
                  style={{ width: '80px', height: '80px' }}
                  mode="forward"
                  autoplay
                ></dotlottie-wc>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
