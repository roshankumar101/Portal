import React, { useState, useEffect } from 'react';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Manager",
      company: "Google",
      quote: "We've hired multiple IOI graduates, and they consistently stand out for their problem-solving skills and quick learning ability. The most recent hire integrated into our team within weeks and was contributing to production code immediately. The technical foundation from IOI is truly exceptional.",
      image: "https://placehold.co/80x80",
      alt: "Professional headshot of Sarah Johnson, Google HR Manager with short blonde hair and wearing business attire"
    },
    {
      name: "David Chen",
      role: "Senior Engineer",
      company: "Microsoft",
      quote: "As someone who works closely with IOI alumni, I'm continually impressed by their depth of understanding. They don't just know how to code - they understand systems thinking at a level that takes most engineers years to develop. Our team's productivity increased noticeably after we hired two IOI graduates.",
      image: "https://placehold.co/80x80",
      alt: "Smiling portrait of David Chen, Senior Engineer at Microsoft wearing glasses and a collared shirt"
    },
    {
      name: "Emily Rodriguez",
      role: "Talent Acquisition",
      company: "Facebook",
      quote: "IOI graduates go through our interview process with flying colors. Their algorithmic thinking and problem-structuring skills are outstanding compared to candidates from other programs. We've developed a special fast-track interview process specifically for IOI alumni because their technical abilities are so consistently high-quality.",
      image: "https://placehold.co/80x80",
      alt: "Portrait of Emily Rodriguez, Talent Acquisition at Facebook with curly brown hair and professional attire"
    },
    {
      name: "Michael Thompson",
      role: "CTO",
      company: "Startup Inc",
      quote: "Hiring an IOI graduate was a game-changer for our engineering team. Within three months, she had rearchitected our core service, reducing latency by 40% while mentoring more experienced engineers. The quality of IOI's training produces engineers who can hit the ground running at an extremely high level.",
      image: "https://placehold.co/80x80",
      alt: "Professional headshot of Michael Thompson, CTO at Startup Inc with grey hair and a friendly smile"
    }
  ];

  useEffect(() => {
    const updateSlideWidth = () => {
      if (typeof window !== 'undefined') {
        const slideElement = document.querySelector('.testimonial-slide');
        if (slideElement) {
          setSlideWidth(slideElement.clientWidth);
        }
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);

    return () => {
      window.removeEventListener('resize', updateSlideWidth);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const trackStyle = {
    transform: `translateX(-${currentIndex * slideWidth}px)`,
    transition: 'transform 0.3s ease-in-out'
  };

  const StarRating = () => (
    <div className="flex mt-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-['Inter']">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">The Word of Mouth</h2>
            <p className="text-slate-600 mt-2"></p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={prevSlide}
              className="carousel-control text-slate-600 hover:text-slate-800 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="carousel-control text-slate-600 hover:text-slate-800 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out" style={trackStyle}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4 testimonial-slide">
                <div className="bg-white rounded-2xl p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] transition-all hover:translate-y-[-5px] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.alt} 
                      className="w-20 h-20 rounded-full object-cover" 
                    />
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-slate-800">{testimonial.name}</h3>
                      <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full mt-1 inline-block">
                        {testimonial.role}, {testimonial.company}
                      </span>
                      <StarRating />
                    </div>
                  </div>
                  <p className="mt-6 text-slate-600 leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;