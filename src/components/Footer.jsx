import React, { useState } from 'react';
import brandLogo from '../assets/brand_logo.webp';

const PWIOIFooter = () => {
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
            <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-5 px-5">
                {/* Brand & Social Media */}
                <div className="flex flex-col mt-4 items-start">
                    <img
                        src={brandLogo}
                        alt="PW IOI Logo"
                        className="w-44 mb-5 filter brightness-0 invert"
                    />
                    <div className="flex flex-col mt-10">
                        <h3 className="text-xl text-gray-200 mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                            Connect With Us
                        </h3>
                        <div className='flex gap-6 text-gray-300'>
                            {/* LinkedIn */}
                            <a href="https://linkedin.com/company/pw-ioi" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            {/* Twitter/X */}
                            <a href="https://twitter.com/pw_ioi" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://instagram.com/pw_ioi" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="https://youtube.com/@pw_ioi" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Quick Links
                    </h3>
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

                {/* Contact Info */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Contact Info
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>placement@pwioi.edu.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
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
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span className='leading-5'>
                                PW IOI Main Campus<br />
                                Bangalore, Karnataka<br />
                                India - 560001
                            </span>
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="flex flex-col col-span-2 pl-10">
                    <h3 className="text-4xl text-gray-400 font-bold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Get In<span className='text-gray-200'> Touch</span>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="Company Name *"
                                className="w-full px-2 bg-black/30 py-2 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                                
                                required
                            />
                        </div>
                        
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email Address *"
                                className="w-full px-2 bg-black/30 py-2 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                                
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number *"
                                className="w-full px-2 bg-black/30 py-2 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                                
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform disabled:transform-none disabled:cursor-not-allowed"
                            
                        >
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="text-center mt-10 pt-5 border-t border-white/30 text-gray-400 text-sm">
                © {new Date().getFullYear()} PW IOI - Placement Cell. All Rights Reserved.
            </div>
        </footer>
    );
};

export default PWIOIFooter;