import React from 'react';
import AwsLogoUrl from '../../../assets/Amazon_Web_Services-Logo.wine.svg';

const companySvgs = {
  Google: (
    <svg
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <path fill="#4285F4" d="M533.5 278.4c0-17.3-1.6-34-4.7-50.2H272v95.4h147c-6.3 34-25 62.8-53.4 82.1l86.1 67.3c50.4-46.5 81.8-114.9 81.8-194.6z" />
      <path fill="#34A853" d="M272 544.3c72.1 0 132.6-23.9 176.8-65.2l-86.1-67.3c-23.9 16-54.7 25.5-90.7 25.5-69.6 0-128.6-47-149.7-110.3L31 362.9C76.6 458 167.8 544.3 272 544.3z" />
      <path fill="#FBBC05" d="M122.3 327.1c-10.9-32-10.9-66.8 0-98.8L31 181c-41.9 83.8-41.9 183.6 0 267.4l91.3-71.3z" />
      <path fill="#EA4335" d="M272 107.7c39.2-.6 76.9 13.7 106 39.7l79-79C416.4 24.4 346.8-1.6 272 0 167.8 0 76.6 86.3 31 181l91.3 47.3C143.3 154.7 202.3 107.7 272 107.7z" />
    </svg>
  ),
  Microsoft: (
    <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="10" height="10" x="0" y="0" fill="#F25022" />
      <rect width="10" height="10" x="12" y="0" fill="#7FBA00" />
      <rect width="10" height="10" x="0" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  ),

  Amazon: <img src={AwsLogoUrl} alt="Amazon Web Services logo" className="w-12 h-12" />,

  Facebook: (
    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="#1877F2">
      <path d="M18 0C8 0 0 8 0 18c0 9 7 16.5 16 17.8v-12.6h-4v-5.3h4v-4c0-4 2.5-6 6-6 1.7 0 3 .1 3 .1v3.5h-2c-1.8 0-2.3 1.1-2.3 2.3v2.6h4l-.6 5.3h-3.5V36c8-1.5 14-8.8 14-17.7C36 8 28 0 18 0z" />
    </svg>
  ),
  Apple: (
    <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className="w-8 h-10" fill="black">
      <path d="M318.7 268c-.2-37.3 16.4-65.5 51.2-86-19.3-28.1-48.5-44-92-47.7-39-3.5-81.4 23.4-96.1 23.4-15.3 0-49-22.7-75.8-22-55.4 1-114.6 32.2-114.6 96.5 0 28.7 10.8 59.1 31.7 95.9 30.3 52.6 70.5 111.8 128.2 110 25.2-.6 43-15.9 72.1-15.9 28.4 0 45.6 15.9 75.9 15.5 30.5-.4 62.3-28.8 85.6-81-50.2-19.2-96.3-80.2-94.2-88.7zM251.4 92c17.4-21.1 29.2-50.6 25.9-80-24.9 1-54.8 17-72.3 38.5-15.8 19.3-29.9 49.9-26.1 78.8 27.5 2.1 55.1-14.8 72.5-37.3z" />
    </svg>
  ),
  PwC: (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className="w-24 h-6">
      <rect width="50" height="50" fill="#FF6600" />
      <rect x="50" width="50" height="35" fill="#FF9900" />
      <rect x="100" width="100" height="20" fill="#FFCC00" />
    </svg>
  ),
  Deloitte: (
    <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="w-20 h-6">
      <text x="0" y="40" fontSize="36" fontFamily="Arial, sans-serif" fill="black">
        Deloitte
      </text>
      <circle cx="185" cy="30" r="10" fill="#86BC25" />
    </svg>
  ),
};

const JobPostingsSection = ({ jobs, onKnowMore }) => {
  const getCompanySvg = (companyName) => {
    return companyName && companySvgs[companyName] ? companySvgs[companyName] : null;
  };

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
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const jobsWithSvgs = (jobs || []).filter((job) => getCompanySvg(job.company?.name));

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] py-4 px-6 transition-all duration-200 shadow-lg">
        <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text">
          Latest Job Postings
        </legend>

        <div className="mb-3 mt-1">
          {jobsWithSvgs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No job postings available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="grid grid-cols-5 gap-6 mb-3 py-3 px-6">
                <div className="text-black font-bold text-lg col-span-1 flex items-center space-x-3">
                  Company
                </div>
                <div className="text-black font-bold text-lg">Job Title</div>
                <div className="text-black font-bold text-lg">Interview Date</div>
                <div className="text-black font-bold text-lg">Salary (CTC)</div>
                <div></div>
              </div>

              {/* Job Listings */}
              {jobsWithSvgs.slice(0, 3).map((job) => {
                const companyName = job.company?.name;
                const logoSvg = getCompanySvg(companyName);

                return (
                  <div
                    key={job.id}
                    className="grid grid-cols-5 gap-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-[#f0f8fa] hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      {logoSvg && <div className="w-10 h-8">{logoSvg}</div>}
                      <span className="text-base font-semibold text-black truncate">
                        {companyName || 'Unknown Company'}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-gray-800 flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.jobTitle || 'Unknown Position'}
                    </div>

                    <div className="text-sm text-gray-600 flex items-center whitespace-nowrap">
                      {formatDate(job.interviewDate)}
                    </div>

                    <div className="text-sm font-medium text-gray-800 flex items-center whitespace-nowrap">
                      {formatSalary(job.salary)}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onKnowMore && onKnowMore(job)}
                        className="px-2 py-1 border border-[#3c80a7] bg-[#8ec5ff] text-black font-medium rounded-sm hover:bg-[#2563eb] transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
                      >
                        Know More
                      </button>
                      <button
                        className="px-2 py-1 border border-green-600 bg-[#268812] text-white font-medium rounded-sm hover:bg-green-600 transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}

              {jobsWithSvgs.length > 3 && (
                <div className="flex justify-end pt-1">
                  <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-900 text-white font-medium rounded-sm hover:bg-[#3c80a7] hover:text-white transition-all duration-200 shadow-md transform hover:scale-105 text-sm">
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
