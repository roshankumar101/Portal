import React, { useState, useCallback, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHome from '../../components/dashboard/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  LogOut,
  GripVertical,
  ClipboardList,
  BookOpen
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(20); // Default 20%
  const [isDragging, setIsDragging] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dragRef = useRef(null);
  const [batch, setBatch] = useState('2023-2027');
  const [center, setCenter] = useState('Bangalore');


  // New state for checkbox in Edit Profile
  const [isChecked, setIsChecked] = useState(false);

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tab = searchParams.get('tab');

    // Listen for edit profile button clicks
    const handleEditProfileClick = () => {
      setActiveTab('editProfile');
    };

    window.addEventListener('editProfileClicked', handleEditProfileClick);

    // Only set tab from URL if it's a valid tab and not on page refresh
    if (tab && ['dashboard', 'jobs', 'calendar', 'applications', 'resources', 'editProfile'].includes(tab)) {
      // Check if this is a fresh navigation (not a refresh)
      const isRefresh = window.performance.navigation?.type === 1 ||
        window.performance.getEntriesByType('navigation')[0]?.type === 'reload';

      if (!isRefresh || tab !== 'editProfile') {
        setActiveTab(tab);
      } else {
        // On refresh, always default to dashboard
        setActiveTab('dashboard');
        // Clear the URL parameter
        navigate('/student', { replace: true });
      }
    } else {
      setActiveTab('dashboard');
    }

    return () => {
      window.removeEventListener('editProfileClicked', handleEditProfileClick);
    };
  }, [searchParams, navigate]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'applications', label: 'Track Applications', icon: ClipboardList },
    { id: 'resources', label: 'Placement Resources', icon: BookOpen },
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

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const windowWidth = window.innerWidth;
    const newWidth = (e.clientX / windowWidth) * 100;

    // Constrain between 6% and 18%
    const constrainedWidth = Math.min(Math.max(newWidth, 6), 18);
    setSidebarWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
              {/* Calendar content omitted for brevity */}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Applications</h2>
              {/* Applications content omitted for brevity */}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Placement Resources</h2>
              {/* Resources content omitted for brevity */}
            </div>
          </div>
        );

      case 'editProfile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                      <option className='bg-blue-50'>School of Technology</option>
                      <option className='bg-blue-50'>School of Management</option>
                      <option className='bg-blue-50'>School of HealthCare</option>
                    </select>
                  </div>
                

{/* Inside your form, add: */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
  <select
    value={batch}
    onChange={(e) => setBatch(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="2023-2027">2023-2027</option>
    <option value="2024-2028">2024-2028</option>
    <option value="2025-2029">2025-2029</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Center</label>
  <select
    value={center}
    onChange={(e) => setCenter(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="Bangalore">Bangalore</option>
    <option value="Noida">Noida</option>
    <option value="Lucknow">Lucknow</option>
    <option value="Pune">Pune</option>
  </select>
</div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your CGPA" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Write a brief bio about yourself"></textarea>
                </div>

                <div className="space-x-2 px-4 mb-2 text-xs">
  <input
    type="checkbox"
    id="editCheckbox"
    checked={isChecked}
    onChange={() => setIsChecked(!isChecked)}
  />
  <label htmlFor="editCheckbox">
    I acknowledge that the information provided on this dashboard is accurate to the best of the institution’s knowledge. I understand that the institution shall not be held liable for any errors, omissions, or discrepancies.
  </label>
</div>

                <div className="flex space-x-4 justify-center">
                  <button
                    type="submit"
                    id='editSaveBtn'
                    disabled={!isChecked}
                    className={`px-6 py-2 rounded-md text-white transition-colors ${
                      isChecked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
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
      <div className="flex min-h-screen relative">
        <aside
          className="bg-white border-r border-gray-200 fixed h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-200 ease-in-out"
          style={{ width: `${sidebarWidth}%` }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="mb-6">
              {sidebarWidth >= 12 && (
                <h2 className="text-base font-bold text-gray-900 mb-3">Navigation</h2>
              )}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="mb-1">
                      <button
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          } ${sidebarWidth < 12 ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}`}
                        title={sidebarWidth < 12 ? tab.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarWidth >= 12 ? 'mr-2' : ''}`} />
                        {sidebarWidth >= 12 && tab.label}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="mb-6">
              {sidebarWidth >= 12 && (
                <h2 className="text-base font-bold text-gray-900 mb-3">Skills & Credentials</h2>
              )}
              <nav className="space-y-1">
                {skillsCredentials.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.id} className="mb-1">
                      <button
                        onClick={() => handleSkillClick(skill.id)}
                        className={`w-full flex items-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 group ${sidebarWidth < 12 ? 'justify-center px-2 py-3' : 'px-3 py-2'
                          }`}
                        title={sidebarWidth < 12 ? skill.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarWidth >= 12 ? 'mr-2' : ''} ${skill.color}`} />
                        {sidebarWidth >= 12 && (
                          <>
                            <span className="flex-1 text-left">{skill.label}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto pt-4 pb-[35%] border-t border-gray-300">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${sidebarWidth < 12 ? 'justify-center px-2 py-2 mb-15' : 'px-3 py-2.5'
                  }`}
                title={sidebarWidth < 12 ? 'Logout' : ''}
              >
                <LogOut className={`h-4 w-4 ${sidebarWidth >= 12 ? 'mr-2' : ''}`} />
                {sidebarWidth >= 12 && 'Logout'}
              </button>
            </div>
          </div>
        </aside>

        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          className="fixed top-0 h-screen w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize z-10 transition-colors duration-200 flex items-center justify-center group"
          style={{ left: `${sidebarWidth}%` }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </div>
        </div>

        <main
          className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen transition-all duration-200 ease-in-out"
          style={{
            marginLeft: `${sidebarWidth}%`,
            width: `${100 - sidebarWidth}%`
          }}
        >
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
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
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
