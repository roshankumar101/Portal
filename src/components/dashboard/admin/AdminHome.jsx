import React, { useState, useRef, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { ChevronDown, Filter, TrendingUp, Users, Briefcase, MessageSquare, Bell, BarChart3, Target, DollarSign, X } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Title, Tooltip, Legend } from 'chart.js';
import { Radar, PolarArea, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, RadialLinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Title, Tooltip, Legend);

export default function AdminHome() {
  const [filters, setFilters] = useState({ center: [], school: [], quarter: [] });
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('SOT');

  const centerDropdownRef = useRef(null);
  const schoolDropdownRef = useRef(null);
  const quarterDropdownRef = useRef(null);

  // Chart.js color palette
  const chartColors = {
    blue: 'rgb(59, 130, 246)',
    purple: 'rgb(147, 51, 234)',
    green: 'rgb(34, 197, 94)',
    red: 'rgb(239, 68, 68)',
    blueLight: 'rgba(59, 130, 246, 0.1)',
    purpleLight: 'rgba(147, 51, 234, 0.1)',
    greenLight: 'rgba(34, 197, 94, 0.1)',
    redLight: 'rgba(239, 68, 68, 0.1)'
  };

  // Dummy data
  const [dashboardData, setDashboardData] = useState({
    jobPostings: 120,
    studentQueries: 45,
    notifications: 25,
    applications: 300,
    overallStats: {
      totalCenters: 6,
      totalBatches: 12,
      activeStudents: 1245,
      placementRate: 78,
      avgResponseTime: '2.4 hrs',
      completionRate: 92,
      engagementRate: 67,
      satisfactionScore: '4.5/5'
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (centerDropdownRef.current && !centerDropdownRef.current.contains(event.target)) setShowCenterDropdown(false);
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target)) setShowSchoolDropdown(false);
      if (quarterDropdownRef.current && !quarterDropdownRef.current.contains(event.target)) setShowQuarterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = {
    centers: ['Bangalore', 'Noida', 'Lucknow', 'Pune', 'Patna', 'Indore'],
    schools: ['SOT (School of Technology)', 'SOM (School of Management)', 'SOH (School of Health)'],
    quarters: ['Q1 (Pre-Placement)', 'Q2 (Placement Drive)', 'Q3 (Internship)', 'Q4 (Final Placements)']
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const current = [...prev[filterType]];
      const idx = current.indexOf(value);
      if (idx > -1) current.splice(idx, 1); else current.push(value);
      return { ...prev, [filterType]: current };
    });
  };

  const removeFilter = (filterType, value) => setFilters(prev => ({ ...prev, [filterType]: prev[filterType].filter(i => i !== value) }));
  const clearAllFilters = () => setFilters({ center: [], school: [], quarter: [] });

  // Stats with consistent Chart.js colors
  const stats = [
    { 
      title: 'Job Postings', 
      value: dashboardData.jobPostings, 
      borderColor: 'border-blue-200', 
      icon: <Briefcase className="w-5 h-5" style={{ color: chartColors.blue }} />, 
      chartData: [ 
        { title: 'Active', value: Math.round(dashboardData.jobPostings * 0.7), color: chartColors.blue },
        { title: 'Closed', value: Math.round(dashboardData.jobPostings * 0.3), color: '#dbeafe' } 
      ] 
    },
    { 
      title: 'Student Queries', 
      value: dashboardData.studentQueries, 
      borderColor: 'border-green-200', 
      icon: <MessageSquare className="w-5 h-5" style={{ color: chartColors.green }} />, 
      chartData: [ 
        { title: 'Resolved', value: Math.round(dashboardData.studentQueries * 0.7), color: chartColors.green },
        { title: 'Pending', value: Math.round(dashboardData.studentQueries * 0.3), color: '#dcfce7' } 
      ] 
    },
    { 
      title: 'Notifications', 
      value: dashboardData.notifications, 
      borderColor: 'border-purple-200', 
      icon: <Bell className="w-5 h-5" style={{ color: chartColors.purple }} />, 
      chartData: [ 
        { title: 'Sent', value: Math.round(dashboardData.notifications * 0.8), color: chartColors.purple },
        { title: 'Draft', value: Math.round(dashboardData.notifications * 0.2), color: '#f3e8ff' } 
      ] 
    },
    { 
      title: 'Applications', 
      value: dashboardData.applications, 
      borderColor: 'border-red-200', 
      icon: <TrendingUp className="w-5 h-5" style={{ color: chartColors.red }} />, 
      chartData: [ 
        { title: 'Accepted', value: Math.round(dashboardData.applications * 0.6), color: chartColors.red },
        { title: 'Rejected', value: Math.round(dashboardData.applications * 0.4), color: '#fecaca' } 
      ] 
    }
  ];

  // School data with performance and application metrics
  const schoolData = {
    SOT: {
      performance: {
        labels: ['Placement Rate', 'Avg Salary', 'Technical Skills', 'Project Completion', 'Internship Rate'],
        values: [88, 85, 92, 90, 87]
      },
      applications: {
        labels: ['Applications', 'Interviews', 'Offers', 'Acceptance Rate', 'Response Time'],
        values: [3847, 892, 567, 85, 88]
      }
    },
    SOM: {
      performance: {
        labels: ['Placement Rate', 'Avg Salary', 'Leadership', 'Case Studies', 'Corporate Projects'],
        values: [85, 92, 88, 90, 84]
      },
      applications: {
        labels: ['Applications', 'Interviews', 'Offers', 'Acceptance Rate', 'Response Time'],
        values: [2934, 745, 489, 82, 86]
      }
    },
    SOH: {
      performance: {
        labels: ['Placement Rate', 'Avg Salary', 'Clinical Skills', 'Research', 'Patient Care'],
        values: [82, 78, 90, 85, 88]
      },
      applications: {
        labels: ['Applications', 'Interviews', 'Offers', 'Acceptance Rate', 'Response Time'],
        values: [1856, 523, 342, 80, 83]
      }
    }
  };

  // Build unified radar chart data with consistent colors
  const buildSchoolRadarData = (schoolKey) => {
    const school = schoolData[schoolKey];
    const labels = school.performance.labels;
    
    return {
      labels,
      datasets: [
        {
          label: 'Performance Metrics',
          data: school.performance.values,
          backgroundColor: chartColors.blueLight,
          borderColor: chartColors.blue,
          borderWidth: 2,
          pointBackgroundColor: chartColors.blue,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.blue
        },
        {
          label: 'Application Metrics',
          data: school.applications.values.map((val, index) => {
            const maxVal = index === 0 ? 4000 : index === 1 ? 1000 : index === 2 ? 600 : 100;
            return Math.round((val / maxVal) * 100);
          }),
          backgroundColor: chartColors.greenLight,
          borderColor: chartColors.green,
          borderWidth: 2,
          pointBackgroundColor: chartColors.green,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.green
        }
      ]
    };
  };

  const schoolRadarData = buildSchoolRadarData(selectedSchool);

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      {/* Header with consistent colors */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <h1 className="text-3xl font-bold" style={{ background: `linear-gradient(to right, ${chartColors.blue}, ${chartColors.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Dashboard
          </h1>
          <div className="absolute -bottom-1 left-0 w-1/2 h-0.5" style={{ background: `linear-gradient(to right, ${chartColors.blue}, transparent)` }}></div>
        </div>
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
          <div className="relative">
            <Filter className="w-5 h-5 mr-2" style={{ color: chartColors.blue }} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm font-semibold" style={{ background: `linear-gradient(to right, ${chartColors.blue}, ${chartColors.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Filters Applied: {Object.values(filters).flat().length}
          </span>
        </div>
      </div>

      {/* Filter Section with consistent colors */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" style={{ color: chartColors.blue }} />
          Filter Dashboard
        </h2>

        {(filters.center.length > 0 || filters.school.length > 0 || filters.quarter.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.center.map(c => (
              <span key={c} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: chartColors.blueLight, borderColor: chartColors.blue, color: chartColors.blue }}>
                Center: {c}
                <button onClick={() => removeFilter('center', c)} className="ml-1 hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.school.map(s => (
              <span key={s} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: chartColors.greenLight, borderColor: chartColors.green, color: chartColors.green }}>
                School: {s}
                <button onClick={() => removeFilter('school', s)} className="ml-1 hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.quarter.map(q => (
              <span key={q} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: chartColors.purpleLight, borderColor: chartColors.purple, color: chartColors.purple }}>
                Quarter: {q}
                <button onClick={() => removeFilter('quarter', q)} className="ml-1 hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-gray-700 underline">Clear all</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['center', 'school', 'quarter'].map((type, index) => (
            <div key={type} className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 font-medium capitalize">{type}:</label>
              <div className="relative" ref={[centerDropdownRef, schoolDropdownRef, quarterDropdownRef][index]}>
                <button 
                  type="button" 
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors ${
                    filters[type].length > 0 ? 'border-blue-300 bg-blue-50' : ''
                  }`}
                  onClick={() => [setShowCenterDropdown, setShowSchoolDropdown, setShowQuarterDropdown][index](p => !p)}
                >
                  <span className="truncate">
                    {filters[type].length > 0 ? `${filters[type].length} selected` : `Select ${type}s`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </button>
                {[showCenterDropdown, showSchoolDropdown, showQuarterDropdown][index] && (
                  <div className="absolute z-10 overflow-y-auto max-h-60 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {filterOptions[`${type}s`].map((option, i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 cursor-pointer text-left border-b border-gray-100 last:border-b-0"
                        onClick={() => handleFilterChange(type, option)}
                      >
                        <input
                          type="checkbox"
                          checked={filters[type].includes(option)}
                          onChange={() => {}}
                          className="rounded"
                          style={{ color: chartColors.blue }}
                        />
                        <span className="text-gray-700">{option}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards with consistent colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-all duration-300 ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  {stat.icon}
                  <span className="ml-2">{stat.title}</span>
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</h3>
              </div>
              <div className="w-16 h-16">
                <PieChart 
                  data={stat.chartData} 
                  lineWidth={20} 
                  radius={40} 
                  label={({ dataEntry }) => `${dataEntry.value}`}
                  labelStyle={{ fontSize: '0px', fill: '#000' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* School Performance Radar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Target className="w-5 h-5 mr-2" style={{ color: chartColors.blue }} />
                School Performance & Applications
              </h2>
            </div>
            {/* School selector with consistent Chart.js colors */}
            <div className="flex gap-2">
              {['SOT', 'SOM', 'SOH'].map((school) => (
                <button
                  key={school}
                  onClick={() => setSelectedSchool(school)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
                    selectedSchool === school
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Animated gradient border using Chart.js colors */}
                  {selectedSchool === school && (
                    <div 
                      className="absolute inset-0 rounded-xl p-[1.5px] animate-pulse"
                      style={{
                        background: school === 'SOT' 
                          ? `linear-gradient(to right, ${chartColors.blue}, ${chartColors.purple})`
                          : school === 'SOM'
                          ? `linear-gradient(to right, ${chartColors.purple}, ${chartColors.green})`
                          : `linear-gradient(to right, ${chartColors.green}, ${chartColors.blue})`
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-lg"
                        style={{
                          background: school === 'SOT' 
                            ? chartColors.blue
                            : school === 'SOM'
                            ? chartColors.purple
                            : chartColors.green
                        }}
                      />
                    </div>
                  )}
                  
                  <span className="relative z-10">{school}</span>
                  
                  {/* Hover effect with Chart.js background colors */}
                  {selectedSchool !== school && (
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                      style={{
                        background: school === 'SOT' 
                          ? chartColors.blueLight
                          : school === 'SOM'
                          ? chartColors.purpleLight
                          : chartColors.greenLight,
                        borderColor: school === 'SOT' 
                          ? chartColors.blue
                          : school === 'SOM'
                          ? chartColors.purple
                          : chartColors.green
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-96">
            <Radar 
              data={schoolRadarData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      display: false
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    },
                    angleLines: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                      font: {
                        size: 11,
                        weight: '500'
                      },
                      color: '#374151'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#374151',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}