import React from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectsSection = () => {
  // Static projects data - Added more projects to demonstrate scrolling
  const projects = [
    {
      projectName: 'E-Commerce Website',
      description: 'A full-stack e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Implemented responsive design and optimized for performance.',
      projectUrl: 'https://github.com/username/ecommerce-website'
    },
    {
      projectName: 'Task Management App',
      description: 'A collaborative task management application using React, Firebase, and Material-UI. Users can create projects, assign tasks, set deadlines, and track progress. Real-time updates and notifications keep teams synchronized.',
      projectUrl: 'https://github.com/username/task-manager'
    },
    {
      projectName: 'Weather Dashboard',
      description: 'Interactive weather dashboard with location-based forecasts, historical data visualization, and weather alerts. Built using React, Chart.js, and OpenWeather API. Features include dark/light themes and mobile responsiveness.',
      projectUrl: 'https://github.com/username/weather-dashboard'
    },
    {
      projectName: 'Social Media Platform',
      description: 'A comprehensive social media platform with real-time messaging, post sharing, user profiles, and friend connections. Built with React, Socket.io, and MongoDB. Features include image/video uploads and privacy controls.',
      projectUrl: 'https://github.com/username/social-platform'
    },
    {
      projectName: 'AI Chatbot Assistant',
      description: 'An intelligent chatbot built using Python, TensorFlow, and natural language processing. Capable of answering queries, providing recommendations, and learning from user interactions.',
      projectUrl: 'https://github.com/username/ai-chatbot'
    },
    {
      projectName: 'Finance Tracker',
      description: 'Personal finance management application with expense tracking, budget planning, and financial goal setting. Includes data visualization and automated categorization of transactions.',
      projectUrl: 'https://github.com/username/finance-tracker'
    }
  ];


  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Project Details
        </legend>
        
        <div className="my-3">
          {/* Scrollable container with fixed height for 3 projects */}
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 pr-2">
            <div className="space-y-2">
              {projects.map((project, index) => (
                <ul key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex-shrink-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{project.projectName}</h4>
                  
                  <li className="mb-3 ml-4">
                    <span className="font-semibold text-gray-800">Project Description: </span>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </span>
                  </li>
                  
                  <li className="ml-4">
                    <span className="font-semibold text-gray-800">Project URL: </span>
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
