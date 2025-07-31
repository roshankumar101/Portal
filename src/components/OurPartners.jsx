import React, { useState, useEffect, useRef } from 'react';
import MicrosoftLogo from '../assets/Microsoft-Logo.wine.svg';
import GoogleLogo from '../assets/Google-Logo.wine.svg';
import AmazonLogo from '../assets/Amazon_(company)-Logo.wine.svg';
import IntelLogo from '../assets/Intel-Logo.wine.svg';
import IBMLogo from '../assets/IBM-Logo.wine.svg';
import OracleLogo from '../assets/Oracle_Corporation-Logo.wine.svg';
import SalesforceLogo from '../assets/Salesforce.com-Logo.wine.svg';
import AdobeLogo from '../assets/Adobe_Inc.-Logo.wine.svg';
import TeslaLogo from '../assets/Tesla,_Inc.-Logo.wine.svg';
import NetflixLogo from '../assets/Netflix-Logo.wine.svg';

const OurPartners = () => {
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);
  const positionRef = useRef(0); // Persist position across renders
  
  const partners = [
    { id: 1, name: 'Microsoft', logo: MicrosoftLogo, studentsPlaced: 142 },
    { id: 2, name: 'Google', logo: GoogleLogo, studentsPlaced: 98 },
    { id: 3, name: 'Amazon', logo: AmazonLogo, studentsPlaced: 156 },
    { id: 4, name: 'Tesla', logo: TeslaLogo, studentsPlaced: 63 },
    { id: 5, name: 'Netflix', logo: NetflixLogo, studentsPlaced: 42 },
    { id: 6, name: 'Adobe', logo: AdobeLogo, studentsPlaced: 87 },
    { id: 7, name: 'Intel', logo: IntelLogo, studentsPlaced: 105 },
    { id: 8, name: 'IBM', logo: IBMLogo, studentsPlaced: 121 },
    { id: 9, name: 'Oracle', logo: OracleLogo, studentsPlaced: 76 },
    { id: 10, name: 'Salesforce', logo: SalesforceLogo, studentsPlaced: 59 },
  ];

  // Duplicate partners for infinite loop effect
  const duplicatedPartners = [...partners, ...partners];

  useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrameId;
    const speed = 0.6; // pixels per frame (increased by 20%)

    const animate = () => {
      if (!paused && carousel) {
        positionRef.current -= speed;
        if (positionRef.current <= -carousel.scrollWidth / 2) {
          positionRef.current = 0;
        }
        carousel.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [paused]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-blue-900 mb-4 tracking-tight">
          Our Esteemed Hiring Partners
        </h2>
        <p className="text-xl text-gray-600 font-normal">
          Where talent meets opportunity
        </p>
      </div>

      <div className="w-full overflow-hidden relative py-4">
        <div 
          ref={carouselRef}
          className="flex gap-8 w-max will-change-transform"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`}
              className="w-48 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 transition-all duration-300 ease-out hover:transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl group"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="w-4/5 h-4/5 flex items-center justify-center transition-all duration-300 ease-out z-10 group-hover:opacity-0">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale contrast-75 brightness-90 transition-all duration-300 ease-out"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-400  to-gray-600 flex flex-col items-center justify-center p-6 opacity-0 transition-opacity duration-300 ease-out text-white text-center group-hover:opacity-100">
                <h3 className="text-lg font-semibold mb-2">
                  {partner.name}
                </h3>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold leading-none">
                    {partner.studentsPlaced}+
                  </span>
                  <span className="text-sm opacity-90 mt-1">
                    Students Placed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPartners;