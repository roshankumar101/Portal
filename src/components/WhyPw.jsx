import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillsDisplay from './SkillsDisplay';
import ManagementSkills from './ManagementSkills';
import HealthcareSkills from './HealthcareSkills';
import HiringBet from './HiringBet';

gsap.registerPlugin(ScrollTrigger);

const WhyPw = () => {
  const [activeTab, setActiveTab] = useState('SOT'); // Default to SOT

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'SOT':
        return <SkillsDisplay />;
      case 'SOM':
        return <ManagementSkills />;
      case 'SOH':
        return <HealthcareSkills />;
      default:
        return <SkillsDisplay />;
    }
  };

  return (
    <section className="py-8 px-2 max-w-6xl mx-auto text-center font-sans rounded-lg">
      <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-12 relative z-2 inline-block after:block after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-primary">
        Why Do Recruiters Keep Coming Back to Us ?
      </h2>

      {/* Skills Section */}
      <div className="transition-all duration-1000 z-2 ease-out opacity-100 translate-y-0">
        {/* Minimal Navbar */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-1 flex gap-3">
            {['SOT', 'SOM', 'SOH'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-2 rounded-md text-sm font-semibold transition-all duration-700 ${
                  activeTab === tab
                    ? 'bg-white/80 text-black font-bold shadow-lg'
                    : 'text-white hover:bg-black/30 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Render Active Component */}
        {renderActiveComponent()}

        {/* Hiring Bet Component */}
        <HiringBet userSelection={activeTab}/>
      </div>
    </section>
  );
};

export default WhyPw;