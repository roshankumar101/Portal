import React from 'react';

const Education = () => {
    // Sample education data with 4 rows
    const educationData = [
        {
            institute: 'PW IOI',
            qualification: 'CSE',
            yearOfPassing: '2028',
            cgpaPercentage: '8.5 CGPA'
        },
        {
            institute: 'IITM',
            qualification: 'BS',
            yearOfPassing: '2027',
            cgpaPercentage: '8.2 CGPA'
        },
        {
            institute: 'AN Inter College(Dumka)',
            qualification: '12th',
            yearOfPassing: '2023',
            cgpaPercentage: '77.2%'
        },
        {
            institute: 'SVM Jamtara',
            qualification: '10th',
            yearOfPassing: '2021',
            cgpaPercentage: '89.4%'
        },

    ];

    return (
        <div className="w-full">
            <fieldset className="bg-white rounded-lg border-2 border-blue-200 py-4 px-6 transition-all duration-200">
                <legend className="text-xl font-bold text-blue-600 px-2 bg-blue-100 rounded-full">
                    Education
                </legend>

                <div className="my-2">
                    <div className="space-y-1">
                        {/* Column Headers */}
                        <div className="grid grid-cols-4 gap-4 mb-1 p-4">
                            <div className="text-gray-800 font-bold text-lg">Institute</div>
                            <div className="text-gray-800 font-bold text-lg">Qualification</div>
                            <div className="text-gray-800 font-bold text-lg">Year of Passing</div>
                            <div className="text-gray-800 font-bold text-lg">CGPA/Percentage</div>
                        </div>

                        {/* Education Rows */}
                        {educationData.map((education, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100"
                            >
                                <div className="text-base font-semibold text-gray-900 flex items-center">
                                    {education.institute}
                                </div>
                                <div className="pl-7 text-base font-semibold text-gray-900 flex items-center">
                                    {education.qualification}
                                </div>
                                <div className="pl-6 text-sm font-medium text-gray-700 items-center">
                                    {education.yearOfPassing}
                                </div>
                                <div className="pl-6 text-sm font-medium text-gray-700 items-center">
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
