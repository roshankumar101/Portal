import React, { useEffect, useRef, useState } from 'react';
import brandLogo from '../assets/brand_logo.webp';

const PWIOIFooter = () => {
    const [isClient, setIsClient] = useState(false);
    const svgRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
        
        // Load Lottie script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
        script.type = 'module';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup script if component unmounts
            const existingScript = document.querySelector('script[src*="dotlottie-wc"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (!isClient || !svgRef.current || !pathRef.current) return;

        const svg = svgRef.current;
        const path = pathRef.current;
        let animationId;
        let isInteracting = false;
        const wavePoints = [];
        const numPoints = 50;

        // Initialize wave points
        for (let i = 0; i <= numPoints; i++) {
            wavePoints.push({
                x: i * (800 / numPoints) + 100,
                y: 50,
                vy: 0
            });
        }

        // Mouse/touch events
        const startInteraction = (e) => {
            isInteracting = true;
            const rect = svg.getBoundingClientRect();
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);

            if (!clientY || !clientX) return;

            const y = clientY - rect.top;
            const x = clientX - rect.left;
            const svgX = (x / rect.width) * 800 + 100;

            // Find nearest point
            let nearestIdx = 0;
            let minDist = Infinity;

            for (let i = 0; i < wavePoints.length; i++) {
                const dist = Math.abs(wavePoints[i].x - svgX);
                if (dist < minDist) {
                    minDist = dist;
                    nearestIdx = i;
                }
            }

            // Create ripple effect
            for (let i = 0; i < wavePoints.length; i++) {
                const distance = Math.abs(i - nearestIdx);
                const influence = Math.max(0, 1 - distance / 15);

                if (influence > 0) {
                    wavePoints[i].vy = (y - 60) * influence * 0.1;
                }
            }

            // Start animation if not already running
            if (!animationId) {
                animateWave();
            }
        };

        const animateWave = () => {
            // Apply physics to wave points
            const tension = 0.2;
            const damping = 0.95;

            for (let i = 1; i < wavePoints.length - 1; i++) {
                const prev = wavePoints[i - 1].y;
                const next = wavePoints[i + 1].y;
                const acceleration = (prev + next - wavePoints[i].y * 2) * tension;

                wavePoints[i].vy = (wavePoints[i].vy + acceleration) * damping;
                wavePoints[i].y += wavePoints[i].vy;
            }

            // Fixed endpoints
            wavePoints[0].y = 50;
            wavePoints[wavePoints.length - 1].y = 50;

            // Build SVG path
            let pathData = `M${wavePoints[0].x},${wavePoints[0].y}`;

            // Create smooth curve through points
            for (let i = 1; i < wavePoints.length - 2; i++) {
                const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2;
                const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2;
                pathData += ` Q${wavePoints[i].x},${wavePoints[i].y} ${xc},${yc}`;
            }

            // Connect last segment
            pathData += ` L${wavePoints[wavePoints.length - 1].x},${wavePoints[wavePoints.length - 1].y}`;

            path.setAttribute('d', pathData);

            // Silver/white theme effects
            const maxMovement = wavePoints.reduce((max, point) =>
                Math.max(max, Math.abs(point.y - 50)), 0);

            const opacity = 0.8 + Math.min(maxMovement / 30, 0.2);
            path.style.stroke = `rgba(192, 192, 192, ${opacity})`;
            path.style.strokeWidth = `${1.5 + maxMovement / 25}`;

            // Continue animation if there's still movement
            let isMoving = wavePoints.some(point =>
                Math.abs(point.vy) > 0.01 || Math.abs(point.y - 50) > 0.1);

            if (isMoving || isInteracting) {
                animationId = requestAnimationFrame(animateWave);
            } else {
                animationId = null;
                // Return to straight line
                path.setAttribute('d', 'M100,50 L900,50');
                path.style.stroke = 'rgba(192, 192, 192, 0.8)';
                path.style.strokeWidth = '1.5';
            }
        };

        const endInteraction = () => {
            isInteracting = false;
        };

        svg.addEventListener('mousedown', startInteraction);
        svg.addEventListener('touchstart', startInteraction);
        document.addEventListener('mouseup', endInteraction);
        document.addEventListener('touchend', endInteraction);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            svg.removeEventListener('mousedown', startInteraction);
            svg.removeEventListener('touchstart', startInteraction);
            document.removeEventListener('mouseup', endInteraction);
            document.removeEventListener('touchend', endInteraction);
        };
    }, [isClient]);

    return (
        <footer className="text-white py-10 relative overflow-hidden mt-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-5">
                <div className="flex flex-col items-start">
                    <img
                        src={brandLogo}
                        alt="PW IOI Logo"
                        className="w-44 mb-5 filter brightness-0 invert"
                    />
                    <p className="text-gray-300">Empowering students with career opportunities and industry connections since 2010.</p>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-xl mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Connect With Us
                    </h3>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        LinkedIn
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Twitter
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Facebook
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Instagram
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        YouTube
                    </a>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-xl mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Quick Links
                    </h3>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Placement Portal
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Recruiter Login
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Student Login
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Placement Policy
                    </a>
                    <a href="#" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Contact Team
                    </a>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-xl mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Our Campus
                    </h3>
                    <a
                        href="https://maps.google.com?q=PW+IOI+Bangalore+Campus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline transition-all duration-300 hover:text-white"
                    >
                        <div className="flex items-start gap-4">
                            
                            {isClient && (
                                <div className="w-15 h-10 flex-shrink-0 flex items-center justify-center">
                                    <dotlottie-wc 
                                        src="https://lottie.host/82b13e45-1fb2-47fc-b0ef-4021226e1782/MRuJ4Z38ys.lottie" 
                                        speed="1" 
                                        style={{ width: '120px', height: '50px' }} 
                                        mode="forward" 
                                        loop 
                                        autoplay
                                    />
                                </div>
                            )}
                            <div>
                                PW IOI Main Campus<br />
                                Bangalore, Karnataka<br />
                                India - 560001
                            </div>

                        </div>
                    </a>
                </div>
            </div>

            {/* Interactive SVG String Animation */}
            <div className="w-full h-32 relative mt-12 overflow-hidden">
                <svg
                    ref={svgRef}
                    className="w-full h-full cursor-pointer"
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={pathRef}
                        className="fill-none filter drop-shadow-[0_0_3px_rgba(255,255,255,0.2)]"
                        d="M100,50 L900,50"
                        stroke="rgba(192, 192, 192, 0.8)"
                        strokeWidth="1.5"
                    />
                </svg>
            </div>

            <div className="text-center mt-10 pt-5 border-t border-white/10 text-gray-400 text-sm">
                © {new Date().getFullYear()} PW IOI - Placement Cell. All Rights Reserved.
            </div>
        </footer>
    );
};

export default PWIOIFooter;