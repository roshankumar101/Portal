import React, { useEffect, useState, useRef } from 'react';
import { deleteJob, subscribeJobs, postJob } from '../../../services/jobs';
import { Loader, Trash2, Share2, Building2, Calendar, GraduationCap, Users, Briefcase, ChevronDown, CheckCircle } from 'lucide-react';

const SCHOOLS = ['All Schools', 'SOT', 'SOM', 'SOH'];
const BATCHES = ['All Batches', '23-27', '24-28', '25-29'];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postingJobs, setPostingJobs] = useState(new Set());
  const [postedJobs, setPostedJobs] = useState(new Set());
  const [showSchools, setShowSchools] = useState({});
  const [showBatches, setShowBatches] = useState({});
  const [selectedSchools, setSelectedSchools] = useState({});
  const [selectedBatches, setSelectedBatches] = useState({});
  const schoolDropdownRefs = useRef({});
  const batchDropdownRefs = useRef({});

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeJobs((jobsList) => {
      setJobs(jobsList);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check school dropdowns
      Object.keys(showSchools).forEach(jobId => {
        if (showSchools[jobId] && schoolDropdownRefs.current[jobId] && 
            !schoolDropdownRefs.current[jobId].contains(event.target)) {
          setShowSchools(prev => ({ ...prev, [jobId]: false }));
        }
      });

      // Check batch dropdowns
      Object.keys(showBatches).forEach(jobId => {
        if (showBatches[jobId] && batchDropdownRefs.current[jobId] && 
            !batchDropdownRefs.current[jobId].contains(event.target)) {
          setShowBatches(prev => ({ ...prev, [jobId]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSchools, showBatches]);

  const handlePostJob = async (jobId) => {
    if (postingJobs.has(jobId) || postedJobs.has(jobId)) return;

    try {
      setPostingJobs((prev) => new Set([...prev, jobId]));
      await postJob(jobId);
      setPostedJobs((prev) => new Set([...prev, jobId]));
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('Failed to post job: ' + (err?.message || 'Unknown error'));
    } finally {
      setPostingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };


  const handleShare = (job) => {
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const shareText = `Check out this job opportunity: ${job.jobTitle} at ${job.company?.name || job.companyName || 'Company'}`;
    
    if (navigator.share) {
      navigator.share({
        title: job.jobTitle,
        text: shareText,
        url: jobUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText}\n${jobUrl}`)
        .then(() => alert('Job link copied to clipboard!'))
        .catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = `${shareText}\n${jobUrl}`;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Job link copied to clipboard!');
        });
    }
  };

  const handleDelete = async (jobId) => {
    if (!jobId) return;
    if (!confirm('Delete this job?')) return;
    try {
      await deleteJob(jobId);
    } catch (e) {
      console.error('Failed to delete job', e);
      alert('Failed to delete job');
    }
  };

  const toggleSchool = (jobId, school) => {
    setSelectedSchools(prev => {
      const jobSchools = new Set(prev[jobId] || []);
      
      if (school === 'All Schools') {
        // If "All Schools" is clicked
        if (jobSchools.has('All Schools')) {
          // If already selected, remove it
          jobSchools.delete('All Schools');
        } else {
          // If not selected, clear all others and add only "All Schools"
          jobSchools.clear();
          jobSchools.add('All Schools');
        }
      } else {
        // If any specific school is clicked
        if (jobSchools.has('All Schools')) {
          // Remove "All Schools" and add the specific school
          jobSchools.delete('All Schools');
          jobSchools.add(school);
        } else {
          // Normal toggle behavior for specific schools
          if (jobSchools.has(school)) {
            jobSchools.delete(school);
          } else {
            jobSchools.add(school);
          }
        }
      }
      
      return { ...prev, [jobId]: Array.from(jobSchools) };
    });
  };

  const toggleBatch = (jobId, batch) => {
    setSelectedBatches(prev => {
      const jobBatches = new Set(prev[jobId] || []);
      
      if (batch === 'All Batches') {
        // If "All Batches" is clicked
        if (jobBatches.has('All Batches')) {
          // If already selected, remove it
          jobBatches.delete('All Batches');
        } else {
          // If not selected, clear all others and add only "All Batches"
          jobBatches.clear();
          jobBatches.add('All Batches');
        }
      } else {
        // If any specific batch is clicked
        if (jobBatches.has('All Batches')) {
          // Remove "All Batches" and add the specific batch
          jobBatches.delete('All Batches');
          jobBatches.add(batch);
        } else {
          // Normal toggle behavior for specific batches
          if (jobBatches.has(batch)) {
            jobBatches.delete(batch);
          } else {
            jobBatches.add(batch);
          }
        }
      }
      
      return { ...prev, [jobId]: Array.from(jobBatches) };
    });
  };

  const toggleSchoolDropdown = (jobId) => {
    setShowSchools(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const toggleBatchDropdown = (jobId) => {
    setShowBatches(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage & Post Jobs</h2>
        </div>
      </div>

      {/* Jobs list */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold">Jobs ({jobs.length})</h3>
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader className="w-4 h-4 animate-spin" /> Loading
            </div>
          )}
        </div>
        <div className="divide-y py-4">
          {jobs.length === 0 && !loading && (
            <div className="p-6 text-slate-500 text-sm">No jobs yet.</div>
          )}
          {jobs.map((job) => (
            <div key={job.id} className="relative bg-blue-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-4 mx-4">
              
              <div className="p-4">
                {/* First Row: Company, Interview Date, School, Batch, Actions */}
                <div className="flex items-center justify-between gap-6">
                  {/* Company - More space */}
                  <div className="flex-4 min-w-0">
                    <div className="flex items-center gap-2 mb-2 -mt-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Company</span>
                    </div>
                    <div className="font-semibold text-slate-900 truncate">
                      {job.company?.name || job.companyName || job.company || 'N/A'}
                    </div>
                  </div>
                  
                  {/* Interview Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 -mt-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Interview</span>
                    </div>
                    <div className="text-slate-900 text-sm">
                      {job.driveDate ? new Date(job.driveDate).toLocaleDateString('en-GB') : 'TBD'}
                    </div>
                  </div>
                  
                  {/* School */}
                  <div className="flex-2 min-w-0">
                    <div className="flex justify-center -translate-x-2 items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">School</span>
                    </div>
                    <div className="relative" ref={el => schoolDropdownRefs.current[job.id] = el}>
                      <button
                        type="button"
                        className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-blue-100 text-left flex items-center justify-between"
                        onClick={() => toggleSchoolDropdown(job.id)}
                      >
                        <span className="truncate">
                          {selectedSchools[job.id]?.length ? selectedSchools[job.id].join(', ') : 'Select Schools'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      </button>
                      {showSchools[job.id] && (
                        <div className="absolute z-10 overflow-hidden w-full bg-white border-2 border-slate-300 rounded-md shadow-lg">
                          {SCHOOLS.map((school) => (
                            <label key={school} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedSchools[job.id]?.includes(school) || false}
                                onChange={() => toggleSchool(job.id, school)}
                              />
                              <span>{school}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Batch */}
                  <div className="flex-2 min-w-0">
                    <div className="flex justify-center -translate-x-2 items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Batch</span>
                    </div>
                    <div className="relative" ref={el => batchDropdownRefs.current[job.id] = el}>
                      <button
                        type="button"
                        className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-blue-100 text-left flex items-center justify-between"
                        onClick={() => toggleBatchDropdown(job.id)}
                      >
                        <span className="truncate">
                          {selectedBatches[job.id]?.length ? selectedBatches[job.id].join(', ') : 'Select Batches'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      </button>
                      {showBatches[job.id] && (
                        <div className="absolute z-10 overflow-hidden w-full bg-white border-2 border-slate-300 rounded-md shadow-lg">
                          {BATCHES.map((batch) => (
                            <label key={batch} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedBatches[job.id]?.includes(batch) || false}
                                onChange={() => toggleBatch(job.id, batch)}
                              />
                              <span>{batch}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Post Action */}
                  <div className="flex items-center ml-3 mt-4">
                    <button
                      onClick={() => handlePostJob(job.id)}
                      disabled={postingJobs.has(job.id) || postedJobs.has(job.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                        postedJobs.has(job.id)
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : postingJobs.has(job.id)
                          ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      {postedJobs.has(job.id) ? (
                        <>
                          <CheckCircle className="w-5 h-5" /> Posted!
                        </>
                      ) : postingJobs.has(job.id) ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        'Post Job'
                      )}
                    </button>
                  </div>
                </div>

                {/* Second Row: Role and Actions */}
                <div className="mt-2 pt-2 border-t border-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Role:</span>
                      <span className="font-semibold text-slate-900">{job.jobTitle || 'N/A'}</span>
                    </div>
                    
                    {/* Share and Delete Actions */}
                    <div className="flex items-center gap-2 mr-2">
                      <button 
                        onClick={() => handleShare(job)}
                        className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                        title="Share job"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
