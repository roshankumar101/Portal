import React, { useEffect, useState } from 'react';
import brandLogo from '../assets/brand_logo.webp';

const PWIOIFooter = () => {
    const [isClient, setIsClient] = useState(false);

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


            <div className="text-center mt-10 pt-5 border-t-1 border-white/30 text-gray-400 text-sm">
                © {new Date().getFullYear()} PW IOI - Placement Cell. All Rights Reserved.
            </div>
        </footer>
    );
};

export default PWIOIFooter;