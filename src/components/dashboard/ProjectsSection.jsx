import React from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectsSection = () => {
  // Sample projects data
  const projects = [
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
  ];

  return (
    <div className="w-full relative">
      {/* Embedded custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0f2fe; /* Tailwind blue-100 */
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6; /* Tailwind blue-500 */
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb; /* Tailwind blue-600 */
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #e0f2fe;
        }
      `}</style>

      <fieldset className="bg-white rounded-lg border-2 border-blue-200 py-4 px-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-2 bg-blue-100 rounded-full">
          Project Details
        </legend>

        <div className="my-2">
          {/* Vertical scrollable container */}
          <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
              {projects.map((project, index) => (
                <ul
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 py-3 hover:shadow-md transition-all duration-200"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {project.projectName}
                  </h4>

                  <li className="mb-1 ml-4">
                    <span className="font-semibold text-gray-800">
                      Project Description:{' '}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </span>
                  </li>

                  <li className="ml-4">
                    <span className="font-semibold text-gray-800">
                      Project URL:{' '}
                    </span>
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Project
                    </a>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ProjectsSection;
