import React, { useState, useEffect, useRef } from 'react';

import MicrosoftLogo from '../assets/Microsoft-Logo.wine.svg';
import GoogleLogo from '../assets/Google-Logo.wine.svg';
import AmazonLogo from '../assets/Amazon_(company)-Logo.wine.svg';
import TeslaLogo from '../assets/Tesla,_Inc.-Logo.wine.svg';
import NetflixLogo from '../assets/Netflix-Logo.wine.svg';
import AdobeLogo from '../assets/Adobe_Inc.-Logo.wine.svg';
import IntelLogo from '../assets/Intel-Logo.wine.svg';
import IBMLogo from '../assets/IBM-Logo.wine.svg';
import OracleLogo from '../assets/Oracle_Corporation-Logo.wine.svg';
import SalesforceLogo from '../assets/Salesforce.com-Logo.wine.svg';


const ORIGINAL_PARTNERS = [
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

// Example: Add "Labs" to company names for the 2nd row.
const CHANGE_ROW2_NAMES = (arr) =>
  arr.map((p) => ({ ...p, name: `${p.name} Labs` }));

const CARD_WIDTH = 192; // px (Tailwind w-48)
const GAP_WIDTH = 24;   // px (Tailwind gap-6)
const PARTNERS_PER_SET = ORIGINAL_PARTNERS.length;
const DUPLICATION = 3;  // Duplicate enough sets for seamless loop

const OurPartners = () => {
  const [paused, setPaused] = useState(false);
  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);
  const positionRef1 = useRef(0);
  const positionRef2 = useRef(0);

  // Duplicated arrays for seamless animation
  const duplicatedRow1 = Array(DUPLICATION).fill(ORIGINAL_PARTNERS).flat();
  const row2Partners = CHANGE_ROW2_NAMES([...ORIGINAL_PARTNERS].reverse());
  const duplicatedRow2 = Array(DUPLICATION).fill(row2Partners).flat();

  // Calculate the width of one full set of cards + gaps
  const cardWidthWithGap = CARD_WIDTH + GAP_WIDTH;
  const oneSetWidth = PARTNERS_PER_SET * cardWidthWithGap;

  useEffect(() => {
    const carousel1 = carouselRef1.current;
    const carousel2 = carouselRef2.current;
    let animationFrameId;
    const speed = 0.6;

    // Always initialize starting positions cleanly
    if (carousel1) {
      positionRef1.current = 0;
    }
    if (carousel2) {
      positionRef2.current = -oneSetWidth; // Start from negative full set width for continuous right->left
    }

    const animate = () => {
      if (!paused) {
        if (carousel1) {
          positionRef1.current -= speed;
          if (positionRef1.current <= -oneSetWidth) {
            positionRef1.current += oneSetWidth;
          }
          carousel1.style.transform = `translateX(${positionRef1.current}px)`;
        }
        if (carousel2) {
          positionRef2.current += speed;
          if (positionRef2.current >= 0) {
            positionRef2.current -= oneSetWidth;
          }
          carousel2.style.transform = `translateX(${positionRef2.current}px)`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
    // oneSetWidth as a dependency if dynamic; here it's constant so omitted
  }, [paused]);

  return (
    <section className="pt-15 pb-10 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
      {/* ... heading */}
      <div className="w-full overflow-hidden relative py-4">
        <div className="space-y-6">
          {/* Row 1 */}
          <div
            ref={carouselRef1}
            className="flex gap-6 w-max will-change-transform"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {duplicatedRow1.map((partner, index) => (
              <div
                key={`1-${partner.id}-${index}`}
                className="w-48 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="w-4/5 h-4/5 flex items-center justify-center transition-all duration-300 ease-out z-10 group-hover:opacity-0">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain contrast-75 brightness-90 transition-all duration-300 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-400 to-gray-600 flex flex-col items-center justify-center p-6 opacity-0 transition-opacity duration-300 ease-out text-white text-center group-hover:opacity-100">
                  <h3 className="text-lg font-semibold mb-2">
                    {partner.name}
                  </h3>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold leading-none">
                      {partner.studentsPlaced}+
                    </span>
                    <span className="text-sm opacity-90 mt-1">Students Placed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div
            ref={carouselRef2}
            className="flex gap-6 w-max will-change-transform"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {duplicatedRow2.map((partner, index) => (
              <div
                key={`2-${partner.id}-${index}`}
                className="w-48 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="w-4/5 h-4/5 flex items-center justify-center transition-all duration-300 ease-out z-10 group-hover:opacity-0">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain contrast-75 brightness-90 transition-all duration-300 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-400 to-gray-600 flex flex-col items-center justify-center p-6 opacity-0 transition-opacity duration-300 ease-out text-white text-center group-hover:opacity-100">
                  <h3 className="text-lg font-semibold mb-2">
                    {partner.name}
                  </h3>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold leading-none">
                      {partner.studentsPlaced}+
                    </span>
                    <span className="text-sm opacity-90 mt-1">Students Placed</span>
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

export default OurPartners;