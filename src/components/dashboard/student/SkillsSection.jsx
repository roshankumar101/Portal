import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faJava, faPython, faJs, faReact, faNodeJs, faCss3Alt, faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function getPointOnQuadraticBezier(t, p0, p1, p2) {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
}

const iconsMap = {
  Java: faJava,
  Python: faPython,
  JavaScript: faJs,
  React: faReact,
  'Node.js': faNodeJs,
  SQL: faDatabase,
  CSS: faCss3Alt,
  Git: faGithub,
};

const SkillsSection = () => {
  const initialSkills = [
    { name: 'Java', rating: 4, icon: faJava },
    { name: 'Python', rating: 5, icon: faPython },
    { name: 'JavaScript', rating: 3, icon: faJs },
    { name: 'React', rating: 4, icon: faReact },
    { name: 'Node.js', rating: 3, icon: faNodeJs },
    { name: 'SQL', rating: 4, icon: faDatabase },
    { name: 'CSS', rating: 5, icon: faCss3Alt },
    { name: 'Git', rating: 4, icon: faGithub },
  ];

  const [skills, setSkills] = useState(initialSkills);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({ name: '', rating: 0, icon: faJs });

  const handleAddClick = () => {
    setCurrentSkill({ name: '', rating: 0, icon: faJs });
    setEditingIndex(null);
    setShowForm(true);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleEditClick = (index) => {
    setCurrentSkill(skills[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteClick = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setShowForm(false);
      setEditingIndex(null);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentSkill((prev) => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (rating) => {
    setCurrentSkill((prev) => ({ ...prev, rating }));
  };

  const saveSkill = () => {
    if (!currentSkill.name.trim()) {
      alert('Skill name cannot be empty');
      return;
    }
    const updatedSkill = { ...currentSkill, icon: iconsMap[currentSkill.name] || faJs };
    let updatedSkills = [...skills];
    if (editingIndex !== null) {
      updatedSkills[editingIndex] = updatedSkill;
    } else {
      updatedSkills.push(updatedSkill);
    }
    setSkills(updatedSkills);
    setShowForm(false);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  return (
    <>
      <style>{`
        .skill-badge {
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .skill-badge:hover {
          transform: scale(1.05);
        }
        .skill-badge::before {
          content: "";
          position: absolute;
          top: -150%;
          left: -75%;
          width: 50%;
          height: 300%;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          transition: all 0.7s ease;
          pointer-events: none;
          filter: blur(30px);
          z-index: 10;
        }
        .skill-badge:hover::before {
          left: 150%;
        }
      `}</style>
      
      <div className="w-full">
        <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] pt-1 pb-4 px-6 transition-all duration-200 shadow-lg">

          <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text select-none">
            Skills
          </legend>

          <div className="flex items-center justify-end mb-1 mr-[-1%]">
            <div className="flex gap-2">
              <button
                onClick={handleAddClick}
                aria-label="Add new skill"
                className="bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition"
              >
                <Plus size={18} className="text-white" />
              </button>
              <button
                onClick={toggleEditMode}
                aria-label={editMode ? 'Exit edit mode' : 'Edit skills'}
                className={`bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition flex items-center justify-center ${
                  editMode ? 'bg-[#5e9ad6]' : ''
                }`}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="text-white" />
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-4 p-4 border border-gray-300 rounded bg-gray-50">
              <input
                type="text"
                placeholder="Skill Name"
                value={currentSkill.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border border-gray-400 rounded px-2 py-1 mb-2 w-full"
                disabled={!editMode}
              />
              <div className="flex items-center mb-2 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={star <= currentSkill.rating ? 'text-yellow-400 cursor-pointer' : 'text-gray-300 cursor-pointer'}
                    onClick={() => editMode && handleRatingChange(star)}
                  />
                ))}
              </div>
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSkill}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 justify-center">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="skill-badge relative w-33 h-40 cursor-pointer transition-transform transform group"
                onClick={() => editMode && handleEditClick(index)}
                title={editMode ? 'Click to edit skill' : skill.name}
              >
                <svg viewBox="0 0 512 512" className="absolute inset-0 w-full h-full z-0">
                  {/* Shield */}
                  <path
                    d="M256 55 L430 100 L385 362 L256 452 L127 362 L82 100 Z"
                    fill="url(#purpleGradient)"
                    stroke="#d4af37"
                    strokeWidth="7"
                  />
                  {/* Ribbon band */}
                  <path
                    d="
                      M75 235
                      Q 255 285 435 235
                      L 385 315
                      Q 255 355 125 315 Z
                    "
                    fill="url(#goldGradient)"
                    stroke="#b8860b"
                    strokeWidth="7"
                    className="ribbon-band"
                  />
                  {/* Ribbon left tail */}
                  <path
                    d="M75 235 L30 265 L125 315 L75 235"
                    fill="#d4af37"
                    stroke="#b8860b"
                    strokeWidth="4"
                  />
                  {/* Ribbon right tail */}
                  <path
                    d="M435 235 L480 265 L385 315 L435 235"
                    fill="#d4af37"
                    stroke="#b8860b"
                    strokeWidth="4"
                  />
                  {/* Shield glare */}
                  <path
                    d="M135 110 Q255 70 377 110 Q335 160 257 120 Q175 145 135 110 Z"
                    fill="white"
                    fillOpacity="0.12"
                    className="shield-glare"
                    style={{ transition: 'fill-opacity 0.4s' }}
                  />
                  {/* Ribbon glare */}
                  <path
                    d="
                      M110 260
                      Q255 280 400 260
                      L385 315
                      Q 255 340 125 315 Z
                    "
                    fill="white"
                    fillOpacity="0.07"
                    className="ribbon-glare"
                    style={{ transition: 'fill-opacity 0.4s' }}
                  />
                  {/* Curved stars */}
                  {[...Array(5)].map((_, i) => {
                    const ptA = { x: 110, y: 263 };
                    const ptB = { x: 256, y: 310 };
                    const ptC = { x: 400, y: 263 };
                    const t = 0.07 + (0.8 * i) / 4;
                    const { x, y } = getPointOnQuadraticBezier(t, ptA, ptB, ptC);
                    const isFilled = i < skill.rating;
                    return (
                      <g key={i} transform={`translate(${x - 13},${y - 8})`}>
                        <Star
                          size={40}
                          className={isFilled ? 'text-black fill-black' : 'text-black-400'}
                        />
                      </g>
                    );
                  })}
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e96518ff" />
                      <stop offset="60%" stopColor="#1b33b8ff" />
                      <stop offset="100%" stopColor="#6122c7ff" />
                    </linearGradient>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffe066" />
                      <stop offset="100%" stopColor="#b8860b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center gap-1 justify-start z-10 top-[8%]">
                  <FontAwesomeIcon
                    icon={skill.icon}
                    className="text-3xl mb-2 text-yellow-300 drop-shadow"
                  />
                  <div className="inset-x-0 text-center z-20">
                    <span className="font-bold text-white text-sm tracking-wide drop-shadow">
                      {skill.name}
                    </span>
                  </div>
                  {editMode && (
                    <button
                      aria-label={`Delete skill ${skill.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(index);
                      }}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default SkillsSection;
