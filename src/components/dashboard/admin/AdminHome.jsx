import React, { useState, useRef, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { ChevronDown, Filter, TrendingUp, Users, Briefcase, MessageSquare, Bell, BarChart3, Target, DollarSign, X } from 'lucide-react';

export default function AdminHome() {
  const [filters, setFilters] = useState({
    center: [],
    school: [],
    quarter: []
  });

  const [showCenterDropdown, setShowCenterDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  
  const centerDropdownRef = useRef(null);
  const schoolDropdownRef = useRef(null);
  const quarterDropdownRef = useRef(null);

  // Dummy data that would typically come from Firestore
  const [dashboardData, setDashboardData] = useState({
    jobPostings: 120,
    studentQueries: 45,
    notifications: 25,
    applications: 300,
    overallStats: {
      totalCenters: 4,
      totalBatches: 12,
      activeStudents: 1245,
      placementRate: 78,
      avgResponseTime: '2.4 hrs',
      completionRate: 92,
      engagementRate: 67,
      satisfactionScore: '4.5/5'
    },
    placementOverview: {
      totalStudentsPlaced: 850,
      placementRatio: '78%',
      firstAttemptPlacementRatio: '65%',
      studentsShortlisted: 950,
      studentsJoined: 820,
      studentsInProcess: 130,
      studentsRejected: 45
    },
    jobApplicationStats: {
      totalApplications: 2450,
      applicationToInterviewRatio: '1:4',
      shortlistedToOfferRatio: '3:2',
      studentsWithNoApplications: 75
    },
    salaryOverview: {
      avgSalaryPlaced: '8.5 LPA',
      avgSalaryOffered: '9.2 LPA',
      highestPackage: '22 LPA',
      medianSalaryByIndustry: {
        'Technology': '10.5 LPA',
        'Management': '8.2 LPA',
        'Humanities': '6.8 LPA',
        'Research': '9.1 LPA'
      }
    }
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (centerDropdownRef.current && !centerDropdownRef.current.contains(event.target)) {
        setShowCenterDropdown(false);
      }
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target)) {
        setShowSchoolDropdown(false);
      }
      if (quarterDropdownRef.current && !quarterDropdownRef.current.contains(event.target)) {
        setShowQuarterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Realistic filter options for a college placement process
  const filterOptions = {
    centers: ['Bangalore', 'Lucknow', 'Pune', 'Delhi'],
    schools: ['SOT (School of Technology)', 'SOH (School of Humanities)', 'SOM (School of Management)'],
    quarters: ['Q1 (Pre-Placement)', 'Q2 (Placement Drive)', 'Q3 (Internship)', 'Q4 (Final Placements)']
  };

  // Function to simulate fetching data based on filters
  const fetchFilteredData = () => {
    // This would be replaced with actual Firestore query
    console.log("Fetching data for filters:", filters);
    
    // Simulate different data based on filters
    let newData = { ...dashboardData };
    
    if (filters.center.length > 0) {
      // Simulate center-specific data
      newData.jobPostings = Math.floor(Math.random() * 50) + 80;
      newData.studentQueries = Math.floor(Math.random() * 20) + 30;
      newData.applications = Math.floor(Math.random() * 100) + 250;
    }
    
    if (filters.school.length > 0) {
      // Simulate school-specific data
      newData.jobPostings = Math.floor(Math.random() * 40) + 90;
      newData.applications = Math.floor(Math.random() * 150) + 200;
    }
    
    if (filters.quarter.length > 0) {
      // Simulate quarter-specific data
      if (filters.quarter.some(q => q.includes('Q1'))) {
        newData.jobPostings = 60;
        newData.applications = 150;
      } else if (filters.quarter.some(q => q.includes('Q2'))) {
        newData.jobPostings = 100;
        newData.applications = 280;
      } else if (filters.quarter.some(q => q.includes('Q3'))) {
        newData.jobPostings = 80;
        newData.applications = 220;
      } else if (filters.quarter.some(q => q.includes('Q4'))) {
        newData.jobPostings = 140;
        newData.applications = 350;
      }
    }
    
    setDashboardData(newData);
  };

  // Apply filters and fetch new data
  useEffect(() => {
    fetchFilteredData();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index > -1) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };

  const removeFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      center: [],
      school: [],
      quarter: []
    });
  };

  const stats = [
    {
      title: 'Job Postings',
      value: dashboardData.jobPostings,
      borderColor: 'border-blue-500',
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      chartData: [
        { title: 'Active', value: Math.round(dashboardData.jobPostings * 0.7), color: '#3b82f6' },
        { title: 'Closed', value: Math.round(dashboardData.jobPostings * 0.3), color: '#60a5fa' },
      ],
    },
    {
      title: 'Student Queries',
      value: dashboardData.studentQueries,
      borderColor: 'border-green-500',
      icon: <MessageSquare className="w-5 h-5 text-green-500" />,
      chartData: [
        { title: 'Resolved', value: Math.round(dashboardData.studentQueries * 0.7), color: '#10b981' },
        { title: 'Pending', value: Math.round(dashboardData.studentQueries * 0.3), color: '#34d399' },
      ],
    },
    {
      title: 'Notifications',
      value: dashboardData.notifications,
      borderColor: 'border-yellow-500',
      icon: <Bell className="w-5 h-5 text-yellow-500" />,
      chartData: [
        { title: 'Sent', value: Math.round(dashboardData.notifications * 0.8), color: '#f59e0b' },
        { title: 'Draft', value: Math.round(dashboardData.notifications * 0.2), color: '#fbbf24' },
      ],
    },
    {
      title: 'Applications',
      value: dashboardData.applications,
      borderColor: 'border-purple-500',
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      chartData: [
        { title: 'Accepted', value: Math.round(dashboardData.applications * 0.6), color: '#8b5cf6' },
        { title: 'Rejected', value: Math.round(dashboardData.applications * 0.4), color: '#a78bfa' },
      ],
    },
  ];

  // Gradient colors for the section headers
  const sectionGradients = [
    'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
    'bg-gradient-to-r from-green-500/20 to-teal-500/20',
    'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
  ];

  // Gradient colors for the widgets
  const gradientClasses = [
    'from-blue-500/10 to-indigo-500/10',
    'from-green-500/10 to-teal-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-amber-500/10 to-orange-500/10',
    'from-cyan-500/10 to-blue-500/10',
    'from-emerald-500/10 to-green-500/10',
    'from-violet-500/10 to-purple-500/10',
    'from-rose-500/10 to-pink-500/10'
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header with Title and Filter Icon */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center text-blue-600">
          <Filter className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Filters Applied: {
            Object.values(filters).flat().length
          }</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-500" />
          Filter Dashboard
        </h2>
        
        {/* Active Filters */}
        {(filters.center.length > 0 || filters.school.length > 0 || filters.quarter.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.center.map(center => (
              <span key={center} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Center: {center}
                <button onClick={() => removeFilter('center', center)} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.school.map(school => (
              <span key={school} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                School: {school}
                <button onClick={() => removeFilter('school', school)} className="ml-1 hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.quarter.map(quarter => (
              <span key={quarter} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Quarter: {quarter}
                <button onClick={() => removeFilter('quarter', quarter)} className="ml-1 hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button 
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Center Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-black font-medium">Center:</label>
            <div className="relative" ref={centerDropdownRef}>
              <button
                type="button"
                className={`w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between ${filters.center.length > 0 ? 'bg-blue-50' : 'bg-gray-50'}`}
                onClick={() => setShowCenterDropdown(prev => !prev)}
              >
                <span className="truncate">
                  {filters.center.length > 0 ? `${filters.center.length} selected` : 'Select Centers'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
              {showCenterDropdown && (
                <div className="absolute z-10 overflow-y-auto max-h-60 w-full bg-white border-2 border-slate-300 rounded-md shadow-md mt-1">
                  {filterOptions.centers.map((center, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer text-left"
                      onClick={() => handleFilterChange('center', center)}
                    >
                      <input
                        type="checkbox"
                        checked={filters.center.includes(center)}
                        onChange={() => {}}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span>{center}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* School Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-black font-medium">School:</label>
            <div className="relative" ref={schoolDropdownRef}>
              <button
                type="button"
                className={`w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between ${filters.school.length > 0 ? 'bg-green-50' : 'bg-gray-50'}`}
                onClick={() => setShowSchoolDropdown(prev => !prev)}
              >
                <span className="truncate">
                  {filters.school.length > 0 ? `${filters.school.length} selected` : 'Select Schools'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
              {showSchoolDropdown && (
                <div className="absolute z-10 overflow-y-auto max-h-60 w-full bg-white border-2 border-slate-300 rounded-md shadow-md mt-1">
                  {filterOptions.schools.map((school, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-green-50 cursor-pointer text-left"
                      onClick={() => handleFilterChange('school', school)}
                    >
                      <input
                        type="checkbox"
                        checked={filters.school.includes(school)}
                        onChange={() => {}}
                        className="rounded text-green-500 focus:ring-green-500"
                      />
                      <span>{school}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quarter Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-black font-medium">Quarter:</label>
            <div className="relative" ref={quarterDropdownRef}>
              <button
                type="button"
                className={`w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between ${filters.quarter.length > 0 ? 'bg-purple-50' : 'bg-gray-50'}`}
                onClick={() => setShowQuarterDropdown(prev => !prev)}
              >
                <span className="truncate">
                  {filters.quarter.length > 0 ? `${filters.quarter.length} selected` : 'Select Quarters'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
              {showQuarterDropdown && (
                <div className="absolute z-10 overflow-y-auto max-h-60 w-full bg-white border-2 border-slate-300 rounded-md shadow-md mt-1">
                  {filterOptions.quarters.map((quarter, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-purple-50 cursor-pointer text-left"
                      onClick={() => handleFilterChange('quarter', quarter)}
                    >
                      <input
                        type="checkbox"
                        checked={filters.quarter.includes(quarter)}
                        onChange={() => {}}
                        className="rounded text-purple-500 focus:ring-purple-500"
                      />
                      <span>{quarter}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-white p-4 rounded-lg shadow-lg border-t-4 hover:shadow-xl transition-all duration-300 ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  {stat.icon}
                  <span className="ml-2">{stat.title}</span>
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h3>
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
            <div className="mt-4 border-t pt-2 text-sm text-gray-600 flex justify-between items-center">
              <span>View details</span>
              <a href="#" className="text-blue-500 hover:underline">View More</a>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
        
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-4 space-y-6">
          {/* Placement Overview Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className={`p-4 ${sectionGradients[0]} rounded-t-lg`}>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Placement Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(dashboardData.placementOverview).map(([key, value], index) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg bg-gradient-to-br ${gradientClasses[index % gradientClasses.length]} backdrop-blur-sm border border-gray-200/50`}
                >
                  <h3 className="text-sm font-medium text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Overview Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className={`p-4 ${sectionGradients[3]} rounded-t-lg`}>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-amber-500" />
                Salary Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main salary metrics */}
              {Object.entries(dashboardData.salaryOverview)
                .filter(([key]) => key !== 'medianSalaryByIndustry')
                .map(([key, value], index) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg bg-gradient-to-br ${gradientClasses[(index + 4) % gradientClasses.length]} backdrop-blur-sm border border-gray-200/50`}
                  >
                    <h3 className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              
              {/* Industry-wise median salaries */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Median Salary by Industry</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(dashboardData.salaryOverview.medianSalaryByIndustry).map(([industry, salary], index) => (
                    <div 
                      key={industry}
                      className={`p-3 rounded-lg bg-gradient-to-br ${gradientClasses[(index + 6) % gradientClasses.length]} backdrop-blur-sm border border-gray-200/50`}
                    >
                      <h4 className="text-sm font-medium text-gray-600">{industry}</h4>
                      <p className="text-xl font-bold text-gray-800 mt-1">{salary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Job Application and Participation Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className={`p-4 ${sectionGradients[1]} rounded-t-lg`}>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Job Applications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(dashboardData.jobApplicationStats).map(([key, value], index) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg bg-gradient-to-br ${gradientClasses[(index + 2) % gradientClasses.length]} backdrop-blur-sm border border-gray-200/50`}
                >
                  <h3 className="text-sm font-medium text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Stats Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className={`p-4 ${sectionGradients[2]} rounded-t-lg`}>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Overall Statistics
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Summary</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Total Centers</span>
                    <span className="font-medium">{dashboardData.overallStats.totalCenters}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Total Batches</span>
                    <span className="font-medium">{dashboardData.overallStats.totalBatches}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Active Students</span>
                    <span className="font-medium">{dashboardData.overallStats.activeStudents.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Placement Rate</span>
                    <span className="font-medium text-green-600">{dashboardData.overallStats.placementRate}%</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Performance Metrics</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-medium">{dashboardData.overallStats.avgResponseTime}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-green-600">{dashboardData.overallStats.completionRate}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-medium">{dashboardData.overallStats.engagementRate}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Satisfaction Score</span>
                    <span className="font-medium text-green-600">{dashboardData.overallStats.satisfactionScore}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}