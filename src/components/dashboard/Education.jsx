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
        <div className="w-full font-inter">
            <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6 transition-all duration-200 shadow-md">
                <legend className="text-xl font-bold text-white px-3 bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] rounded-full">
                    Education
                </legend>

                <div className="my-2">
                    <div className="space-y-1">
                        {/* Column Headers */}
                        <div className="grid grid-cols-4 gap-4 mb-1 p-4">
                            <div className="text-slate-800 font-bold text-lg">Institute</div>
                            <div className="text-slate-800 font-bold text-lg">Qualification</div>
                            <div className="text-slate-800 font-bold text-lg">Year of Passing</div>
                            <div className="text-slate-800 font-bold text-lg">CGPA/Percentage</div>
                        </div>

                        {/* Education Rows */}
                        {educationData.map((education, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="text-base font-semibold text-slate-900 flex items-center">
                                    {education.institute}
                                </div>
                                <div className="pl-7 text-base font-semibold text-slate-900 flex items-center">
                                    {education.qualification}
                                </div>
                                <div className="pl-6 text-sm font-medium text-slate-700 items-center">
                                    {education.yearOfPassing}
                                </div>
                                <div className="pl-6 text-sm font-medium text-slate-700 items-center">
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
