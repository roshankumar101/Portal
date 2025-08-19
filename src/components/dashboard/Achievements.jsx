import React from 'react';
import { Award, Eye } from 'lucide-react';

const Achievements = () => {
  // Achievements & Certifications data
  const achievementsData = [
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
      title: "Winner - National Coding Championship 2024",
      description: "First place winner in the annual national coding competition with over 10,000 participants.",
      hasCertificate: true,
      certificateUrl: "https://example.com/coding-championship"
    },
    {
      id: 5,
      title: "Microsoft Azure Fundamentals (AZ-900)",
      description: "Foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
      hasCertificate: false,
      certificateUrl: null
    },
    {
      id: 6,
      title: "Scrum Master Professional Certificate",
      description: "Agile project management certification covering Scrum methodology, team leadership, and sprint planning.",
      hasCertificate: true,
      certificateUrl: "https://example.com/scrum-cert"
    },
    {
      id: 7,
      title: "Dean's List - Academic Excellence Award",
      description: "Recognition for maintaining exceptional academic performance with GPA above 9.5 for consecutive semesters.",
      hasCertificate: true,
      certificateUrl: "https://example.com/deans-list"
    },
    {
      id: 8,
      title: "Python Institute PCAP Certification",
      description: "Professional certification in Python programming covering advanced concepts and best practices.",
      hasCertificate: false,
      certificateUrl: null
    }
  ];

  // Handle certificate viewing
  const handleViewCertificate = (achievement) => {
    if (achievement.hasCertificate && achievement.certificateUrl) {
      window.open(achievement.certificateUrl, '_blank');
    }
  };

  // Sort achievements to show those with certificates first
  const sortedAchievements = [...achievementsData].sort((a, b) => {
    if (a.hasCertificate && !b.hasCertificate) return -1;
    if (!a.hasCertificate && b.hasCertificate) return 1;
    return 0;
  });

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-blue-200 py-4 px-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-2 bg-blue-100 rounded-full">
          Achievements & Certifications
        </legend>
        
        <div className="my-3">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 pr-2">
            <div className="space-y-3">
              {sortedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex items-center justify-between"
                >
                  {/* Left side - Achievement content */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - View Certificate button - Only show if certificate exists */}
                  {achievement.hasCertificate && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleViewCertificate(achievement)}
                        className="flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
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
