import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManagementSkills = () => {
  const businessFocusRef = useRef(null);
  const leadershipFocusRef = useRef(null);
  const businessSkillsItemsRef = useRef([]);
  const leadershipSkillsItemsRef = useRef([]);

  useEffect(() => {
    // Set initial states
    gsap.set([businessFocusRef.current, leadershipFocusRef.current], {
      opacity: 0,
      y: 50
    });
    
    gsap.set([...businessSkillsItemsRef.current, ...leadershipSkillsItemsRef.current], {
      opacity: 0,
      y: 30
    });

    // Animate columns on scroll
    gsap.to([businessFocusRef.current, leadershipFocusRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: businessFocusRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate skill items with stagger
    gsap.to([...businessSkillsItemsRef.current, ...leadershipSkillsItemsRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: businessFocusRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToBusinessSkillsRef = (el, index) => {
    if (el && !businessSkillsItemsRef.current.includes(el)) {
      businessSkillsItemsRef.current[index] = el;
    }
  };

  const addToLeadershipSkillsRef = (el, index) => {
    if (el && !leadershipSkillsItemsRef.current.includes(el)) {
      leadershipSkillsItemsRef.current[index] = el;
    }
  };

  return (
    <div className="flex gap-8 mt-12 flex-wrap font-sans max-w-6xl mx-auto px-8">
      {/* Hard Skills Column - Business Focus */}
      <div ref={businessFocusRef} className="flex-1 min-w-[320px]">
        <div className="mb-6 h-full">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-secondary mb-2">Strategic Business Competencies</h3>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-start">
            <div 
              ref={(el) => addToBusinessSkillsRef(el, 0)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">4 Years of Immersive Business Training</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Mentored by C-suite executives with live corporate simulations and case challenges, not theoretical classroom learning.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToBusinessSkillsRef(el, 1)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">Real-World Business Projects</h4>
                  <p className="text-gray-600 leading-relaxed">
                    From startup incubators to Fortune 500 consulting projects—developed market-ready solutions under real deadlines.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToBusinessSkillsRef(el, 2)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">Executive-Level Business Acumen</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Mastery of financial modeling, competitive analysis, and stakeholder management at par with MBA graduates.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToBusinessSkillsRef(el, 3)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1 border-b-2 border-purple-500 pb-1 inline-block">
                    Zero-Cost Talent Pipeline
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our corporate partners access pre-vetted business talent without recruitment fees or hidden costs.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToBusinessSkillsRef(el, 4)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">Boardroom-Ready Graduates</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Trained on Bloomberg Terminals, Salesforce, and Tableau with certified proficiency in enterprise platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soft Skills Column - Leadership Focus */}
      <div ref={leadershipFocusRef} className="flex-1 min-w-[320px]">
        <div className="mb-6 h-full">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Leadership Differentiators</h3>
            <div className="w-16 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            <div 
              ref={(el) => addToLeadershipSkillsRef(el, 0)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">CRISIS LEADERSHIP</h4>
                  <p className="text-gray-600 leading-relaxed">
                    <em className="text-gray-700">83% of graduates successfully lead teams through high-pressure scenarios</em> - from investor negotiations to operational disruptions.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToLeadershipSkillsRef(el, 1)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">C-SUITE COMMUNICATION</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Proven ability to distill complex data into executive briefings that drive decision-making at the highest levels.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToLeadershipSkillsRef(el, 2)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">ENTREPRENEURIAL MINDSET</h4>
                  <p className="text-gray-600 leading-relaxed">
                    <em className="text-gray-700">42% reduce time-to-market</em> by identifying opportunities and mobilizing resources ahead of competitors.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToLeadershipSkillsRef(el, 3)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">CULTURAL ARCHITECT</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Certified in organizational design with demonstrated ability to transform team dynamics and engagement metrics.
                  </p>
                </div>
              </div>
            </div>

            <div 
              ref={(el) => addToLeadershipSkillsRef(el, 4)}
              className="group transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">ADAPTIVE INTELLIGENCE</h4>
                  <p className="text-gray-600 leading-relaxed">
                    <em className="text-gray-700">67% faster promotion trajectory</em> due to rapid mastery of emerging business technologies and methodologies.
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

export default ManagementSkills;
