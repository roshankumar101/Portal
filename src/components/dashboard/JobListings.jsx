import React from 'react';

const JobListings = ({ jobs, onKnowMore }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${(salary / 100000).toFixed(0)} LPA`;
    }
    return salary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
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

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No job postings available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-6 mb-3 p-3">
        <div className="text-gray-800 font-bold text-lg">Company</div>
        <div className="text-gray-800 font-bold text-lg pl-2">Job Title</div>
        <div className="text-gray-800 font-bold text-lg">Tentative Interview Date</div>
        <div className="text-gray-800 font-bold text-lg">Salary (CTC)</div>
        <div></div>
      </div>
      
      {/* Job Listings */}
      {jobs.slice(0, 3).map((job) => (
        <div
          key={job.id}
          className="grid grid-cols-5 gap-6 p-4 rounded-xl bg-blue-100 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 ${getCompanyColor(job.company?.name)} rounded-lg mr-3 flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">
                {getCompanyInitial(job.company?.name)}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {job.company?.name || 'Unknown Company'}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-700 flex items-center whitespace-nowrap overflow-hidden text-ellipsis pl-2">
            {job.jobTitle || 'Unknown Position'}
          </div>
          <div className="text-sm text-gray-600 flex items-center whitespace-nowrap">
            {formatDate(job.interviewDate)}
          </div>
          <div className="text-sm font-medium text-gray-700 flex items-center whitespace-nowrap">
            {formatSalary(job.salary)}
          </div>
          <div className="flex justify-end space-x-1">
            <button 
              onClick={() => onKnowMore && onKnowMore(job)}
              className="px-2 py-1 bg-blue-200 text-blue-800 font-medium rounded-lg hover:bg-blue-300 transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
            >
              Know More
            </button>
            <button 
              className="px-2 py-1 bg-yellow-200 text-yellow-800 font-medium rounded-lg hover:bg-yellow-300 transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
            >
              Apply Now
            </button>
          </div>
        </div>
      ))}
      
      {jobs.length > 3 && (
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm">
            Explore More
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListings;
