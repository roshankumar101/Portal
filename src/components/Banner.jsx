import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BannerImage1 from '../assets/IndiaMapBlend.png'
import '../index.css'
import { TypeWriter, ScribbledText } from "./TextStyle";
import { rotate } from "three/tsl";
import r2 from '../assets/r2.png'


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
    const typewriterCompletionTime = 2.5; // Adding small buffer

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
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">

        {/* Left Section - India Map with Facts */}
        <div className="relative w-full h-full order-1">
          {/* India Map */}
          <div ref={mapRef} className="relative left-0 pt-10 lg:pt-2 mb-4">
            <img className="absolute w-[75%] lg:w-[85%]" style={{ transform: 'rotateX(20deg) rotateY(-5deg) rotateZ(5deg)' }} src={BannerImage1} />
          </div>

          {/* India Facts */}
          <div className="absolute w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute right-[10%] top-[5%] space-y-2 w-1/2">
                <p className="text-sm font-semibold">70% Students lack Industry relevant Skills</p>
                <p className="text-sm font-semibold">40% Students forced to choose the wrong career path</p>
                <p className="text-sm font-semibold">29% population in 20's but lack industry exposure</p>
              </div>
                <p className="absolute -left-[12%] top-[15%] space-y-2 w-1/4">70% Students lack Industry relevant Skills</p>
                <p className="absolute right-[10%] bottom-[15%] space-y-2 w-1/2">Lorem ipsum dolor sit amet consectetur </p>
                <p className="absolute -left-[12%] -bottom-[10%] space-y-2 w-1/4">70% Students lack Industry relevant Skills</p>
                <p className="absolute right-[10%] bottom-[0%] space-y-2 w-1/2">40% Students forced to choose the wrong career path</p>
              
            </div>
          </div>
        </div>


        {/* Right Section - Mission and Solutions */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-2 mt-8">
          {/* Mission Statement */}
          <div ref={missionRef} className="text-center lg:text-left relative">
            <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-gray-900 leading-tight">
              <span className="text-5xl">On</span> a mission to change the
              <span className="text-blue-900"> Skilling landscape</span> of India
            </h1>

            <div className="absolute w-[70%] right-0 top-[30%]">
              <img src={r2} alt=""  className="opacity-20"/>
            </div>


            {/* Subtitle - appears after TypeWriter completes */}
            <div ref={subtitleRef}>
              <h2 className="text-base sm:text-md lg:text-xl">
                India doesn't need more degrees, It needs <span className="text-base sm:text-lg lg:text-xl text-blue-800 font-semibold">Real Skills...</span>
              </h2>
            </div>
          </div>
          {/* Solutions */}
          <div ref={solutionsRef} className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center lg:text-left">Two simple solutions:</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-6">


              {/* Industry Relevant Skills */}
              <div className="flex flex-col items-center relative hover:bg-[#E5F4FE] rounded-md h-8 sm:h-10 px-3 sm:px-6 py-1.5 sm:py-2 shadow-md bg-white/80 hover:shadow-lg transition-all duration-300">
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black">Precision Learning</h3>
                </div>

                {/* Lottie Animation */}
              </div>

              {/* Passion Aligned Opportunities */}
              <div className="flex flex-col items-center relative hover:bg-[#E5F4FE] rounded-md h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2 shadow-md bg-white/80 hover:shadow-lg transition-all duration-300">
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black">Excellence Network</h3>
                </div>
              </div>

            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row justify-around mt-2 sm:mt-4 lg:mt-6 text-center gap-4 sm:gap-0">
              <div className="flex items-center justify-center">
                <ScribbledText
                  text="We Shape Brilliance"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="0px"
                  duration={0.2}
                  delay={2}
                  stagger={0.1}
                  className="font-bold text-base sm:text-md font-caveat italic cursive"
                />
              </div>
              <div className="flex items-center justify-center">
                <ScribbledText
                  text="You Spot it"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="0px"
                  duration={0.5}
                  delay={2}
                  stagger={0.15}
                  className="font-bold text-base sm:text-md font-caveat italic"
                />
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div ref={sloganRef} className="pt-3 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-bold text-gray-600 text-center relative">
              Hiring from us is a common sense <span className="text-gray-800 font-italic underline">Don't believe us Scroll down</span>
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
