import React from 'react';

const HealthcareSkills = () => {
  return (
    <div className="flex gap-16 mt-12 flex-wrap font-sans max-w-6xl mx-auto px-4">
      {/* Clinical Competencies Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-blue-200 text-blue-800 p-6 font-bold text-2xl">
            Clinical & Technical Mastery
          </div>
          <div className="p-6 text-start">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">4 Years of Immersive Medical Training</strong><br />
              Trained by practicing physicians and nurses through high-fidelity simulations and clinical rotations.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Real Patient Care Experience</strong><br />
              From emergency drills to actual clinical placements—delivered care under supervision with 95% patient satisfaction scores.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Healthcare Systems Fluency</strong><br />
              Proficient in EHR systems (Epic, Cerner), medical coding, and healthcare administration protocols.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg underline underline-offset-2 decoration-3 decoration-purple-500">Zero-Cost Clinical Talent</strong><br />
              Hospitals access pre-credentialed graduates without recruitment fees or temp agency markups.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">Clinical Readiness</strong><br />
              Certified in BLS, ACLS, and facility-specific EMR systems before first shift.
            </div>
          </div>
        </div>
      </div>

      {/* Beside Excellence Column */}
      <div className="flex-1 min-w-[320px]">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-6 h-full">
          <div className="bg-purple-200 text-purple-800 p-6 font-bold text-2xl">
            Beside Excellence
          </div>
          <div className="p-6">
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CRISIS POISE IN EMERGENCIES</strong><br />
              <span className="underline decoration-black font-semibold bg-gray-50 px-2 py-1 rounded">40% faster response times</span> during code blues and rapid responses compared to average new hires.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">PATIENT-CENTERED COMMUNICATION</strong><br />
              Certified in health literacy best practices and interpreter collaboration for diverse populations.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">CLINICAL JUDGMENT</strong><br />
              <span className="underline decoration-black font-semibold bg-gray-50 px-2 py-1 rounded">30% fewer safety incidents</span> due to proactive risk identification and mitigation.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">INTERPROFESSIONAL COLLABORATION</strong><br />
              Demonstrated ability to work effectively in care teams across nursing, medicine, and allied health.
            </div>
            <div className="mb-5 pl-6 relative text-gray-600 leading-relaxed">
              <span className="absolute left-0 text-gray-800 font-bold">•</span>
              <strong className="text-gray-800 font-bold text-lg">EVIDENCE-BASED ADAPTABILITY</strong><br />
              <span className="underline decoration-black font-semibold bg-gray-50 px-2 py-1 rounded">50% faster protocol adoption</span> when implementing new clinical guidelines or technology.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareSkills; 