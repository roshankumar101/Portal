import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BannerImage1 from '../assets/BannerImg.jpg'
import BannerImage2 from '../assets/IndiaMap.png'
import '../index.css'
import { TypeWriter, ScribbledText } from "./TextStyle";

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
    gsap.set(missionEl, { opacity: 1, y: 0 }); // Keep main title visible

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
    const typewriterCompletionTime = 3.8; // Adding small buffer

    // Animate subtitle after TypeWriter completes
    entranceTl.to(subtitleEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, typewriterCompletionTime);

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
      className="relative w-full min-h-screen flex items-center justify-center px-8 py-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Section - India Map with Facts */}
        <div className="relative w-full h-full">
          {/* India Map */}
          <div ref={mapRef} className="relative mb-8">
            <img src={BannerImage2} alt="" width="1000" height="700" />
          </div>

          {/* India Facts */}
          <div ref={factsRef} className="absolute w-full inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-6 relative w-full max-w-md">
              {/* Educated Unemployment */}
              <div
                className="group absolute top-10 left-10 p-4 transition-all duration-500 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => startCounting('unemployment', 0, 96.2, 2000, '')}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    <span id="unemployment">0</span><span className="text-lg">%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                    Educated Unemployment
                  </p>
                </div>
              </div>

              {/* Massive Dropout */}
              <div
                className=" p-4 transition-all duration-500 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => startCounting('dropout', 0, 60, 1800, '')}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    <span id="dropout">0</span><span className="text-lg">%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                    Massive Dropout Rate
                  </p>
                </div>
              </div>

              {/* Upskilling Void */}
              <div
                className=" p-4  duration-500 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => startCounting('upskilling', 0, 75, 2200, '')}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    <span id="upskilling">0</span><span className="text-lg">K+</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                    Upskilling Void
                  </p>
                </div>
              </div>

              {/* Access Deficiency */}
              <div
                className="group p-4 transition-all duration-500 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => startCounting('access', 0, 300, 2500, '')}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    <span id="access">0</span><span className="text-lg">%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                    Access Deficiency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Mission and Solutions */}
        <div className="space-y-20 -mt-10">
          {/* Mission Statement */}
          <div ref={missionRef} className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Redefining Talent
              <span className="text-blue-900"> Reimagining
                <TypeWriter
                  text={" INDIA"}
                  className="text-5xl font-bold inline whitespace-nowrap transition-colors duration-300 text-blue-900"
                  delay={1}
                  charDelay={0.2}
                  charDuration={0.1}
                  cursor={false}
                />
              </span>
            </h1>


            {/* Subtitle - appears after TypeWriter completes */}
            <div ref={subtitleRef}>
              <h2 className="text-xl">
                India doesn't need more degrees, It needs <span className="text-xl text-blue-800 font-semibold">Real Skills...</span>
              </h2>
            </div>
          </div>
          {/* Solutions */}
          <div ref={solutionsRef} className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Two simple solutions:</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* Industry Relevant Skills */}
              <div className="flex flex-col relative hover:bg-[#E5F4FE] rounded-md h-10 px-4 py-2 shadow-lg bg-white/50 hover:shadow-xl transition-all duration-400">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 animate-pulse rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Industry Relevant Skills</h3>
                </div>

                {/* Lottie Animation */}
                <div className="absolute top-0 left-1/3 -translate-x-1/2 z-10">
                  <dotlottie-wc
                    src="https://lottie.host/dca4880a-6889-4996-b44e-9321f9e4bfa6/GRjki1SfoF.lottie"
                    speed="1"
                    style={{ width: '120px', height: '120px', transform: 'rotate(150deg) scaleX(-1) scale(0.45)' }}
                    mode="forward"

                    autoplay
                  ></dotlottie-wc>
                </div>
              </div>

              {/* Passion Aligned Opportunities */}
              <div className="flex flex-col relative hover:bg-[#E5F4FE] rounded-md h-10 px-4 py-2 shadow-lg bg-white/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Purposeful Placements</h3>

                  <div className="absolute top-0 right-1/3 translate-x-1/2 z-10 delay-1000">
                    <dotlottie-wc
                      src="https://lottie.host/dca4880a-6889-4996-b44e-9321f9e4bfa6/GRjki1SfoF.lottie"
                      speed="1"
                      style={{ width: '120px', height: '120px', transform: 'rotate(210deg) scale(0.45)' }}
                      mode="forward"
                      autoplay
                    ></dotlottie-wc>
                  </div>
                </div>

              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row justify-around mt-8 text-center">
              <div className="flex items-center">
                <ScribbledText
                  text="We Shape Brilliance"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="-2px"
                  duration={0.6}
                  delay={1.5}
                  stagger={0.15}
                  className="font-bold text-lg font-caveat italic cursive"
                />
              </div>
              <div className="flex items-center end-0">
                <ScribbledText
                  text="You Spot it"
                  color="#1f2937"
                  lineColor="#3b82f6"
                  lineHeight="0.15rem"
                  lineOffset="-2px"
                  duration={0.6}
                  delay={4.0}
                  stagger={0.15}
                  className="font-bold text-lg font-caveat italic cursive"
                />
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div ref={sloganRef} className="pt-3 border-t border-gray-200">
            <p className="text-sm font-bold text-gray-600 text-center relative">
              Hiring from us is a common sense <span className="text-gray-700 font-italic underline">Don't believe us Scroll down</span>
              <div className="absolute z-10 delay-1000">
                <dotlottie-wc
                  src="https://lottie.host/ae1d97bb-5c47-4831-9dcb-b722fa2b7aa2/HYheM2XgzN.lottie"
                  speed="1"
                  style={{ width: '100px', height: '100px' }}
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
