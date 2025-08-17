import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap';
import { useAuth } from '../hooks/useAuth';
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
  const [lottieReady, setLottieReady] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const formRef = useRef(null);

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

  // Load and track Lottie web component
  useEffect(() => {
    const loadLottie = async () => {
      if (!document.querySelector('script[src*="dotlottie-wc"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
        script.type = 'module';
        
        script.onload = () => {
          // Wait a bit for the web component to register
          setTimeout(() => {
            setLottieReady(true);
          }, 100);
        };
        
        document.body.appendChild(script);
      } else {
        // Script already exists, check if web component is ready
        if (customElements.get('dotlottie-wc')) {
          setLottieReady(true);
        } else {
          // Wait for it to be defined
          customElements.whenDefined('dotlottie-wc').then(() => {
            setLottieReady(true);
          });
        }
      }
    };
    
    loadLottie();
  }, []);

  useEffect(() => {
    if (shouldRender && modalRef.current && backdropRef.current) {
      if (isOpen) {
        // Opening animation
        gsap.killTweensOf([modalRef.current, backdropRef.current]);
        if (formRef.current) gsap.killTweensOf(formRef.current);
        
        // Set initial state immediately
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { opacity: 0, scale: 0.85, y: 60, rotationX: 5 });
        if (formRef.current) {
          gsap.set(formRef.current, { opacity: 0, y: 30 });
        }
        
        // Create timeline for smoother animations
        const tl = gsap.timeline();
        
        // Animate backdrop
        tl.to(backdropRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        // Animate modal with enhanced easing
        .to(modalRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          duration: 0.7,
          ease: 'back.out(1.2)'
        }, 0.1)
        // Animate form content
        .to(formRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            setIsAnimating(false);
          }
        }, 0.3);
        
      } else {
        // Closing animation
        gsap.killTweensOf([modalRef.current, backdropRef.current]);
        if (formRef.current) gsap.killTweensOf(formRef.current);
        
        const tl = gsap.timeline();
        
        // Animate form out first
        if (formRef.current) {
          tl.to(formRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in'
          });
        }
        
        // Animate modal out
        tl.to(modalRef.current, {
          opacity: 0,
          scale: 0.85,
          y: 60,
          rotationX: -5,
          duration: 0.4,
          ease: 'power2.in'
        }, 0.1)
        
        // Animate backdrop out
        .to(backdropRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            setShouldRender(false);
            setIsAnimating(false);
          }
        }, 0.2);
      }
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
          {lottieReady && (
            <dotlottie-wc
              src="https://lottie.host/a22e1a8b-a8e9-4fe4-893c-f5ba49c2a4b6/KHjSf9NMKB.lottie"
              speed="1"
              style={{ width: '220px', height: '220px' }}
              mode="forward"
              loop
              autoplay
            ></dotlottie-wc>
          )}
        </div>
        {/* Login Form Right Side */}
        <div className="flex-1 flex flex-col justify-center h-full relative bg-transparent">
          <button onClick={handleClose} className="absolute top-4 right-4 bg-gray-200 text-black hover:bg-gray-300 hover:scale-110 text-sm font-bold px-4 py-0.5 border-2 rounded z-20 transition-all duration-200">✕</button>
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 pointer-events-none rounded-lg" style={{ boxShadow: '0 0 12px 3px rgba(128,0,255,0.2)' }}></div>
          <div ref={formRef} className="relative z-10 px-8 py-4">
            <h2 className="text-2xl font-bold mb-2 text-center text-black">
              {mode === 'login' && 'Sign in'}
              {mode === 'register' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {['Student', 'Recruiter', 'Admin'].map(opt => (
                <button
                  key={opt}
                  className={`px-3 py-1 rounded-lg font-semibold text-sm uppercase border transition-all duration-300 transform hover:rotate-1
                    ${role === opt ? 'bg-gradient-to-r from-black to-gray-800 text-white scale-105 shadow-lg border-black' : 'bg-white bg-opacity-30 text-black border-gray-400 hover:scale-105 hover:shadow-md hover:bg-opacity-50'}`}
                  onClick={() => {
                    setRole(opt);
                    setAnimKey(opt); // Trigger form animation
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div
              key={animKey}
              className="transition-all duration-500 ease-out opacity-100 scale-100"
              style={{ 
                animation: 'fadeInScale 0.4s ease-out',
                animationFillMode: 'both'
              }}
            >
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              {mode !== 'forgot' && (
                <form className="flex flex-col gap-3" onSubmit={async (e)=>{
                  e.preventDefault();
                  setError('');
                  setBusy(true);
                  try {
                    console.log('LoginModal - Starting login process...');
                    let uid = null;
                    if (mode === 'login') {
                      const u = await login(email, password);
                      uid = u?.uid;
                      console.log('LoginModal - Login successful, UID:', uid);
                    } else {
                      // Register. For Admin, require manual creation in Firestore after registration
                      const selected = role.toLowerCase();
                      const assignRole = selected === 'admin' ? 'student' : selected;
                      const u = await registerWithEmail({ email, password, role: assignRole });
                      uid = u?.uid;
                      console.log('LoginModal - Registration successful, UID:', uid);
                      if (selected === 'admin') {
                        // Inform user that admin role must be granted by existing admin in Firestore
                        alert('Account created. Ask an existing admin to set your role to admin in Firestore.');
                      }
                    }
                    
                    console.log('LoginModal - Closing modal and checking for redirect');
                    
                    // Get user role and redirect appropriately
                    try {
                      const userDoc = await getDoc(doc(db, 'users', uid));
                      if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userRole = userData.role;
                        console.log('LoginModal - User role:', userRole);
                        
                        // Close modal first
                        onClose();
                        
                        // Navigate based on role
                        if (userRole === 'student') {
                          navigate('/student', { replace: true });
                        } else if (userRole === 'recruiter') {
                          navigate('/recruiter', { replace: true });
                        } else if (userRole === 'admin') {
                          navigate('/admin', { replace: true });
                        } else {
                          console.log('LoginModal - No role found, staying on home page');
                        }
                      } else {
                        console.log('LoginModal - No user document found');
                        onClose();
                      }
                    } catch (roleError) {
                      console.error('LoginModal - Error fetching user role:', roleError);
                      onClose();
                    }
                  } catch (err) {
                    setError(err?.message || 'Action failed');
                  } finally { setBusy(false); }
              }}>
                <input 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Email" 
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200" 
                />
                <input 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  type="password" 
                  placeholder="Password" 
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200" 
                />
                <button 
                    disabled={busy} 
                    type="submit" 
                    className="bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-lg font-semibold disabled:opacity-60 hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {busy ? 'Please wait...' : (mode==='login' ? 'Sign in' : 'Create account')}
                  </button>
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
                  <input 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                    type="email" 
                    placeholder="Email" 
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200" 
                  />
                  <button 
                    disabled={busy} 
                    type="submit" 
                    className="bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-lg font-semibold disabled:opacity-60 hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {busy ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              )}
              <div className="flex items-center justify-between mt-3 text-sm">
                <button 
                  onClick={()=>setMode(mode==='login' ? 'register' : 'login')} 
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 hover:underline"
                >
                  {mode==='login' ? 'Create account' : 'Have an account? Sign in'}
                </button>
                <button 
                  onClick={()=>setMode('forgot')} 
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
            @keyframes fadeInScale {
              0% { 
                opacity: 0; 
                transform: scale(0.95) translateY(10px); 
              }
              100% { 
                opacity: 1; 
                transform: scale(1) translateY(0px); 
              }
            }
            
            /* Enhanced focus states for form elements */
            input:focus {
              transform: scale(1.02);
            }
            
            /* Smooth lottie animation entry */
            dotlottie-wc {
              animation: lottieEntry 0.8s ease-out 0.5s both;
            }
            
            @keyframes lottieEntry {
              0% {
                opacity: 0;
                transform: scale(0.8) rotate(-5deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
              }
            }
          `}</style>
      </div>
    </div>
  )
}

export default LoginModal;