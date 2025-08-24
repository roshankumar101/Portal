import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import SOTbanner from '../../../assets/SOTbanner.jpg';
import PWIOILOGO from '../../../assets/brand_logo.webp'

import { 
  User,
  SquarePen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // School-specific header texts
  const getSchoolHeaderText = (school) => {
    const schoolTexts = {
      'SOT': 'Building with Code. Empowering with Innovation.',
      'SOM': 'Leading with Vision. Strategizing with Innovation.',
      'SOH': 'Healing with Science. Caring with Innovation.'
    };

    // Default to SOT if school is not specified or not found
    return schoolTexts[school] || schoolTexts['SOT'];
  };

  // Get student's school
  const getStudentSchool = () => {
    return user?.school || 'SOM';
  };

  // Calculate profile completion percentage (50-100%)
  const calculateProfileCompletion = () => {
    if (!user) return 50;

    let completion = 50; // Base completion
    const maxCompletion = 100;
    const stepValue = 10;

    // Check various profile fields
    if (user.displayName) completion += stepValue;
    if (user.email) completion += stepValue;
    if (user.photoURL) completion += stepValue;
    // Add more checks based on your user model

    return Math.min(completion, maxCompletion);
  };

  const completionPercentage = calculateProfileCompletion();

  // dynamic color 
  const getProgressColor = (percentage) => {
    if (percentage < 40) {
      return '#ef4444'; 
    } else if (percentage < 70) {
      return '#eab308'; 
    } else {
      return '#22c55e'; 
    }
  };

  // Profile image sizing 
  const profileConfig = {
    imageSize: 20, // Profile image size (w-19 h-19)
    svgSize: 80,   // SVG container size (imageSize * 4)
    circleRadius: 36, // Circle radius (imageSize * 1.8)
    strokeWidth: 4,   // Circle stroke width
    iconSize: 8       // User icon size (imageSize * 0.42)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      {/* Horizontal Navbar */}
      <nav className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="w-full px-2 py-1">
          <div
            className="px-6 py-1 rounded-xl bg-gradient-to-br from-white to-blue-300 border-2 border-gray-400"
          >
            <div className="flex justify-between items-center h-23 gap-2 relative">
              {/* Left Side - Student Details */}
              <div className="flex items-center flex-1">
                {/* Profile Image with Completion Indicator */}
                <div className="flex-shrink-0 relative">
                  {/* SVG Circle Progress */}
                  <svg
                    className="absolute inset-0 transform -rotate-90"
                    width={profileConfig.svgSize}
                    height={profileConfig.svgSize}
                  >
                    {/* Background circle */}
                    <circle
                      cx={profileConfig.svgSize / 2}
                      cy={profileConfig.svgSize / 2}
                      r={profileConfig.circleRadius}
                      stroke="#E5E7EB"
                      strokeWidth={profileConfig.strokeWidth}
                      fill="none"
                    />
                    {/* Progress circle with dynamic color */}
                    <circle
                      cx={profileConfig.svgSize / 2}
                      cy={profileConfig.svgSize / 2}
                      r={profileConfig.circleRadius}
                      stroke={getProgressColor(completionPercentage)}
                      strokeWidth={profileConfig.strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * profileConfig.circleRadius}
                      strokeDashoffset={2 * Math.PI * profileConfig.circleRadius - (completionPercentage / 100) * (2 * Math.PI * profileConfig.circleRadius)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Profile Image */}
                  <div
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      width: `${profileConfig.imageSize * 0.25}rem`,
                      height: `${profileConfig.imageSize * 0.25}rem`
                    }}
                  >
                    <User
                      className="text-white"
                      style={{
                        width: `${profileConfig.iconSize * 0.25}rem`,
                        height: `${profileConfig.iconSize * 0.25}rem`
                      }}
                    />
                  </div>
                </div>

                {/* Student Details */}
                <div className="ml-4 space-y-0">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-black flex items-center">
                      {user?.displayName || 'Esha Bajaj'}
                      

                      <button
                        onClick={() => {
                          navigate('/student?tab=editProfile');
                          // Force a small delay to ensure navigation completes
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('editProfileClicked'));
                          }, 100);
                        }}
                        className="p-1 text-black relative hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                        aria-label="Edit profile"
                      >
                        <SquarePen className="h-3 w-3 absolute start-0" />
                      </button>

                      {/* Verified icon with blue color and spacing */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-6 w-6 text-blue-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Verified Icon"
                        role="img"
                      >
                        <path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48z" />
                      </svg>

                      
                    </h2>
                  </div>

                  <div className='ml-2 -mt-0 mb-1 italic'>
                    <p>Aspiring Software Engineer</p>
                  </div>
                  <div className="ml-2 mt-2 flex flex-col sm:flex-row sm:space-x-6 text-sm text-black">
                    <div>
                      <span className="font-medium text-gray-700 ">ID:</span> ENR123456789
                    </div>
                    {/* <div>
                      <span className="font-medium text-gray-700">School:</span> SOT
                    </div> */}
                    <div>
                      <span className="font-medium text-gray-700">CGPA:</span> 8.5
                    </div>
                  </div>
                </div>
              </div>

              <div className='absolute top-1 start-1/2 -translate-x-1/5 w-fit flex flex-col items-center gap-2'>
                <img src={PWIOILOGO} alt="" className='w-30' />
                <h1 className='text-nowrap text-3xl text-black-300 opacity-90 font-caveat'>{getSchoolHeaderText(getStudentSchool())}</h1>
              </div>

              {/* Right Side - Batch Image Only */}
              <div className="flex items-center">
                {/* Batch Image - Placeholder */}
                <div className="hidden md:block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-400">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                    <circle cx="12" cy="8" r="6" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
        {children}
      </main>
    </div>
  );
}