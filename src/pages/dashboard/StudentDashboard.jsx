import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHome from '../../components/dashboard/DashboardHome';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'jobs':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Job Opportunities</h2>
            <p className="text-gray-600">Detailed job listing page coming soon...</p>
          </div>
        );
      case 'applications':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">My Applications</h2>
            <p className="text-gray-600">Application tracking page coming soon...</p>
          </div>
        );
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <p className="text-gray-600">Events calendar coming soon...</p>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}


