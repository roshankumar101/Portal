import React, { useState } from 'react';
import brandLogo from '../assets/brand_logo.webp';
import placementPolicy from '../assets/Docs/PlacementPolicy.pdf';

const PWIOIFooter = ({ onLoginOpen, onContactTeam }) => {

    const linkedinLink = "https://www.linkedin.com/school/pw-ioi/";
    const instagramLink = "https://www.instagram.com/pw_ioi/";
    const youtubeLink = "https://www.youtube.com/@PW-IOI";

    const [formData, setFormData] = useState({
        company: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setFormData({
                company: '',
                email: '',
                phone: ''
            });
            setIsSubmitting(false);
            alert('Thank you for your message! We will get back to you soon.');
        }, 1000);
    };

    return (
        <footer className="text-white py-5 relative overflow-hidden mt-10" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a5a 100%)' }}>
            <div className="px-[10%] grid grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand & Social Media */}
                <div className="flex flex-col mt-6 items-start">
                    <img
                        src={brandLogo}
                        alt="PW IOI Logo"
                        className="w-44 mb-5 filter brightness-0 invert"
                    />
                    <p className="text-gray-300">Empowering students with career opportunities and industry connections since 2010.</p>
                </div>

                {/* Social Media */}
                <div>
                    <div className="flex flex-col mt-4">
                        <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                            Connect With Us
                        </h3>
                        <a href={linkedinLink} target='_blank' rel="noopener noreferrer" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                            LinkedIn
                        </a>
                        <a href={instagramLink} target='_blank' rel="noopener noreferrer" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                            Instagram
                        </a>
                        <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                            YouTube
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Quick Links
                    </h3>
                    <button
                        onClick={() => onLoginOpen && onLoginOpen('Recruiter')}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Recruiter Login
                    </button>
                    <button
                        onClick={() => onLoginOpen && onLoginOpen('Student')}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Student Login
                    </button>
                    <a href={placementPolicy} target="_blank" rel="noopener noreferrer" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Placement Policy
                    </a>
                    <button
                        onClick={() => onContactTeam && onContactTeam()}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Contact Team
                    </button>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Contact Info
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <span>placement@pwioi.edu.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span>+91 80 1234 5678</span>
                        </div>
                        <a
                            href="https://maps.google.com?q=PW+IOI+Bangalore+Campus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex group items-center gap-3 text-gray-300 transition-all duration-300 hover:text-white"
                        >
                            <svg className="w-6 h-6 text-gray-300 group-hover:text-red-500 duration-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span className='leading-5'>
                                PW IOI Main Campus<br />
                                Bangalore, Karnataka<br />
                                India - 560001
                            </span>
                        </a>
                    </div>
                </div>


            </div>

            <div className="text-center mt-10 pt-5 border-t border-white/30 text-gray-400 text-sm flex justify-around items-center">
                <div>
                   This portal is first success story Itself. Hopeful
                </div>
                <div>
                    © {new Date().getFullYear()} PW IOI - Placement Cell. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default PWIOIFooter;