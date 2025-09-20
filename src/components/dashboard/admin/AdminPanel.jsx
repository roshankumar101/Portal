import React, { useState } from 'react';
import { 
  FaBell, FaCheck, FaTimes, FaEnvelope, FaCalendarAlt, FaBriefcase, FaTrash, FaUserGraduate, 
  FaQuestionCircle, FaSearch, FaEye, FaReply, FaCheckCircle, FaPaperPlane, FaRegCommentDots, 
  FaFilePdf, FaFileAlt, FaUserTie, FaGraduationCap, FaClipboardCheck, FaUsers, FaChartLine, 
  FaUniversity, FaIdBadge, FaClock, FaLink, FaDownload, FaCog, FaComment, FaShare, FaEnvelopeOpen,
  FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaChartBar, FaUserFriends, FaTasks, FaIdCard,
  FaBook, FaLaptopCode, FaHandshake, FaUserCheck, FaFileExcel, FaFilter,
  FaPlus, FaEdit, FaSync, FaArchive, FaHistory, FaCogs, FaDatabase, FaShieldAlt, FaKey
} from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [notifications, setNotifications] = useState([]); // Initialize with empty array or add notification objects
  // Mock data for demonstration
  const campuses = [
    { id: 'bangalore', name: 'Bangalore', students: 3200, companies: 185 },
    { id: 'lucknow', name: 'Lucknow', students: 2800, companies: 142 },
    { id: 'pune', name: 'Pune', students: 2500, companies: 128 },
    { id: 'noida', name: 'Noida', students: 3000, companies: 165 }
  ];

  const schools = [
    { id: 'SOT', name: 'School of Technology', color: 'blue', icon: <FaLaptopCode /> },
    { id: 'SOM', name: 'School of Management', color: 'green', icon: <FaChartBar /> },
    { id: 'SOH', name: 'School of Humanities', color: 'purple', icon: <FaBook /> }
  ];

  const batches = [
    { id: '23-27', name: '2023-2027', graduating: '2027' },
    { id: '24-28', name: '2024-2028', graduating: '2028' },
    { id: '25-29', name: '2025-2029', graduating: '2029' }
  ];

  const statsData = {
    placements: { total: 1245, percentage: 78.5, trend: 'up' },
    companies: { total: 156, new: 24, trend: 'up' },
    students: { total: 11500, eligible: 8920, trend: 'up' },
    queries: { total: 345, resolved: 298, trend: 'down' }
  };

  const recentActivities = [
    { id: 1, action: 'JD Approved', target: 'Microsoft SWE Role', user: 'Dr. Sharma', time: '2 hours ago' },
    { id: 2, action: 'Placement Drive', target: 'Google Interview Schedule', user: 'Admin System', time: '5 hours ago' },
    { id: 3, action: 'Student Query', target: 'Eligibility Question', user: 'Aarav Sharma', time: 'Yesterday' },
    { id: 4, action: 'CGPA Update', target: 'Neha Patel Request', user: 'Placement Cell', time: '2 days ago' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Google Campus Drive', date: 'Nov 20, 2023', campus: 'All', type: 'placement' },
    { id: 2, title: 'Soft Skills Workshop', date: 'Nov 15, 2023', campus: 'Bangalore', type: 'training' },
    { id: 3, title: 'Placement Coordinators Meeting', date: 'Nov 12, 2023', campus: 'All', type: 'meeting' },
    { id: 4, title: 'Microsoft Pre-Placement Talk', date: 'Nov 25, 2023', campus: 'Pune', type: 'event' }
  ];

  const adminTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaChartBar /> },
    { id: 'students', name: 'Students', icon: <FaUserGraduate /> },
    { id: 'companies', name: 'Companies', icon: <FaBuilding /> },
    { id: 'placements', name: 'Placements', icon: <FaHandshake /> },
    { id: 'communications', name: 'Communications', icon: <FaComment /> },
    { id: 'reports', name: 'Reports', icon: <FaFileExcel /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Campus Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Campus Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {campuses.map(campus => (
            <div key={campus.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-blue-800">{campus.name}</h3>
                <FaBuilding className="text-blue-600" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-blue-900">{campus.students.toLocaleString()}</p>
                <p className="text-sm text-blue-700">Students</p>
              </div>
              <div className="mt-3">
                <p className="text-lg font-semibold text-blue-900">{campus.companies}</p>
                <p className="text-sm text-blue-700">Companies</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Placement Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-green-800">Placements</h3>
              <FaUserCheck className="text-green-600" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-green-900">{statsData.placements.total.toLocaleString()}</p>
              <p className="text-sm text-green-700">{statsData.placements.percentage}% Success Rate</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-purple-800">Companies</h3>
              <FaBuilding className="text-purple-600" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-purple-900">{statsData.companies.total}</p>
              <p className="text-sm text-purple-700">{statsData.companies.new} New This Year</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-amber-800">Students</h3>
              <FaUserGraduate className="text-amber-600" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-amber-900">{statsData.students.total.toLocaleString()}</p>
              <p className="text-sm text-amber-700">{statsData.students.eligible.toLocaleString()} Eligible</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-5 border border-rose-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-rose-800">Queries</h3>
              <FaQuestionCircle className="text-rose-600" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-rose-900">{statsData.queries.total}</p>
              <p className="text-sm text-rose-700">{statsData.queries.resolved} Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 mt-1 mr-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">
                    <span className="font-medium">{activity.action}</span> for {activity.target}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'placement' ? 'bg-blue-100 text-blue-600' :
                    event.type === 'training' ? 'bg-green-100 text-green-600' :
                    event.type === 'meeting' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <FaCalendarAlt />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {event.date} • {event.campus} Campus
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Student Management</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <select 
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
          >
            <option value="all">All Campuses</option>
            {campuses.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
          <select 
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="all">All Schools</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
          <select 
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="all">All Batches</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
            <FaFilter className="mr-2" /> Apply Filters
          </button>
        </div>
      </div>
      
      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-blue-800">Total Students</h3>
            <FaUserGraduate className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">11,500</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-green-800">Placement Eligible</h3>
            <FaUserCheck className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">8,920</p>
        </div>
        
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-amber-800">Placed Students</h3>
            <FaHandshake className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">1,245</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add Student
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center">
          <FaFileExcel className="mr-2" /> Bulk Import
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center">
          <FaDownload className="mr-2" /> Export Data
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center">
          <FaSync className="mr-2" /> Refresh
        </button>
      </div>
      
      {/* Student Table (simplified) */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">STU-2024-789</td>
              <td className="px-6 py-4 whitespace-nowrap">Aarav Sharma</td>
              <td className="px-6 py-4 whitespace-nowrap">Bangalore</td>
              <td className="px-6 py-4 whitespace-nowrap">SOT</td>
              <td className="px-6 py-4 whitespace-nowrap">2024-2028</td>
              <td className="px-6 py-4 whitespace-nowrap">8.2</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Eligible</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <FaEye />
                </button>
                <button className="text-green-600 hover:text-green-900 mr-3">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FaArchive />
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">STU-2025-456</td>
              <td className="px-6 py-4 whitespace-nowrap">Neha Patel</td>
              <td className="px-6 py-4 whitespace-nowrap">Pune</td>
              <td className="px-6 py-4 whitespace-nowrap">SOM</td>
              <td className="px-6 py-4 whitespace-nowrap">2025-2029</td>
              <td className="px-6 py-4 whitespace-nowrap">8.7</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Pending CGPA</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <FaEye />
                </button>
                <button className="text-green-600 hover:text-green-900 mr-3">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FaArchive />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'students': return renderStudents();
      case 'companies': return <div className="bg-white rounded-xl shadow-sm p-6">Companies Management Content</div>;
      case 'placements': return <div className="bg-white rounded-xl shadow-sm p-6">Placements Management Content</div>;
      case 'communications': return <div className="bg-white rounded-xl shadow-sm p-6">Communications Content</div>;
      case 'reports': return <div className="bg-white rounded-xl shadow-sm p-6">Reports Content</div>;
      case 'settings': return <div className="bg-white rounded-xl shadow-sm p-6">Settings Content</div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaUniversity className="text-blue-600 text-2xl mr-3" />
            <h1 className="text-xl font-bold text-gray-800">PWIOI Admin Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <FaUserTie className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Dr. Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminPanel;