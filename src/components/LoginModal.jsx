import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, defaultRole = 'Student' }) {
  const { login, registerWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(defaultRole);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [animKey, setAnimKey] = useState('Student');
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Update role when defaultRole changes and modal opens
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  useEffect(() => {
    if (isOpen && !shouldRender) {
      // Modal is opening - render it first
      setShouldRender(true);
      setIsAnimating(true);
    } else if (!isOpen && shouldRender && !isAnimating) {
      // Modal is closing - start closing animation
      setIsAnimating(true);
    }
  }, [isOpen, shouldRender, isAnimating]);

  useEffect(() => {
    if (shouldRender && modalRef.current && backdropRef.current) {
      if (isOpen) {
        // Opening animation
        gsap.killTweensOf([modalRef.current, backdropRef.current]);
        
        // Set initial state immediately
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { opacity: 0, scale: 0.8, y: 50 });
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          // Animate backdrop
          gsap.to(backdropRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
          
          // Animate modal
          gsap.to(modalRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: 0.1,
            onComplete: () => {
              setIsAnimating(false);
            }
          });
        }, 10);
      } else {
        // Closing animation
        gsap.killTweensOf([modalRef.current, backdropRef.current]);
        
        // Animate modal out
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          duration: 0.4,
          ease: 'power2.in'
        });
        
        // Animate backdrop out
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          delay: 0.1,
          onComplete: () => {
            setShouldRender(false);
            setIsAnimating(false);
          }
        });
      }
    }
    
    // Dynamically load the Lottie web component script if not already present
    if (!document.querySelector('script[src*="dotlottie-wc"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, [shouldRender, isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [shouldRender]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isAnimating) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isAnimating) {
      onClose();
    }
  };

  // Don't render anything if modal should not be rendered
  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.10)',
        opacity: 0 // Start invisible to prevent flash
      }} 
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-transparent backdrop-blur-lg p-0 rounded-lg shadow-2xl w-full max-w-2xl h-[28rem] relative overflow-hidden flex flex-row items-center border border-gray-300"
        style={{
          background: 'linear-gradient(135deg, #FFDE83 60%, rgba(245,245,245,0.85) 60%, rgba(245,245,245,0.85) 100%)',
          boxShadow: '0 8px 48px 8px rgba(80, 80, 120, 0.25), 0 1.5px 8px 0 rgba(80,80,120,0.10)',
          opacity: 0, // Start invisible to prevent flash
          transform: 'scale(0.8) translateY(50px)' // Start in initial animation state
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Lottie Animation Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full bg-transparent ">
          <dotlottie-wc src="https://lottie.host/a22e1a8b-a8e9-4fe4-893c-f5ba49c2a4b6/KHjSf9NMKB.lottie" speed="1" style={{ width: '220px', height: '220px' }} mode="forward" loop="" autoplay=""></dotlottie-wc>
        </div>
        {/* Login Form Right Side */}
        <div className="flex-1 flex flex-col justify-center h-full relative bg-transparent">
          <button onClick={handleClose} className="absolute top-4 right-4 bg-gray-200 text-black hover:text-black/40 text-sm font-bold px-4 py-0.5 border-2 rounded z-20 transition-colors duration-200">X</button>
          {/* Remove the border from the right side by deleting the border class below */}
          <div className="absolute inset-0 pointer-events-none rounded-lg" style={{ boxShadow: '0 0 8px 2px rgba(128,0,255,0.3)' }}></div>
          <div className="relative z-10 px-8 py-4">
            <h2 className="text-2xl font-bold mb-2 text-center text-black">
              {mode === 'login' && 'Sign in'}
              {mode === 'register' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
            </h2>
            <div className="flex justify-center gap-2 mb-4">
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
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              {mode !== 'forgot' && (
                <form className="flex flex-col gap-3" onSubmit={async (e)=>{
                  e.preventDefault();
                  setError('');
                  setBusy(true);
                  try {
                    let uid = null;
                    if (mode === 'login') {
                      const u = await login(email, password);
                      uid = u?.uid;
                    } else {
                      // Register. For Admin, require manual creation in Firestore after registration
                      const selected = role.toLowerCase();
                      const assignRole = selected === 'admin' ? 'student' : selected;
                      const u = await registerWithEmail({ email, password, role: assignRole });
                      uid = u?.uid;
                      if (selected === 'admin') {
                        // Inform user that admin role must be granted by existing admin in Firestore
                        alert('Account created. Ask an existing admin to set your role to admin in Firestore.');
                      }
                    }
                    // Role-based redirect
                    if (uid) {
                      try {
                        const snap = await getDoc(doc(db, 'users', uid));
                        const userRole = snap.exists() ? snap.data()?.role : null;
                        if (userRole === 'student') navigate('/student', { replace: true });
                        else if (userRole === 'recruiter') navigate('/recruiter', { replace: true });
                        else if (userRole === 'admin') navigate('/admin', { replace: true });
                        else navigate('/', { replace: true });
                      } catch {
                        navigate('/', { replace: true });
                      }
                    }
                    onClose();
                  } catch (err) {
                    setError(err?.message || 'Action failed');
                  } finally { setBusy(false); }
                }}>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                  <button disabled={busy} type="submit" className="bg-black text-white py-2 rounded font-semibold disabled:opacity-60">{busy ? 'Please wait...' : (mode==='login' ? 'Sign in' : 'Create account')}</button>
                </form>
              )}
              {mode === 'forgot' && (
                <form className="flex flex-col gap-3" onSubmit={async (e)=>{
                  e.preventDefault();
                  setError('');
                  setBusy(true);
                  try {
                    await resetPassword(email);
                    alert('Reset link sent to your email.');
                    onClose();
                  } catch (err) {
                    setError(err?.message || 'Failed to send reset link');
                  } finally { setBusy(false); }
                }}>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="border rounded px-3 py-2 bg-white bg-opacity-70 text-black placeholder-gray-700 focus:outline-none" />
                  <button disabled={busy} type="submit" className="bg-black text-white py-2 rounded font-semibold disabled:opacity-60">{busy ? 'Sending...' : 'Send reset link'}</button>
                </form>
              )}
              <div className="flex items-center justify-between mt-3 text-sm">
                <button onClick={()=>setMode(mode==='login' ? 'register' : 'login')} className="text-blue-600 font-semibold">
                  {mode==='login' ? 'Create account' : 'Have an account? Sign in'}
                </button>
                <button onClick={()=>setMode('forgot')} className="text-blue-600 font-semibold">Forgot password?</button>
              </div>
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