import React, { useState } from 'react';
import { ExternalLink, Edit2, Plus } from 'lucide-react';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([
    {
      projectName: 'E-Commerce Website',
      description:
        'A full-stack e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Implemented responsive design and optimized for performance.',
      projectUrl: 'https://github.com/username/ecommerce-website',
    },
    {
      projectName: 'Task Management App',
      description:
        'A collaborative task management application using React, Firebase, and Material-UI. Users can create projects, assign tasks, set deadlines, and track progress. Real-time updates and notifications keep teams synchronized.',
      projectUrl: 'https://github.com/username/task-manager',
    },
    {
      projectName: 'Weather Dashboard',
      description:
        'Interactive weather dashboard with location-based forecasts, historical data visualization, and weather alerts. Built using React, Chart.js, and OpenWeather API. Features include dark/light themes and mobile responsiveness.',
      projectUrl: 'https://github.com/username/weather-dashboard',
    },
    {
      projectName: 'Social Media Platform',
      description:
        'A comprehensive social media platform with real-time messaging, post sharing, user profiles, and friend connections. Built with React, Socket.io, and MongoDB. Features include image/video uploads and privacy controls.',
      projectUrl: 'https://github.com/username/social-platform',
    },
    {
      projectName: 'AI Chatbot Assistant',
      description:
        'An intelligent chatbot built using Python, TensorFlow, and natural language processing. Capable of answering queries, providing recommendations, and learning from user interactions.',
      projectUrl: 'https://github.com/username/ai-chatbot',
    },
    {
      projectName: 'Finance Tracker',
      description:
        'Personal finance management application with expense tracking, budget planning, and financial goal setting. Includes data visualization and automated categorization of transactions.',
      projectUrl: 'https://github.com/username/finance-tracker',
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProject, setEditedProject] = useState({
    projectName: '',
    description: '',
    projectUrl: '',
  });

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedProject({ ...projects[index] });
  };

  const handleChange = (field, value) => {
    setEditedProject((prev) => ({ ...prev, [field]: value }));
  };

  const saveProject = () => {
    setProjects((prev) =>
      prev.map((proj, idx) => (idx === editingIndex ? editedProject : proj))
    );
    setEditingIndex(null);
  };

  const deleteProject = (index) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const addProject = () => {
    setProjects((prev) => [...prev, { projectName: '', description: '', projectUrl: '' }]);
    setEditingIndex(projects.length);
    setEditedProject({ projectName: '', description: '', projectUrl: '' });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  return (
    <div className="w-full relative">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] pt-1 pb-4 px-6 transition-all duration-200 shadow-lg">
        <legend className="text-xl font-bold bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text px-2">
          Projects
        </legend>

        <div className="flex justify-end mb-3 mr-[-1%]">
          <button
            onClick={addProject}
            aria-label="Add new project"
            className="bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>

        <div className="my-2">
          <div className="max-h-[480px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {projects.map((project, index) =>
              editingIndex === index ? (
                <div
                  key={index}
                  className="rounded-lg px-4 py-3 bg-gradient-to-r from-[#f0f8fa] to-[#e6f3f8]"
                >
                  <input
                    type="text"
                    value={editedProject.projectName}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                    placeholder="Project Name"
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                  />
                  <textarea
                    value={editedProject.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Project Description"
                    rows={3}
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded resize-none"
                  />
                  <input
                    type="url"
                    value={editedProject.projectUrl}
                    onChange={(e) => handleChange('projectUrl', e.target.value)}
                    placeholder="Project URL"
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                  />
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => deleteProject(index)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProject}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <ul
                  key={index}
                  className={`rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md bg-gradient-to-r ${
                    index % 2 !== 0 ? 'from-gray-50 to-gray-100' : 'from-[#f0f8fa] to-[#e6f3f8]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-black mb-2">{project.projectName}</h4>
                    <button
                      onClick={() => startEditing(index)}
                      aria-label={`Edit project ${project.projectName}`}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>

                  <li className="mb-1 ml-4 list-none">
                    <span className="font-semibold text-gray-800">Project Description: </span>
                    <span className="text-sm text-gray-600 leading-relaxed">{project.description}</span>
                  </li>

                  <li className="ml-4 list-none">
                    <span className="font-semibold text-gray-800">Project URL: </span>
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#3c80a7] hover:text-[#2f6786] text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Project
                    </a>
                  </li>
                </ul>
              )
            )}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ProjectsSection;
