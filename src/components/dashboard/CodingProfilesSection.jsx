import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCodingProfiles } from '../../services/students';
import { ExternalLink, Code, Github, Trophy } from 'lucide-react';

const CodingProfilesSection = () => {
  const { user } = useAuth();
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodingProfiles = async () => {
      if (user?.uid) {
        try {
          const profilesData = await getCodingProfiles(user.uid);
          setCodingProfiles(profilesData);
        } catch (error) {
          console.error('Error fetching coding profiles:', error);
          // Fallback to static data if fetch fails
          setCodingProfiles([
            {
              platform: "LeetCode",
              username: "student_coder",
              profileUrl: "https://leetcode.com/student_coder",
              rating: 1850,
              problemsSolved: 450
            },
            {
              platform: "GitHub",
              username: "student-dev",
              profileUrl: "https://github.com/student-dev",
              rating: null,
              problemsSolved: null
            },
            {
              platform: "CodeForces",
              username: "student_cf",
              profileUrl: "https://codeforces.com/profile/student_cf",
              rating: 1650,
              problemsSolved: 200
            },
            {
              platform: "HackerRank",
              username: "student_hr",
              profileUrl: "https://hackerrank.com/student_hr",
              rating: 2000,
              problemsSolved: 300
            }
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCodingProfiles();
  }, [user]);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'leetcode':
      case 'codeforces':
      case 'hackerrank':
        return <Code className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return 'bg-gray-600';
      case 'leetcode':
        return 'bg-orange-600';
      case 'codeforces':
        return 'bg-blue-600';
      case 'hackerrank':
        return 'bg-green-600';
      default:
        return 'bg-purple-600';
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Coding Profiles
          </legend>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading coding profiles...</div>
          </div>
        </fieldset>
      </div>
    );
  }

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Coding Profiles
        </legend>
        
        <div className="my-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codingProfiles.map((profile, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 ${getPlatformColor(profile.platform)} rounded-lg flex items-center justify-center text-white`}>
                    {getPlatformIcon(profile.platform)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{profile.platform}</h4>
                    <p className="text-sm text-gray-600">@{profile.username}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {profile.rating && (
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">Rating:</span>
                      <span className="text-gray-700 font-medium">{profile.rating}</span>
                    </div>
                  )}
                  {profile.problemsSolved && (
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">Problems Solved:</span>
                      <span className="text-gray-700 font-medium">{profile.problemsSolved}</span>
                    </div>
                  )}
                </div>
                
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default CodingProfilesSection;
