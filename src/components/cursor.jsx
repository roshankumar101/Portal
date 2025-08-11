// SmartCursor.jsx
import React, { useState, useEffect, useRef } from 'react';

const SmartCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [outlinePos, setOutlinePos] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth outline following animation
  useEffect(() => {
    const animate = () => {
      setOutlinePos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.1,
        y: prev.y + (mousePos.y - prev.y) * 0.1
      }));
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [mousePos]);

  useEffect(() => {
    const handleElementHover = (e) => {
      const target = e.target;
      
     
      if (target.matches('a, button:not(:disabled), [role="button"], .clickable')) {
        if (!target.disabled) {
          setCursorState('hover-link');
        }
      }
  
      else if (target.matches('button:disabled, .disabled, [disabled]')) {
        setCursorState('disabled');
      }
  
      else if (target.matches('p, span, div, h1, h2, h3, h4, h5, h6, .text-content')) {
        const computedStyle = window.getComputedStyle(target);
        if (computedStyle.userSelect !== 'none' && !target.closest('a, button, [role="button"], .clickable')) {
          setCursorState('text');
        }
      }
    };

    const handleElementLeave = () => {
      setCursorState('default');
    };

    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    return () => {
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, []);


  const getCursorClasses = () => {
    let classes = 'fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300';
    if (!isVisible) classes += ' opacity-0';
    return classes;
  };

  const getDotClasses = () => {
    let classes = 'absolute w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100';
    
    if (isPressed && cursorState !== 'disabled') {
      classes += ' w-1.5 h-1.5 bg-red-500';
    } else {
      switch (cursorState) {
        case 'hover-link':
          classes = classes.replace('w-2 h-2 bg-white', 'w-3 h-3 bg-green-400');
          break;
        case 'text':
          classes = classes.replace('w-2 h-2 bg-white rounded-full', 'w-0.5 h-5 bg-blue-500 rounded-sm');
          break;
        case 'disabled':
          classes = classes.replace('bg-white', 'bg-gray-500');
          break;
      }
    }
    
    return classes;
  };

  const getOutlineClasses = () => {
    let classes = 'absolute w-10 h-10 border-2 border-white border-opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300';
    
    if (isPressed && cursorState !== 'disabled') {
      classes = classes.replace('w-10 h-10', 'w-7 h-7').replace('border-white border-opacity-30', 'border-red-500 border-opacity-70');
    } else {
      switch (cursorState) {
        case 'hover-link':
          classes = classes.replace('w-10 h-10', 'w-15 h-15').replace('border-white border-opacity-30', 'border-green-400 border-opacity-50');
          break;
        case 'text':
          classes = classes.replace('w-10 h-10 rounded-full', 'w-5 h-7 rounded-sm').replace('border-white border-opacity-30', 'border-blue-500 border-opacity-50');
          break;
        case 'disabled':
          classes = classes.replace('border-white border-opacity-30', 'border-gray-500 border-opacity-30');
          break;
      }
    }
    
    return classes;
  };

  return (
    <div ref={cursorRef} className={getCursorClasses()}>
      <div
        ref={dotRef}
        className={getDotClasses()}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`
        }}
      />
      <div
        ref={outlineRef}
        className={getOutlineClasses()}
        style={{
          left: `${outlinePos.x}px`,
          top: `${outlinePos.y}px`
        }}
      />
    </div>
  );
};

export default SmartCursor;
