import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listJobs } from '../../services/jobs';
import { getStudentApplications } from '../../services/applications';
import { getStudentProfile } from '../../services/students';
import { 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  MapPin,
  Building,
  DollarSign,
  Calendar
} from 'lucide-react';

const ExploreJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [error, setError] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        setError('');
        
        const [jobsData, applicationsData, studentProfileData] = await Promise.all([
          listJobs().catch(err => {
            console.warn('Jobs fetch failed:', err);
            return [];
          }),
          getStudentApplications(user.uid).catch(err => {
            console.warn('Applications fetch failed:', err);
            return [];
          }),
          getStudentProfile(user.uid).catch(err => {
            console.warn('Student profile fetch failed:', err);
            return null;
          })
        ]);
        
        setJobs(jobsData || []);
        setApplications(applicationsData || []);
        setStudentData(studentProfileData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle job application
  const handleApplyToJob = async (jobId, companyId) => {
    if (!user?.uid) return;
    
    try {
      setApplying(prev => ({ ...prev, [jobId]: true }));
      const { applyToJob } = await import('../../services/applications');
      await applyToJob(user.uid, jobId, companyId);
      
      // Refresh applications
      const updatedApplications = await getStudentApplications(user.uid);
      setApplications(updatedApplications);
      
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying to job:', err);
      alert(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Check if student has already applied to a job
  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  // Handle job details modal
  const handleKnowMore = (job) => {
    if (job.jdUrl) {
      window.open(job.jdUrl, '_blank');
    } else {
      alert('Job description not available');
    }
  };

  // Check if student meets eligibility criteria
  const meetsEligibility = (eligibilityCriteria) => {
    if (!studentData?.cgpa || !eligibilityCriteria) return true;
    
    const match = eligibilityCriteria.match(/CGPA\s*>=\s*(\d+\.?\d*)/i);
    if (match) {
      const requiredCGPA = parseFloat(match[1]);
      return studentData.cgpa >= requiredCGPA;
    }
    
    return true;
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${(salary / 100000).toFixed(0)} LPA`;
    }
    return salary;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get company initial and color
  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : '?';
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 
      'bg-red-600', 'bg-indigo-600', 'bg-pink-600'
    ];
    const index = companyName ? companyName.length % colors.length : 0;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-blue-200 p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Explore Job Opportunities</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No job postings available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Column Headers */}
            <div className="grid grid-cols-5 gap-6 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-800 font-bold text-lg">Company</div>
              <div className="text-gray-800 font-bold text-lg pl-2">Job Title</div>
              <div className="text-gray-800 font-bold text-lg">Interview Date</div>
              <div className="text-gray-800 font-bold text-lg">Salary (CTC)</div>
              <div className="text-gray-800 font-bold text-lg text-center">Actions</div>
            </div>
            
            {/* Job Listings */}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-5 gap-6 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 hover:shadow-md transition-all duration-200 border border-blue-200"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${getCompanyColor(job.company?.name)} rounded-lg mr-3 flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">
                      {getCompanyInitial(job.company?.name)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {job.company?.name || 'Unknown Company'}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.company?.location || 'Location TBD'}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center pl-2">
                  <div className="text-sm font-medium text-gray-900">
                    {job.jobTitle || 'Unknown Position'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {job.jobType || 'Full-time'}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div className="text-sm text-gray-600">
                    {formatDate(job.interviewDate)}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <div className="text-sm font-medium text-gray-700">
                    {formatSalary(job.salary)}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleKnowMore(job)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Know More
                  </button>
                  <button
                    onClick={() => handleApplyToJob(job.id, job.companyId)}
                    disabled={hasApplied(job.id) || applying[job.id] || !meetsEligibility(job.eligibilityCriteria)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      hasApplied(job.id) 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : applying[job.id]
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : !meetsEligibility(job.eligibilityCriteria)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {hasApplied(job.id) 
                      ? 'Applied' 
                      : applying[job.id] 
                      ? 'Applying...' 
                      : !meetsEligibility(job.eligibilityCriteria)
                      ? 'Not Eligible'
                      : 'Apply Now'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreJobsPage;
