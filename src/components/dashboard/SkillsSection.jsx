import React from 'react';
import { Star } from 'lucide-react';

const SkillsSection = () => {
  // Static skills data with 8 rows
  const skills = [
    { name: 'Java', rating: 4 },
    { name: 'Python', rating: 5 },
    { name: 'JavaScript', rating: 3 },
    { name: 'React', rating: 4 },
    { name: 'Node.js', rating: 3 },
    { name: 'SQL', rating: 4 },
    { name: 'HTML/CSS', rating: 5 },
    { name: 'Git', rating: 4 }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 transition-colors duration-200 ${
              star <= rating
                ? 'text-[#3c80a7] fill-[#3c80a7]'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full font-inter">
      <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6 transition-all duration-200 shadow-md">
        <legend className="text-xl font-bold text-white px-3 bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] rounded-full">
          Skills
        </legend>
        
        <div className="my-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - First 4 skills */}
            <div className="space-y-3">
              {skills.slice(0, 4).map((skill, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 hover:shadow-md hover:border-[#3c80a7]/30 transition-all duration-200">
                  <div className="flex items-center">
                    <span className="text-base font-semibold text-slate-900">{skill.name}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <StarRating rating={skill.rating} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Column - Last 4 skills */}
            <div className="space-y-3">
              {skills.slice(4, 8).map((skill, index) => (
                <div key={index + 4} className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 hover:shadow-md hover:border-[#3c80a7]/30 transition-all duration-200">
                  <div className="flex items-center">
                    <span className="text-base font-semibold text-slate-900">{skill.name}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <StarRating rating={skill.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default SkillsSection;
