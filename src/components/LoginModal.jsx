import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap';

function LoginModal({ isOpen, onClose }) {
  const [role, setRole] = useState('Student');
  const [animKey, setAnimKey] = useState('Student');
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.killTweensOf(modalRef.current); // Kill any previous tweens
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,scale' }
      );
    }
    // Dynamically load the Lottie web component script if not already present
    if (!document.querySelector('script[src*="dotlottie-wc"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, [isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRoleChange = (newRole) => {
    if (role !== newRole) {
      setAnimKey('');
      setTimeout(() => {
        setRole(newRole);
        setAnimKey(newRole);
      }, 100); // short delay for fade out
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.10)' }} onClick={handleBackdropClick}>
      <div ref={modalRef}
        className="bg-transparent backdrop-blur-lg p-0 rounded-lg shadow-2xl w-full max-w-2xl h-[28rem] relative overflow-hidden flex flex-row items-center border border-gray-300"
        style={{
          background: 'linear-gradient(135deg, #DBD7F9 60%, rgba(245,245,245,0.85) 60%, rgba(245,245,245,0.85) 100%)',
          boxShadow: '0 8px 48px 8px rgba(80, 80, 120, 0.25), 0 1.5px 8px 0 rgba(80,80,120,0.10)'
        }}
        onClick={e => e.stopPropagation()}>
        {/* Lottie Animation Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full bg-transparent ">
          <dotlottie-wc src="https://lottie.host/a22e1a8b-a8e9-4fe4-893c-f5ba49c2a4b6/KHjSf9NMKB.lottie" speed="1" style={{ width: '220px', height: '220px' }} mode="forward" loop="" autoplay=""></dotlottie-wc>
        </div>
        {/* Login Form Right Side */}
        <div className="flex-1 flex flex-col justify-center h-full relative bg-transparent">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black text-gray-300 hover:text-white text-xs font-semibold px-2 py-1 border-2 border-gray-400 rounded z-20">Esc</button>
          {/* Remove the border from the right side by deleting the border class below */}
          <div className="absolute inset-0 pointer-events-none rounded-lg border-purple-400" style={{ boxShadow: '0 0 8px 2px rgba(128,0,255,0.3)' }}></div>
          <div className="relative z-10 px-8 py-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Login</h2>
            <div className="flex justify-center gap-2 mb-6">
              {['Student', 'Recruiter', 'Admin'].map(opt => (
                <button
                  key={opt}
                  className={`px-3 py-1 rounded font-semibold text-xs uppercase border transition-all duration-200
                    ${role === opt ? 'bg-black text-white scale-110 shadow-lg' : 'bg-white bg-opacity-20 text-black border-gray-400 hover:scale-105 hover:shadow-md'}`}
                  onClick={() => setRole(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div
              key={animKey}
              className="transition-all duration-300 ease-in-out opacity-100 scale-100 animate-fadeIn"
              style={{ animation: 'fadeInScale 0.3s' }}
            >
              <form className="flex flex-col gap-4">
                <input type="email" placeholder="Email" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                <input type="password" placeholder="Password" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                {role !== 'Student' && (
                  <input type="password" placeholder="General Password" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                )}
                <button type="submit" className="bg-black text-white py-2 rounded font-semibold">Login</button>
                <div className="text-right mt-1">
                  <button type="button" className="text-sm text-blue-600 font-semibold hover:underline focus:outline-none">Forgot password?</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.97); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
      </div>
    </div>
  )
}

export default LoginModal;