import React from "react";

// Company SVG Icons
const CompanyLogoIcon = ({ company }) => {
  switch (company) {
    case "Microsoft":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <rect x="2" y="2" width="13" height="13" fill="#f35022" />
          <rect x="17" y="2" width="13" height="13" fill="#80ba01" />
          <rect x="2" y="17" width="13" height="13" fill="#01a4ef" />
          <rect x="17" y="17" width="13" height="13" fill="#ffb900" />
        </svg>
      );
    case "Google":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <g>
            {/* Google G paths here as before */}
            <path fill="#4285F4" d="M16.32 13.37v4.07h5.72c-.23 1.16-1.41 3.39-5.72 3.39-3.43 0-6.22-2.83-6.22-6.33 0-3.51 2.79-6.33 6.22-6.33 1.95 0 3.27.82 4.02 1.53l2.74-2.66C21.38 5.22 19.23 4 16.32 4 10.51 4 5.69 8.82 5.69 14.11c0 5.3 4.82 10.11 10.63 10.11 6.11 0 10.15-4.29 10.15-10.34 0-.7-.08-1.24-.19-1.76z"/>
            <path fill="#34A853" d="M6.43 9.84l3.35 2.54c.9-1.72 2.61-2.93 4.54-2.93 1.28 0 2.42.45 3.32 1.29l2.79-2.73C19.07 6.19 17.79 5.69 16.32 5.69c-3.27 0-6.15 2.41-7.02 5.87z"/>
            <path fill="#FBBC05" d="M16.32 24.53c2.88 0 5.29-.95 7.03-2.71l-3.24-2.65c-.9.71-2.03 1.11-3.8 1.11-2.94 0-5.42-1.99-6.32-4.7H6.19v2.84C8.18 22.07 11.93 24.53 16.32 24.53z"/>
            <path fill="#EA4335" d="M24.02 10.82h-2.17v-.01H16.32v2.92h4.45c-.17 1.01-1.36 2.97-4.45 2.97-2.68 0-4.87-2.2-4.87-4.9 0-.71.27-1.39.7-1.91V9.85H7.56C7.26 10.45 7.07 11.13 7.07 11.91c0 1.38.5 3.07 1.9 4.45l3.36-2.57c-.33-.57-.54-1.23-.54-1.93 0-.73.22-1.4.56-1.97z"/>
          </g>
        </svg>
      );
    case "Amazon":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <circle cx="16" cy="16" r="16" fill="#fff" />
          <text x="7" y="24" fontWeight="bold" fontSize="22" fontFamily="Arial" fill="#232f3e">a</text>
          <path d="M9 26c2.5 2.5 12 2.5 14 0" fill="none" stroke="#ff9900" strokeWidth="2" />
          <path d="M21 25l2 1-1-2" fill="none" stroke="#ff9900" strokeWidth="2" />
        </svg>
      );
    case "Apple":
      return (
        <svg viewBox="0 0 30 30" width={32} height={32}>
          <path fill="#222" d="M23.87,16.4c0,3.56,2.86,4.73,2.9,4.75c-0.02,0.08-0.45,1.53-1.48,3.03c-0.9,1.34-1.85,2.69-3.33,2.72c-1.45,0.03-1.92-0.87-3.59-0.87s-2.18,0.84-3.57,0.9c-1.44,0.06-2.54-1.45-3.45-2.79c-1.88-2.69-3.33-7.6-1.39-10.93c0.96-1.65,2.69-2.7,4.57-2.72c1.34-0.03,2.6,0.91,3.59,0.91s2.46-1.12,4.14-0.95c0.71,0.03,2.72,0.29,4.01,2.18C25.23,13.67,23.87,16.4,23.87,16.4z"/>
          <path fill="#222" d="M20.75,7.12c0.81-0.98,1.36-2.34,1.22-3.62c-1.18,0.05-2.63,0.8-3.48,1.77c-0.76,0.88-1.43,2.3-1.18,3.63C18.41,8.99,19.89,8.1,20.75,7.12z"/>
        </svg>
      );
    case "Facebook":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <circle cx="16" cy="16" r="16" fill="#1877f3"/>
          <text x="10" y="24" fontWeight="bold" fontSize="22" fontFamily="Arial" fill="#fff">f</text>
        </svg>
      );
    case "PwC":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <rect width="32" height="32" rx="16" fill="#fff" />
          <rect x="6" y="16" width="20" height="7" fill="#e87722" />
          <rect x="7" y="9" width="7" height="7" fill="#f15a29" />
        </svg>
      );
    case "Deloitte":
      return (
        <svg viewBox="0 0 32 32" width={32} height={32}>
          <circle cx="16" cy="16" r="16" fill="#fff" />
          <circle cx="23" cy="23" r="6" fill="#64bc46" />
        </svg>
      );
    default:
      return null;
  }
};

// Helper for fallback color (hash to class)
const fallbackColors = [
  "bg-[#3c80a7]", // main theme!
  "bg-green-600",
  "bg-purple-700",
  "bg-red-500",
  "bg-gray-500",
  "bg-pink-500",
];

function getFallbackColor(company) {
  if (!company) return fallbackColors[0];
  let code = 0;
  for (let i = 0; i <1; i++) code += company.charCodeAt(i);
  return fallbackColors[code % fallbackColors.length];
}

const FallbackLogo = ({ company }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${getFallbackColor(company)}`}
    title={company}
  >
    {company?.toUpperCase() || "?"}
  </div>
);

const JobPostingsSection = ({ jobs, onKnowMore }) => {
  // Format salary to ₹X LPA
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === "number") {
      return `₹${(salary / 100000).toFixed(0)} LPA`;
    }
    return salary;
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6">
        <legend className="text-xl font-bold text-[#3c80a7] px-3 bg-[#e3f0fa] rounded-full">
          Latest Job Postings
        </legend>
        <div className="my-3">
          {!jobs || jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No job postings available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="grid grid-cols-5 gap-6 mb-3 py-2 px-4">
                <div className="text-[#3c80a7] font-bold text-lg">Company</div>
                <div className="text-[#3c80a7] font-bold text-lg">Job Title</div>
                <div className="text-[#3c80a7] font-bold text-lg">
                  Interview Date
                  <div className="text-xs -mt-1">(Tentative)</div>
                </div>
                <div className="text-[#3c80a7] font-bold text-lg">Salary (CTC)</div>
                <div></div>
              </div>
              {/* Job Listings */}
              {jobs.slice(0, 3).map((job) => {
                const icon = CompanyLogoIcon({ company: job.company?.name });
                return (
                  <div
                    key={job.id}
                    className="grid grid-cols-5 gap-6 p-4 rounded-xl bg-[#e3f0fa] hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <span className="mr-3">
                        {icon || <FallbackLogo company={job.company?.name} />}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                        {job.company?.name || "Unknown Company"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.jobTitle || "Unknown Position"}
                    </div>
                    <div className="text-sm text-gray-700 flex items-center whitespace-nowrap">
                      {formatDate(job.interviewDate)}
                    </div>
                    <div className="text-sm font-medium text-gray-800 flex items-center whitespace-nowrap">
                      {formatSalary(job.salary)}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onKnowMore && onKnowMore(job)}
                        className="px-2 py-1 bg-[#3c80a7] text-white font-medium rounded-sm hover:bg-[#246087] transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
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
              {jobs.length > 3 && (
                <div className="flex justify-end pt-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-[#3c80a7] to-[#246087] text-white font-medium rounded-lg hover:from-[#246087] hover:to-[#3c80a7] transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3c80a7] focus:ring-opacity-50 text-sm">
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
