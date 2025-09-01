import React, { useEffect, useMemo, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaExternalLinkAlt,
  FaTasks,
  FaEnvelopeOpen,
  FaClipboardList,
  FaPhone,
  FaUserCheck,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import { GoChecklist } from "react-icons/go";

// Timeline steps
const interviewTimeline = [
  {
    label: "Round 1: Aptitude Test",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-sky-400",
    number: "1",
    icon: <FaClipboardList className="text-white" size={22} />,
  },
  {
    label: "Round 2: Technical Interview",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-pink-400",
    number: "2",
    icon: <FaPhone className="text-white" size={22} />,
  },
  {
    label: "Round 3: HR Interview",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-purple-500",
    number: "3",
    icon: <FaTasks className="text-white" size={22} />,
  },
  {
    label: "Round 4: Group Discussion",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-teal-400",
    number: "4",
    icon: <FaUserCheck className="text-white" size={22} />,
  },
  {
    label: "Round 5: Final Decision",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-yellow-400",
    number: "5",
    icon: <FaUsers className="text-white" size={22} />,
  },
  {
    label: "OFFER",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-indigo-500",
    number: "6",
    icon: <FaCheckCircle className="text-white" size={22} />,
  },
  {
    label: "Onboarding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "bg-red-400",
    number: "7",
    icon: <FaEnvelopeOpen className="text-white" size={22} />,
  },
];

const JobDescription = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  // -------- Dynamic Timer --------
  const [now, setNow] = useState(Date.now());
  const deadline = useMemo(() => Date.now() + 3 * 24 * 60 * 60 * 1000, []); // 3 days from now

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    const diff = deadline - now;
    if (diff <= 0) return "Deadline passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, [deadline, now]);

  // -------- Skills Array --------
  const skillsRequired = [
    "Problem Solving",
    "JavaScript & ES6+",
    "React.js & Node.js",
    "Git & Version Control",
    "Database Management",
    "Team Collaboration",
    "REST APIs",
    "Agile Methodology",
  ];

  // Split skills alternately between left and right
  const leftSkills = skillsRequired.filter((_, index) => index % 2 === 0);
  const rightSkills = skillsRequired.filter((_, index) => index % 2 === 1);

  // -------- Helpers --------
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === "number") {
      return `₹${(salary / 100000).toFixed(1)} LPA`;
    }
    return salary;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="relative bg-white rounded-xl shadow-2xl w-[95%] md:w-[80%] h-[95%] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="text-center mt-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{job.jobTitle || "Job Position"}</h2>
        </div>
        {/* Company Info */}
        <div className="flex items-center gap-4 py-6 px-6 border-b">
          {job.company?.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company?.name}
              className="w-14 h-14 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-semibold bg-blue-500 text-white">
              {job.company?.name?.[0] || "?"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{job.company?.name}</h2>
            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
              >
                <FaExternalLinkAlt size={12} /> {job.company.website}
              </a>
            )}
          </div>
        </div>


        {/* Position Details */}
        <div className="flex flex-wrap justify-center gap-6 px-6 py-6 border-b">
          <div className="flex items-center gap-2 text-gray-700">
            <FaBriefcase className="text-blue-600" />
            <span>{job.jobType || "Full-time"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaBuilding className="text-green-600" />
            <span>{job.workMode || "Onsite"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-red-600" />
            <span>{job.location || "Bangalore"}</span>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4">
          <div className="bg-blue-50 p-3 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaMoneyBillWave className="text-blue-600 text-lg" />
              <p className="text-sm text-gray-500">CTC</p>
            </div>
            <p className="font-semibold text-gray-800">{formatSalary(job.salary)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaCalendarAlt className="text-green-600 text-lg" />
              <p className="text-sm text-gray-500">Drive Date</p>
            </div>
            <p className="font-semibold text-gray-800">{job.driveDate || "15-09-25"}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaBuilding className="text-purple-600 text-lg" />
              <p className="text-sm text-gray-500">Venue</p>
            </div>
            <p className="font-semibold text-gray-800">{job.driveVenues?.[0] || "Bangalore"}</p>
          </div>
          <div className="flex justify-center items-center">
            <div
              className="relative w-48 h-24 bg-white border-4 border-yellow-500 rounded-md shadow-lg flex flex-col items-center justify-center"
              style={{ boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)" }}
            >
              {/* Buttons */}
              <div className="absolute top-[-8px] left-0 right-0 flex justify-between px-4">
                <button className="w-6 h-4 border-2 border-black bg-red-400 rounded-none shadow-md"></button>
                <button className="w-6 h-4 border-2 border-black bg-green-400 rounded-none shadow-md"></button>
              </div>
              {/* Digital Display */}
              <div className="text-center text-black">
                {countdown === "Deadline passed" ? (
                  <p className="text-lg font-bold">Deadline passed</p>
                ) : (
                  <div>
                    <p className="text-xl font-bold">{countdown.days}d {countdown.hours}h</p>
                    <p className="text-lg font-medium">{countdown.minutes}m {countdown.seconds}s</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Roles & Responsibilities */}
        <div className="px-6 pb-10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaTasks className="text-blue-600" /> Roles & Responsibilities
          </h3>
          <ul className="space-y-2 text-gray-700">
            {(job.responsibilities && job.responsibilities.length > 0
              ? job.responsibilities
              : [" Responsibility 1.", " Responsibility 2.", " Responsibility 3."]
            ).map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 bg-gray-50 rounded"
              >
                <span className="text-blue-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>


        {/* Eligibility Criteria */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800 px-4 flex items-center gap-2">
          <GoChecklist className="text-blue-600" /> Eligibility Criteria
        </h3>
        <div className="px-6 pb-10 w-[90%] mx-auto">
          <div className="relative bg-amber-100 rounded-lg p-6 shadow-lg border border-amber-200">
            {/* Clipboard clip at the top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-100 h-6 bg-yellow-500 rounded-sm shadow-md border border-gray-500">
                <div className="w-8 h-3 bg-yellow-300 rounded-sm mx-auto mt-1.5"></div>
              </div>
            </div>
            {/* Paper/Card content */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-300 mt-4">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Bachelor's degree in Computer Science or related field
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Minimum 60% aggregate in academics
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">No active backlogs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Valid student ID card required
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Must be in final year or final semester
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Skills Required */}
        <div className="px-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <FaTasks className="text-blue-600" /> Skills Required
          </h3>
          <div className="relative w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              {/* Left semicircle container */}
              <div className="relative" style={{ width: "400px", height: "350px" }}>
                {leftSkills.map((skill, index) => {
                  const totalLeftSkills = leftSkills.length;
                  const circleRadius = Math.max(96, 88 + skillsRequired.length * 3);
                  // Changed: Start from top (225°) and go to bottom (135°)
                  const startAngle = 225;
                  const endAngle = 135;
                  const angleStep =
                    totalLeftSkills > 1 ? (endAngle - startAngle) / (totalLeftSkills - 1) : 0;
                  const angle = startAngle + index * angleStep;
                  const radian = (angle * Math.PI) / 180;
                  // Attachment point on circle edge
                  const attachX = 500 + circleRadius * Math.cos(radian);
                  const attachY = 175 + circleRadius * Math.sin(radian);

                  // Now we can use direct numbering since positioning is top to bottom
                  const skillNumber = skillsRequired.findIndex(s => s === skill) + 1;

                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        right: `${400 - attachX}px`,
                        top: `${attachY}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <div
                        className={`${index % 3 === 0
                            ? "bg-slate-600"
                            : index % 3 === 1
                              ? "bg-slate-500"
                              : "bg-slate-400"
                          } text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap relative`}
                      >
                        <span className="text-white font-bold mr-2">
                          {String(skillNumber).padStart(2, "0")}
                        </span>
                        {skill}
                        <div
                          className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 ${index % 3 === 0
                              ? "border-l-slate-600"
                              : index % 3 === 1
                                ? "border-l-slate-500"
                                : "border-l-slate-400"
                            } border-l-8 border-t-4 border-t-transparent border-b-4 border-b-transparent`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Center circle */}
              <div
                className="bg-white border-4 border-gray-400 rounded-full flex flex-col items-center justify-center shadow-lg relative z-10 flex-shrink-0 mx-4"
                style={{
                  width: `${Math.max(192, 176 + skillsRequired.length * 6)}px`,
                  height: `${Math.max(192, 176 + skillsRequired.length * 6)}px`,
                }}
              >
                <h4 className="text-lg font-bold text-gray-800 text-center px-4">SKILLS REQUIRED</h4>
              </div>
              {/* Right semicircle container */}
              <div className="relative" style={{ width: "400px", height: "350px" }}>
                {rightSkills.map((skill, index) => {
                  const totalRightSkills = rightSkills.length;
                  const circleRadius = Math.max(96, 88 + skillsRequired.length * 3);
                  // Changed: Start from top (-45°) and go to bottom (45°)
                  const startAngle = -45;
                  const endAngle = 45;
                  const angleStep =
                    totalRightSkills > 1 ? (endAngle - startAngle) / (totalRightSkills - 1) : 0;
                  const angle = startAngle + index * angleStep;
                  const radian = (angle * Math.PI) / 180;
                  // Attachment point on circle edge
                  const attachX = circleRadius * Math.cos(radian) - 100;
                  const attachY = 175 + circleRadius * Math.sin(radian);

                  // Now we can use direct numbering since positioning is top to bottom
                  const skillNumber = skillsRequired.findIndex(s => s === skill) + 1;

                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${attachX}px`,
                        top: `${attachY}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <div
                        className={`${index % 3 === 0
                            ? "bg-slate-600"
                            : index % 3 === 1
                              ? "bg-slate-500"
                              : "bg-slate-400"
                          } text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap relative`}
                      >
                        <div
                          className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 ${index % 3 === 0
                              ? "border-r-slate-600"
                              : index % 3 === 1
                                ? "border-r-slate-500"
                                : "border-r-slate-400"
                            } border-r-8 border-t-4 border-t-transparent border-b-4 border-b-transparent`}
                        ></div>
                        <span className="text-white font-bold mr-2">
                          {String(skillNumber).padStart(2, "0")}
                        </span>
                        {skill}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>


        {/* Interview Process Timeline */}
        <div className="w-full flex flex-col items-center py-8 px-4">
          <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <FaTasks className="text-blue-600" /> Interview Process
          </h3>
          <div className="relative w-full max-w-2xl mx-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
            {/* Extended Curvy Vertical Path */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 hidden md:block"
              width="75"
              height="1400"
              viewBox="0 0 75 1400"
              fill="none"
              style={{ zIndex: 0, pointerEvents: "none" }}
            >
              <path
                d="
          M37.5 0
          Q75 75 37.5 150
          Q0 225 37.5 300
          Q75 375 37.5 450
          Q0 525 37.5 600
          Q75 675 37.5 750
          Q0 825 37.5 900
          Q75 975 37.5 1050
          Q0 1125 37.5 1200
          Q75 1275 37.5 1350
          Q0 1425 37.5 1400
        "
                stroke="#222"
                strokeWidth="10"
                fill="none"
                strokeDasharray="20 12"
                strokeLinejoin="miter"
              />
              <path
                d="
          M37.5 0
          Q75 75 37.5 150
          Q0 225 37.5 300
          Q75 375 37.5 450
          Q0 525 37.5 600
          Q75 675 37.5 750
          Q0 825 37.5 900
          Q75 975 37.5 1050
          Q0 1125 37.5 1200
          Q75 1275 37.5 1350
          Q0 1425 37.5 1400
        "
                stroke="#fff"
                strokeWidth="5"
                fill="none"
              />
            </svg>
            {/* Steps */}
            <div className="relative z-10 flex flex-col gap-16 pt-8 pb-4">
              {interviewTimeline.map((step, idx) => (
                <div
                  key={step.number}
                  className={`flex ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center relative`}
                  style={{
                    justifyContent: idx % 2 === 0 ? "flex-start" : "flex-end",
                  }}
                >
                  {/* Card Content */}
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "pr-4" : "pl-4"} flex flex-col items-${idx % 2 === 0 ? "end" : "start"}`}>
                    <div className="bg-white rounded-lg shadow-lg border px-5 py-4 max-w-[270px] min-w-[200px] mb-2">
                      <h4 className="font-extrabold uppercase text-gray-900 text-base mb-2">{step.label}</h4>
                      <p className="text-xs text-gray-700">{step.description}</p>
                    </div>
                  </div>
                  {/* Step Dot */}
                  <div className="w-full md:w-1/2 flex flex-col items-center" style={{ marginTop: "-2rem" }}>
                    <div className={`relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full border-4 border-white ${step.color} shadow-xl`}>
                      <span className="z-10">{step.icon}</span>
                      <span className="absolute bottom-2 right-3 text-sm font-black text-white drop-shadow">{step.number}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Buttons Sticky at the Bottom */}
        <div className="sticky bottom-0 z-50 flex gap-2 p-4 shadow-md justify-end">
          <button
            className="px-4 py-2 border-1 border-green-700 text-white rounded-md transition font-semibold shadow-md bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500"
          >
            Apply Now
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border-1 border-gray-700 text-white rounded-md transition font-semibold shadow-md bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
