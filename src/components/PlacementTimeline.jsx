import React, { useState, useEffect, useRef } from 'react';
import { Check, Clock, FileText, Users, Award, Briefcase, MessageSquare } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    title: 'Application Submitted',
    description: 'Your application has been received and is under review',
    icon: <FileText className="w-6 h-6" />,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Initial Screening',
    description: 'HR team reviews your profile and qualifications',
    icon: <Clock className="w-6 h-6" />,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Technical Assessment',
    description: 'Complete coding challenges and technical evaluations',
    icon: <Award className="w-6 h-6" />,
    status: 'current'
  },
  {
    id: 4,
    title: 'Team Interview',
    description: 'Meet with potential team members and discuss collaboration',
    icon: <Users className="w-6 h-6" />,
    status: 'upcoming'
  },
  {
    id: 5,
    title: 'Final Interview',
    description: 'Discussion with leadership team about role expectations',
    icon: <MessageSquare className="w-6 h-6" />,
    status: 'upcoming'
  },
  {
    id: 6,
    title: 'Offer Extended',
    description: 'Congratulations! Join our amazing team',
    icon: <Briefcase className="w-6 h-6" />,
    status: 'upcoming'
  }
];

const PlacementTimeline = ({ autoplay = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [lineSegments, setLineSegments] = useState([]);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const centerY = windowHeight / 2;

      let newActiveStep = 0;
      let newLineSegments = [];

      stepRefs.current.forEach((stepRef, index) => {
        if (!stepRef) return;

        const stepRect = stepRef.getBoundingClientRect();
        const stepCenterY = stepRect.top + stepRect.height / 2;
        const distanceFromCenter = Math.abs(stepCenterY - centerY);

        // Determine active step based on proximity to center
        if (stepCenterY <= centerY + 100) {
          newActiveStep = Math.max(newActiveStep, index);
        }

        // Calculate line segment progress for each step
        if (index < timelineData.length - 1) {
          const nextStepRef = stepRefs.current[index + 1];
          if (nextStepRef) {
            const nextStepRect = nextStepRef.getBoundingClientRect();
            const currentStepBottom = stepRect.top + stepRect.height / 2;
            const nextStepTop = nextStepRect.top + nextStepRect.height / 2;
            const segmentHeight = nextStepTop - currentStepBottom;

            let progress = 0;
            
            if (currentStepBottom <= centerY) {
              const scrolledDistance = centerY - currentStepBottom;
              progress = Math.min(1, Math.max(0, scrolledDistance / segmentHeight));
            }

            newLineSegments[index] = progress;
          }
        }
      });

      setActiveStep(newActiveStep);
      setLineSegments(newLineSegments);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStepOpacity = (index) => {
    const distance = Math.abs(index - activeStep);
    if (distance === 0) return 1;
    if (distance === 1) return 0.8;
    if (distance === 2) return 0.6;
    return 0.4;
  };

  const getStepScale = (index) => {
    return index <= activeStep ? 1 : 0.9;
  };

  const getIconColor = (status, index) => {
    const isActive = index <= activeStep;
    
    if (!isActive) return 'text-gray-400 dark:text-gray-600';
    
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'current':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-purple-600 dark:text-purple-400';
    }
  };

  const getBorderColor = (status, index) => {
    const isActive = index <= activeStep;
    
    if (!isActive) return 'border-gray-300 dark:border-gray-700';
    
    switch (status) {
      case 'completed':
        return 'border-green-500 dark:border-green-400';
      case 'current':
        return 'border-blue-500 dark:border-blue-400';
      default:
        return 'border-purple-500 dark:border-purple-400';
    }
  };

  const getBackgroundColor = (status, index) => {
    const isActive = index <= activeStep;
    
    if (!isActive) return 'bg-gray-100 dark:bg-gray-800';
    
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'current':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-purple-50 dark:bg-purple-900/20';
    }
  };

  return (
    <div ref={timelineRef} className="relative max-w-4xl mx-auto pt-15 pb-20">

      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Placement <span className="text-blue-900">Timeline</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your journey from application to offer - step by step
        </p>
      </div>
      {/* Timeline Steps */}
      <div className="space-y-24">
        {timelineData.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => (stepRefs.current[index] = el)}
            className="relative flex items-start"
            style={{
              opacity: getStepOpacity(index),
              transform: `scale(${getStepScale(index)})`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Connecting Line Segment */}
            {index < timelineData.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-24 bg-gray-200 dark:bg-gray-700">
                <div 
                  className="w-full bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300 ease-out origin-top"
                  style={{
                    height: `${(lineSegments[index] || 0) * 100}%`,
                    boxShadow: lineSegments[index] > 0 ? '0 0 12px rgba(59, 130, 246, 0.6)' : 'none',
                    opacity: lineSegments[index] || 0
                  }}
                />
              </div>
            )}

            {/* Step Circle */}
            <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500 ${getBorderColor(step.status, index)} ${getBackgroundColor(step.status, index)}`}>
              {step.status === 'completed' && index <= activeStep ? (
                <div className={`transition-all duration-300 ${getIconColor(step.status, index)}`}>
                  <Check className="w-8 h-8" />
                </div>
              ) : (
                <div className={`transition-all duration-300 ${getIconColor(step.status, index)}`}>
                  {step.icon}
                </div>
              )}
              
              {/* Pulse animation for active step */}
              {index === activeStep && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20" />
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse" />
                </>
              )}

              {/* Glow effect for completed steps */}
              {index <= activeStep && (
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-500"
                  style={{
                    boxShadow: `0 0 20px ${
                      step.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' :
                      step.status === 'current' ? 'rgba(59, 130, 246, 0.3)' :
                      'rgba(168, 85, 247, 0.3)'
                    }`
                  }}
                />
              )}
            </div>

            {/* Step Content */}
            <div className="ml-8 flex-1">
              <div className={`p-6 rounded-xl shadow-lg transition-all duration-500 ${
                index <= activeStep 
                  ? 'bg-[#FFEEC0]  shadow-xl border border-gray-200 dark:border-gray-700' 
                  : 'bg-gray-50 dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800'
              }`}>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  index <= activeStep 
                    ? 'text-gray-900' 
                    : 'text-gray-600'
                }`}>
                  {step.title}
                </h3>
                <p className={`transition-colors duration-300 ${
                  index <= activeStep 
                    ? 'text-gray-600' 
                    : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
                
                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    index <= activeStep ? (
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : step.status === 'current'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    ) : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {index <= activeStep ? (
                      step.status === 'completed' ? 'Completed' :
                      step.status === 'current' ? 'In Progress' : 'Active'
                    ) : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default PlacementTimeline;
