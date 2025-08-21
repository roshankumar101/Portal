import React from 'react';
import { Briefcase, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const DashboardStatsSection = ({ studentData }) => {
  const stats = studentData?.stats;
  
  const statsData = [
    {
      label: 'Applied',
      count: stats?.applied || 0,
      icon: Briefcase
    },
    {
      label: 'Shortlisted',
      count: stats?.shortlisted || 0,
      icon: AlertCircle
    },
    {
      label: 'Interviewed',
      count: stats?.interviewed || 0,
      icon: CheckCircle
    },
    {
      label: 'Offers',
      count: stats?.offers || 0,
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
    <div className="w-full font-inter">
      <fieldset className="bg-white rounded-lg border-2 border-[#3c80a7] py-4 px-6 transition-all duration-200 shadow-md">
        <legend className="text-xl font-bold text-white px-3 bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] rounded-full">
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
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-[#3c80a7] transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{displayValue}</p>
                    </div>
                    <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-[#3c80a7]/10 transition-all duration-300">
                      <Icon className="h-6 w-6 text-slate-800 group-hover:text-[#3c80a7]" />
                    </div>
                  </div>
                  
                  {/* Progress bar for offers */}
                  {stat.percentage && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(calculateOfferPercentage(), 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Success Rate</p>
                    </div>
                  )}
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

