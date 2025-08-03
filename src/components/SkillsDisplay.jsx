import React from 'react';

const SkillsDisplay = () => {
  return (
    <div className="flex gap-8 mt-12 flex-wrap font-sans max-w-6xl mx-auto px-8">
      {/* Hard Skills Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-blue-200 text-blue-800 p-6 font-bold text-2xl">
            Hard Skills They've Mastered
          </div>
          <div className="p-6">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">4 Years of Immersive Training</strong><br />
              Mentored by industry experts with real-world simulations, not just textbook learning.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Worked on Real-Time Projects</strong><br />
              From hackathons to live deployments—they've built, failed, and delivered under pressure.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Business Acumen Included</strong><br />
              Students gain exposure to business strategy, finance, and stakeholder management beyond core skills.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg underline decoration-2 decoration-yellow-400">No-Cost Hiring Policy</strong><br />
              Zero placement fees—because talent should be <span className='block text-gray-700 underline font-semibold decoration-blue-800'> accessible, not transactional.</span> 
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Play-and-Plug Resources</strong><br />
              Trained on industry tools so they're productive from Day 1, not just "familiar."
            </div>
          </div>
        </div>
      </div>

      {/* Soft Skills Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-purple-200 text-purple-800 p-6 font-bold text-2xl">
            What Employers Really Remember
          </div>
          <div className="p-6">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CRISIS POISE UNDER PRESSURE</strong><br />
              Maintain clarity of thought and communication during system outages- reducing resolution time by an average of 40%.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CROSS-FUNCTIONAL DIPLOMACY</strong><br />
              Capacity to translate complex technical concepts for executives, clients, and team members - eliminating communication gaps that delay projects.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">SOLUTION-ORIENTED OWNERSHIP</strong><br />
              Pattern of identifying risks proactively and presenting validated solutions rather than just problems.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">TEAM AMPLIFICATION</strong><br />
              Elevate team performance through knowledge sharing, emotional intelligence, and collaborative problem-solving.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">ADAPTIVE LEARNING AGILITY</strong><br />
              Master new methodologies and tools 50% faster than industry benchmarks, future-proofing your talent investment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDisplay; 