import React, { useState, useEffect, useRef } from 'react';

const PlacementTimeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathRef = useRef(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 1,
      title: "Profile Completion",
      description: "Upload your resume, academic details, and skills to create your placement profile",
      side: "right",
      yPos: 84 // Reduced from 120
    },
    {
      id: 2,
      title: "Application Review",
      description: "Our team verifies your details within 3-5 business days",
      side: "left", 
      yPos: 224 // Reduced from 320
    },
    {
      id: 3,
      title: "Test Scheduled",
      description: "Aptitude, technical, and coding tests based on company requirements",
      side: "right",
      yPos: 364 // Reduced from 520
    },
    {
      id: 4, 
      title: "Technical Interview",
      description: "Live problem-solving session with company engineers (DSA, system design, projects)",
      side: "left",
      yPos: 504 // Reduced from 720
    },
    {
      id: 5,
      title: "HR Discussion",
      description: "Culture fit, salary expectations, and role clarification",
      side: "right",
      yPos: 644 // Reduced from 920
    },
    {
      id: 6,
      title: "Final Evaluation",
      description: "Hiring committee makes the final decision",
      side: "left",
      yPos: 784 // Reduced from 1120
    },
    {
      id: 7,
      title: "Offer Received!",
      description: "Congratulations! Check your email for the offer letter",
      side: "right",
      yPos: 924 // Reduced from 1320
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = 1050; // Reduced from 1500
      const progress = Math.min(scrollY / (docHeight - windowHeight), 1);
      setScrollProgress(progress);
      
      // Determine which steps are completed
      const completed = steps.filter(step => {
        const stepProgress = (step.yPos - 84) / 840; // Adjusted calculation
        return progress >= stepProgress;
      }).map(step => step.id);
      
      setCompletedSteps(completed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate path drawing
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length - (length * scrollProgress);
    }
  }, [scrollProgress]);

  const getResumePosition = () => {
    const y = 84 + (scrollProgress * 840); // Adjusted calculation
    return { x: 400, y };
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Your Placement Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-normal max-w-2xl mx-auto">
            Follow the timeline to understand your placement process
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full h-auto overflow-visible relative">
            <svg 
              className="w-full h-auto"
              viewBox="0 0 900 1050" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Animated path with drawing effect */}
              <path 
                ref={pathRef}
                d="M450 84 
                   Q 600 154, 450 224 
                   T 450 364 
                   T 450 504 
                   T 450 644 
                   T 450 784 
                   T 450 924"
                className="stroke-blue-900"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Steps with wider cards */}
              {steps.map(step => (
                <g key={step.id}>
                  <circle 
                    cx="450" 
                    cy={step.yPos} 
                    r="12" 
                    className={`fill-blue-900 ${completedSteps.includes(step.id) ? 'ring-2 ring-green-500' : ''}`}
                  />
                  <foreignObject 
                    x={step.side === 'left' ? 50 : 550} 
                    y={step.yPos - 75}
                    width="350" 
                    height="180"
                    className="overflow-visible"
                  >
                    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${completedSteps.includes(step.id) ? 'border-green-500' : 'border-blue-900'} h-full box-border transition-all duration-300`}>
                      <h3 className="text-blue-900 text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
                    </div>
                  </foreignObject>
                </g>
              ))}

              
              
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementTimeline;