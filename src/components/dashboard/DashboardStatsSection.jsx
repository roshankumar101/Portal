import React from 'react';
import { Briefcase, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const DashboardStatsSection = ({ studentData }) => {
  const stats = studentData?.stats;
  
  const statsData = [
    {
      label: 'Applied',
      count: stats?.applied || 0,
      color: 'bg-blue-500',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      icon: Briefcase
    },
    {
      label: 'Shortlisted',
      count: stats?.shortlisted || 0,
      color: 'bg-indigo-500',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      icon: AlertCircle
    },
    {
      label: 'Interviewed',
      count: stats?.interviewed || 0,
      color: 'bg-emerald-500',
      bgColor: 'from-emerald-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      icon: CheckCircle
    },
    {
      label: 'Offers',
      count: stats?.offers || 0,
      color: 'bg-orange-500',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      icon: TrendingUp,
      percentage: true
    }
  ];

  const calculateOfferPercentage = () => {
    const totalApplied = stats?.applied || 0;
    const totalOffers = stats?.offers || 0;
    return totalApplied > 0 ? Math.round((totalOffers / totalApplied) * 100) : 0;
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-blue-200 p-3 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Dashboard Stats
        </legend>
        <div className="my-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              const displayValue = stat.percentage ? `${calculateOfferPercentage()}%` : stat.count;
              
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.bgColor} p-4 rounded-2xl border hover:shadow-yellow-300 hover:shadow-sm ${stat.borderColor} transition-all duration-200`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} to-opacity-80 rounded-xl`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className={`text-xs font-semibold ${stat.textColor}`}>{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DashboardStatsSection;
