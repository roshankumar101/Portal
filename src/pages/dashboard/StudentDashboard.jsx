import React, { useState, useCallback, useRef, useEffect } from 'react';
import SampleResume from '../../assets/Docs/Resume(1).pdf';
import DashboardLayout from '../../components/dashboard/shared/DashboardLayout';
import DashboardHome from '../../components/dashboard/student/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { 
  getStudentProfile, 
  updateCompleteStudentProfile, 
  createCompleteStudentProfile,
  getStudentSkills,
  getEducationalBackground,
} from '../../services/students';
import { getStudentApplications, applyToJob } from '../../services/applications';
import { listJobs } from '../../services/jobs';
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
  FilePlus,
  ScanLine,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import PDFLivePreview from '../../components/resume/PDFLivePreview';
import ResumeEnhancer from '../../components/resume/ResumeEnhancer';
import { upsertResume, getResume } from '../../services/resumes';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(15); // Default 15% (within 5%-15%)
  const [isDragging, setIsDragging] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dragRef = useRef(null);
  const [batch, setBatch] = useState('2023-2027');
  const [center, setCenter] = useState('Bangalore');



  // New state for checkbox in Edit Profile
  const [isChecked, setIsChecked] = useState(false);
  
  // Validation state for real-time feedback
  const [validationErrors, setValidationErrors] = useState({});

  // Edit Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
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
  const [school, setSchool] = useState('');
  // Local UI-only state for Resume tab (no DB)
  const [hasResume, setHasResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);
  const resumeFileInputRef = useRef(null);
  const [resumeActiveTab, setResumeActiveTab] = useState('editor');
  
  // Skills state
  const [skillsEntries, setSkillsEntries] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: '', rating: 1 });
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  
  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [applying, setApplying] = useState({});
  

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tab = searchParams.get('tab');

    // Listen for edit profile button clicks
    const handleEditProfileClick = () => {
      setActiveTab('editProfile');
    };

    // Listen for navigate to jobs event
    const handleNavigateToJobs = () => {
      setActiveTab('jobs');
    };

    // Listen for navigate to applications event
    const handleNavigateToApplications = () => {
      setActiveTab('applications');
    };


    window.addEventListener('editProfileClicked', handleEditProfileClick);
    window.addEventListener('navigateToJobs', handleNavigateToJobs);
    window.addEventListener('navigateToApplications', handleNavigateToApplications);

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
      window.removeEventListener('navigateToJobs', handleNavigateToJobs);
      window.removeEventListener('navigateToApplications', handleNavigateToApplications);
    };
  }, [searchParams, navigate]);

  // Load profile data function (can be called for real-time updates)
  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const data = await getStudentProfile(user.uid);
      if (data) {
        setFullName(data.fullName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setEnrollmentId(data.enrollmentId || '');
        setCgpa(data.cgpa?.toString?.() || '');
        setBatch(data.batch || batch);
        setCenter(data.center || center);
        setBio(data.bio || '');
        setTagline(data.tagline || '');
        setCity(data.city || '');
        setStateRegion(data.stateRegion || data.state || '');
        setLinkedin(data.linkedin || '');
        setLeetcode(data.leetcode || '');
        setCodeforces(data.codeforces || '');
        setGfg(data.gfg || '');
        setHackerrank(data.hackerrank || '');
        setGithubUrl(data.githubUrl || data.github || '');
        setYoutubeUrl(data.youtubeUrl || data.youtube || '');
        setSchool(data.school || '');
        // Load resume if present on profile
        if (data.resumeUrl) {
          setResumeUrl(data.resumeUrl);
          setHasResume(true);
        }
      }
      
      // Load skills data
      await loadSkillsData();
      // Load applications data
      await loadApplicationsData();
    } catch (err) {
      console.warn('Failed to load profile for edit form', err);
    }
  }, [user?.uid, batch, center]);


  const loadSkillsData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoadingSkills(true);
      const skillsData = await getStudentSkills(user.uid);
      setSkillsEntries(skillsData || []);
    } catch (err) {
      console.error('Failed to load skills data', err);
    } finally {
      setLoadingSkills(false);
    }
  }, [user?.uid]);

  const loadApplicationsData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoadingApplications(true);
      const applicationsData = await getStudentApplications(user.uid);
      setApplications(applicationsData || []);
    } catch (err) {
      console.error('Failed to load applications data', err);
    } finally {
      setLoadingApplications(false);
    }
  }, [user?.uid]);

  const loadJobsData = useCallback(async () => {
    try {
      setLoadingJobs(true);
      const jobsData = await listJobs();
      setJobs(jobsData || []);
    } catch (err) {
      console.error('Failed to load jobs data', err);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const handleApplyToJob = async (job) => {
    if (!user?.uid || !job?.id) {
      console.error('Missing user ID or job ID');
      return;
    }

    try {
      setApplying(prev => ({ ...prev, [job.id]: true }));
      
      await applyToJob(user.uid, job.id, job.companyId);
      
      // Reload applications to update UI
      await loadApplicationsData();
      
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  // Load existing profile data for Edit Profile form
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Load jobs data when component mounts
  useEffect(() => {
    loadJobsData();
  }, [loadJobsData]);

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateCGPA = (cgpa) => {
    const cgpaNum = parseFloat(cgpa);
    return !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10;
  };

  const validateURL = (url) => {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateProfile = () => {
    const errors = [];

    // Required field validations
    if (!fullName.trim()) errors.push('Full name is required');
    if (!email.trim()) errors.push('Email is required');
    else if (!validateEmail(email.trim())) errors.push('Please enter a valid email address');
    
    if (!phone.trim()) errors.push('Phone number is required');
    else if (!validatePhone(phone.trim())) errors.push('Please enter a valid phone number');

    // Optional field validations
    if (cgpa && !validateCGPA(cgpa)) errors.push('CGPA must be between 0 and 10');
    
    // URL validations for social profiles
    if (linkedin && !validateURL(linkedin)) errors.push('Please enter a valid LinkedIn URL');
    if (githubUrl && !validateURL(githubUrl)) errors.push('Please enter a valid GitHub URL');
    if (youtubeUrl && !validateURL(youtubeUrl)) errors.push('Please enter a valid YouTube URL');

    return errors;
  };

  // Real-time field validation
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };
    
    switch (fieldName) {
      case 'fullName':
        if (!value.trim()) {
          errors.fullName = 'Full name is required';
        } else {
          delete errors.fullName;
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!validateEmail(value.trim())) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!validatePhone(value.trim())) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'enrollmentId':
        if (!value.trim()) {
          errors.enrollmentId = 'Enrollment ID is required';
        } else if (value.trim().length < 3) {
          errors.enrollmentId = 'Enrollment ID must be at least 3 characters';
        } else {
          delete errors.enrollmentId;
        }
        break;
      case 'cgpa':
        if (value && !validateCGPA(value)) {
          errors.cgpa = 'CGPA must be between 0 and 10';
        } else {
          delete errors.cgpa;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  // Skills management functions
  const handleSaveSkill = async () => {
    if (!user?.uid) return;
    
    const { skillName, rating } = newSkill;
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    try {
      const skillData = {
        studentId: user.uid,
        skillName: skillName.trim(),
        rating: parseInt(rating)
      };

      await addOrUpdateSkill(skillData);
      
      // Reload skills data
      const updatedSkills = await getStudentSkills(user.uid);
      setSkillsEntries(updatedSkills || []);
      
      // Reset form
      setNewSkill({ skillName: '', rating: 1 });
      
      alert('Skill saved successfully!');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!user?.uid || !skillId) return;
    
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await deleteSkill(skillId);
      
      // Reload skills data
      const updatedSkills = await getStudentSkills(user.uid);
      setSkillsEntries(updatedSkills || []);
      
      alert('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('You must be logged in to save your profile.');
      return;
    }

    // Validate form data
    const validationErrors = validateProfile();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      
      const profileData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        enrollmentId: enrollmentId.trim(),
        cgpa: cgpa ? Number(cgpa) : null,
        batch,
        center,
        bio: bio.trim(),
        tagline: tagline.trim(),
        city: city.trim(),
        stateRegion: stateRegion.trim(),
        linkedin: linkedin.trim(),
        githubUrl: githubUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        leetcode: leetcode.trim(),
        codeforces: codeforces.trim(),
        gfg: gfg.trim(),
        hackerrank: hackerrank.trim(),
        school: school.trim(),
      };

      const existing = await getStudentProfile(user.uid);
      if (existing) {
        await updateCompleteStudentProfile(user.uid, profileData, []);
      } else {
        await createCompleteStudentProfile(user.uid, profileData, []);
      }
      
      // Reload profile data to show real-time updates
      await loadProfile();
      
      // Go back to dashboard to see the updates
      setActiveTab('dashboard');
      alert('Profile saved successfully! Your information has been updated.');
    } catch (err) {
      console.error('Failed to save profile', err);
      
      // More specific error messages
      let errorMessage = 'Failed to save profile. ';
      if (err.code === 'permission-denied') {
        errorMessage += 'You do not have permission to update this profile.';
      } else if (err.code === 'network-request-failed') {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (err.code === 'unavailable') {
        errorMessage += 'Service is temporarily unavailable. Please try again later.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      alert(errorMessage);
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

    // Constrain between 5% and 15%
    const constrainedWidth = Math.min(Math.max(newWidth, 5), 15);
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
    };

  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock size={16} />;
      case 'shortlisted': return <AlertCircle size={16} />;
      case 'interviewed': return <CheckCircle size={16} />;
      case 'offered': return <CheckCircle size={16} />;
      case 'selected': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-[#3c80a7]/20 text-[#3c80a7]';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'from-[#f0f8fa] to-[#d6eaf5]';
      case 'shortlisted': return 'from-yellow-50 to-yellow-100';
      case 'interviewed': return 'from-purple-50 to-purple-100';
      case 'offered': return 'from-green-50 to-green-100';
      case 'rejected': return 'from-red-50 to-red-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : '?';
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-[#3c80a7]', 'bg-green-600', 'bg-purple-600',
      'bg-red-600', 'bg-indigo-600', 'bg-pink-600'
    ];
    const index = companyName ? companyName.length % colors.length : 0;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
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
              
              {loadingJobs ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading jobs...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No jobs available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.jobTitle}</h3>
                          <p className="text-blue-600 font-medium text-sm">{job.company?.name || 'Company'}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.jobType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Location:</span>
                          <span className="ml-1">{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Experience:</span>
                          <span className="ml-1">{job.experienceLevel}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Salary:</span>
                          <span className="ml-1 text-green-600 font-semibold">
                            ₹{(job.salary / 100000).toFixed(1)} LPA
                          </span>
                        </div>
                        {job.eligibilityCriteria && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Eligibility:</span>
                            <span className="ml-1">{job.eligibilityCriteria}</span>
                          </div>
                        )}
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => handleApplyToJob(job)}
                          disabled={hasApplied(job.id) || applying[job.id]}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            hasApplied(job.id)
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : applying[job.id]
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                          }`}
                        >
                          {hasApplied(job.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 inline mr-1" />
                              Applied
                            </>
                          ) : applying[job.id] ? (
                            <>
                              <Loader className="h-4 w-4 inline mr-1 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setResumeActiveTab('editor')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        resumeActiveTab === 'editor'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Live Preview
                    </button>
                    <button
                      onClick={() => setResumeActiveTab('enhancer')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        resumeActiveTab === 'enhancer'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      AI Enhancer
                    </button>
                    <button
                      onClick={() => setResumeActiveTab('upload')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        resumeActiveTab === 'upload'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Upload & Manage
                    </button>
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              {resumeActiveTab === 'editor' && (
                <div className="w-full h-[70vh]">
                  <ErrorBoundary>
                    {user?.uid && (
                      <PDFLivePreview 
                        uid={user.uid} 
                        resumeId="default"
                        resumeUrl={resumeUrl}
                        hasResume={hasResume}
                        onUploadClick={() => resumeFileInputRef.current?.click()}
                      />
                    )}
                  </ErrorBoundary>
                </div>
              )}

              {resumeActiveTab === 'enhancer' && (
                <div className="w-full h-[70vh]">
                  <ErrorBoundary>
                    {user?.uid && (
                      <ResumeEnhancer uid={user.uid} resumeId="default" />
                    )}
                  </ErrorBoundary>
                </div>
              )}

              {resumeActiveTab === 'upload' && (
                <div className="space-y-4">
                  {/* Subheading row with actions */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-gray-600">
                      Upload and manage your resume files
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
                        onClick={() => window.open('https://www.open-resume.com/resume-import', '_blank', 'noopener')}
                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-md bg-white hover:bg-gray-50 text-sm"
                        title="Create resume"
                      >
                        <FilePlus className="h-4 w-4" /> Create Resume
                      </button>
                    </div>
                  </div>

                  {/* Dropzone area */}
                  <div
                    className={`relative w-full h-[60vh] border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden ${!hasResume ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (!hasResume) {
                        resumeFileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0];
                      if (file && (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'))) {
                        if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(resumeUrl);
                        }
                        const blobUrl = URL.createObjectURL(file);
                        setResumeUrl(blobUrl);
                        setHasResume(true);
                      }
                    }}
                  >
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
                        className="absolute top-3 right-3 inline-flex items-center justify-center p-2 rounded-md bg-red-200 text-red-500 hover:bg-red-700 hover:text-white"
                        title="Delete Resume"
                        aria-label="Delete resume"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {!hasResume && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                        <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
                        <p className="text-gray-500 text-sm">Or click 'Add Resume' above to select a file.</p>
                      </div>
                    )}
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
                        if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(resumeUrl);
                        }
                        const blobUrl = URL.createObjectURL(file);
                        setResumeUrl(blobUrl);
                        setHasResume(true);
                      }
                    }}
                  />
                </div>
              )}
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
              
              {loadingApplications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="animate-spin h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading applications...</span>
                </div>
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No applications found</p>
                  <p className="text-gray-400 text-sm">Start applying to jobs to track your applications here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Column Headers */}
                  <div className="grid grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-black font-bold text-lg">Company</div>
                    <div className="text-black font-bold text-lg">Job Title</div>
                    <div className="text-black font-bold text-lg">Date Applied</div>
                    <div className="text-black font-bold text-lg">Interview Date</div>
                    <div className="text-black font-bold text-lg text-right">Status</div>
                  </div>

                  {/* Application Rows */}
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className={`grid grid-cols-5 gap-4 p-4 rounded-xl bg-gradient-to-r ${getRowBgColor(application.status)} hover:shadow-md transition-all duration-200 border border-gray-100`}
                    >
                      <div className="flex items-center">
                        <div className={`${getCompanyColor(application.company?.name)} w-10 h-10 rounded-lg mr-3 flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">
                            {getCompanyInitial(application.company?.name)}
                          </span>
                        </div>
                        <div className="text-base font-semibold text-black">
                          {application.company?.name || 'Unknown Company'}
                        </div>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-800 flex items-center">
                        {application.job?.jobTitle || 'Unknown Position'}
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center">
                        {formatDate(application.appliedDate)}
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center">
                        {application.interviewDate ? formatDate(application.interviewDate) : 'TBD'}
                      </div>
                      
                      <div className="flex justify-end">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status
                            ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Application Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                        <div className="text-sm text-blue-700">Total Applied</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {applications.filter(app => app.status === 'shortlisted').length}
                        </div>
                        <div className="text-sm text-yellow-700">Shortlisted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {applications.filter(app => app.status === 'interviewed').length}
                        </div>
                        <div className="text-sm text-purple-700">Interviewed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {applications.filter(app => app.status === 'offered').length}
                        </div>
                        <div className="text-sm text-green-700">Offers</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.fullName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        validateField('fullName', e.target.value);
                      }}
                    />
                    {validationErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.email 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                      }}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.phone 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        validateField('phone', e.target.value);
                      }}
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment ID</label>
                    <input 
                      type="text" 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.enrollmentId 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your enrollment ID"
                      value={enrollmentId}
                      onChange={(e) => {
                        setEnrollmentId(e.target.value);
                        validateField('enrollmentId', e.target.value);
                      }}
                    />
                    {validationErrors.enrollmentId && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.enrollmentId}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    >
                      <option value="">Select School</option>
                      <option value="School of Technology">School of Technology</option>
                      <option value="School of Management">School of Management</option>
                      <option value="School of HealthCare">School of HealthCare</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
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
          <div className="p-3 h-full flex flex-col">
            <div className="mb-6">
              {sidebarWidth >= 9 && (
                <h2 className="text-base font-bold text-gray-900 mb-3">Navigation</h2>
              )}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="mb-1">
                      <button
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          } ${sidebarWidth < 9 ? 'justify-center px-2 py-2' : 'px-2 py-3'}`}
                        title={sidebarWidth < 9 ? tab.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''}`} />
                        {sidebarWidth >= 9 && tab.label}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="mb-6">
              {sidebarWidth >= 9 && (
                <h2 className="text-base font-bold text-gray-900 mb-3">Skills & Credentials</h2>
              )}
              <nav className="space-y-1">
                {skillsCredentials.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.id} className="mb-1">
                      <button
                        onClick={() => handleSkillClick(skill.id)}
                        className={`w-full flex items-center rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-all duration-200 group ${sidebarWidth < 12 ? 'justify-center px-2 py-3' : 'px-3 py-2'
                          }`}
                        title={sidebarWidth < 9 ? skill.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''} ${skill.color}`} />
                        {sidebarWidth >= 9 && (
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
                title={sidebarWidth < 9 ? 'Logout' : ''}
              >
                <LogOut className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''}`} />
                {sidebarWidth >= 9 && 'Logout'}
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
