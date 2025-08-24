import React from 'react';

const Education = () => {
  // Sample education data with 4 rows, including location
  const educationData = [
    {
      institute: 'PW IOI',
      location: 'Bangalore, Karnataka',
      qualification: 'CSE',
      yearOfPassing: '2028',
      cgpaPercentage: '8.5 CGPA'
    },
    {
      institute: 'IITM',
      location: 'Chennai, Tamil Nadu',
      qualification: 'BS',
      yearOfPassing: '2027',
      cgpaPercentage: '8.2 CGPA'
    },
    {
      institute: 'AN Inter College',
      location: 'Dumka, Jharkhand',
      qualification: '12th',
      yearOfPassing: '2023',
      cgpaPercentage: '77.2%'
    },
    {
      institute: 'SVM',
      location: 'Jamtara, Jharkhand',
      qualification: '10th',
      yearOfPassing: '2021',
      cgpaPercentage: '89.4%'
    }
  ];

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] py-4 px-6 transition-all duration-200 shadow-lg">
        
        <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text">
          Education
        </legend>

        <div className="mb-3 mt-1">
          <div className="space-y-2">
            {/* Column Headers */}
            <div className="grid grid-cols-4 gap-4 mb-0 p-4">
              <div className="text-black font-bold text-lg">Institute</div>
              <div className="text-black font-bold text-lg">Qualification</div>
              <div className="text-black font-bold text-lg">Year of Passing</div>
              <div className="text-black font-bold text-lg">CGPA/Percentage</div>
            </div>

            {/* Education Rows */}
            {educationData.map((education, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 gap-4 p-4 rounded-xl 
                  bg-gradient-to-r 
                  ${index % 2 !== 0 ? 'from-gray-50 to-gray-100' : 'from-[#f0f8fa] to-[#e6f3f8]'}
                  hover:shadow-md transition`}
              >
                {/* Institute with Location */}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-black">
                    {education.institute}
                  </span>
                  <span className="text-sm italic text-gray-600">
                    {education.location}
                  </span>
                </div>

                <div className="pl-7 text-base font-semibold text-black flex items-center">
                  {education.qualification}
                </div>
                <div className="pl-6 text-sm font-medium text-gray-700 flex items-center">
                  {education.yearOfPassing}
                </div>
                <div className="pl-6 text-sm font-medium text-gray-700 flex items-center">
                  {education.cgpaPercentage}
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
