import React from 'react';
import JobListings from './JobListings';

const JobPostingsSection = ({ jobs, onKnowMore, onApply, hasApplied, applying, meetsEligibility, onExploreMore }) => {
  // Default functions if not provided
  const defaultOnApply = onApply || (() => console.log('Apply function not implemented'));
  const defaultHasApplied = hasApplied || (() => false);
  const defaultApplying = applying || {};
  const defaultMeetsEligibility = meetsEligibility || (() => true);

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-3 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Latest Job Postings
        </legend>
        
        <div className="my-3">
          <JobListings 
            jobs={jobs} 
            onKnowMore={onKnowMore}
            onApply={defaultOnApply}
            hasApplied={defaultHasApplied}
            applying={defaultApplying}
            meetsEligibility={defaultMeetsEligibility}
            onExploreMore={onExploreMore}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default JobPostingsSection;
