import React, { useEffect, useMemo, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaExternalLinkAlt,
  FaUserTie,
  FaTasks,
} from "react-icons/fa";
import pwLogo from "../../../assets/physics-wallah-seeklogo.png";

const JobDescription = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  // -------- Helpers stay same --------
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

  // Countdown logic
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
    const s = Math.floor((diff / 1000) % 60);
    return { text: `${d}d : ${h}h : ${m}m : ${s}s`, expired: false };
  }, [deadline, now]);

  // --------- New Layout ---------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[95%] md:w-[85%] h-[90%] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* PW Logo */}
          <img
            src={pwLogo}
            alt="PW IOI"
            className="w-14 h-14 rounded bg-white p-1 shadow"
          />

          {/* Company Info */}
          <div className="flex items-center gap-4 flex-1">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company?.name || "Company"}
                className="w-14 h-14 rounded-full object-cover bg-white p-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-blue-500">
                {job.company?.name?.[0] || "?"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{job.company?.name}</h1>
              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-100 hover:text-white"
                >
                  {job.company.website} <FaExternalLinkAlt size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="ml-auto text-white hover:text-gray-200 transition p-2 rounded-full hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        {/* Job Title */}
        <div className="text-center py-6 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {job.jobTitle || "Job Position"}
          </h2>
        </div>

        {/* Position Details Row */}
        <div className="flex flex-wrap justify-center gap-6 px-6 mb-6">
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
            <span>{job.location || "Not specified"}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <FaMoneyBillWave className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">CTC</p>
              <p className="font-semibold text-gray-800">
                {formatSalary(job.salary)}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <FaCalendarAlt className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Drive Date</p>
              <p className="font-semibold text-gray-800">
                {formatDate(job.driveDate)}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <FaBuilding className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-semibold text-gray-800">
                {job.driveVenues?.[0] || "TBD"}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div
            className={`p-4 rounded-lg shadow-sm flex items-center gap-3 ${
              countdown.expired ? "bg-red-50" : "bg-amber-50"
            }`}
          >
            <FaClock
              className={`text-xl ${
                countdown.expired ? "text-red-600" : "text-amber-600"
              }`}
            />
            <div>
              <p className="text-sm text-gray-500">Application Deadline</p>
              <p
                className={`font-semibold ${
                  countdown.expired ? "text-red-600" : "text-amber-700"
                }`}
              >
                {countdown.text}
              </p>
            </div>
          </div>
        </div>

        {/* Roles & Responsibilities */}
        <div className="px-6 mb-10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaTasks className="text-blue-600" /> Roles & Responsibilities
          </h3>
          <ul className="space-y-2 text-gray-700">
            {(job.responsibilities && job.responsibilities.length > 0
              ? job.responsibilities
              : [
                  "Collaborate with cross-functional teams.",
                  "Write clean, maintainable code.",
                  "Participate in code reviews.",
                ]
            ).map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <FaUserTie className="text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
