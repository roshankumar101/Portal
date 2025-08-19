import React from 'react';
import StudentStats from './StudentStats';

const DashboardStatsSection = ({ applications = [] }) => {
  // Calculate dynamic stats from applications data
  const calculateStats = (applications) => {
    const stats = {
      applied: applications.length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      offers: applications.filter(app => app.status === 'selected' || app.status === 'offered').length
    };
    return stats;
  };

  const calculatedStats = calculateStats(applications);
  
  const stats = [
    { label: 'Applied', value: calculatedStats.applied, color: 'bg-blue-100 text-blue-800' },
    { label: 'Shortlisted', value: calculatedStats.shortlisted, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Interviewed', value: calculatedStats.interviewed, color: 'bg-purple-100 text-purple-800' },
    { label: 'Offers', value: calculatedStats.offers, color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-3 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Dashboard Stats
        </legend>
        <div className="my-3">
          <StudentStats stats={stats} />
        </div>
      </fieldset>
    </div>
  );
};

export default DashboardStatsSection;
