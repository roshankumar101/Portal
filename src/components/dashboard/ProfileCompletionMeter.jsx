import React from 'react';
import { User } from 'lucide-react';

const ProfileCompletionMeter = ({ studentData, size = 80 }) => {
  // Calculate completion percentage
  const calculateCompletion = (data) => {
    if (!data) return 0;
    
    const fields = [
      'name',
      'enrollmentId', // Updated field name
      'department',
      'skills',
      'resumeUrl',
      'leetcodeProfile',
      'email'
    ];
    
    let completedFields = 0;
    
    fields.forEach(field => {
      if (field === 'skills') {
        if (data[field] && Array.isArray(data[field]) && data[field].length > 0) {
          completedFields++;
        }
      } else if (field === 'enrollmentId') {
        // Check both new and old field names
        if ((data[field] && data[field].trim() !== '') || (data.rollNo && data.rollNo.trim() !== '')) {
          completedFields++;
        }
      } else {
        if (data[field] && data[field].trim() !== '') {
          completedFields++;
        }
      }
    });
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion(studentData);
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Color based on completion percentage - Blue theme
  const getColor = (percentage) => {
    if (percentage >= 80) return '#059669'; // Emerald
    if (percentage >= 60) return '#3B82F6'; // Blue
    if (percentage >= 40) return '#6366F1'; // Indigo
    return '#9CA3AF'; // Gray
  };

  const color = getColor(completionPercentage);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* SVG Circle Progress */}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Profile picture or user icon */}
      <div 
        className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg"
        style={{ 
          width: size - 16, 
          height: size - 16 
        }}
      >
        <User size={size * 0.4} />
      </div>
      
      {/* Completion percentage badge */}
      <div 
        className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-lg border-2 border-blue-200 px-2 py-1"
        style={{ fontSize: size * 0.12 }}
      >
        <span className="font-bold text-blue-700">{completionPercentage}%</span>
      </div>
    </div>
  );
};

export default ProfileCompletionMeter;
