import React, { useEffect, useState } from 'react';
import MongoDbLogo from '../assets/MongoDB-Logo.wine.svg';
import PythonLogo from '../assets/Python_(programming_language)-Logo.wine.svg';
import JavaLogo from '../assets/Java_(programming_language)-Logo.wine.svg';
import JSLogo from '../assets/JavaScript-Logo.png';
import ReactLogo from '../assets/React_(web_framework)-Logo.wine.svg';
import NodeLogo from '../assets/Node.js-Logo.wine.svg';
import SQLLogo from '../assets/Oracle_SQL_Developer-Logo.wine.svg';
import AWSLogo from '../assets/Amazon_Web_Services-Logo.wine.svg';

const ResultsComponent = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);


  const statsData = [
    { id: 'placements', target: 287, suffix: '+', duration: 1000 },
    { id: 'partners', target: 150, suffix: '+', duration: 1000 },
    { id: 'success-rate', target: 98, suffix: '%', duration: 1000 },
    { id: 'students', target: 5000, suffix: '+', duration: 1000 }
  ];

  useEffect(() => {
    const checkScroll = () => {
      const statsBar = document.getElementById('statsBar');
      if (!statsBar) return;

      const rect = statsBar.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight * 0.8) && 
                       (rect.bottom >= window.innerHeight * 0.2);

      if (isVisible && !animationStarted) {
        setAnimationStarted(true);
        setStatsVisible(true);

        // Animate numbers after short delay
        setTimeout(() => {
          statsData.forEach(stat => {
            animateNumber(stat.id, stat.target, stat.suffix, stat.duration);
          });
        }, 500);

        // Show skills section after stats animation
        setTimeout(() => {
          setSkillsVisible(true);
        }, 3000);

        window.removeEventListener('scroll', checkScroll);
      }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => window.removeEventListener('scroll', checkScroll);
  }, [animationStarted]);

  const animateNumber = (elementId, target, suffix, duration) => {
    let start = 0;
    const element = document.getElementById(elementId);
    if (!element) return;

    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        element.textContent = Math.floor(target) + suffix;
      } else {
        element.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  };

  return (
    <section className="py-8 px-2 max-w-6xl mx-auto text-center font-sans">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 relative inline-block after:block after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-[#3949ab]">
        Why Choose PW IOI?
      </h2>
      
      <div id="statsBar" className={`flex justify-around flex-wrap gap-4 my-12 transition-all duration-1000 ease-in-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {statsData.map((stat) => (
          <div className="flex-1 min-w-[200px] bg-white p-6 rounded-xl shadow-md" key={stat.id}>
            <div className="text-4xl font-bold text-[#1a237e] my-2" id={stat.id}>0</div>
            <div className="text-[#3949ab] text-lg capitalize">{stat.id.split('-').join(' ')}</div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className={`transition-all duration-1000 ease-out ${skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Skills Heading */}
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Skills You Can Recruit From Us
        </h3>
        
        {/* Language Logos in Circles */}
        <div className="flex justify-center items-center gap-6 mb-10 flex-wrap">
          <img src={JavaLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={PythonLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={JSLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={ReactLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={NodeLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={SQLLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={MongoDbLogo} className='size-20 bg-black rounded-full animate-bounce'/>
          <img src={AWSLogo} className='size-20 bg-black rounded-full animate-bounce'/>
        </div>
      </div>
    </section>
  );
};

export default ResultsComponent;


// {languages.map((language, index) => (
//             <div 
//               key={index}
//               className={`w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs font-medium shadow-lg transition-all duration-500 ease-out animate-bounce ${
//                 skillsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
//               }`}
//               style={{ 
//                 animationDelay: `${index * 150}ms`
//               }}
//             >
//               {/* Logo will be added here */}
//             </div>
//           ))}