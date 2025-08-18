import React from 'react';

const Education = () => {
  // Sample education data - you can later connect this to your database
  const educationData = [
    { id: 1, institute: "PW IOI (cse)", yearOfPassing: "2028", percentage: "87.6" },
    { id: 2, institute: "IITM (BS)", yearOfPassing: "2027", percentage: "86.9" },
    { id: 3, institute: "12th", yearOfPassing: "2023", percentage: "77.2" },
    { id: 4, institute: "10th", yearOfPassing: "2021", percentage: "89.4" }
  ];

  const handleViewCertificate = (education) => {
    // Placeholder function - you can implement certificate viewing logic here
    alert(`Viewing certificate for ${education.institute}`);
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-blue-200 p-3 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Education
        </legend>
        
        <div className="my-3">
          <div className="space-y-2">
            {/* Column Headers */}
            <div className="grid grid-cols-3 gap-6 mb-3 p-3">
              <div className="text-gray-800 font-bold text-lg">Institute</div>
              <div className="text-gray-800 font-bold text-lg">Year of Passing</div>
              <div className="text-gray-800 font-bold text-lg text-center">Percentage</div>
            </div>
            
            {/* Education Rows */}
            {educationData.map((education) => (
              <div
                key={education.id}
                className="grid grid-cols-3 gap-6 p-4 rounded-xl bg-green-50 hover:shadow-md transition-all duration-200"
              >
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  {education.institute}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  {education.yearOfPassing}
                </div>
                <div className="flex justify-center">
                  {education.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Education;
