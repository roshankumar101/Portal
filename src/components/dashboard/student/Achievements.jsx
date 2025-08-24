import React, { useState } from 'react';
import { Award, Eye, Edit2, Plus, Trash2, Save, X } from 'lucide-react';

const Achievements = () => {
  // Initial data
  const [achievements, setAchievements] = useState([
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
      hasCertificate: false,
      certificateUrl: null
    },
    {
      id: 5,
      title: "Microsoft Azure Fundamentals (AZ-900)",
      description: "Foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
      hasCertificate: true,
      certificateUrl: "https://example.com/azure-cert"
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
      hasCertificate: false,
      certificateUrl: null
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editedAchievement, setEditedAchievement] = useState({
    title: "",
    description: "",
    hasCertificate: false,
    certificateUrl: ""
  });

  // Split groups
  const certificates = achievements.filter(item => item.hasCertificate);
  const awardsAndAchievements = achievements.filter(item => !item.hasCertificate);

  // Add achievement or certificate
  const addAchievement = (isCertificate = false) => {
    const newAchievement = {
      id: Date.now(),
      title: "",
      description: "",
      hasCertificate: isCertificate,
      certificateUrl: ""
    };
    setAchievements(prev => [...prev, newAchievement]);
    setEditingId(newAchievement.id);
    setEditedAchievement(newAchievement);
  };

  // Start editing
  const startEditing = (achievement) => {
    setEditingId(achievement.id);
    setEditedAchievement({ ...achievement });
  };

  // Save edited achievement
  const saveAchievement = () => {
    setAchievements(prev =>
      prev.map(item => item.id === editingId ? { ...editedAchievement } : item)
    );
    setEditingId(null);
  };

  // Delete achievement
  const deleteAchievement = (id) => {
    setAchievements(prev => prev.filter(item => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // View certificate url
  const handleViewCertificate = (achievement) => {
    if (achievement.hasCertificate && achievement.certificateUrl) {
      window.open(achievement.certificateUrl, "_blank");
    }
  };

  // Render single item (edit or view)
  const renderItem = (achievement) => {
    if (editingId === achievement.id) {
      return (
        <div
          key={achievement.id}
          className="bg-gradient-to-r from-[#f0f8fa] to-[#e6f3f8] rounded-lg p-4"
        >
          <input
            type="text"
            value={editedAchievement.title}
            onChange={e => setEditedAchievement(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Title"
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
          />
          <textarea
            value={editedAchievement.description}
            onChange={e => setEditedAchievement(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded resize-none"
          />
          {achievement.hasCertificate && (
            <input
              type="url"
              value={editedAchievement.certificateUrl}
              onChange={e => setEditedAchievement(prev => ({ ...prev, certificateUrl: e.target.value }))}
              placeholder="Certificate URL"
              className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
            />
          )}
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => deleteAchievement(achievement.id)}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={cancelEditing}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              <X size={14} />
            </button>
            <button
              onClick={saveAchievement}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={achievement.id}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex justify-between items-start"
      >
        <div className="flex items-start space-x-3">
          <Award className="h-5 w-5 text-[#3c80a7] mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-bold text-black mb-2">{achievement.title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{achievement.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          {achievement.hasCertificate && (
            <button
              onClick={() => handleViewCertificate(achievement)}
              className="flex items-center px-2 py-1 rounded border border-[#3c80a7] bg-blue-300 text-black hover:bg-[#3c80a7] hover:text-white text-sm"
            >
              <Eye className="h-4 w-4 mr-0" />
            </button>
          )}
          <button
            onClick={() => startEditing(achievement)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            <Edit2 size={15} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3c80a7;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2f6786;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3c80a7 #f3f4f6;
        }
      `}</style>

      <div className="w-full relative space-y-6">
        {/* Awards & Achievements */}
        <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] py-1 px-6 shadow-lg">
          <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] text-transparent bg-clip-text">
            Awards & Achievements
          </legend>

          <div className="flex justify-end mb-3 mr-[-1%]">
            <button
              onClick={() => addAchievement(false)}
              aria-label="Add new award"
              className="bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>

          <div
            className={`pr-2 space-y-3 pb-6 ${
              awardsAndAchievements.length > 3
                ? "max-h-[300px] overflow-y-auto custom-scrollbar"
                : ""
            }`}
          >
            {awardsAndAchievements.map(renderItem)}
          </div>
        </fieldset>

        {/* Certifications */}
        <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] py-1 px-6 shadow-lg">
          <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] text-transparent bg-clip-text">
            Certifications
          </legend>

          <div className="flex justify-end mb-3 mr-[-1%]">
            <button
              onClick={() => addAchievement(true)}
              aria-label="Add new certificate"
              className="bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>

          <div
            className={`pr-2 space-y-3 pb-6 ${
              certificates.length > 3
                ? "max-h-[300px] overflow-y-auto custom-scrollbar"
                : ""
            }`}
          >
            {certificates.map(renderItem)}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default Achievements;
