import React from 'react';

const JobPostingsSection = ({ jobs, onKnowMore }) => {
  // Map of company names to logo URLs
  const companyLogos = {
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'Facebook': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'PwC': 'https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg',
    'Deloitte': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deloitte_Logo.svg',
  };

  // Get logo URL by company name or null if not listed
  const getCompanyLogo = (companyName) => {
    if (!companyName) return null;
    return companyLogos[companyName] || null;
  };

  // Get first letter uppercase for fallback avatar (not used now since filtered)
  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : '?';
  };

  // Color fallback helper (optional, not shown since logos filtered)
  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-red-600',
      'bg-indigo-600',
      'bg-pink-600',
    ];
    const index = companyName ? companyName.length % colors.length : 0;
    return colors[index];
  };

  // Format salary display helper
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${(salary / 100000).toFixed(0)} LPA`;
    }
    return salary;
  };

  // Format interview date display helper
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Filtered jobs only for companies with logos
  const jobsWithLogos = (jobs || []).filter(
    (job) => getCompanyLogo(job.company?.name)
  );

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-blue-200 py-4 px-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-2 bg-blue-100 rounded-full">
          Latest Job Postings
        </legend>
        <div className="my-3">
          {jobsWithLogos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No job postings available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="grid grid-cols-5 gap-6 mb-3 py-3 px-6">
                <div className="text-gray-800 font-bold text-lg">Company</div>
                <div className="text-gray-800 font-bold text-lg pl-2">Job Title</div>
                <div className="text-gray-800 font-bold text-lg">
                  Interview Date
                  <div className="text-sm -mt-2">(Tentative)</div>
                </div>
                <div className="text-gray-800 font-bold text-lg">Salary (CTC)</div>
                <div></div>
              </div>

              {/* Job Listings */}
              {jobsWithLogos.slice(0, 3).map((job) => {
                const logoUrl = getCompanyLogo(job.company?.name);
                return (
                  <div
                    key={job.id}
                    className="grid grid-cols-5 gap-6 p-4 rounded-xl bg-blue-50 hover:shadow-md transition-all duration-200"
                  >
                    <div className='pl-[10%]'>
                      {/* Logo image */}
                      <img
                        src={logoUrl}
                        alt={`${job.company?.name} logo`}
                        className="w-[50%] h-8 rounded-md object-contain"
                      />
                      
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
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onKnowMore && onKnowMore(job)}
                        className="px-2 py-1 bg-blue-200 text-blue-800 font-medium rounded-sm hover:bg-blue-300 transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
                      >
                        Know More
                      </button>
                      <button
                        className="px-2 py-1 bg-yellow-200 text-yellow-800 font-medium rounded-sm hover:bg-yellow-300 transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}

              {jobsWithLogos.length > 3 && (
                <div className="flex justify-end pt-2">
                  <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm">
                    Explore More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};

export default JobPostingsSection;
