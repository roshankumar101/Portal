import React, { useState } from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';

const AboutMe = ({ studentData, user }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Text truncation function
  const truncateText = (text, wordLimit = 40) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return { truncated: text, needsReadMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(' '),
      needsReadMore: true,
      fullText: text
    };
  };

  // About Me text
  const aboutMeText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas repellendus eius est aperiam, consequatur reprehenderit aliquid soluta architecto voluptatum cupiditate consectetur a quisquam. Sed unde voluptate dignissimos laboriosam, asperiores facere mollitia iste maxime accusamus quasi quaerat expedita dolore nulla officia rem pariatur nobis fugiat corrupti architecto cupiditate consectetur a quisquam numquam tenetur reprehenderit suscipit aliquid. Voluptas esse amet consectetur adipisicing elit quas repellendus eius est aperiam consequatur reprehenderit aliquid soluta architecto voluptatum cupiditate. Lorem ipsum dolor sit amet consectetur adipisicing elit quas repellendus eius est.";
  
  const { truncated, needsReadMore, fullText } = truncateText(aboutMeText);

  return (
    <div className="w-full font-inter">
      <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6 transition-all duration-200 shadow-md">
        <legend className="text-xl font-bold text-white px-3 bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] rounded-full">
          About Me
        </legend>
        
        {/* About Me Content */}
        <div className="my-3 space-y-4">
          <div className="text-slate-700 leading-relaxed text-sm">
            <span>{isTextExpanded ? fullText : truncated}</span>
            {needsReadMore && (
              <button 
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="ml-2 text-[#3c80a7] hover:text-[#2d5f7a] font-medium transition-colors duration-200 underline"
              >
                {isTextExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
          
          {/* Contact Information - LinkedIn Style */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-start text-slate-600">
              {/* Phone */}
              <span className="text-sm font-medium">{studentData?.personalInfo?.phone || '9876543210'}</span>
              
              {/* Dot separator */}
              <span className="ml-4 mr-1 text-slate-400">•</span>
              
              {/* Email */}
              <span className="text-sm font-medium">{studentData?.personalInfo?.email || user?.email || 'student@example.com'}</span>
              
              {/* Dot separator */}
              <span className="ml-4 mr-1 text-slate-400">•</span>
              
              {/* LinkedIn */}
              <button 
                onClick={() => window.open(studentData?.personalInfo?.linkedinUrl || 'https://linkedin.com/in/student', '_blank')}
                className="flex items-center p-1 rounded-sm border border-[#3c80a7] bg-white text-[#3c80a7] hover:bg-[#3c80a7] hover:border-[#2d5f7a] hover:text-white hover:scale-110 transition-all duration-200 shadow-sm"
              >
                <Linkedin className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default AboutMe;
