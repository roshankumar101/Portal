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
  Target
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState({});

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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 drop-shadow-sm">
                Welcome back, {studentData?.name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-blue-100 text-xl font-medium">Ready to explore new opportunities today?</p>
            </div>
            <div className="hidden md:block">
              <Award className="h-20 w-20 text-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-blue-700">Jobs Applied</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl shadow-lg">
              <AlertCircle className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-blue-700">Shortlisted</p>
              <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-orange-700">Selected</p>
              <p className="text-3xl font-bold text-gray-900">{stats.selected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-orange-700">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Profile</h3>
              </div>
              <ProfileCompletionMeter studentData={studentData} size={70} />
            </div>
            <EditableProfile 
              studentData={studentData} 
              onDataUpdate={setStudentData}
            />
          </div>
        </div>

        {/* Recent Job Opportunities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="h-7 w-7 text-orange-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Recent Job Opportunities</h3>
              </div>
              <button 
                onClick={() => window.location.hash = '#jobs'}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600 rounded-2xl font-semibold transition-all duration-200 shadow-lg"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => {
                const eligible = meetsEligibility(job.eligibilityCriteria);
                const applied = hasApplied(job.id);
                
                return (
                  <div key={job.id} className="border border-orange-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-300 transition-all duration-300 bg-gradient-to-r from-white to-orange-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-xl">{job.title}</h4>
                        <p className="text-orange-600 font-semibold text-lg">{job.company}</p>
                      </div>
                      <button
                        onClick={() => handleApplyToJob(job.id)}
                        disabled={applied || applying[job.id] || !eligible}
                        className={`px-6 py-3 text-sm rounded-2xl font-semibold transition-all duration-200 shadow-lg ${
                          applied 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : !eligible
                            ? 'bg-red-100 text-red-600 cursor-not-allowed'
                            : applying[job.id]
                            ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transform hover:scale-105'
                        }`}
                      >
                        {applying[job.id] ? (
                          <div className="flex items-center">
                            <Loader className="animate-spin h-4 w-4 mr-1" />
                            Applying...
                          </div>
                        ) : applied ? 'Applied' : !eligible ? 'Not Eligible' : 'Apply'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{job.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-semibold px-3 py-1 rounded-full ${eligible ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
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
                <p className="text-gray-500 text-center py-4">No job opportunities available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <FileText className="h-7 w-7 text-orange-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Recent Applications</h3>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="flex items-center justify-between p-5 border border-orange-200 rounded-2xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-orange-50">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{job?.title || 'Unknown Job'}</p>
                    <p className="text-sm text-orange-600 font-semibold">{job?.company || 'Unknown Company'}</p>
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
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1 capitalize">{app.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {applications.length === 0 && (
              <p className="text-gray-500 text-center py-4">No applications yet. Start applying to jobs!</p>
            )}
          </div>
        </div>

        {/* Upcoming Events - Placeholder */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <Calendar className="h-7 w-7 text-orange-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="space-y-3">
            {/* Placeholder events */}
            <div className="flex items-center p-5 border border-orange-200 rounded-2xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-orange-50">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">Campus Drive - TechCorp</p>
                <p className="text-sm text-gray-600">Jan 18, 2024 at 10:00 AM</p>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Interview
                </span>
              </div>
            </div>
            <div className="flex items-center p-5 border border-orange-200 rounded-2xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-amber-50">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">Resume Building Workshop</p>
                <p className="text-sm text-gray-600">Jan 20, 2024 at 2:00 PM</p>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Workshop
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              * Events integration coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
