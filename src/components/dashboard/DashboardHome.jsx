import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUser } from '../../services/users';
import { listJobs } from '../../services/jobs';
import { listApplicationsForStudent, applyToJob } from '../../services/jobs';
import ProfileCompletionMeter from './ProfileCompletionMeter';
import EditableProfile from './EditableProfile';
import { 
  User, 
  GraduationCap, 
  Star, 
  FileText, 
  Briefcase, 
  Clock, 
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader,
  Award,
  Target,
  Phone,
  Mail,
  Linkedin
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState({});
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Fetch student profile data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.uid) return;
      
      try {
        const userData = await getUser(user.uid);
        setStudentData(userData);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load profile data');
      }
    };

    fetchStudentData();
  }, [user]);

  // Fetch jobs and applications
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        setError(''); // Clear previous errors
        
        const [jobsData, applicationsData] = await Promise.all([
          listJobs({ limitTo: 10 }).catch(err => {
            console.warn('Jobs fetch failed:', err);
            return []; // Return empty array if jobs fetch fails
          }),
          listApplicationsForStudent(user.uid).catch(err => {
            console.warn('Applications fetch failed:', err);
            return []; // Return empty array if applications fetch fails
          })
        ]);
        
        setJobs(jobsData || []);
        setApplications(applicationsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Don't show error for empty collections
        setJobs([]);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle job application
  const handleApplyToJob = async (jobId) => {
    if (!user?.uid) return;
    
    try {
      setApplying(prev => ({ ...prev, [jobId]: true }));
      await applyToJob(jobId, user.uid);
      
      // Refresh applications
      const updatedApplications = await listApplicationsForStudent(user.uid);
      setApplications(updatedApplications);
      
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying to job:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Check if student has already applied to a job
  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  // Check if student meets eligibility criteria
  const meetsEligibility = (eligibilityCriteria) => {
    if (!studentData?.cgpa || !eligibilityCriteria) return true;
    
    // Simple CGPA check (you can make this more sophisticated)
    const match = eligibilityCriteria.match(/CGPA\s*>=\s*(\d+\.?\d*)/i);
    if (match) {
      const requiredCGPA = parseFloat(match[1]);
      return studentData.cgpa >= requiredCGPA;
    }
    
    return true; // If we can't parse criteria, assume eligible
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'text-blue-600 bg-blue-100';
      case 'shortlisted': return 'text-yellow-600 bg-yellow-100';
      case 'selected': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock size={16} />;
      case 'shortlisted': return <AlertCircle size={16} />;
      case 'selected': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Text truncation function
  const truncateText = (text, wordLimit = 40) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return { truncated: text, needsReadMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(' '),
      needsReadMore: true,
      fullText: text
    };
  };

  // About Me text
  const aboutMeText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas repellendus eius est aperiam, consequatur reprehenderit aliquid soluta architecto voluptatum cupiditate consectetur a quisquam. Sed unde voluptate dignissimos laboriosam, asperiores facere mollitia iste maxime accusamus quasi quaerat expedita dolore nulla officia rem pariatur nobis fugiat corrupti architecto cupiditate consectetur a quisquam numquam tenetur reprehenderit suscipit aliquid. Voluptas esse amet consectetur adipisicing elit quas repellendus eius est aperiam consequatur reprehenderit aliquid soluta architecto voluptatum cupiditate. Lorem ipsum dolor sit amet consectetur adipisicing elit quas repellendus eius est.";
  
  const { truncated, needsReadMore, fullText } = truncateText(aboutMeText);

  // Calculate stats
  const stats = {
    totalApplications: applications.length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    selected: applications.filter(app => app.status === 'selected').length,
    successRate: applications.length > 0 ? Math.round((applications.filter(app => app.status === 'selected').length / applications.length) * 100) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      

      {/* About Me Section with Fieldset Styling */}
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            About Me
          </legend>
          
          {/* About Me Content */}
          <div className="my-3 space-y-4">
            <div className="text-gray-700 leading-relaxed text-sm">
              <span>{isTextExpanded ? fullText : truncated}</span>
              {needsReadMore && (
                <button 
                  onClick={() => setIsTextExpanded(!isTextExpanded)}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 underline"
                >
                  {isTextExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
            
            {/* Contact Information - LinkedIn Style */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-start space-x-4 text-gray-600">
                {/* Phone */}
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">9883737743</span>
                </div>
                
                {/* Separator */}
                <span className="text-gray-400">|</span>
                
                {/* Email */}
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{user?.email || 'student@example.com'}</span>
                </div>
                
                {/* Separator */}
                <span className="text-gray-400">|</span>
                
                {/* LinkedIn */}
                <button 
                  onClick={() => window.open('https://linkedin.com/in/johndoe-student', '_blank')}
                  className="flex items-center p-1 rounded-sm border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 hover:scale-110 transition-all duration-200 shadow-sm hover"
                >
                  <Linkedin className="h-3 w-3 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>


      {/* Job List Section with Fieldset Styling */}
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-3 transition-all duration-200">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Job List
          </legend>
          
          {/* Quick Stats - Compact */}
          <div className="my-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border hover:shadow-yellow-300 hover:shadow-sm border-blue-200 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-blue-700">Jobs Applied</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl border hover:shadow-yellow-300 hover:shadow-sm border-indigo-200 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-indigo-700">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-2xl border hover:shadow-yellow-300 hover:shadow-sm border-green-200 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-green-700">Selected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.selected}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border hover:shadow-yellow-300 hover:shadow-sm border-orange-200 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-orange-700">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      
      {/* Live Application Tracker Section */}
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Live Application Tracker
          </legend>
          
          {/* Application Cards */}
          <div className="my-3">
            {/* Column Headers */}
            <div className="grid grid-cols-4 gap-4 mb-2 p-4">
              <div className="text-gray-800 font-bold text-lg">Company</div>
              <div className="text-gray-800 font-bold text-lg">Job Title</div>
              <div className="text-gray-800 font-bold text-lg">Date Applied</div>
              <div className="text-gray-800 font-bold text-lg text-right">Status</div>
            </div>
            
            {/* Job List Rows */}
            <div className="space-y-2">
              {/* Google Row - Applied Status */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">Google Inc.</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">Software Engineer</div>
                <div className="text-sm text-gray-600 flex items-center">Jan 12, 2024</div>
                <div className="flex justify-end">
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Applied
                  </span>
                </div>
              </div>
              
              {/* Microsoft Row - Shortlisted Status */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">Microsoft</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">Frontend Developer</div>
                <div className="text-sm text-gray-600 flex items-center">Jan 10, 2024</div>
                <div className="flex justify-end">
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Shortlisted
                  </span>
                </div>
              </div>
              
              {/* Apple Row - Accepted Status */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">Apple</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">iOS Developer</div>
                <div className="text-sm text-gray-600 flex items-center">Jan 08, 2024</div>
                <div className="flex justify-end">
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Track All Button */}
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm">
              Track All
            </button>
          </div>
        </fieldset>
      </div>

      {/* Latest Job Postings Section */}
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-3 transition-all duration-200">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Latest job postings
          </legend>
          
          {/* Latest Job Postings Cards */}
          <div className="my-3">
            {/* Column Headers */}
            <div className="grid grid-cols-5 gap-4 mb-3 p-3">
              <div className="text-gray-800 font-bold text-lg">Company</div>
              <div className="text-gray-800 font-bold text-lg">Job Title</div>
              <div className="text-gray-800 font-bold text-lg">Tentative Interview Date</div>
              <div className="text-gray-800 font-bold text-lg">Salary (in CTC)</div>
              <div></div>
            </div>
            
            {/* Job Postings List Rows */}
            <div className="space-y-2">
              {/* TCS Row */}
              <div className="grid grid-cols-5 gap-4 p-4 rounded-xl bg-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">TCS</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">Software Developer</div>
                <div className="text-sm text-gray-600 flex items-center">Feb 15, 2024</div>
                <div className="text-sm font-medium text-gray-700 flex items-center">₹6-8 LPA</div>
                <div className="flex justify-center">
                  <button className="px-2 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm text-xs">
                    Know More
                  </button>
                </div>
              </div>
              
              {/* Infosys Row */}
              <div className="grid grid-cols-5 gap-4 p-4 rounded-xl bg-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">I</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">Infosys</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">System Engineer</div>
                <div className="text-sm text-gray-600 flex items-center">Feb 20, 2024</div>
                <div className="text-sm font-medium text-gray-700 flex items-center">₹5-7 LPA</div>
                <div className="flex justify-center">
                  <button className="px-2 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm text-xs">
                    Know More
                  </button>
                </div>
              </div>
              
              {/* Wipro Row */}
              <div className="grid grid-cols-5 gap-4 p-4 rounded-xl bg-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">Wipro</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">Project Engineer</div>
                <div className="text-sm text-gray-600 flex items-center">Feb 25, 2024</div>
                <div className="text-sm font-medium text-gray-700 flex items-center">₹4-6 LPA</div>
                <div className="flex justify-center">
                  <button className="px-2 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm text-xs">
                    Know More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Student Profile Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Profile</h3>
              </div>
              <ProfileCompletionMeter studentData={studentData} size={60} />
            </div>
            <EditableProfile 
              studentData={studentData} 
              onDataUpdate={setStudentData}
            />
          </div>
        </div>

        {/* Recent Job Opportunities */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Recent Job Opportunities</h3>
              </div>
              <button 
                onClick={() => window.location.hash = '#jobs'}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600 rounded-xl font-semibold transition-all duration-200 text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {jobs.slice(0, 2).map((job) => {
                const eligible = meetsEligibility(job.eligibilityCriteria);
                const applied = hasApplied(job.id);
                
                return (
                  <div key={job.id} className="border border-orange-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-200 bg-gradient-to-r from-white to-orange-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{job.title}</h4>
                        <p className="text-orange-600 font-semibold text-sm">{job.company}</p>
                      </div>
                      <button
                        onClick={() => handleApplyToJob(job.id)}
                        disabled={applied || applying[job.id] || !eligible}
                        className={`px-4 py-2 text-xs rounded-xl font-semibold transition-all duration-200 ${
                          applied 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : !eligible
                            ? 'bg-red-100 text-red-600 cursor-not-allowed'
                            : applying[job.id]
                            ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
                        }`}
                      >
                        {applying[job.id] ? (
                          <div className="flex items-center">
                            <Loader className="animate-spin h-3 w-3 mr-1" />
                            Applying...
                          </div>
                        ) : applied ? 'Applied' : !eligible ? 'Not Eligible' : 'Apply'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">{job.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold px-2 py-1 rounded-full ${eligible ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {job.eligibilityCriteria}
                      </span>
                      <span className="text-orange-600 font-medium">
                        Deadline: {job.deadline ? (
                          typeof job.deadline === 'string' 
                            ? new Date(job.deadline).toLocaleDateString()
                            : job.deadline.seconds 
                            ? new Date(job.deadline.seconds * 1000).toLocaleDateString()
                            : job.deadline.toDate ? job.deadline.toDate().toLocaleDateString()
                            : 'N/A'
                        ) : 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {jobs.length === 0 && (
                <p className="text-gray-500 text-center py-3 text-sm">No job opportunities available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Application Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          </div>
          <div className="space-y-2">
            {applications.slice(0, 3).map((app) => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-xl hover transition-all duration-200 bg-gradient-to-r from-white to-orange-50">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{job?.title || 'Unknown Job'}</p>
                    <p className="text-xs text-orange-600 font-semibold">{job?.company || 'Unknown Company'}</p>
                    <p className="text-xs text-gray-500">
                      Applied: {app.appliedAt ? (
                        typeof app.appliedAt === 'string'
                          ? new Date(app.appliedAt).toLocaleDateString()
                          : app.appliedAt.seconds
                          ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
                          : app.appliedAt.toDate ? app.appliedAt.toDate().toLocaleDateString()
                          : 'N/A'
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1 capitalize">{app.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {applications.length === 0 && (
              <p className="text-gray-500 text-center py-3 text-sm">No applications yet. Start applying to jobs!</p>
            )}
          </div>
        </div>

        {/* Upcoming Events - Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="space-y-2">
            {/* Placeholder events */}
            <div className="flex items-center p-3 border border-orange-200 rounded-xl hover transition-all duration-200 bg-gradient-to-r from-white to-orange-50">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900 text-sm">Campus Drive - TechCorp</p>
                <p className="text-xs text-gray-600">Jan 18, 2024 at 10:00 AM</p>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Interview
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 border border-orange-200 rounded-xl hover transition-all duration-200 bg-gradient-to-r from-white to-amber-50">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900 text-sm">Resume Building Workshop</p>
                <p className="text-xs text-gray-600">Jan 20, 2024 at 2:00 PM</p>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Workshop
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              * Events integration coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
