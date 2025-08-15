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
  
  // Calculate color based on completion (50-100% mapped to red-yellow-green)
  const getCompletionColor = (percentage) => {
    if (percentage <= 70) {
      // Red to Yellow (50-70%)
      const ratio = (percentage - 50) / 20;
      return `conic-gradient(from 0deg, #ef4444 0%, #f59e0b ${ratio * 100}%, #e5e7eb ${ratio * 100}%, #e5e7eb 100%)`;
    } else {
      // Yellow to Green (70-100%)
      const ratio = (percentage - 70) / 30;
      const yellowToGreen = ratio * 120; // 0 to 120 degrees in HSL
      return `conic-gradient(from 0deg, hsl(${45 + yellowToGreen}, 85%, 55%) 0%, hsl(${45 + yellowToGreen}, 85%, 55%) ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
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
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
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
