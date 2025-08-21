import React from 'react';
import { Award, Eye } from 'lucide-react';

const Achievements = () => {
  // Certifications data
  const certificationsData = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect - Associate",
      description: "Comprehensive certification covering AWS core services, architecture best practices, and cloud security fundamentals.",
      hasCertificate: true,
      certificateUrl: "https://example.com/aws-cert"
    },
    {
      id: 2,
      title: "React Professional Developer Certification",
      description: "Advanced certification in React.js development including hooks, context, performance optimization, and testing.",
      hasCertificate: true,
      certificateUrl: "https://example.com/react-cert"
    },
    {
      id: 3,
      title: "Google Analytics Individual Qualification (IQ)",
      description: "Certification demonstrating proficiency in Google Analytics including data analysis and reporting.",
      hasCertificate: false,
      certificateUrl: null
    },
    {
      id: 4,
      title: "Microsoft Azure Fundamentals (AZ-900)",
      description: "Foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
      hasCertificate: false,
      certificateUrl: null
    },
    {
      id: 5,
      title: "Scrum Master Professional Certificate",
      description: "Agile project management certification covering Scrum methodology, team leadership, and sprint planning.",
      hasCertificate: true,
      certificateUrl: "https://example.com/scrum-cert"
    },
    {
      id: 6,
      title: "Python Institute PCAP Certification",
      description: "Professional certification in Python programming covering advanced concepts and best practices.",
      hasCertificate: false,
      certificateUrl: null
    }
  ];

  // Handle certificate viewing
  const handleViewCertificate = (certification) => {
    if (certification.hasCertificate && certification.certificateUrl) {
      window.open(certification.certificateUrl, '_blank');
    }
  };

  // Sort certifications to show those with certificates first
  const sortedCertifications = [...certificationsData].sort((a, b) => {
    if (a.hasCertificate && !b.hasCertificate) return -1;
    if (!a.hasCertificate && b.hasCertificate) return 1;
    return 0;
  });

  return (
    <div className="w-full relative font-inter">
      {/* Embedded custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; /* Tailwind slate-100 */
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3c80a7;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2d5f7a;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3c80a7 #f1f5f9;
        }
      `}</style>

      <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6 transition-all duration-200 shadow-md">
        <legend className="text-xl font-bold text-white px-3 bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] rounded-full">
          Certifications
        </legend>

        <div className="my-3">
          {/* Scrollable container */}
          <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {sortedCertifications.map((certification) => (
                <div
                  key={certification.id}
                  className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex items-center justify-between border border-slate-200"
                >
                  {/* Left side - Certification content */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-[#3c80a7] mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          {certification.title}
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {certification.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - View Certificate button (only if certificate exists) */}
                  {certification.hasCertificate && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleViewCertificate(certification)}
                        className="flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-[#3c80a7] text-white hover:bg-[#2d5f7a] hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3c80a7] focus:ring-opacity-50 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Certificate
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Achievements;