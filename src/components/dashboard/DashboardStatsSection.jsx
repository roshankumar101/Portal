import React from 'react';
import StudentStats from './StudentStats';

const DashboardStatsSection = ({ studentData }) => {
  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-3 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Dashboard Stats
        </legend>
        <div className="my-3">
          <StudentStats stats={studentData?.stats} />
        </div>
      </fieldset>
    </div>
  );
};

export default DashboardStatsSection;
