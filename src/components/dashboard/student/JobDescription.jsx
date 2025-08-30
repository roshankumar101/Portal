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
} from "react-icons/fa";
import { GoChecklist } from "react-icons/go";

const JobDescription = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  // -------- Skills Array --------
  const skillsRequired = [
    "JavaScript & ES6+",
    "React.js & Node.js",
    "Database Management",
    "Problem Solving",
    "Team Collaboration",
    "Git & Version Control",
    "REST APIs",
    "Agile Methodology"
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

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // -------- Countdown --------
  const [now, setNow] = useState(Date.now());
  const deadline = useMemo(
    () =>
      job.applicationDeadline
        ? new Date(job.applicationDeadline).getTime()
        : null,
    [job.applicationDeadline]
  );

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const countdown = useMemo(() => {
    if (!deadline) return { text: "Not specified", expired: false };
    const diff = deadline - now;
    if (diff <= 0) return { text: "Deadline passed", expired: true };
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return { text: `${d}d : ${h}h : ${m}m`, expired: false };
  }, [deadline, now]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl shadow-2xl w-[95%] md:w-[80%] h-[95%] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="text-center mt-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {job.jobTitle || "Job Position"}
          </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaMoneyBillWave className="text-blue-600 text-lg" />
              <p className="text-sm text-gray-500">CTC</p>
            </div>
            <p className="font-semibold text-gray-800">
              {formatSalary(job.salary)}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaCalendarAlt className="text-green-600 text-lg" />
              <p className="text-sm text-gray-500">Drive Date</p>
            </div>
            <p className="font-semibold text-gray-800">
              {/* {formatDate(job.driveDate)} */} 15-09-25
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow-sm text-center">
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaBuilding className="text-purple-600 text-lg" />
              <p className="text-sm text-gray-500">Venue</p>
            </div>
            <p className="font-semibold text-gray-800">
              {job.driveVenues?.[0] || "Bangalore"}
            </p>
          </div>

          {/* Application Deadline (Date + Countdown) */}
          <div
            className={`p-4 rounded-lg shadow-sm text-center ${countdown.expired ? "bg-red-50" : "bg-amber-50"
              }`}
          >
            <div className="flex justify-center gap-2 items-center mb-1">
              <FaClock
                className={`text-lg ${countdown.expired ? "text-red-600" : "text-amber-600"
                  }`}
              />
              <p className="text-sm text-gray-500">Application Deadline</p>
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
              : [
                " Responsibility 1.",
                " Responsibility 2.",
                " Responsibility 3.",
              ]
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
                  <span className="text-gray-700 text-sm">Bachelor's degree in Computer Science or related field</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Minimum 60% aggregate in academics</span>
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
                  <span className="text-gray-700 text-sm">Valid student ID card required</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center bg-green-100">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Must be in final year or final semester</span>
                </li>
              </ul>

            </div>
          </div>
        </div>

        {/* Skills Required */}
        <div className="px-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaTasks className="text-blue-600" /> Skills Required
          </h3>

          <div className="relative w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center">

              {/* Left semicircle container */}
              <div className="relative" style={{ width: '400px', height: '350px' }}>
                {leftSkills.map((skill, index) => {
                  const totalLeftSkills = leftSkills.length;
                  const circleRadius = Math.max(96, 88 + (skillsRequired.length * 3));
                  const startAngle = 135;
                  const endAngle = 225;
                  const angleStep = totalLeftSkills > 1 ? (endAngle - startAngle) / (totalLeftSkills - 1) : 0;
                  const angle = startAngle + (index * angleStep);
                  const radian = (angle * Math.PI) / 180;

                  // Attachment point on circle edge
                  const attachX = 500 + circleRadius * Math.cos(radian);
                  const attachY = 175 + circleRadius * Math.sin(radian);

                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        right: `${400 - attachX}px`, // Anchor right edge of box to attachment point
                        top: `${attachY}px`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <div className={`${index % 3 === 0 ? 'bg-slate-600' : index % 3 === 1 ? 'bg-slate-500' : 'bg-slate-400'} text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap relative`}>
                        <span className="text-white font-bold mr-2">{String(index * 2 + 1).padStart(2, '0')}</span>
                        {skill}
                        <div className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 ${index % 3 === 0 ? 'border-l-slate-600' : index % 3 === 1 ? 'border-l-slate-500' : 'border-l-slate-400'} border-l-8 border-t-4 border-t-transparent border-b-4 border-b-transparent`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center circle */}
              <div
                className="bg-white border-4 border-gray-400 rounded-full flex flex-col items-center justify-center shadow-lg relative z-10 flex-shrink-0 mx-4"
                style={{
                  width: `${Math.max(192, 176 + (skillsRequired.length * 6))}px`,
                  height: `${Math.max(192, 176 + (skillsRequired.length * 6))}px`
                }}
              >
                <h4 className="text-lg font-bold text-gray-800 text-center px-4">SKILLS REQUIRED</h4>
              </div>

              {/* Right semicircle container */}
              <div className="relative" style={{ width: '400px', height: '350px' }}>
                {rightSkills.map((skill, index) => {
                  const totalRightSkills = rightSkills.length;
                  const circleRadius = Math.max(96, 88 + (skillsRequired.length * 3));
                  const startAngle = 45;
                  const endAngle = -45;
                  const angleStep = totalRightSkills > 1 ? (startAngle - endAngle) / (totalRightSkills - 1) : 0;
                  const angle = startAngle - (index * angleStep);
                  const radian = (angle * Math.PI) / 180;

                  // Attachment point on circle edge
                  const attachX = circleRadius * Math.cos(radian) - 100;
                  const attachY = 175 + circleRadius * Math.sin(radian);

                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${attachX}px`, // Anchor left edge of box to attachment point
                        top: `${attachY}px`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <div className={`${index % 3 === 0 ? 'bg-slate-600' : index % 3 === 1 ? 'bg-slate-500' : 'bg-slate-400'} text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap relative`}>
                        <div className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 ${index % 3 === 0 ? 'border-r-slate-600' : index % 3 === 1 ? 'border-r-slate-500' : 'border-r-slate-400'} border-r-8 border-t-4 border-t-transparent border-b-4 border-b-transparent`}></div>
                        <span className="text-white font-bold mr-2">{String((index + leftSkills.length) * 2).padStart(2, '0')}</span>
                        {skill}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            
          </div>
        </div>






        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 sticky bottom-0">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Apply Now
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
