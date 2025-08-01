import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import photoPdf1 from '../assets/photo1_page-0001.jpg';
import photoPdf2 from '../assets/photo2_page-0001.jpg';


gsap.registerPlugin(TextPlugin);

const Banner = () => {
  const textRef = useRef(null);
  const scrambleRef = useRef(null);

  useEffect(() => {
    
    gsap.fromTo(textRef.current, 
      { 
        opacity: 0, 
        y: 50
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power2.out"
      }
    );

    // Scramble animation for "Talent. Not payouts"
    const scrambleText = () => {
      const text = "Talent. Not payouts";
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()";
      let currentText = text;
      let iterations = 0;
      
      const interval = setInterval(() => {
        currentText = currentText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        
        if (scrambleRef.current) {
          scrambleRef.current.textContent = currentText;
        }
        
        if (iterations >= text.length) {
          clearInterval(interval);
          setTimeout(() => {
            if (scrambleRef.current) {
              scrambleRef.current.textContent = text;
            }
            setTimeout(scrambleText, 3000);
          }, 1000);
        }
        
        iterations += 1/3;
      }, 50);
    };
    
    scrambleText();


  }, []);

  return (
    <div className="w-full flex flex-row justify-around items-center px-1 pt-6 pb-0 bg-white">
      {/* First Photo - Left Side */}
      <div className="h-screen hidden ps-10 sm:flex items-center">
        <div className="relative w-fit h-4/5 bg-white rounded-lg overflow-hidden">
          <img
            src={photoPdf1}
            className="w-full h-full bg-cover bg-center"
          />
        </div>
      </div>
      
      {/* Center Text - Positioned forward */}
      <div className="inset-0 mt-24 mb-10 ms:mb-0 sm:mt-0 flex flex-col justify-center items-center pointer-events-none">
        <div className="text-center max-w-3xl px-8">
          <h1 
            ref={textRef}
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-800 via-gray-600 to-black bg-clip-text text-transparent"
            
          >
            Launch Your Career
            with Industry-Ready Skills
            & Guaranteed Opportunities
          </h1>
          <p 
            ref={scrambleRef}
            className="text-2xl md:text-3xl font-semibold text-black scrambled-text"
          >
            Talent. Not payouts
          </p>
        </div>
      </div>
      
      {/* Second Photo - Right Side */}
      <div className="h-screen hidden pr-10 sm:flex items-center">
        <div className="relative w-fit h-4/5 bg-white rounded-lg overflow-hidden">
          <img
            src={photoPdf2}
            className="w-full h-full bg-cover bg-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
