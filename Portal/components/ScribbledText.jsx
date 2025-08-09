import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ScribbledText = ({
  text = "Hello",
  fontSize = "3rem",
  color = "#333",
  lineColor = "#333",
  lineHeight = "3px",
  lineOffset = "-5px",
  duration = 0.3,
  delay = 0,
  stagger = 0.1,
  className = "",
  style = {},
  children,
}) => {
  const containerRef = useRef(null);
  const charsRef = useRef([]);
  const [mounted, setMounted] = useState(false);
  
  // Use children prop if provided, otherwise use text prop
  const displayText = children || text;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    // Clear previous refs
    charsRef.current = [];
    
    // Split text into characters and create spans
    const textString = typeof displayText === 'string' ? displayText : displayText.toString();
    const charElements = textString.split('').map((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.color = color;
      // Apply font family from style prop if provided
      if (style.fontFamily) {
        span.style.fontFamily = style.fontFamily;
      }
      span.textContent = char === ' ' ? '\u00A0' : char;
      charsRef.current[i] = span;
      return span;
    });

    // Clear container and add character spans
    containerRef.current.innerHTML = '';
    charElements.forEach(span => {
      containerRef.current.appendChild(span);
    });

    // Set initial state for animation
    gsap.set(charsRef.current, { opacity: 0, y: 20 });
    
    // Create animation timeline
    const tl = gsap.timeline({ delay });
    
    // Animate characters appearing
    tl.to(charsRef.current, {
      opacity: 1,
      y: 0,
      duration,
      stagger: {
        each: stagger,
        from: "start",
        ease: "power2.out"
      },
    });
    
    // Animate the underline effect for each character
    tl.to(charsRef.current, {
      duration: duration * 1.5,
      stagger: {
        each: stagger,
        from: "start",
        ease: "power2.out"
      },
      onStart: function() {
        // Add scribble line animation to each character
        charsRef.current.forEach((char, index) => {
          gsap.to(char, {
            "--line-scale": 1,
            duration: duration * 1.5,
            delay: index * stagger,
            ease: "power2.out"
          });
        });
      }
    }, "-=" + (duration * 0.5));

    return () => {
      tl.kill();
    };
  }, [displayText, duration, delay, stagger, color, lineColor, mounted]);

  if (!mounted) {
    return (
      <div 
        className={`scribbled-text-container ${className}`}
        style={{
          fontSize,
          '--line-color': lineColor,
          '--line-height': lineHeight,
          '--line-offset': lineOffset,
          '--line-scale': 0,
          ...style,
        }}
      >
        {displayText}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`scribbled-text-container ${className}`}
      style={{
        fontSize,
        '--line-color': lineColor,
        '--line-height': lineHeight,
        '--line-offset': lineOffset,
        '--line-scale': 0,
        ...style,
      }}
    />
  );
};

export default ScribbledText;