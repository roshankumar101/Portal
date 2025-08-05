import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * A reusable component for text that animates up from the bottom when scrolled into view
 * 
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Content to animate
 * @param {string} [props.as='div'] - HTML element to render as container
 * @param {'block'|'words'} [props.animationType='block'] - Animate entire block or word-by-word
 * @param {number} [props.fromY=50] - Starting Y position in pixels
 * @param {number} [props.duration=1] - Animation duration in seconds
 * @param {number} [props.delay=0] - Initial delay before animation
 * @param {number} [props.stagger=0.05] - Delay between word animations
 * @param {string} [props.ease='power3.out'] - GSAP easing function
 * @param {string} [props.startTrigger='top 80%'] - ScrollTrigger start position
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Object} [props.style={}] - Additional inline styles
 * @param {Object} [props.rest] - Any other props will be passed to container element
 */
const ScrollRevealText = ({
  children,
  as: Tag = 'div',
  animationType = 'block',
  fromY = 50,
  duration = 1,
  delay = 0,
  stagger = 0.05,
  ease = 'power3.out',
  startTrigger = 'top 80%',
  className = '',
  style = {},
  ...rest
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const elements = animationType === 'words' 
      ? textRef.current.querySelectorAll('.sr-word')
      : textRef.current;

    // Set initial state
    gsap.set(elements, {
      y: fromY,
      opacity: 0,
      willChange: 'transform, opacity'
    });

    // Create animation
    const animation = gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger: animationType === 'words' ? stagger : 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: startTrigger,
        toggleActions: 'play none none none',
        markers: false // Set to true for debugging positions
      }
    });

    // Cleanup
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [children, animationType, fromY, duration, delay, stagger, ease, startTrigger]);

  // Split text into words if needed
  const renderContent = () => {
    if (animationType !== 'words' || typeof children !== 'string') {
      return children;
    }

    return children.split(' ').map((word, i) => (
      <span key={i} className="sr-word" style={{ display: 'inline-block' }}>
        {word + (i < children.split(' ').length - 1 ? ' ' : '')}
      </span>
    ));
  };

  return (
    <Tag 
      ref={containerRef} 
className={`sr-container ${className}`}
      style={{ 
        overflow: 'hidden',
        ...style 
      }}
      {...rest}
    >
      <div ref={textRef} className="sr-content">
        {renderContent()}
      </div>
    </Tag>
  );
};

// Optional: Default props (not needed with ES6 defaults)
ScrollRevealText.defaultProps = {
  as: 'div',
  animationType: 'block',
  fromY: 50,
  duration: 1,
  delay: 0,
  stagger: 0.05,
  ease: 'power3.out',
  startTrigger: 'top 80%',
  className: '',
  style: {}
};

export default ScrollRevealText;