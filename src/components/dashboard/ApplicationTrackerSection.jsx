import React from 'react';
import ApplicationTracker from './ApplicationTracker';

const ApplicationTrackerSection = ({ applications, onDeleteApplication }) => {
  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Live Application Tracker
        </legend>
        
        <div className="my-3">
          <ApplicationTracker applications={applications} onDeleteApplication={onDeleteApplication} />
        </div>
        
        {/* Track All Button */}
        {applications.length > 5 && (
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm">
              Track All
            </button>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default ApplicationTrackerSection;
