import React from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const ApplicationTracker = ({ applications, onDeleteApplication }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return <Clock className="h-3 w-3 mr-1" />;
      case 'shortlisted': return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'interviewed': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'offered': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'rejected': return <XCircle className="h-3 w-3 mr-1" />;
      default: return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const getRowBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'from-blue-50 to-blue-100';
      case 'shortlisted': return 'from-yellow-50 to-yellow-100';
      case 'interviewed': return 'from-purple-50 to-purple-100';
      case 'offered': return 'from-green-50 to-green-100';
      case 'rejected': return 'from-red-50 to-red-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : '?';
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 
      'bg-red-600', 'bg-indigo-600', 'bg-pink-600'
    ];
    const index = companyName ? companyName.length % colors.length : 0;
    return colors[index];
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found. Start applying to jobs!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-4 mb-2 p-4">
        <div className="text-gray-800 font-bold text-lg">Company</div>
        <div className="text-gray-800 font-bold text-lg">Job Title</div>
        <div className="text-gray-800 font-bold text-lg">Date Applied</div>
        <div className="text-gray-800 font-bold text-lg text-right">Status</div>
        <div className="text-gray-800 font-bold text-lg text-center">Actions</div>
      </div>
      
      {/* Application Rows */}
      {applications.slice(0, 5).map((application, index) => (
        <div
          key={application.id}
          className={`grid grid-cols-5 gap-4 p-4 rounded-xl bg-gradient-to-r ${getRowBgColor(application.status)} hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 ${getCompanyColor(application.company?.name)} rounded-lg mr-3 flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">
                {getCompanyInitial(application.company?.name)}
              </span>
            </div>
            <div className="text-base font-semibold text-gray-900">
              {application.company?.name || 'Unknown Company'}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-700 flex items-center">
            {application.job?.jobTitle || 'Unknown Position'}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {formatDate(application.appliedDate)}
          </div>
          <div className="flex justify-end">
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => onDeleteApplication && onDeleteApplication(application.id, index)}
              className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded hover:bg-red-50"
              title="Delete Application"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      {applications.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing 5 of {applications.length} applications
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
