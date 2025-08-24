import React, { useState, useCallback, useRef, useEffect } from 'react';
import SampleResume from '../../assets/Docs/Resume(1).pdf';
import DashboardLayout from '../../components/dashboard/shared/DashboardLayout';
import DashboardHome from '../../components/dashboard/student/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { getStudentProfile, updateStudentProfile, createStudentProfile } from '../../services/students';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SiCodeforces, SiGeeksforgeeks } from 'react-icons/si';
import { FaHackerrank, FaYoutube } from 'react-icons/fa';
import {
  Home,
  Briefcase,
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
  BookOpen,
  FileText,
  Trash2,
  Upload,
  FilePlus
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(20); // Default 20%
  const [isDragging, setIsDragging] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dragRef = useRef(null);
  const [batch, setBatch] = useState('2023-2027');
  const [center, setCenter] = useState('Bangalore');



  // New state for checkbox in Edit Profile
  const [isChecked, setIsChecked] = useState(false);

  // Edit Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [gfg, setGfg] = useState('');
  const [hackerrank, setHackerrank] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  // Local UI-only state for Resume tab (no DB)
  const [hasResume, setHasResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);
  const resumeFileInputRef = useRef(null);

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tab = searchParams.get('tab');

    // Listen for edit profile button clicks
    const handleEditProfileClick = () => {
      setActiveTab('editProfile');
    };


    window.addEventListener('editProfileClicked', handleEditProfileClick);

    // Only set tab from URL if it's a valid tab and not on page refresh
    if (tab && ['dashboard', 'jobs', 'calendar', 'applications', 'resources', 'resume', 'editProfile'].includes(tab)) {
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

  // Load existing profile data for Edit Profile form
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      try {
        const data = await getStudentProfile(user.uid);
        if (data) {
          setFullName(data.fullName || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setCgpa(data.cgpa?.toString?.() || '');
          setBatch(data.batch || batch);
          setCenter(data.center || center);
          setBio(data.bio || '');
          setTagline(data.tagline || '');
          setCity(data.city || '');
          setStateRegion(data.state || '');
          setLinkedin(data.linkedin || '');
          setLeetcode(data.leetcode || '');
          setCodeforces(data.codeforces || '');
          setGfg(data.gfg || '');
          setHackerrank(data.hackerrank || '');
          setGithubUrl(data.github || '');
          setYoutubeUrl(data.youtube || '');
          // Load resume if present on profile
          if (data.resumeUrl) setResumeUrl(data.resumeUrl);
        }
      } catch (err) {
        console.warn('Failed to load profile for edit form', err);
      }
    };
    loadProfile();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('You must be logged in to save your profile.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cgpa: cgpa ? Number(cgpa) : null,
        batch,
        center,
        bio: bio.trim(),
        tagline: tagline.trim(),
        city: city.trim(),
        state: stateRegion.trim(),
        linkedin: linkedin.trim(),
        leetcode: leetcode.trim(),
        codeforces: codeforces.trim(),
        gfg: gfg.trim(),
        hackerrank: hackerrank.trim(),
        github: githubUrl.trim(),
        youtube: youtubeUrl.trim(),
      };

      const existing = await getStudentProfile(user.uid);
      if (existing) {
        await updateStudentProfile(user.uid, payload);
      } else {
        await createStudentProfile(user.uid, payload);
      }
      // Go back to dashboard to see the updates
      setActiveTab('dashboard');
      alert('Profile saved successfully');
    } catch (err) {
      console.error('Failed to save profile', err);
      alert(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'resume', label: 'Resume', icon: FileText },
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

      case 'resume':
        return (
          <div className="space-y-6">
            {/* Outer card matching Edit Profile style */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Heading inside the card */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Resume
                </h2>
              </div>
              {/* Subheading row with actions on the right */}
              <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-600">
                  You can Create/Analyze your resume here
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => resumeFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                    title={hasResume ? 'Choose a PDF to replace your resume' : 'Choose a PDF to add'}
                  >
                    <Upload className="h-4 w-4" /> {hasResume ? 'Replace Resume' : 'Add Resume'}
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Resume builder coming soon')}
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-md bg-white hover:bg-gray-50 text-sm"
                    title="Create resume"
                  >
                    <FilePlus className="h-4 w-4" /> Create Resume
                  </button>
                </div>
              </div>

              {/* Dropzone area */}
              <div
                className={`relative w-full h-[80vh] border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden ${!hasResume ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (!hasResume) {
                    resumeFileInputRef.current?.click();
                  }
                }}
              >
                {/* Conditional delete button in top-right when resume exists */}
                {hasResume && (
                  <button
                    type="button"
                    onClick={() => {
                      if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(resumeUrl);
                      }
                      setHasResume(false);
                      setResumeUrl(null);
                    }}
                    className="absolute top-3 right-3 inline-flex items-center justify-center p-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    title="Delete Resume"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {/* Empty state text */}
                {!hasResume && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                    <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
                    <p className="text-gray-500 text-sm">Or click 'Add Resume' below to select a file.</p>
                  </div>
                )}
                {/* When a resume is present, render inline preview (no PDF controls) */}
                {hasResume && resumeUrl && (
                  <iframe
                    src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="Resume preview"
                    className="w-[70%] h-full rounded shadow"
                  />
                )}
              </div>

              {/* Hidden file input for uploads */}
              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    // Revoke old blob if present
                    if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(resumeUrl);
                    }
                    const blobUrl = URL.createObjectURL(file);
                    setResumeUrl(blobUrl);
                    setHasResume(true);
                  }
                }}
              />

              {/* Action buttons moved to subheading row above */}
            </div>
          </div>
        );

      case 'editProfile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100" value={user?.uid || ''} disabled />
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
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your CGPA"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Full-Stack Developer | Open Source Enthusiast"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your state"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/@channel"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://leetcode.com/u/username"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Codeforces</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://codeforces.com/profile/username"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GeeksforGeeks</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://auth.geeksforgeeks.org/user/username"
                        value={gfg}
                        onChange={(e) => setGfg(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">HackerRank</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.hackerrank.com/profile/username"
                      value={hackerrank}
                      onChange={(e) => setHackerrank(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Write a brief bio about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
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
                    disabled={!isChecked || saving}
                    className={`px-6 py-2 rounded-md text-white transition-colors ${(!isChecked || saving) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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
