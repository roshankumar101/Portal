import React, { useState, useEffect } from 'react';

const PlacementTimeline = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [nearBottomSteps, setNearBottomSteps] = useState([]);
  const [lineProgress, setLineProgress] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Profile Completion",
      description: "Upload your resume, academic details, and skills to create your placement profile",
      side: "right",
    },
    {
      id: 2,
      title: "Application Review",
      description: "Our team verifies your details within 3-5 business days",
      side: "left", 
    },
    {
      id: 3,
      title: "Test Scheduled",
      description: "Aptitude, technical, and coding tests based on company requirements",
      side: "right",
    },
    {
      id: 4, 
      title: "Technical Interview",
      description: "Live problem-solving session with company engineers (DSA, system design, projects)",
      side: "left",
    },
    {
      id: 5,
      title: "HR Discussion",
      description: "Culture fit, salary expectations, and role clarification",
      side: "right",
    },
    {
      id: 6,
      title: "Final Evaluation",
      description: "Hiring committee makes the final decision",
      side: "left",
    },
    {
      id: 7,
      title: "Offer Received!",
      description: "Congratulations! Check your email for the offer letter",
      side: "right",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const viewportHeight = window.innerHeight;
      const stepElements = document.querySelectorAll('.timeline-step');
      const timelineContainer = document.querySelector('.timeline-container');
      
      const newVisibleSteps = [];
      const newNearBottomSteps = [];
      
      // Calculate line progress
      if (timelineContainer) {
        const containerRect = timelineContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerHeight = containerRect.height;
        const scrollStart = containerTop - viewportHeight * 0.5;
        const scrollEnd = containerTop + containerHeight - viewportHeight * 0.5;
        
        let progress = 0;
        if (window.scrollY > scrollStart) {
          progress = Math.min(100, ((window.scrollY - scrollStart) / (scrollEnd - scrollStart)) * 100);
        }
        setLineProgress(progress);
      }
      
      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = rect.bottom + window.scrollY;
        
        // Check if step is visible (for fade-in effect)
        if (scrollPosition > elementTop + 100) {
          newVisibleSteps.push(index + 1);
        }
        
        // Check if step is within 30% from bottom of viewport
        if (elementBottom > scrollPosition - (0.3 * viewportHeight) && 
            elementTop < scrollPosition) {
          newNearBottomSteps.push(index + 1);
        }
      });
      
      setVisibleSteps(newVisibleSteps);
      setNearBottomSteps(newNearBottomSteps);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-24" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a5a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Your Placement Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-normal max-w-2xl mx-auto">
            Follow the timeline to understand your placement process
          </p>
        </div>
        
        <div className="relative timeline-container">
          {/* Vertical line background */}
          <div className="absolute left-1/2 h-full w-1 bg-gray-600 transform -translate-x-1/2"></div>
          
          {/* Progressive fill line */}
          <div 
            className="absolute left-1/2 w-2 bg-blue-600 blur-xs transform -translate-x-1/2 transition-all duration-300 ease-out"
            style={{
              height: `${lineProgress}%`,
              top: 0
            }}
          ></div>
          
          {/* Timeline steps and gap */}
          <div className="space-y-12">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`timeline-step relative flex ${step.side === 'left' ? 'justify-start' : 'justify-end'}`}
              >
                {/* Step dot */}
                <div className={`absolute top-1/2 h-6 w-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 flex items-center justify-center transition-all duration-500 ${
                  visibleSteps.includes(step.id) ? 'bg-green-500 ring-2 ring-green-300' : 'bg-gray-600'
                }`}>
                  {visibleSteps.includes(step.id) && (
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                  )}
                </div>
                
                {/* Card dimensions */}
                <div 
                  className={`w-full md:w-1/2 p-1 ${step.side === 'left' ? 'pr-8 md:pr-16' : 'pl-8 md:pl-16'}`}
                >
                  <div 
                    className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ease-out h-44 flex flex-col justify-center ${visibleSteps.includes(step.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${
                      visibleSteps.includes(step.id) ? 'border-2 border-green-500' : ''
                    } ${
                      nearBottomSteps.includes(step.id) ? 'border border-purple-500' : ''
                    }`}
                  >
                    <h3 className="text-blue-900 text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementTimeline;