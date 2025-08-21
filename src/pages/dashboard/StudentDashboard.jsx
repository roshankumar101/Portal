import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHome from '../../components/dashboard/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SiCodeforces, SiGeeksforgeeks } from 'react-icons/si';
import { FaHackerrank, FaYoutube } from 'react-icons/fa';
import { 
  Home, 
  Briefcase,
  FileText, 
  Calendar,
  SquarePen,
  Code2,
  Trophy,
  Github,
  Youtube,
  ExternalLink,
  LogOut
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'applications', label: 'Track Applications', icon: FileText },
    { id: 'resources', label: 'Placement Resources', icon: FileText },
    { id: 'editProfile', label: 'Edit Profile', icon: SquarePen },
  ];

  const LeetCodeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="m15.42 16.94-2.25 2.17a2.1 2.1 0 0 1-1.52.56 2.1 2.1 0 0 1-1.52-.56l-3.61-3.63a2.18 2.18 0 0 1-.58-1.55 2.07 2.07 0 0 1 .58-1.52l3.6-3.65a2.1 2.1 0 0 1 1.53-.54 2.08 2.08 0 0 1 1.52.55l2.25 2.17A1.14 1.14 0 0 0 17 9.33l-2.17-2.2a4.24 4.24 0 0 0-2-1.12l2.06-2.08a1.15 1.15 0 0 0-1.62-1.62l-8.43 8.42a4.48 4.48 0 0 0-1.24 3.2 4.57 4.57 0 0 0 1.24 3.23l3.63 3.63A4.38 4.38 0 0 0 11.66 22a4.45 4.45 0 0 0 3.2-1.25L17 18.56a1.14 1.14 0 0 0-1.61-1.62z"></path>
      <path d="M19.34 12.84h-8.45a1.12 1.12 0 0 0 0 2.24h8.45a1.12 1.12 0 0 0 0-2.24"></path>
    </svg>
  );

  const skillsCredentials = [
    { id: 'leetcode', label: 'LeetCode', icon: LeetCodeIcon, color: 'text-orange-600' },
    { id: 'codeforces', label: 'Codeforces', icon: SiCodeforces, color: 'text-blue-600' },
    { id: 'gfg', label: 'GeeksforGeeks', icon: SiGeeksforgeeks, color: 'text-green-600' },
    { id: 'hackerrank', label: 'HackerRank', icon: FaHackerrank, color: 'text-emerald-600' },
    { id: 'github', label: 'GitHub', icon: Github, color: 'text-gray-700' },
    { id: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
        
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Job Opportunities</h2>
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <p className="text-gray-600 text-sm">{job.location} • {job.type}</p>
                    <p className="text-green-600 font-semibold mt-2">{job.salary}</p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Calendar</h2>
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
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-500">{event.date}</div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-blue-600">{event.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Academic Schedule</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Interactive calendar component would be integrated here.</p>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Applications</h2>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Applied', count: 15, color: 'bg-blue-500' },
                    { label: 'In Progress', count: 8, color: 'bg-yellow-500' },
                    { label: 'Interviews', count: 3, color: 'bg-purple-500' },
                    { label: 'Offers', count: 1, color: 'bg-green-500' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2`}>
                        {stat.count}
                      </div>
                      <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Applications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
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
                        { company: 'Amazon', position: 'Data Scientist', date: '2025-08-05', status: 'Applied', statusColor: 'text-blue-600' },
                        { company: 'Netflix', position: 'Product Manager', date: '2025-08-03', status: 'Offer Received', statusColor: 'text-green-600' }
                      ].map((app, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 font-medium">{app.company}</td>
                          <td className="px-4 py-2">{app.position}</td>
                          <td className="px-4 py-2 text-gray-600">{app.date}</td>
                          <td className={`px-4 py-2 font-medium ${app.statusColor}`}>{app.status}</td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
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
        
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Placement Resources</h2>
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
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">{resource.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <ul className="space-y-1">
                      {resource.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">• {item}</li>
                      ))}
                    </ul>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors w-full">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100" value="ENR123456789" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>School of Technology</option>
                      <option>School of Engineering</option>
                      <option>School of Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your CGPA" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="List your key skills (comma separated)"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Write a brief bio about yourself"></textarea>
                </div>
                
                <div className="flex space-x-4">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                  <button type="button" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors">
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
    <DashboardLayout>
      {/* 20% Sidebar / 80% Content Layout */}
      <div className="flex min-h-screen">
        {/* Left Sidebar - 20% - Navigation */}
        <aside className="w-[20%] bg-white border-r border-gray-200 fixed h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-4 h-full flex flex-col">
            {/* Navigation Section */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">Navigation</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Skills & Credentials Section */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">Skills & Credentials</h2>
              <nav className="space-y-1">
                {skillsCredentials.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleSkillClick(skill.id)}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${skill.color}`} />
                      <span className="flex-1 text-left">{skill.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout Section */}
            <div className="mt-auto pt-4 pb-[20%] border-t border-gray-300">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area - 80% */}
        <main className="ml-[20%] w-[80%] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen">
          {/* Mobile Navigation Menu - Top of Right Section */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Navigation</h3>
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
  );
}