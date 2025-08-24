import React, { useState } from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';
const linkedinLink = "https://www.linkedin.com/school/pw-ioi/";

const AboutMe = ({ studentData, user }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const truncateText = (text, wordLimit = 40) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return { truncated: text, needsReadMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(' ') + '...',  // Add ellipsis here
      needsReadMore: true,
      fullText: text
    };
  };

  const aboutMeText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas repellendus eius est aperiam facere mollitia iste maxime accusamus quasi quaerat expedita dolore nulla officia rem pariatur nobis fugiat corrupti architecto cupiditate suscipit aliquid. Voluptas esse amet consectetur adipisicing elit quas repellendus eius est aperiam consequatur reprehenderit aliquid soluta architecto voluptatum cupiditate. Lorem ipsum dolor sit amet consectetur adipisicing elit quas repellendus eius est.";

  const { truncated, needsReadMore, fullText } = truncateText(aboutMeText);

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] pt-2 pb-4 px-6 transition-all duration-200 shadow-lg">

        <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text">
          About Me
        </legend>

        {/* About Me Content */}
        <div className="my-3 space-y-4">
          <div className="leading-relaxed text-sm bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
            <span>{isTextExpanded ? fullText : truncated}</span>
            {needsReadMore && (
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="ml-2 font-medium underline text-blue-800 hover:text-blue-700 transition-colors duration-300"
              >
                {isTextExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Contact Information */}
          <div className="pt-4 border-t border-[#3c80a7]/40">
            <div className="flex items-center justify-start text-gray-600">
              {/* Phone */}
              <span className="text-sm font-medium bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
                {studentData?.personalInfo?.phone || '9876543210'}
              </span>

              <span className="ml-4 mr-1 text-black">•</span>

              {/* Email */}
              <span className="text-sm font-medium bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
                {studentData?.personalInfo?.email || user?.email || 'student@example.com'}
              </span>

              <span className="ml-4 mr-1 text-black">•</span>
              <span className='text-black font-medium'>Innovation &nbsp;</span>

              {/* LinkedIn */}
              <button>
                <a
                  href={linkedinLink}
                  target='_blank'
                  rel="noopener noreferrer"
                  className="text-[#0A66C2] transition-colors duration-300 hover:text-[#1d7dde]"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </button>

              <span className='text-black font-medium'>&nbsp; every step</span>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default AboutMe;
