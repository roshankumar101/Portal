import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  User
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  
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
  
  // Get dynamic color based on completion percentage (0-100%)
  const getProgressColor = (percentage) => {
    if (percentage <= 50) {
      // Red to Yellow (0-50%)
      const ratio = percentage / 50;
      const red = 239; // #ef4444 red component
      const green = Math.round(68 + (171 * ratio)); // Transition from 68 to 239
      return `rgb(${red}, ${green}, 68)`;
    } else {
      // Yellow to Green (50-100%)
      const ratio = (percentage - 50) / 50;
      const red = Math.round(239 - (205 * ratio)); // Transition from 239 to 34
      const green = 239; // Keep green high
      const blue = Math.round(68 + (16 * ratio)); // Slight blue increase
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      {/* Horizontal Navbar */}
      <nav className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="w-full px-2 sm:px-3 lg:px-4 sm:py-1 lg:py-2">
          <div className="px-6 py-1 bg-blue-100 rounded-xl">
            <div className="flex justify-between items-center h-22">
              {/* Left Side - Student Details */}
              <div className="flex items-center flex-1">
                {/* Profile Image with Completion Indicator */}
                <div className="flex-shrink-0 relative">
                  {/* SVG Circle Progress */}
                  <svg
                    className="absolute inset-0 transform -rotate-90"
                    width="72"
                    height="72"
                  >
                    {/* Background circle */}
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress circle with dynamic color */}
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      stroke={getProgressColor(completionPercentage)}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 - (completionPercentage / 100) * (2 * Math.PI * 32)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Profile Image */}
                  <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-0">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Student Details */}
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.displayName || user?.email?.split('@')[0] || 'Student Name'}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-gray-900">
                    <div>
                      <span className="font-medium text-gray-500">ID:</span> ENR123456789
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">School:</span> SOT
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">CGPA:</span> 8.5
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Batch Image Only */}
              <div className="flex items-center">
                {/* Batch Image - Placeholder */}
                <div className="hidden md:block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-400">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
                    <circle cx="12" cy="8" r="6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen">

        {children}
      </main>
    </div>
  );
}
