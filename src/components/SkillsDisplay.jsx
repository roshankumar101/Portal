import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SkillsDisplay = () => {
  const hardSkillsRef = useRef(null);
  const softSkillsRef = useRef(null);
  const hardSkillItemsRef = useRef([]);
  const softSkillItemsRef = useRef([]);

  useEffect(() => {
    // Set initial states
    gsap.set([hardSkillsRef.current, softSkillsRef.current], {
      opacity: 0,
      y: 50
    });

    gsap.set([...hardSkillItemsRef.current, ...softSkillItemsRef.current], {
      opacity: 0,
      y: 30
    });

    // Animate columns on scroll
    gsap.to([hardSkillsRef.current, softSkillsRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: hardSkillsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate skill items with stagger
    gsap.to([...hardSkillItemsRef.current, ...softSkillItemsRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: hardSkillsRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToHardSkillsRef = (el, index) => {
    if (el && !hardSkillItemsRef.current.includes(el)) {
      hardSkillItemsRef.current[index] = el;
    }
  };

  const addToSoftSkillsRef = (el, index) => {
    if (el && !softSkillItemsRef.current.includes(el)) {
      softSkillItemsRef.current[index] = el;
    }
  };

  return (
    <div className="flex gap-16 mt-12 flex-wrap font-sans max-w-6xl mx-auto px-4">
      {/* Hard Skills Column */}
      <div ref={hardSkillsRef} className="flex-1 min-w-[300px] bg-[#e9edef] border border-gray-700 rounded-xl p-5">
        <div className="mb-6 h-full">
          <div className="text-center mb-8 border-b-1">
            <h3 className="text-2xl font-bold mb-4">Hard Skills They've Mastered</h3>
          </div>

          <div className="space-y-8 text-start text-sm px-6">
            <div
              ref={(el) => addToHardSkillsRef(el, 0)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">4 Years of Immersive Training</h4>
                  <p className="text-gray-700">
                    Mentored by industry experts with real-world simulations, not just textbook learning.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToHardSkillsRef(el, 1)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Worked on Real-Time Projects</h4>
                  <p className="text-gray-700">
                    From hackathons to live deployments—they've built, failed, and delivered under pressure.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToHardSkillsRef(el, 2)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Business Acumen Included</h4>
                  <p className="text-gray-700">
                    Students gain exposure to business strategy, finance, and stakeholder management beyond core skills.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToHardSkillsRef(el, 3)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold mb-1 underline decoration-2 underline-offset-1">
                    No-Cost Hiring Policy
                  </h4>
                  <p className="text-gray-700">
                    Zero placement fees—because talent should be <span className="text-gray-800 font-semibold inline-block underline underline-offset-1 decoration-0">accessible, not transactional.</span>
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToHardSkillsRef(el, 4)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Play-and-Plug Resources</h4>
                  <p className="text-gray-700">
                    Trained on industry tools so they're "productive" from Day 1, not just "familiar."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soft Skills Column */}
      <div ref={softSkillsRef} className="flex-1 min-w-[300px] bg-[#e9edef] border border-gray-700 rounded-xl p-5">
        <div className="mb-6 h-full">
          <div className="text-center mb-8 border-b-1">
            <h3 className="text-2xl font-bold mb-4">What Employers Really Remember</h3>
          </div>

          <div className="space-y-7 text-start text-sm px-6">
            <div
              ref={(el) => addToSoftSkillsRef(el, 0)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">CALM IN CHAOS</h4>
                  <p className="text-gray-700">
                    They are trained to think, speak and resolve crisis calmly 40% faster than industry norm.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToSoftSkillsRef(el, 1)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">FLUENT IN GEEK AND EXEC</h4>
                  <p className="text-gray-700">
                    Breaks down tech-speak into plain English - because great ideas shouldn't get lost in translation.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToSoftSkillsRef(el, 2)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">SOLUTION-ORIENTED OWNERSHIP</h4>
                  <p className="text-gray-700">
                    Pattern of identifying risks proactively and presenting validated solutions rather than just problems.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToSoftSkillsRef(el, 3)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">SOLUTIONS OVER EXCUSES</h4>
                  <p className="text-gray-700">
                    Take accountability - doesn't just report problems. They are used to taking charge, they don't blink when it fires, they extinguish it.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={(el) => addToSoftSkillsRef(el, 4)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">LEARN FAST AND STAY RELEVANT</h4>
                  <p className="text-gray-700">
                    Not spoon-fed, they pick up new tech 50% faster than the industry average. Plug them into a new tool and get surprised - we promise, try it!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDisplay;
