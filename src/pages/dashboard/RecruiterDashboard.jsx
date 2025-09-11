import React, { useState } from 'react';
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiSearch,
  FiMail,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';

const RecruiterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const statsData = {
    totalCandidates: 145,
    newApplications: 12,
    shortlisted: 32,
    interviewsScheduled: 8
  };

  const recentActivities = [
    { id: 1, action: 'Reviewed profile', candidate: 'Sarah Johnson', time: '10 mins ago' },
    { id: 2, action: 'Scheduled interview', candidate: 'Michael Chen', time: '1 hour ago' },
    { id: 3, action: 'Shortlisted', candidate: 'Emma Williams', time: '2 hours ago' },
    { id: 4, action: 'Posted new job', candidate: 'Software Engineer', time: '5 hours ago' }
  ];

  const upcomingInterviews = [
    { id: 1, candidate: 'Alex Rodriguez', role: 'Frontend Developer', time: 'Today, 2:00 PM' },
    { id: 2, candidate: 'Priya Sharma', role: 'Data Scientist', time: 'Tomorrow, 10:30 AM' },
    { id: 3, candidate: 'James Wilson', role: 'UX Designer', time: 'Oct 15, 11:00 AM' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-blue-700">
          <h1 className="text-xl font-semibold">CampusRecruit</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <div className="mb-6">
            <p className="text-blue-200 text-sm font-medium mb-2">MAIN NAVIGATION</p>
            <ul>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <FiHome className="mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'jobs' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <FiBriefcase className="mr-3" />
                  <span>Job Postings</span>
                </button>
              </li>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'candidates' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('candidates')}
                >
                  <FiUsers className="mr-3" />
                  <span>Candidates</span>
                </button>
              </li>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'calendar' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('calendar')}
                >
                  <FiCalendar className="mr-3" />
                  <span>Calendar</span>
                </button>
              </li>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'messages' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <FiMessageSquare className="mr-3" />
                  <span>Messages</span>
                  <span className="ml-auto bg-red-500 text-xs rounded-full px-2 py-1">3</span>
                </button>
              </li>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'analytics' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <FiBarChart2 className="mr-3" />
                  <span>Analytics</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-blue-200 text-sm font-medium mb-2">ACCOUNT</p>
            <ul>
              <li className="mb-2">
                <button 
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <FiSettings className="mr-3" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-semibold">RJ</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Robert Johnson</p>
              <p className="text-xs text-blue-300">TechCorp Recruiter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="relative max-w-xs w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </button>
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FiMail className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-medium text-sm">RJ</span>
              </div>
              <span className="ml-2 hidden md:block">Robert Johnson</span>
              <FiChevronDown className="ml-1 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your recruitment process.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <FiUsers className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm font-medium">Total Candidates</h2>
                  <p className="text-2xl font-semibold">{statsData.totalCandidates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <FiBriefcase className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm font-medium">New Applications</h2>
                  <p className="text-2xl font-semibold">{statsData.newApplications}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <FiBarChart2 className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm font-medium">Shortlisted</h2>
                  <p className="text-2xl font-semibold">{statsData.shortlisted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                  <FiCalendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm font-medium">Interviews</h2>
                  <p className="text-2xl font-semibold">{statsData.interviewsScheduled}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-blue-600 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                      <FiUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.action}: {activity.candidate}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Interviews</h2>
                <button className="text-blue-600 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center border border-blue-200">
                        <FiCalendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{interview.candidate}</p>
                        <p className="text-xs text-gray-500">{interview.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{interview.time}</p>
                      <button className="text-xs text-blue-600 font-medium">Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hiring Performance Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Hiring Performance</h2>
              <button className="text-blue-600 text-sm font-medium">View Report</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-gray-600 mt-2">Acceptance Rate</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">4.7/5</div>
                <div className="text-sm text-gray-600 mt-2">Candidate Satisfaction</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-purple-600">24</div>
                <div className="text-sm text-gray-600 mt-2">Total Hires (2023)</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default RecruiterDashboard;