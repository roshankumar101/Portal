import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getStudentProfile } from '../../services/students';
import { listJobs } from '../../services/jobs';
import { getStudentApplications } from '../../services/applications';
import AboutMe from './AboutMe';
import DashboardStatsSection from './DashboardStatsSection';
import ApplicationTrackerSection from './ApplicationTrackerSection';
import JobPostingsSection from './JobPostingsSection';
import Education from './Education';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import Achievements from './Achievements';
import StudentFooter from './StudentFooter';
import Resume from './Resume';
import { 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
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
        const userData = await getStudentProfile(user.uid);
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
          getStudentApplications(user.uid).catch(err => {
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
  const handleApplyToJob = async (jobId, companyId) => {
    if (!user?.uid) return;
    
    try {
      setApplying(prev => ({ ...prev, [jobId]: true }));
      const { applyToJob } = await import('../../services/applications');
      await applyToJob(user.uid, jobId, companyId);
      
      // Refresh applications and student data
      const updatedApplications = await getStudentApplications(user.uid);
      setApplications(updatedApplications);
      
      // Update student stats
      const updatedStudentData = await getStudentProfile(user.uid);
      setStudentData(updatedStudentData);
      
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying to job:', err);
      alert(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Check fir student has already applied to a job
  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  //job details modal
  const handleKnowMore = (job) => {
    if (job.jdUrl) {
      window.open(job.jdUrl, '_blank');
    } else {
      alert('Job description not available');
    }
  };

  // whether a student meets eligibility criteria
  const meetsEligibility = (eligibilityCriteria) => {
    if (!studentData?.cgpa || !eligibilityCriteria) return true;
    
    // CGPA check 
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


      {/* About Me Section */}
      <AboutMe studentData={studentData} user={user} />

      {/* Student Stats Section */}
      <DashboardStatsSection studentData={studentData} />

      {/* Live Application Tracker Section */}
      <ApplicationTrackerSection applications={applications} />

      {/* Latest Job Postings Section */}
      <JobPostingsSection jobs={jobs} onKnowMore={handleKnowMore} />

      {/* Education Section */}
      <Education />

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <ProjectsSection studentId={user?.uid} />

      {/* Achievements & Certifications Section */}
      <Achievements />

      {/* Student Footer */}
      <div>
        <StudentFooter />
      </div>
     
      
    </div>
  );
};

export default DashboardHome;
