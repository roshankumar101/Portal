import React, { useState, useRef } from "react";

export default function Resume() {
  const [resumeFile, setResumeFile] = useState(null);
  const dropRef = useRef();

  // Drag-drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-blue-500");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-blue-500");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-blue-500");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Resume</h2>
        
        {!resumeFile ? (
          <div
            ref={dropRef}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resumeInput").click()}
          >
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png"
              alt="drag-drop"
              className="mb-4 w-20"
            />
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Drag & drop</span> your resume here, or <span className="underline">click to select a file</span>
            </p>
            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-green-600 mb-2 font-medium">Resume uploaded:</p>
            <p className="font-semibold text-gray-700">{resumeFile.name}</p>
          
          </div>
        )}
      </div>
    </div>
  );
}
