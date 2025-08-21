import React from 'react';
import { 
  Home, 
  Briefcase, 
  FileText, 
  Calendar, 
  Code2, 
  Trophy, 
  Github, 
  Youtube,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Dashboard', icon: Home, href: '#dashboard' },
    { name: 'Jobs', icon: Briefcase, href: '#jobs' },
    { name: 'Applications', icon: FileText, href: '#applications' },
    { name: 'Calendar', icon: Calendar, href: '#calendar' },
    { name: 'Resources', icon: FileText, href: '#resources' },
    { name: 'Profile', icon: Calendar, href: '#editProfile' },
  ];

  const skillsLinks = [
    { name: 'LeetCode', icon: Code2, href: 'https://leetcode.com', color: 'text-orange-600' },
    { name: 'Codeforces', icon: Trophy, href: 'https://codeforces.com', color: 'text-blue-600' },
    { name: 'GeeksforGeeks', icon: Code2, href: 'https://geeksforgeeks.org', color: 'text-green-600' },
    { name: 'HackerRank', icon: Trophy, href: 'https://hackerrank.com', color: 'text-emerald-600' },
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: 'text-gray-700' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', color: 'text-red-600' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'placement@university.edu', href: 'mailto:placement@university.edu' },
    { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: MapPin, text: 'University Campus, City, State - 123456', href: '#' },
  ];

  const handleLinkClick = (href) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else if (href.startsWith('#')) {
      // Handle internal navigation if needed
      console.log('Navigate to:', href);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="flex items-center text-slate-600 hover:text-[#3c80a7] transition-colors duration-200 group"
                    >
                      <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      {link.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Skills & Platforms */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Skills & Platforms</h3>
            <ul className="space-y-2">
              {skillsLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="flex items-center text-slate-600 hover:text-[#3c80a7] transition-colors duration-200 group"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${link.color} group-hover:scale-110 transition-transform`} />
                      {link.name}
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <li key={index}>
                    <a
                      href={contact.href}
                      className="flex items-center text-slate-600 hover:text-[#3c80a7] transition-colors duration-200 group"
                    >
                      <Icon className="h-4 w-4 mr-2 text-[#3c80a7] group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{contact.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* University Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">University</h3>
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Empowering students with quality education and placement opportunities for a successful career journey.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Placement Cell
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-600 mb-4 md:mb-0">
              © 2025 University Placement Portal. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-slate-600">
              <a href="#" className="hover:text-[#3c80a7] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#3c80a7] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#3c80a7] transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}