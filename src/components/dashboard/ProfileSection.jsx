import React from 'react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getProgressColor = (percentage) => {
  if (percentage < 40) return '#ef4444';   // red
  else if (percentage < 70) return '#eab308'; // yellow
  else return '#22c55e'; // green
};

const getSchoolTheme = (school) => {
  switch (school) {
    case 'healthcare':
      return {
        profileBg: 'from-indigo-400 to-purple-700',
        iconColor: 'text-indigo-600'
      };
    case 'management':
      return {
        profileBg: 'from-yellow-400 to-orange-700',
        iconColor: 'text-yellow-600'
      };
    case 'technology':
    default:
      return {
        profileBg: 'from-cyan-400 to-blue-700',
        iconColor: 'text-cyan-600'
      };
  }
};

export default function ProfileSection({
  photoURL,
  studentName,
  tagline,
  quote, // dynamic quote input from "What describes you"
  completionPercentage,
  onEditClick,
  school = 'technology', // School theme for styling
}) {
  const navigate = useNavigate();
  const progressColor = getProgressColor(completionPercentage);
  const circleRadius = 32; // radius for progress ring
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference - (completionPercentage / 100) * circumference;

  const schoolTheme = getSchoolTheme(school);

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      // Default navigation to edit profile tab
      navigate('/dashboard?tab=editProfile');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Profile with completion ring and pencil edit overlap */}
      <div className="relative flex flex-col items-center">
        {/* SVG progress ring */}
        <div className="relative w-20 h-20 flex justify-center items-center">
          <svg
            width={circleRadius * 2 + strokeWidth * 2}
            height={circleRadius * 2 + strokeWidth * 2}
            className="absolute left-0 top-0 z-0"
          >
            <circle
              cx={circleRadius + strokeWidth}
              cy={circleRadius + strokeWidth}
              r={circleRadius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
              className="opacity-50"
            />
            <circle
              cx={circleRadius + strokeWidth}
              cy={circleRadius + strokeWidth}
              r={circleRadius}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out transform -rotate-90"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))'
              }}
            />
          </svg>

          {/* Profile picture centered within the progress ring */}
          <div
            className={`w-16 h-16 rounded-full overflow-hidden shadow-lg relative z-10
              bg-gradient-to-br ${schoolTheme.profileBg} flex justify-center items-center`}
          >
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-5 h-5 text-white flex items-center justify-center bg-gray-400 rounded-full "style={{
                bottom: '-5px',
                right: '-5px'
              }}>
        
                <span className="text-lg font-bold select-none">?</span>
              </div>
            )}
          </div>

          {/* Edit button - overlaps bottom right */}
          <button
            onClick={handleEditClick}
            type="button"
            className="absolute w-8 h-8 flex items-center justify-center
              hover:scale-110 transition-transform duration-200 z-30 shadow-lg"
            style={{
              bottom: '-8px',
              right: '-8px'
            }}
            title="Edit Profile"
          >
            <Pencil className={`w-4 h-4 ${schoolTheme.iconColor}`} />
          </button>
        </div>
      </div>

      {/* Student info panel */}
      <div className="flex flex-col justify-center max-w-xs space-y-1">
        <div className="text-lg font-semibold text-black truncate">{studentName || 'Student Name'}</div>
        {tagline && (
          <div className="text-sm italic text-black opacity-75 truncate">{tagline}</div>
        )}
        {quote && (
          <div className="text-sm text-black whitespace-normal">
            {quote}
          </div>
        )}
      </div>
    </div>
  );
}
