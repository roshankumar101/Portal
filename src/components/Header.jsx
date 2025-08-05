import React, { useState, useEffect, useRef } from 'react'
import Login from './Login';
import physicsWallahLogo from '../assets/physics-wallah-seeklogo.png';
import { TypeWriter } from './TextStyle';

function Header({ onLoginOpen }) {
  const openModal = () => {
    if (onLoginOpen) {
      onLoginOpen();
    }
  };

  const scrollToPlacements = (e) => {
    e.preventDefault();
    
    // Try to find the OurPartners section by ID first
    let ourPartnersSection = document.getElementById('our-partners');
    
    // If not found by ID, try the class selector
    if (!ourPartnersSection) {
      ourPartnersSection = document.querySelector('.bg-[#DBD7F9]');
    }
    
    // If still not found, try finding by component structure
    if (!ourPartnersSection) {
      const sections = document.querySelectorAll('div');
      for (let section of sections) {
        if (section.classList.contains('bg-[#DBD7F9]') && section.children.length > 0) {
          ourPartnersSection = section;
          break;
        }
      }
    }
    
    // Scroll to the section if found
    if (ourPartnersSection) {
      ourPartnersSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to approximate position where OurPartners should be
      const scrollPosition = window.innerHeight * 2; // Roughly where OurPartners is
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };


  // Dynamic color based on background
  const [isBgBlack, setIsBgBlack] = useState(false);
  const headerRef = useRef(null);

  // Scroll-based hide/show functionality
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down (after 50px from top)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      // Show header when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    function detectBgColor() {
      const header = headerRef.current;
      if (!header) return;
      
      // Get the header's position
      const rect = header.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.bottom + 5; // Check just below the header
      
      // Find the element at that point
      const el = document.elementFromPoint(x, y);
      if (!el) return;
      
      // Find the section/component that contains this element
      let sectionElement = el;
      while (sectionElement && sectionElement !== document.body) {
        // Check if this is a section with py-20 class (our component sections)
        if (sectionElement.classList.contains('py-20') || 
            sectionElement.tagName === 'SECTION' ||
            sectionElement.classList.contains('bg-gradient-to-br') ||
            sectionElement.classList.contains('bg-black') ||
            sectionElement.classList.contains('bg-[#DBD7F9]') ||
            sectionElement.classList.contains('bg-white')) {
          break;
        }
        sectionElement = sectionElement.parentElement;
      }
      
      // Use the section element if found, otherwise use the original element
      const targetElement = sectionElement || el;
      const style = window.getComputedStyle(targetElement);
      const bg = style.backgroundColor;
      
      // Check if background is white
      let isWhite = false;
      
      if (bg === 'rgb(255, 255, 255)' || bg === 'rgba(255, 255, 255, 1)' || bg === '#ffffff' || bg === 'white') {
        isWhite = true;
      } else if (bg.startsWith('rgb')) {
        // Parse RGB values
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          // Check if it's white or very light
          isWhite = (r > 240 && g > 240 && b > 240);
        }
      }
      
      // Also check for Titan White gradient
      const backgroundImage = style.backgroundImage;
      if (backgroundImage && backgroundImage !== 'none') {
        if (backgroundImage.includes('#DBD7F9') || backgroundImage.includes('rgb(219, 215, 249)')) {
          isWhite = true;
        }
      }
      
      // Check for specific background classes including Banner component
      if (targetElement.classList.contains('bg-[#DBD7F9]') || 
          targetElement.classList.contains('bg-white') ||
          (targetElement.classList.contains('bg-gradient-to-br') && 
           targetElement.classList.contains('from-gray-50'))) {
        isWhite = true;
      }
      
      // Additional check for Banner component structure
      // Look for Banner component by checking if we're over the photo containers
      const bannerElement = document.querySelector('[class*="h-screen"]');
      if (bannerElement && bannerElement.contains(targetElement)) {
        isWhite = true;
      }
      
      // Set the state: if background is white, use black content, else use white content
      setIsBgBlack(!isWhite);
    }

    // Initial detection
    detectBgColor();
    
    // Set up event listeners
    window.addEventListener('scroll', detectBgColor);
    window.addEventListener('resize', detectBgColor);
    
    return () => {
      window.removeEventListener('scroll', detectBgColor);
      window.removeEventListener('resize', detectBgColor);
    };
  }, []);


  return (
    <div 
      className={`w-full fixed top-1 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`} 
      ref={headerRef}
    >
        <div className='backdrop-blur-xs flex justify-between items-center px-12 py-2 mx-3 rounded-xl bg-transparent border border-white/20 shadow-sm'>
            <div className='flex items-center gap-5'>
                <a href="#">
                                    <img 
                  src={physicsWallahLogo} 
                  alt="Physics Wallah Logo" 
                  className="h-10 w-auto transition-all duration-300" 
                />
                </a>
            </div>
            
            {/* Navigation Menu with Login Button */}
            <nav className="flex items-center space-x-12">
                <a 
                  href="#calendar" 
                  className="text-base hidden md:flex font-medium transition-all duration-300 hover:scale-105 relative group text-black hover:text-gray-600"
                >
                  Calendar
                  <div className="absolute hidden md:flex bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-out group-hover:w-full"></div>
                </a>
                <a 
                  href="#placements" 
                  onClick={scrollToPlacements}
                  className="text-base hidden md:flex font-medium transition-all duration-300 hover:scale-105 relative group text-black hover:text-gray-600"
                >
                  Placements
                  <div className="absolute hidden md:flex bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-out group-hover:w-full"></div>
                </a>
                <a 
                  href="#contact" 
                  className="text-base hidden md:flex text-nowrap font-medium transition-all duration-300 hover:scale-105 relative group text-black hover:text-gray-600"
                >
                  Contact Us
                  <div className="absolute hidden md:flex bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-out group-hover:w-full"></div>
                </a>
                
                <Login 
                  onClick={openModal} 
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-gray-800 shadow-lg" 
                />
            </nav>
        </div>
    </div>
  )
}

export default Header;