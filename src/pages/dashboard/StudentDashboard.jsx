import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHome from '../../components/dashboard/DashboardHome';
import Footer from '../../components/Footer';
import Awards from '../../components/dashboard/Awards';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Briefcase,
  FileText, 
  Calendar,
  Code2,
  Trophy,
  Github,
  Youtube,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'applications', label: 'Track Applications', icon: FileText },
    { id: 'awards', label: 'Awards', icon: Trophy },
    { id: 'resources', label: 'Placement Resources', icon: FileText },
    { id: 'editProfile', label: 'Edit Profile', icon: Calendar },
  ];

  const skillsCredentials = [
    { id: 'leetcode', label: 'LeetCode', icon: Code2, color: 'text-orange-600' },
    { id: 'codeforces', label: 'Codeforces', icon: Trophy, color: 'text-blue-600' },
    { id: 'gfg', label: 'GeeksforGeeks', icon: Code2, color: 'text-green-600' },
    { id: 'hackerrank', label: 'HackerRank', icon: Trophy, color: 'text-emerald-600' },
    { id: 'github', label: 'GitHub', icon: Github, color: 'text-gray-700' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleSkillClick = (skillId) => {
    // Handle skill/credential link clicks - open external links
    const urls = {
      leetcode: 'https://leetcode.com',
      codeforces: 'https://codeforces.com',
      gfg: 'https://geeksforgeeks.org',
      hackerrank: 'https://hackerrank.com',
      github: 'https://github.com',
      youtube: 'https://youtube.com'
    };
    window.open(urls[skillId], '_blank');
  };

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked - starting logout process');
      await logout();
      console.log('Logout successful - navigating to home');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed: ' + error.message);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
        
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Job Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Job Cards */}
                {[
                  { title: 'Software Engineer', company: 'TechCorp', location: 'Bangalore', type: 'Full-time', salary: '₹8-12 LPA' },
                  { title: 'Frontend Developer', company: 'StartupXYZ', location: 'Hyderabad', type: 'Full-time', salary: '₹6-10 LPA' },
                  { title: 'Data Analyst', company: 'DataCo', location: 'Mumbai', type: 'Full-time', salary: '₹7-11 LPA' },
                  { title: 'Product Manager', company: 'InnovateInc', location: 'Pune', type: 'Full-time', salary: '₹10-15 LPA' },
                  { title: 'DevOps Engineer', company: 'CloudTech', location: 'Chennai', type: 'Full-time', salary: '₹9-13 LPA' },
                  { title: 'UI/UX Designer', company: 'DesignHub', location: 'Gurgaon', type: 'Full-time', salary: '₹5-9 LPA' }
                ].map((job, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
                    <p className="text-[#3c80a7] font-medium">{job.company}</p>
                    <p className="text-slate-600 text-sm">{job.location} • {job.type}</p>
                    <p className="text-green-600 font-semibold mt-2">{job.salary}</p>
                    <button className="mt-3 bg-[#3c80a7] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2d5f7a] transition-colors">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Academic Calendar</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2025-08-20', title: 'Campus Placement Drive', type: 'Placement' },
                      { date: '2025-08-25', title: 'Mock Interview Session', type: 'Training' },
                      { date: '2025-09-01', title: 'Career Fair 2025', type: 'Event' },
                      { date: '2025-09-05', title: 'Resume Workshop', type: 'Workshop' },
                      { date: '2025-09-10', title: 'Company Visit - Google', type: 'Placement' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                        <div className="text-sm text-slate-500">{event.date}</div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-[#3c80a7]">{event.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Academic Schedule</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600">Interactive calendar component would be integrated here.</p>
                    <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold p-2">{day}</div>
                      ))}
                      {Array.from({length: 31}, (_, i) => (
                        <div key={i} className="p-2 hover:bg-blue-100 cursor-pointer rounded">{i + 1}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Track Applications</h2>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Applied', count: 15, color: 'bg-[#3c80a7]' },
                    { label: 'In Progress', count: 8, color: 'bg-yellow-500' },
                    { label: 'Interviews', count: 3, color: 'bg-purple-500' },
                    { label: 'Offers', count: 1, color: 'bg-green-500' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg text-center">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2`}>
                        {stat.count}
                      </div>
                      <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Applications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-2 text-left">Company</th>
                        <th className="px-4 py-2 text-left">Position</th>
                        <th className="px-4 py-2 text-left">Applied Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { company: 'Google', position: 'Software Engineer', date: '2025-08-10', status: 'Interview Scheduled', statusColor: 'text-purple-600' },
                        { company: 'Microsoft', position: 'Frontend Developer', date: '2025-08-08', status: 'Under Review', statusColor: 'text-yellow-600' },
                        { company: 'Amazon', position: 'Data Scientist', date: '2025-08-05', status: 'Applied', statusColor: 'text-[#3c80a7]' },
                        { company: 'Netflix', position: 'Product Manager', date: '2025-08-03', status: 'Offer Received', statusColor: 'text-green-600' }
                      ].map((app, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 font-medium">{app.company}</td>
                          <td className="px-4 py-2">{app.position}</td>
                          <td className="px-4 py-2 text-slate-600">{app.date}</td>
                          <td className={`px-4 py-2 font-medium ${app.statusColor}`}>{app.status}</td>
                          <td className="px-4 py-2">
                            <button className="text-[#3c80a7] hover:text-[#2d5f7a] text-sm">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'awards':
        return <Awards />;
        
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Placement Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Resume Templates',
                    description: 'Professional resume templates for different roles',
                    icon: '📄',
                    items: ['Software Engineer Template', 'Data Scientist Template', 'Product Manager Template']
                  },
                  {
                    title: 'Interview Preparation',
                    description: 'Resources to ace your technical and HR interviews',
                    icon: '🎯',
                    items: ['Coding Interview Questions', 'System Design Basics', 'Behavioral Questions']
                  },
                  {
                    title: 'Company Research',
                    description: 'Information about top hiring companies',
                    icon: '🏢',
                    items: ['Company Profiles', 'Interview Experiences', 'Salary Insights']
                  },
                  {
                    title: 'Skill Development',
                    description: 'Courses and tutorials to enhance your skills',
                    icon: '💡',
                    items: ['Programming Courses', 'Soft Skills Training', 'Industry Certifications']
                  },
                  {
                    title: 'Mock Tests',
                    description: 'Practice tests for aptitude and technical skills',
                    icon: '📝',
                    items: ['Aptitude Tests', 'Coding Challenges', 'Technical Quizzes']
                  },
                  {
                    title: 'Career Guidance',
                    description: 'Expert advice and mentorship opportunities',
                    icon: '🎓',
                    items: ['Career Counseling', 'Mentor Connect', 'Success Stories']
                  }
                ].map((resource, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">{resource.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-slate-600 mb-4">{resource.description}</p>
                    <ul className="space-y-1">
                      {resource.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-[#3c80a7] hover:text-[#2d5f7a] cursor-pointer">• {item}</li>
                      ))}
                    </ul>
                    <button className="mt-4 bg-[#3c80a7] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2d5f7a] transition-colors w-full">
                      Explore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'editProfile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Student ID</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-100" value="ENR123456789" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">School</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]">
                      <option>School of Technology</option>
                      <option>School of Engineering</option>
                      <option>School of Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CGPA</label>
                    <input type="number" step="0.01" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" placeholder="Enter your CGPA" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                  <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" rows="3" placeholder="List your key skills (comma separated)"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c80a7]" rows="4" placeholder="Write a brief bio about yourself"></textarea>
                </div>
                
                <div className="flex space-x-4">
                  <button type="submit" className="bg-[#3c80a7] text-white px-6 py-2 rounded-md hover:bg-[#2d5f7a] transition-colors">
                    Save Changes
                  </button>
                  <button type="button" className="bg-slate-300 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-400 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
        
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <DashboardLayout>
        {/* Collapsible Sidebar / Content Layout */}
        <div className="flex min-h-screen">
          {/* Left Sidebar - Collapsible */}
          <aside className={`${sidebarCollapsed ? 'w-16' : 'w-[20%]'} bg-white border-r border-slate-200 fixed h-[calc(100vh-5rem)] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out`}>
            {/* Toggle Button */}
            <div className="flex justify-end p-2 border-b border-slate-200">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                )}
              </button>
            </div>

            <div className="p-4 h-full flex flex-col">
              {/* Navigation Section */}
              <div className="mb-6">
                <h2 className={`text-base font-bold text-slate-800 mb-3 ${sidebarCollapsed ? 'sr-only' : ''}`}>
                  Navigation
                </h2>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] text-white shadow-md'
                            : 'text-slate-600 hover:text-[#3c80a7] hover:bg-slate-50'
                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={sidebarCollapsed ? tab.label : ''}
                      >
                        <Icon className="h-4 w-4" />
                        {!sidebarCollapsed && <span className="ml-2">{tab.label}</span>}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Skills & Credentials Section */}
              <div className="mb-6">
                <h2 className={`text-base font-bold text-slate-800 mb-3 ${sidebarCollapsed ? 'sr-only' : ''}`}>
                  Skills & Credentials
                </h2>
                <nav className="space-y-1">
                  {skillsCredentials.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <button
                        key={skill.id}
                        onClick={() => handleSkillClick(skill.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#3c80a7] transition-all duration-200 group ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={sidebarCollapsed ? skill.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'} ${skill.color}`} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left">{skill.label}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Logout Section */}
              <div className="mt-auto pt-4 pb-[20%] border-t border-slate-300">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? 'Logout' : ''}
                >
                  <LogOut className="h-4 w-4" />
                  {!sidebarCollapsed && <span className="ml-2">Logout</span>}
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Area - Dynamic Width */}
          <main className={`${sidebarCollapsed ? 'ml-16' : 'ml-[20%]'} ${sidebarCollapsed ? 'w-[calc(100%-4rem)]' : 'w-[80%]'} bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 min-h-screen transition-all duration-300 ease-in-out`}>
            {/* Mobile Navigation Menu - Top of Right Section */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
                <div className="px-4 py-3">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Navigation</h3>
                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab.id)}
                          className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-[#3c80a7] to-[#2d5f7a] text-white'
                              : 'text-slate-600 hover:text-[#3c80a7] hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </DashboardLayout>
      
      {/* Footer - Full Width After Sidebar and Components */}
      <div className="w-full">
        <Footer />
      </div>
    </>
  );
}


