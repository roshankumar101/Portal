import React from 'react';

const ManagementSkills = () => {
  return (
    <div className="flex gap-8 mt-12 flex-wrap font-sans max-w-6xl mx-auto px-8">
      {/* Hard Skills Column - Business Focus */}
      <div className="flex-1 min-w-[320px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-blue-200 text-blue-800 p-6 font-bold text-2xl">
            Strategic Business Competencies
          </div>
          <div className="p-6">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">4 Years of Immersive Business Training</strong><br />
              Mentored by C-suite executives with live corporate simulations and case challenges, not theoretical classroom learning.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Real-World Business Projects</strong><br />
              From startup incubators to Fortune 500 consulting projects—developed market-ready solutions under real deadlines.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Executive-Level Business Acumen</strong><br />
              Mastery of financial modeling, competitive analysis, and stakeholder management at par with MBA graduates.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Zero-Cost Talent Pipeline</strong><br />
              Our corporate partners access pre-vetted business talent without recruitment fees or hidden costs.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Boardroom-Ready Graduates</strong><br />
              Trained on Bloomberg Terminals, Salesforce, and Tableau with certified proficiency in enterprise platforms.
            </div>
          </div>
        </div>
      </div>

      {/* Soft Skills Column - Leadership Focus */}
      <div className="flex-1 min-w-[320px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-purple-200 text-purple-800 p-6 font-bold text-2xl">
            Leadership Differentiators
          </div>
          <div className="p-6">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CRISIS LEADERSHIP</strong><br />
              <em className="text-gray-700 bg-gray-50 px-2 py-1 rounded">83% of graduates successfully lead teams through high-pressure scenarios</em> - from investor negotiations to operational disruptions.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">C-SUITE COMMUNICATION</strong><br />
              Proven ability to distill complex data into executive briefings that drive decision-making at the highest levels.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">ENTREPRENEURIAL MINDSET</strong><br />
              <em className="text-gray-700 bg-gray-50 px-2 py-1 rounded">42% reduce time-to-market</em> by identifying opportunities and mobilizing resources ahead of competitors.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CULTURAL ARCHITECT</strong><br />
              Certified in organizational design with demonstrated ability to transform team dynamics and engagement metrics.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">ADAPTIVE INTELLIGENCE</strong><br />
              <em className="text-gray-700 bg-gray-50 px-2 py-1 rounded">67% faster promotion trajectory</em> due to rapid mastery of emerging business technologies and methodologies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementSkills; 