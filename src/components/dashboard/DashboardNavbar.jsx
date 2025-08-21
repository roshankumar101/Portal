import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileSection from './ProfileSection';

// Remember to include these fonts in your app HTML <head>:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Oswald:wght@200..700&display=swap" rel="stylesheet">

const schoolThemes = {
  technology: {
    title: "SCHOOL OF TECHNOLOGY",
    subtitle: "PW INSTITUTE OF INNOVATION",
    tagline: "CODE. CREATE. SCALE.",
    bgGradient: "bg-gradient-to-r from-cyan-700 to-blue-800",
    svgStrokeColor: "#3fd7ff",
  },
  healthcare: {
    title: "SCHOOL OF HEALTHCARE",
    subtitle: "PW INSTITUTE OF INNOVATION",
    tagline: "PRECISION. COMPASSION. IMPACT.",
    bgGradient: "bg-gradient-to-r from-indigo-700 to-purple-800",
    svgStrokeColor: "#8e9cf2",
  },
  management: {
    title: "SCHOOL OF MANAGEMENT",
    subtitle: "PW INSTITUTE OF INNOVATION",
    tagline: "LEARN. LEAD. THRIVE.",
    bgGradient: "bg-gradient-to-r from-yellow-600 to-yellow-800",
    svgStrokeColor: "#ffd900",
  },
};

export default function DashboardNavbar({
  cgpa = "8.5",
  badge = "Ace Performer",
  quote,
  school = null, // Allow passing specific school
}) {
  const { user } = useAuth();
  
  // Determine student's school - prioritize passed school, then user data, fallback to technology
  let schoolKey = 'healthcare';
  if (school) {
    schoolKey = school.toLowerCase();
  } else if (user?.school) {
    schoolKey = user.school.toLowerCase();
  }
  
  // Map school names to keys
  const schoolMapping = {
    'soh': 'healthcare',
    'som': 'management', 
    'sot': 'technology',
    'school of healthcare': 'healthcare',
    'school of management': 'management',
    'school of technology': 'technology'
  };
  
  const finalSchoolKey = schoolMapping[schoolKey] || 'technology';
  const theme = schoolThemes[finalSchoolKey] || schoolThemes.technology;

  // Profile completion %
  const calculateProfileCompletion = () => {
    if (!user) return 50;
    let completion = 50;
    if (user.displayName) completion += 10;
    if (user.email) completion += 10;
    if (user.photoURL) completion += 10;
    return Math.min(completion, 100);
  };
  const completion = calculateProfileCompletion();

  // SVG decorations for each school
  const SvgDecoration = () => {
    const color = theme.svgStrokeColor;
    switch (finalSchoolKey) {
      case 'technology':
        return (
          <svg
            className="absolute inset-y-0 right-0 w-36 opacity-20"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M10 90 L40 70 L90 80 L150 40" stroke={color} strokeWidth="2" />
            <circle cx="50" cy="60" r="8" stroke={color} strokeWidth="2" fill="none" />
            <rect x="120" y="45" width="25" height="25" rx="5" stroke={color} strokeWidth="2" fill="none" />
          </svg>
        );
      case 'healthcare':
        return (
          <svg
            className="absolute inset-y-0 right-0 w-36 opacity-20"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M15 80 L70 60 L150 90" stroke={color} strokeWidth="3" />
            <ellipse cx="50" cy="60" rx="20" ry="10" stroke={color} strokeWidth="2" fill="none" />
          </svg>
        );
      case 'management':
        return (
          <svg
            className="absolute inset-y-0 right-0 w-36 opacity-15"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M10 50 Q60 80, 110 60 T190 50" stroke={color} strokeWidth="4" />
            <rect x="130" y="40" width="40" height="30" rx="6" stroke={color} strokeWidth="2" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile tab
    window.location.href = '/dashboard?tab=editProfile';
  };

  return (
    <nav className="sticky top-0 z-50 shadow-sm">
      <div
        className={`${theme.bgGradient} rounded-xl shadow-md overflow-hidden p-3 flex items-center h-24 text-white relative`}
      >
        <SvgDecoration />
        <div className="flex items-center w-full h-full z-10">
          {/* Left: Profile Section Component */}
          <ProfileSection
            photoURL={user?.photoURL}
            studentName={user?.displayName}
            tagline={user?.tagline} // Pass the tagline from user data
            quote={user?.quote} // Pass the quote from user data for banner display
            completionPercentage={completion}
            onEditClick={handleEditProfile}
            school={finalSchoolKey} // Pass the school theme to ProfileSection
          />

          {/* Center: Tagline - black text with 45% opacity */}
          <div className="flex-grow text-center">
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                color: "rgba(0,0,0,0.45)",
                fontSize: "1.125rem",
                fontStyle: "italic",
                userSelect: "none",
              }}
            >
              {quote || theme.tagline}
            </div>
          </div>

          {/* Right: Title and subtitle with new fonts */}
          <div className="flex flex-col items-end flex-shrink-0 ml-6 select-none">
            <span
              style={{
                fontFamily: "'DM Serif Text', serif",
                color: "#000000",
                fontWeight: "600",
                fontSize: "1.8rem",
                letterSpacing: "0.01em",
                userSelect: "none",
              }}
            >
              {theme.title}
            </span>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: "300",
                fontSize: "0.85rem",
                color: "#111111",
                letterSpacing: "0.15em",
                marginTop: "0.25rem",
                userSelect: "none",
              }}
            >
              {theme.subtitle}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
