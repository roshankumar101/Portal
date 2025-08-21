import React from 'react';
import { Trophy, Star, Medal, Crown } from 'lucide-react';

const Awards = () => {
  // Awards & Achievements data
  const awardsData = [
    {
      id: 1,
      title: "Winner - National Coding Championship 2024",
      description: "First place winner in the annual national coding competition with over 10,000 participants.",
      category: "Competition",
      date: "2024",
      icon: Trophy,
      iconColor: "text-yellow-500"
    },
    {
      id: 2,
      title: "Dean's List - Academic Excellence Award",
      description: "Recognition for maintaining exceptional academic performance with GPA above 9.5 for consecutive semesters.",
      category: "Academic",
      date: "2023-2024",
      icon: Crown,
      iconColor: "text-purple-500"
    },
    {
      id: 3,
      title: "Best Project Award - Final Year Project",
      description: "Received the best project award for innovative final year project in software engineering.",
      category: "Project",
      date: "2024",
      icon: Star,
      iconColor: "text-blue-500"
    },
    {
      id: 4,
      title: "Hackathon Winner - Tech Innovation Challenge",
      description: "Won first place in the university hackathon for developing an innovative solution to a real-world problem.",
      category: "Innovation",
      date: "2023",
      icon: Medal,
      iconColor: "text-green-500"
    },
    {
      id: 5,
      title: "Student Leadership Award",
      description: "Recognized for outstanding leadership and contribution to student community and campus activities.",
      category: "Leadership",
      date: "2023",
      icon: Crown,
      iconColor: "text-purple-500"
    },
    {
      id: 6,
      title: "Research Paper Publication",
      description: "Successfully published research paper in international conference on emerging technologies.",
      category: "Research",
      date: "2024",
      icon: Star,
      iconColor: "text-blue-500"
    }
  ];

  // Get icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      Trophy: Trophy,
      Star: Star,
      Medal: Medal,
      Crown: Crown
    };
    return iconMap[iconName] || Star;
  };

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
          Awards & Achievements
        </legend>

        <div className="my-3">
          {/* Scrollable container */}
          <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {awardsData.map((award) => {
                const IconComponent = getIconComponent(award.icon.name);
                return (
                  <div
                    key={award.id}
                    className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-slate-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${award.iconColor} mt-1 flex-shrink-0`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-slate-900">
                            {award.title}
                          </h4>
                          <span className="text-xs font-medium text-[#3c80a7] bg-[#3c80a7]/10 px-2 py-1 rounded-full">
                            {award.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed mb-2">
                          {award.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">
                            {award.date}
                          </span>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 0 ? 'bg-[#3c80a7]' : 'bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Awards;
