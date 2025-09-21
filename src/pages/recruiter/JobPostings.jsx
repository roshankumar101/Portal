import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Info, Plus, X, Loader, ChevronUp, ChevronDown } from 'lucide-react';

const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error('Error caught by ErrorBoundary:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
};

const JobPostings = () => {
  const [activeView, setActiveView] = useState('active');
  const [creationMethod, setCreationMethod] = useState('manual');
  const [isUploading, setIsUploading] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Form state for manual job posting
  const [form, setForm] = useState({
    company: '',
    website: '',
    linkedin: '',
    jobType: '',
    stipend: '',
    duration: '',
    salary: '',
    jobTitle: '',
    workMode: '',
    companyLocation: '',
    openings: '',
    responsibilities: '',
    spocs: [{ fullName: '', email: '', phone: '' }],
    driveDateText: '',
    driveDateISO: '',
    driveVenues: [],
    qualification: '',
    specialization: '',
    yop: '',
    minCgpa: '',
    skillsInput: '',
    skills: [],
    gapAllowed: '',
    gapYears: '',
    backlogs: '',
    serviceAgreement: '',
    blockingPeriod: '',
    baseRoundDetails: ['', '', ''],
    extraRounds: [],
    instructions: '',
  });

  // Reset form to initial state or to keep certain fields
  const resetForm = (keep = {}) => {
    setForm((f) => ({
      company: keep.company ?? '',
      website: keep.website ?? '',
      linkedin: keep.linkedin ?? '',
      jobType: '',
      stipend: '',
      duration: '',
      salary: '',
      jobTitle: '',
      workMode: '',
      companyLocation: keep.companyLocation ?? '',
      openings: '',
      responsibilities: '',
      spocs: [{ fullName: '', email: '', phone: '' }],
      driveDateText: '',
      driveDateISO: '',
      driveVenues: [],
      qualification: '',
      specialization: '',
      yop: '',
      minCgpa: '',
      skillsInput: '',
      skills: [],
      gapAllowed: '',
      gapYears: '',
      backlogs: '',
      serviceAgreement: keep.serviceAgreement ?? '',
      blockingPeriod: '',
      baseRoundDetails: ['', '', ''],
      extraRounds: [],
      instructions: '',
    }));
  };

  // Mock data for job postings
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Frontend Developer', company: 'WebTech', status: 'Live', applications: 24, views: 153, datePosted: '2023-10-26' },
    { id: '2', title: 'Data Scientist', company: 'DataCorp', status: 'Live', applications: 42, views: 287, datePosted: '2023-10-25' },
    { id: '3', title: 'DevOps Engineer', company: 'Cloudify', status: 'Pending Approval', applications: 0, views: 15, datePosted: '2023-10-27' },
  ]);

  // Mock data for drafts
  const [drafts, setDrafts] = useState([
    { id: 'd1', title: 'UX Designer', company: 'DesignHub', lastModified: '2023-10-24' },
    { id: 'd2', title: 'Backend Engineer', company: 'ServerStack', lastModified: '2023-10-23' },
  ]);

  // Handle file upload for JD parsing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setParseResult(null);

    try {
      // Simulate API call for parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedData = {
        success: true,
        data: {
          jobTitle: 'Full Stack Developer',
          company: 'Tech Innovations Inc.',
          responsibilities: 'Develop and maintain web applications using React and Node.js...',
          skills: ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3'],
          salary: '',
        },
        confidence: 0.7,
      };

      if (simulatedData.success) {
        setParseResult(simulatedData);
      } else {
        setUploadError('Failed to parse the document. Please try manual entry.');
      }
    } catch (err) {
      setUploadError('An error occurred during upload. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInputRef.current.files = files;
      handleFileUpload({ target: { files } });
    }
  };

  const handleUseParsedData = () => {
    alert('Parsed data would be sent for approval or opened in an editable form.');
    setActiveView('active');
  };

  const handleCloseJob = (jobId) => {
    console.log('Closing job:', jobId);
    alert(`Job ${jobId} closed.`);
  };

  const handleCloneJob = (jobId) => {
    console.log('Cloning job:', jobId);
    alert(`Job ${jobId} cloned. You are now editing the new draft.`);
  };

  // Render the active view based on state
  const renderActiveView = () => {
    switch (activeView) {
      case 'active':
        return <ActivePostingsView jobs={jobs} onCloseJob={handleCloseJob} onCloneJob={handleCloneJob} />;
      case 'drafts':
        return <DraftPostingsView drafts={drafts} />;
      case 'new':
        return <NewJobView creationMethod={creationMethod} setCreationMethod={setCreationMethod} 
                  isUploading={isUploading} parseResult={parseResult} uploadError={uploadError}
                  fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} 
                  handleDragOver={handleDragOver} handleDrop={handleDrop} 
                  handleUseParsedData={handleUseParsedData} form={form} setForm={setForm} />;
      default:
        return <ActivePostingsView jobs={jobs} onCloseJob={handleCloseJob} onCloneJob={handleCloneJob} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <button
            onClick={() => setActiveView('new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            + Post a New Job
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200 inline-flex mb-8">
          <button
            onClick={() => setActiveView('active')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'active' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active Postings
          </button>
          <button
            onClick={() => setActiveView('drafts')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'drafts' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveView('new')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'new' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            + New Job
          </button>
        </div>

        {/* Render the active view */}
        {renderActiveView()}
      </div>
    </ErrorBoundary>
  );
};

// Sub-components
const ActivePostingsView = ({ jobs, onCloseJob, onCloneJob }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.views}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.datePosted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button title="View Analytics" className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100">
                      <BarChart3Icon />
                    </button>
                    <button title="Edit" className="text-gray-400 hover:text-green-600 p-1 rounded hover:bg-gray-100">
                      <EditIcon />
                    </button>
                    <button title="Clone" onClick={() => onCloneJob(job.id)} className="text-gray-400 hover:text-purple-600 p-1 rounded hover:bg-gray-100">
                      <CopyIcon />
                    </button>
                    <button title="Close Job" onClick={() => onCloseJob(job.id)} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100">
                      <ArchiveIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DraftPostingsView = ({ drafts }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((draft) => (
              <tr key={draft.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{draft.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.lastModified}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100">Edit</button>
                    <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewJobView = ({ 
  creationMethod, setCreationMethod, isUploading, parseResult, uploadError, 
  fileInputRef, handleFileUpload, handleDragOver, handleDrop, handleUseParsedData, form, setForm 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Sub-Navigation Tabs: Manual vs. Upload */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-sm p-1 shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setCreationMethod('manual')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              creationMethod === 'manual'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setCreationMethod('upload')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              creationMethod === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload JD
          </button>
        </div>
      </div>

      {creationMethod === 'manual' ? (
        <ManualJobForm form={form} setForm={setForm} />
      ) : (
        <JDUploadForm 
          isUploading={isUploading} 
          parseResult={parseResult} 
          uploadError={uploadError}
          fileInputRef={fileInputRef} 
          handleFileUpload={handleFileUpload}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleUseParsedData={handleUseParsedData}
        />
      )
      }
    </div>
  );
};

const ManualJobForm = ({ form, setForm }) => {
  const [showVenues, setShowVenues] = useState(false);
  const [showJobTypes, setShowJobTypes] = useState(false);
  const [showWorkModes, setShowWorkModes] = useState(false);
  const [showGapAllowed, setShowGapAllowed] = useState(false);
  const [showBacklogs, setShowBacklogs] = useState(false);
  const [gapInputMode, setGapInputMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [tooltipVisible, setTooltipVisible] = useState({ 
    serviceAgreement: false, 
    blockingPeriod: false 
  });

  const venueDropdownRef = useRef(null);
  const jobTypeDropdownRef = useRef(null);
  const workModeDropdownRef = useRef(null);
  const gapAllowedDropdownRef = useRef(null);
  const backlogsDropdownRef = useRef(null);
  const hiddenDateRef = useRef(null);

  const DRIVE_VENUES = [
    'PW IOI Campus, Bangalore',
    'PW IOI Campus, Pune',
    'PW IOI Campus, Noida',
    'PW IOI Campus, Lucknow',
    'Company Premises',
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
        setShowVenues(false);
      }
      if (jobTypeDropdownRef.current && !jobTypeDropdownRef.current.contains(event.target)) {
        setShowJobTypes(false);
      }
      if (workModeDropdownRef.current && !workModeDropdownRef.current.contains(event.target)) {
        setShowWorkModes(false);
      }
      if (gapAllowedDropdownRef.current && !gapAllowedDropdownRef.current.contains(event.target)) {
        setShowGapAllowed(false);
      }
      if (backlogsDropdownRef.current && !backlogsDropdownRef.current.contains(event.target)) {
        setShowBacklogs(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Utility functions
  const toISOFromDDMMYYYY = (val) => {
    if (!val) return '';
    const m = val.match(/^\d{2}\/\d{2}\/\d{4}$/);
    if (!m) return '';
    const [_, dd, mm, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? '' : d.toISOString();
  };

  const toDDMMYYYY = (date) => {
    try {
      const d = new Date(date);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return '';
    }
  };

  const toRoman = (num) => {
    const romanNumerals = [
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' }
    ];
    
    let result = '';
    for (const { value, symbol } of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };

  // Validation functions
  const isValidUrl = (value) => {
    if (!value) return true;
    if (value.startsWith('www.') && value.includes('.')) {
      return true;
    }
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidLinkedInUrl = (value) => {
    if (!value) return true;
    const linkedinRegex = /(https?)?:?(\/\/)?((w{3}||[\w\w])\.)?linkedin\.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/[\w#!:.?+=&%@!\-\/])?/;
    return linkedinRegex.test(value);
  };

  // Handlers
  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onWebsiteChange = (value) => {
    handleInputChange('website', value);
  };

  const onLinkedInChange = (value) => {
    handleInputChange('linkedin', value);
  };

  const onCompanyLocationChange = (value) => {
    handleInputChange('companyLocation', value);
  };

  const onYopChange = (value) => {
    if (/^\d{0,4}$/.test(value)) {
      handleInputChange('yop', value);
    }
  };

  const onSkillsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = form.skillsInput?.trim().replace(/,$/, '') || '';
      if (!value) return;
      const pieces = value
        .split(',')
        .map((s) => s?.trim())
        .filter(Boolean);
      setForm(prev => ({ 
        ...prev, 
        skills: Array.from(new Set([...prev.skills, ...pieces])), 
        skillsInput: '' 
      }));
    }
  };

  const removeSkill = (idx) => {
    const next = [...form.skills];
    next.splice(idx, 1);
    handleInputChange('skills', next);
  };

  // SPOC management
  const addSpoc = () => {
    setForm(prev => ({ 
      ...prev, 
      spocs: [...prev.spocs, { fullName: '', email: '', phone: '' }] 
    }));
  };
  
  const removeSpoc = (idx) => {
    if (form.spocs.length > 1) {
      const next = [...form.spocs];
      next.splice(idx, 1);
      handleInputChange('spocs', next);
    }
  };
  
  const updateSpoc = (idx, field, value) => {
    const next = [...form.spocs];
    if (field === 'phone') {
      if (!/^[0-9]*$/.test(value) || value.length > 10) {
        return; // Prevent invalid input
      }
    }
    next[idx] = { ...next[idx], [field]: value };
    handleInputChange('spocs', next);
  };

  // Drive date handling
  const onPickDate = (e) => {
    const iso = e.target.value ? new Date(e.target.value).toISOString() : '';
    const text = e.target.value ? toDDMMYYYY(e.target.value) : '';
    handleInputChange('driveDateISO', iso);
    handleInputChange('driveDateText', text);
  };

  const onDriveDateText = (val) => {
    const iso = toISOFromDDMMYYYY(val);
    handleInputChange('driveDateText', val);
    handleInputChange('driveDateISO', iso);
  };

  const toggleVenue = (venue) => {
    const selected = new Set(form.driveVenues);
    if (selected.has(venue)) selected.delete(venue);
    else selected.add(venue);
    const arr = Array.from(selected);
    handleInputChange('driveVenues', arr);
  };

  // Interview rounds
  const addRound = () => {
    const count = form.extraRounds.length + 1; // Start from I
    const romanNumeral = toRoman(count);
    setForm(prev => ({ 
      ...prev, 
      extraRounds: [...prev.extraRounds, { title: `${romanNumeral} Round`, detail: '' }] 
    }));
  };

  const removeExtraRound = (idx) => {
    const next = [...form.extraRounds];
    next.splice(idx, 1);
    const updatedRounds = next.map((round, index) => ({
      ...round,
      title: `${toRoman(index + 4)} Round`
    }));
    handleInputChange('extraRounds', updatedRounds);
  };

  const updateExtraRoundDetail = (idx, val) => {
    const next = [...form.extraRounds];
    next[idx] = { ...next[idx], detail: val };
    handleInputChange('extraRounds', next);
  };

  // Base round details (first 3 rounds)
  const updateBaseRoundDetail = (idx, field, value) => {
    const next = [...form.baseRoundDetails];
    next[idx] = { ...next[idx], [field]: value };
    handleInputChange('baseRoundDetails', next);
  };

  // Section toggling
  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isSectionCollapsed = (sectionId) => collapsedSections.has(sectionId);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Job submitted for approval');
    console.log('Form data:', form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={form.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={form.website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={form.linkedin}
            onChange={(e) => onLinkedInChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
          <div className="relative" ref={jobTypeDropdownRef}>
            <select
              id="jobType"
              name="jobType"
              value={form.jobType}
              onChange={(e) => handleInputChange('jobType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-1">Work Mode *</label>
          <div className="relative" ref={workModeDropdownRef}>
            <select
              id="workMode"
              name="workMode"
              value={form.workMode}
              onChange={(e) => handleInputChange('workMode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
              required
            >
              <option value="">Select Work Mode</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
          <input
            type="text"
            id="stipend"
            name="stipend"
            value={form.stipend}
            onChange={(e) => handleInputChange('stipend', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={form.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={form.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="minCgpa" className="block text-sm font-medium text-gray-700 mb-1">Minimum CGPA</label>
          <input
            type="text"
            id="minCgpa"
            name="minCgpa"
            value={form.minCgpa}
            onChange={(e) => handleInputChange('minCgpa', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <div className="relative" ref={venueDropdownRef}>
            <select
              id="venue"
              name="venue"
              value={form.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">Select Venue</option>
              <option value="PW IOI Campus, Bangalore">PW IOI Campus, Bangalore</option>
              <option value="PW IOI Campus, Pune">PW IOI Campus, Pune</option>
              <option value="PW IOI Campus, Noida">PW IOI Campus, Noida</option>
              <option value="PW IOI Campus, Lucknow">PW IOI Campus, Lucknow</option>
              <option value="Company Premises">Company Premises</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* SPOC Section */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">SPOC Details</h3>
          <button
            type="button"
            onClick={addSpoc}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add SPOC
          </button>
        </div>

        {form.spocs.map((spoc, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={spoc.fullName}
                onChange={(e) => updateSpoc(idx, 'fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={spoc.email}
                onChange={(e) => updateSpoc(idx, 'email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={spoc.phone}
                onChange={(e) => updateSpoc(idx, 'phone', e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 col-span-3">
              <button
                type="button"
                onClick={() => removeSpoc(idx)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Remove SPOC
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drive Details Section */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Drive Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="driveDate" className="block text-sm font-medium text-gray-700 mb-1">Drive Date *</label>
            <input
              type="date"
              id="driveDate"
              name="driveDate"
              value={form.driveDateISO.split('T')[0]}
              onChange={onPickDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-black font-medium">Drive Venue <span className="text-red-500">*</span>:</label>
            <div className="relative">
              <button
                type="button"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left"
                onClick={() => setShowVenues(prev => !prev)}
              >
                {form.driveVenues.length > 0 ? form.driveVenues.join(', ') : 'Select venues'}
              </button>
              {showVenues && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full">
                  {DRIVE_VENUES.map((venue) => (
                    <label key={venue} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.driveVenues.includes(venue)}
                        onChange={() => toggleVenueSelection(venue)}
                      />
                      {venue}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities & Requirements Section */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Responsibilities & Requirements</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">Responsibilities *</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={form.responsibilities}
              onChange={(e) => handleInputChange('responsibilities', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
          </div>
          <div>
            <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={form.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={form.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="yop" className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
            <input
              type="text"
              id="yop"
              name="yop"
              value={form.yop}
              onChange={(e) => onYopChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="YYYY"
            />
          </div>
          <div>
            <div className="relative" ref={gapAllowedDropdownRef}>
                    {!gapInputMode ? (
                      <>
                        <button
                          type="button"
                          className={`w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-blue-100 text-left flex items-center justify-between ${form.gapAllowed && form.gapAllowed !== '' ? 'bg-green-100' : 'bg-gray-100'}`}
                          onClick={() => setShowGapAllowed(prev => !prev)}
                        >
                          <span className="truncate">
                            {form.gapAllowed === 'Custom' && form.gapYears 
                              ? `${form.gapYears} Year/s Allowed` 
                              : form.gapAllowed || 'Select Gap Policy'}
                          </span>
                          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        </button>
                        {showGapAllowed && (
                          <div className="absolute z-10 overflow-hidden w-full bg-white border-2 border-slate-300 rounded-md shadow-lg">
                            {['Allowed', 'Not Allowed'].map((policy) => (
                              <button
                                key={policy}
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-100 cursor-pointer border-b border-slate-200 text-left"
                                onClick={() => {
                                  update({ gapAllowed: policy, gapYears: '' });
                                  setShowGapAllowed(false);
                                }}
                              >
                                <span>{policy}</span>
                              </button>
                            ))}
                            <button
                              type="button"
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-100 cursor-pointer text-left"
                              onClick={() => {
                                setGapInputMode(true);
                                setShowGapAllowed(false);
                                setTimeout(() => {
                                  const input = document.querySelector('[data-gap-input]');
                                  if (input) input.focus();
                                }, 100);
                              }}
                            >
                              <span>{form.gapYears ? `${form.gapYears} Year/s Allowed` : '_ Year/s Allowed'}</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm w-full flex items-center">
                        <input 
                          data-gap-input
                          type="text" 
                          className="bg-transparent border-none outline-none text-sm w-8 text-center" 
                          placeholder="_"
                          value={form.gapYears}
                          onChange={(e) => update({ gapYears: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && form.gapYears.trim()) {
                              update({ gapAllowed: 'Custom' });
                              setGapInputMode(false);
                            } else if (e.key === 'Escape') {
                              update({ gapAllowed: 'Not Allowed', gapYears: '' });
                              setGapInputMode(false);
                            }
                          }}
                          onBlur={() => {
                            if (form.gapYears && form.gapYears.trim()) {
                              update({ gapAllowed: 'Custom' });
                              setGapInputMode(false);
                            } else {
                              update({ gapAllowed: 'Not Allowed', gapYears: '' });
                              setGapInputMode(false);
                            }
                          }}
                        />
                        <span className="text-sm ml-1">Year/s Allowed</span>
                      </div>
                    )}
                  </div>
                </div>    
             
          
        </div>
      </div>

      {/* Rounds Section */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Interview Rounds</h3>
          <div className="flex flex-wrap items-center gap-4">
                {[0,1,2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-xs font-medium text-black whitespace-nowrap">{[`${toRoman(1)} Round`, `${toRoman(2)} Round`, `${toRoman(3)} Round`][i]} <span className="text-red-500">*</span></div>
                    <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-48 ${form.baseRoundDetails[i]?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. Online test, DS&A" value={form.baseRoundDetails[i]} onChange={(e) => updateBaseRoundDetail(i, e.target.value)} required />
                    {i < 2 && <span className="text-slate-300">—</span>}
                  </div>
                ))}
              </div>

              {/* Extra rounds */}
              <div className="flex flex-wrap items-center gap-4">
                {form.extraRounds.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="text-xs font-medium text-slate-600 whitespace-nowrap">{r.title}</div>
                    <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-48 ${r.detail?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. Managerial round (optional)" value={r.detail} onChange={(e) => updateExtraRoundDetail(idx, e.target.value)} />
                    <button type="button" onClick={() => removeExtraRound(idx)} className="text-slate-500 hover:text-red-600" title="Remove this round">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addRound} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                  <Plus className="w-4 h-4" /> Add Round
                </button>
              </div>
        </div>
      </div>

      {/* Service Agreement & Blocking Period */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceAgreement" className="block text-sm font-medium text-gray-700 mb-1">
              Service Agreement (in months) *
            </label>
            <input
              type="number"
              id="serviceAgreement"
              name="serviceAgreement"
              value={form.serviceAgreement}
              onChange={(e) => handleInputChange('serviceAgreement', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="blockingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Blocking Period (in months) *
            </label>
            <input
              type="number"
              id="blockingPeriod"
              name="blockingPeriod"
              value={form.blockingPeriod}
              onChange={(e) => handleInputChange('blockingPeriod', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-md p-4 border">
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={form.instructions}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit Job
      </button>
    </form>
  );
};

const JDUploadForm = ({ 
  isUploading, parseResult, uploadError, fileInputRef, handleFileUpload, 
  handleDragOver, handleDrop, handleUseParsedData 
}) => {
  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <LoaderIcon />
            <p className="text-gray-700">Analyzing your JD...</p>
          </div>
        ) : parseResult ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircleIcon />
            <p className="text-lg font-medium text-gray-900">JD Parsed Successfully!</p>
            <p className="text-sm text-gray-600">We've extracted the key details from your document.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon />
            <div>
              <p className="text-lg font-medium text-gray-900">Drag & Drop your Job Description</p>
              <p className="text-sm text-gray-600">or</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX • Max 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircleIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Parsing Results & Edit Form */}
      {parseResult && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-gray-900">Parsed Details</h3>
          <p className="text-sm text-gray-600">
            <strong>Confidence Score:</strong> {Math.round(parseResult.confidence * 100)}%. Please review and edit the information below before submitting.
          </p>

          <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-md border">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.jobTitle || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, jobTitle: e.target.value}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Company *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.company || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, company: e.target.value}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Key Skills *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.skills?.join(', ') || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, skills: e.target.value.split(',').map(skill => skill.trim())}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Salary (CTC)</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.salary || ''}
                    placeholder="Parser couldn't find this. Please add."
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, salary: e.target.value}})}
                />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setParseResult(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Upload a Different File
            </button>
            <button
              type="button"
              onClick={handleUseParsedData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon components
const BarChart3Icon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 0 002-2m0 0V5a2 2 0 012-2h2a2 0 012 2v14a2 2 0 01-2 2h-2a2 0 01-2-2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.586a1 1 0 01.707.293l2.707 2.707a1 1 0 010 1.414l-2.707 2.707A1 1 0 014.586 17H4v5h16v-5h-.586a1 1 0 01-.707-.293l-2.707-2.707a1 1 0 010-1.414l2.707-2.707A1 1 0 0119.414 9H20V4H4z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default JobPostings;