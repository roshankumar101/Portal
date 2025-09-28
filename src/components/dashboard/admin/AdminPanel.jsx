import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { AgCharts } from 'ag-charts-react';
import { 
  FaBell, FaUserTie, FaUniversity, FaFilter, 
  FaBuilding, FaUserGraduate, FaHandshake, 
  FaFileExcel, FaChartBar, FaChartLine, FaChartPie,
  FaSync, FaDownload, FaCog, FaSearch, FaUsers,
  FaIdCard, FaShare, FaCheckCircle, FaClock, FaEnvelope,
  FaChevronDown, FaTimes
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const CustomDropdown = ({ 
  label, 
  options, 
  selectedValues, 
  onSelectionChange, 
  multiple = false,
  placeholder = "Select options"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    if (multiple) {
      const newSelected = selectedValues.includes(option.id)
        ? selectedValues.filter(id => id !== option.id)
        : [...selectedValues, option.id];
      onSelectionChange(newSelected);
    } else {
      onSelectionChange([option.id]);
      setIsOpen(false);
    }
  };

  const removeOption = (optionId, e) => {
    e.stopPropagation();
    const newSelected = selectedValues.filter(id => id !== optionId);
    onSelectionChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (!multiple) {
      const selected = options.find(opt => opt.id === selectedValues[0]);
      return selected ? selected.name : placeholder;
    }
    if (selectedValues.length === 1) {
      const selected = options.find(opt => opt.id === selectedValues[0]);
      return selected ? selected.name : placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-black font-medium">{label}:</label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={`w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between transition-all duration-200 ${
            selectedValues.length > 0 
              ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' 
              : 'bg-gray-50 border-slate-300'
          } hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span className="truncate flex-1">
            {getDisplayText()}
          </span>
          <div className="flex items-center gap-1">
            {multiple && selectedValues.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {selectedValues.length}
              </span>
            )}
            <FaChevronDown className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-20 w-full bg-white border-2 border-slate-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-left transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span>{option.name}</span>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {multiple && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map(value => {
            const option = options.find(opt => opt.id === value);
            return option ? (
              <span 
                key={value}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {option.name}
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className="hover:text-blue-900 focus:outline-none"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const [filters, setFilters] = useState({
    campus: [],
    school: [],
    batch: [],
    admin: []
  });
  const [chartData, setChartData] = useState({});
  const [statsData, setStatsData] = useState({});
  const [adminPerformanceData, setAdminPerformanceData] = useState({});

  // Enhanced mock data with admin-campus mapping
  const campuses = [
    { id: 'all', name: 'All Campuses' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'lucknow', name: 'Lucknow' },
    { id: 'pune', name: 'Pune' },
    { id: 'noida', name: 'Noida' }
  ];

  const schools = [
    { id: 'all', name: 'All Schools' },
    { id: 'SOT', name: 'School of Technology' },
    { id: 'SOM', name: 'School of Management' },
    { id: 'SOH', name: 'School of Humanities' }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: '23-27', name: '2023-2027' },
    { id: '24-28', name: '2024-2028' },
    { id: '25-29', name: '2025-2029' }
  ];

  // Enhanced admins data with campus association
  const admins = [
    { id: 'all', name: 'All Admins', campus: 'all' },
    { id: 'admin_blr1', name: 'Admin Bangalore 1', campus: 'bangalore' },
    { id: 'admin_blr2', name: 'Admin Bangalore 2', campus: 'bangalore' },
    { id: 'admin_pune1', name: 'Admin Pune 1', campus: 'pune' },
    { id: 'admin_pune2', name: 'Admin Pune 2', campus: 'pune' },
    { id: 'admin_luck1', name: 'Admin Lucknow 1', campus: 'lucknow' },
    { id: 'admin_luck2', name: 'Admin Lucknow 2', campus: 'lucknow' },
    { id: 'admin_noida1', name: 'Admin Noida 1', campus: 'noida' },
    { id: 'admin_noida2', name: 'Admin Noida 2', campus: 'noida' }
  ];

  // Generate AG Charts options for admin performance
  const generateAgChartOptions = (currentFilters) => {
    const filteredAdmins = getFilteredAdmins(currentFilters);
    const adminNames = filteredAdmins.map(admin => admin.name);

    return {
      title: { text: "Admin Performance Metrics" },
      subtitle: { text: "Across Selected Campuses" },
      data: filteredAdmins.map(admin => ({
        admin: admin.name,
        companiesBrought: Math.floor(Math.random() * 50) + 10,
        clientsClosed: Math.floor(Math.random() * 40) + 5,
        profileShared: Math.floor(Math.random() * 200) + 50,
        placementClosed: Math.floor(Math.random() * 30) + 5,
        inProcess: Math.floor(Math.random() * 25) + 5
      })),
      series: [
        {
          type: "bar",
          direction: "horizontal",
          xKey: "admin",
          yKey: "companiesBrought",
          yName: "Companies Brought",
          stacked: true,
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "admin",
          yKey: "clientsClosed",
          yName: "Clients Closed",
          stacked: true,
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "admin",
          yKey: "profileShared",
          yName: "Profiles Shared",
          stacked: true,
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "admin",
          yKey: "placementClosed",
          yName: "Placements Closed",
          stacked: true,
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "admin",
          yKey: "inProcess",
          yName: "In Process",
          stacked: true,
        },
      ],
    };
  };

  // Get filtered admins based on current filters
  const getFilteredAdmins = (currentFilters) => {
    let filtered = admins.filter(admin => admin.id !== 'all');
    
    if (currentFilters.campus.length > 0 && !currentFilters.campus.includes('all')) {
      filtered = filtered.filter(admin => currentFilters.campus.includes(admin.campus));
    }
    
    if (currentFilters.admin.length > 0 && !currentFilters.admin.includes('all')) {
      filtered = filtered.filter(admin => currentFilters.admin.includes(admin.id));
    }
    
    return filtered;
  };

  // Generate mock data based on filters
  const generateMockData = (currentFilters) => {
    const isFiltered = currentFilters.campus.length > 0 && !currentFilters.campus.includes('all') ||
                      currentFilters.school.length > 0 && !currentFilters.school.includes('all') ||
                      currentFilters.batch.length > 0 && !currentFilters.batch.includes('all') ||
                      currentFilters.admin.length > 0 && !currentFilters.admin.includes('all');

    const filterMultiplier = isFiltered ? 0.1 : 1;

    // Placement Status Data
    const placementStatusData = {
      labels: ['Placed', 'Offer Received', 'Interview Stage', 'Profile Shared', 'Not Started'],
      datasets: [
        {
          label: 'Students',
          data: [1245, 890, 670, 1560, 2300].map(val => Math.round(val * filterMultiplier)),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };

    // Monthly Placements Trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseMonthlyData = [85, 92, 105, 120, 135, 150, 165, 180, 195, 210, 225, 245];
    const monthlyData = baseMonthlyData.map(val => Math.round(val * filterMultiplier));

    const monthlyTrendData = {
      labels: months,
      datasets: [
        {
          label: 'Placements',
          data: monthlyData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return {
      placementStatus: placementStatusData,
      monthlyTrend: monthlyTrendData,
    };
  };

  // Generate stats based on filters
  const generateStatsData = (currentFilters) => {
    const isFiltered = currentFilters.campus.length > 0 && !currentFilters.campus.includes('all') ||
                      currentFilters.school.length > 0 && !currentFilters.school.includes('all') ||
                      currentFilters.batch.length > 0 && !currentFilters.batch.includes('all') ||
                      currentFilters.admin.length > 0 && !currentFilters.admin.includes('all');

    const filterMultiplier = isFiltered ? 0.1 : 1;

    return {
      totalStudents: Math.round(11500 * filterMultiplier),
      placedStudents: Math.round(1245 * filterMultiplier),
      activeCompanies: Math.round(156 * filterMultiplier),
      placementRate: isFiltered ? 65.2 : 78.5,
      profileShared: Math.round(1560 * filterMultiplier),
      interviews: Math.round(670 * filterMultiplier),
      companiesBrought: Math.round(89 * filterMultiplier),
      clientsClosed: Math.round(67 * filterMultiplier)
    };
  };

  // Handle filter changes
  const handleFilterChange = (filterType, values) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: values
      };

      // If campus changes and admin was selected, adjust admin filter
      if (filterType === 'campus' && prev.admin.length > 0 && !prev.admin.includes('all')) {
        const filteredAdmins = admins.filter(admin => 
          values.includes('all') || values.includes(admin.campus) || admin.id === 'all'
        );
        const validAdminIds = filteredAdmins.map(admin => admin.id);
        const newAdminFilter = prev.admin.filter(adminId => validAdminIds.includes(adminId));
        
        if (newAdminFilter.length === 0 && values.length > 0 && !values.includes('all')) {
          newFilters.admin = ['all'];
        } else {
          newFilters.admin = newAdminFilter;
        }
      }

      return newFilters;
    });
  };

  const applyFilters = () => {
    // Filters are applied automatically through state changes
    console.log('Applied filters:', filters);
  };

  const resetFilters = () => {
    setFilters({
      campus: ['all'],
      school: ['all'],
      batch: ['all'],
      admin: ['all']
    });
  };

  useEffect(() => {
    setChartData(generateMockData(filters));
    setStatsData(generateStatsData(filters));
    setAdminPerformanceData(generateAgChartOptions(filters));
  }, [filters]);

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">


      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Data Filters</h2>
          <div className="flex space-x-3">
            <button 
              onClick={resetFilters}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center transition-all duration-200 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300"
            >
              <FaSync className="mr-2" /> Reset Filters
            </button>
            <button 
              onClick={applyFilters}
              className="px-6 py-2.5 text-white rounded-lg flex items-center transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
            >
              <FaFilter className="mr-2" /> Apply Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CustomDropdown
            label="Campus"
            options={campuses}
            selectedValues={filters.campus}
            onSelectionChange={(values) => handleFilterChange('campus', values)}
            multiple={true}
            placeholder="Select Campuses"
          />
          
          <CustomDropdown
            label="School"
            options={schools}
            selectedValues={filters.school}
            onSelectionChange={(values) => handleFilterChange('school', values)}
            multiple={true}
            placeholder="Select Schools"
          />
          
          <CustomDropdown
            label="Batch"
            options={batches}
            selectedValues={filters.batch}
            onSelectionChange={(values) => handleFilterChange('batch', values)}
            multiple={true}
            placeholder="Select Batches"
          />
          
          <CustomDropdown
            label="Admin"
            options={admins}
            selectedValues={filters.admin}
            onSelectionChange={(values) => handleFilterChange('admin', values)}
            multiple={true}
            placeholder="Select Admins"
          />
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {[
          { key: 'totalStudents', label: 'Total Students', icon: FaUserGraduate, color: 'blue' },
          { key: 'placedStudents', label: 'Placed Students', icon: FaHandshake, color: 'green' },
          { key: 'activeCompanies', label: 'Active Companies', icon: FaBuilding, color: 'purple' },
          { key: 'placementRate', label: 'Placement Rate', icon: FaChartBar, color: 'amber', suffix: '%' },
          { key: 'profileShared', label: 'Profile Shared', icon: FaShare, color: 'red' },
          { key: 'interviews', label: 'Interviews', icon: FaClock, color: 'teal' },
          { key: 'companiesBrought', label: 'Companies Brought', icon: FaUsers, color: 'indigo' },
          { key: 'clientsClosed', label: 'Clients Closed', icon: FaCheckCircle, color: 'pink' },
        ].map(({ key, label, icon: Icon, color, suffix = '' }) => (
          <div key={key} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 border-${color}-500`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="text-lg font-bold text-gray-800">
                  {statsData[key]?.toLocaleString()}{suffix}
                </p>
              </div>
              <Icon className={`text-${color}-500 text-sm`} />
            </div>
          </div>
        ))}
      </div>

      {/* AG Charts Histogram */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Performance Overview</h3>
        <div className="h-96">
          {adminPerformanceData && <AgCharts options={adminPerformanceData} />}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Status Distribution</h3>
          <div className="h-80">
            {chartData.placementStatus && (
              <Bar data={chartData.placementStatus} options={barOptions} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Placement Trend</h3>
          <div className="h-80">
            {chartData.monthlyTrend && (
              <Line data={chartData.monthlyTrend} options={lineOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200">
              <FaDownload className="mr-2" /> Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center transition-all duration-200">
              <FaFileExcel className="mr-2" /> Download Data
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center transition-all duration-200">
              <FaCog className="mr-2" /> Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;