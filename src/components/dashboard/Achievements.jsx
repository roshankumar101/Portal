import React, { useState, useEffect } from 'react';
import { Award, Eye, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAchievements, addAchievement, updateAchievement, deleteAchievement } from '../../services/achievements';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    hasCertificate: false,
    certificateUrl: ''
  });

  // Default achievements data for fallback
  const defaultAchievementsData = [
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

  useEffect(() => {
    const fetchAchievements = async () => {
      if (user?.uid) {
        try {
          const userAchievements = await getAchievements(user.uid);
          // If no user achievements, use default data
          setAchievements(userAchievements.length > 0 ? userAchievements : defaultAchievementsData);
        } catch (error) {
          console.error('Error fetching achievements:', error);
          setAchievements(defaultAchievementsData);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAchievements();
  }, [user]);

  const handleAddAchievement = async () => {
    if (newAchievement.title.trim() && user?.uid) {
      try {
        const achievementId = await addAchievement(user.uid, newAchievement);
        const newAchievementWithId = { ...newAchievement, id: achievementId };
        setAchievements([...achievements, newAchievementWithId]);
        setNewAchievement({ title: '', description: '', hasCertificate: false, certificateUrl: '' });
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding achievement:', error);
        alert('Failed to add achievement. Please try again.');
      }
    }
  };

  const handleDeleteAchievement = async (index) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        // Only delete from Firestore if it has a string ID (user-created)
        if (typeof achievements[index].id === 'string') {
          await deleteAchievement(achievements[index].id);
        }
        const updatedAchievements = achievements.filter((_, i) => i !== index);
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Failed to delete achievement. Please try again.');
      }
    }
  };

  // Handle certificate viewing
  const handleViewCertificate = (achievement) => {
    if (achievement.hasCertificate && achievement.certificateUrl) {
      window.open(achievement.certificateUrl, '_blank');
    }
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Achievements & Certifications
        </legend>
        
        <div className="my-3">
          {/* Add Achievement Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </button>
          </div>

          {/* Scrollable container with fixed height for 5 items */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 pr-2">
            <div className="space-y-3">
              {/* Add New Achievement Form */}
              {isAdding && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Add New Achievement</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Title</label>
                      <input
                        type="text"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter achievement title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Describe your achievement"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasCertificate"
                        checked={newAchievement.hasCertificate}
                        onChange={(e) => setNewAchievement({...newAchievement, hasCertificate: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="hasCertificate" className="text-sm font-medium text-gray-700">
                        Has Certificate
                      </label>
                    </div>
                    
                    {newAchievement.hasCertificate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate URL</label>
                        <input
                          type="url"
                          value={newAchievement.certificateUrl}
                          onChange={(e) => setNewAchievement({...newAchievement, certificateUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/certificate"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddAchievement}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Achievement
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {achievements.map((achievement, index) => (
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

                  {/* Right side - Action buttons */}
                  <div className="flex-shrink-0 flex space-x-2">
                    {achievement.hasCertificate && achievement.certificateUrl && (
                      <button
                        onClick={() => handleViewCertificate(achievement)}
                        className="flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-105 focus:ring-blue-500 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Certificate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAchievement(index)}
                      className="flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-red-600 text-white hover:bg-red-700 hover:shadow-md transform hover:scale-105 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
