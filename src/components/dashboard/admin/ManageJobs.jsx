import React, { useEffect, useState, useRef } from 'react';
import { deleteJob, subscribeJobs, postJob } from '../../../services/jobs';
import { Loader, Trash2, Share2, Building2, Calendar, GraduationCap, Users, Briefcase, ChevronDown, CheckCircle } from 'lucide-react';

const SCHOOLS = ['All Schools', 'SOT', 'SOM', 'SOH'];
const BATCHES = ['All Batches', '23-27', '24-28', '25-29'];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postingJobs, setPostingJobs] = useState(new Set());
  const [showSchools, setShowSchools] = useState({});
  const [showBatches, setShowBatches] = useState({});
  const [selectedSchools, setSelectedSchools] = useState({});
  const [selectedBatches, setSelectedBatches] = useState({});
  const schoolDropdownRefs = useRef({});
  const batchDropdownRefs = useRef({});

  // Real-time jobs subscription using your existing service
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeJobs((jobsList) => {
      console.log('📡 Real-time update - Jobs received:', jobsList.length);
      setJobs(jobsList);
      
      // Load existing selections from database for posted jobs
      const schoolSelections = {};
      const batchSelections = {};
      
      jobsList.forEach(job => {
        if (isJobPosted(job) && job.targetSchools) {
          schoolSelections[job.id] = job.targetSchools;
        }
        if (isJobPosted(job) && job.targetBatches) {
          batchSelections[job.id] = job.targetBatches;
        }
      });
      
      // Update selections state with database data
      if (Object.keys(schoolSelections).length > 0) {
        setSelectedSchools(prev => ({ ...prev, ...schoolSelections }));
      }
      if (Object.keys(batchSelections).length > 0) {
        setSelectedBatches(prev => ({ ...prev, ...batchSelections }));
      }
      
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showSchools).forEach(jobId => {
        if (showSchools[jobId] && schoolDropdownRefs.current[jobId] && 
            !schoolDropdownRefs.current[jobId].contains(event.target)) {
          setShowSchools(prev => ({ ...prev, [jobId]: false }));
        }
      });

      Object.keys(showBatches).forEach(jobId => {
        if (showBatches[jobId] && batchDropdownRefs.current[jobId] && 
            !batchDropdownRefs.current[jobId].contains(event.target)) {
          setShowBatches(prev => ({ ...prev, [jobId]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSchools, showBatches]);

  // Check if job is posted (compatible with your database structure)
  const isJobPosted = (job) => {
    return job.status === 'posted' || job.isPosted === true || job.posted === true;
  };

  // Database-driven sorting and categorization
  const getSortedJobs = () => {
    // Filter based on database status
    const unpostedJobs = jobs.filter(job => !isJobPosted(job));
    const postedJobs = jobs.filter(job => isJobPosted(job));
    
    console.log('🗂️ Categorization - Unposted:', unpostedJobs.length, 'Posted:', postedJobs.length);
    
    // Sort unposted by creation time (newest first)
    const sortByCreationTime = (a, b) => {
      const getTimestamp = (job) => {
        if (job.createdAt?.toDate) return job.createdAt.toDate();
        if (job.timestamp?.toDate) return job.timestamp.toDate();
        return new Date(job.createdAt || job.timestamp || 0);
      };
      return getTimestamp(b) - getTimestamp(a);
    };
    
    // Sort posted by posted time (latest posted first)
    const sortByPostedTime = (a, b) => {
      const getPostedTimestamp = (job) => {
        if (job.postedAt?.toDate) return job.postedAt.toDate();
        return new Date(job.postedAt || 0);
      };
      const postedTimeA = getPostedTimestamp(a);
      const postedTimeB = getPostedTimestamp(b);
      
      if (postedTimeA && postedTimeB) {
        return postedTimeB - postedTimeA; // Latest posted first
      }
      return sortByCreationTime(a, b); // Fallback
    };
    
    const sortedUnposted = unpostedJobs.sort(sortByCreationTime);
    const sortedPosted = postedJobs.sort(sortByPostedTime);
    
    return [...sortedUnposted, ...sortedPosted];
  };

  // Check if job can be posted
  const canPostJob = (job) => {
    const isAlreadyPosted = isJobPosted(job);
    const hasSchoolSelection = selectedSchools[job.id]?.length > 0;
    const hasBatchSelection = selectedBatches[job.id]?.length > 0;
    
    return !isAlreadyPosted && hasSchoolSelection && hasBatchSelection;
  };

  // Get posted job display text
  const getPostedJobDisplay = (jobId) => {
    const schools = selectedSchools[jobId] || [];
    const batches = selectedBatches[jobId] || [];
    
    const schoolText = schools.length === 1 ? schools[0] : 
                     schools.length > 1 ? `${schools.length} Schools` : '';
    const batchText = batches.length === 1 ? batches[0] : 
                     batches.length > 1 ? `${batches.length} Batches` : '';
    
    return `Posted: ${schoolText}, ${batchText}`;
  };

  // Database-integrated post job handler
  const handlePostJob = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || postingJobs.has(jobId) || !canPostJob(job)) return;

    try {
      setPostingJobs(prev => new Set([...prev, jobId]));
      
      const postData = {
        selectedSchools: selectedSchools[jobId] || [],
        selectedBatches: selectedBatches[jobId] || [],
        postedBy: 'admin', // You can get this from auth context
      };
      
      console.log('🚀 Posting job to database:', jobId, postData);
      
      // Update database using your existing service
      await postJob(jobId, postData);
      
      console.log('✅ Job posted successfully:', jobId);
      
    } catch (err) {
      console.error('❌ Failed to post job:', err);
      
      let errorMessage = 'Failed to post job';
      if (err?.code) {
        switch (err.code) {
          case 'permission-denied':
            errorMessage = 'You do not have permission to post this job';
            break;
          case 'not-found':
            errorMessage = 'Job not found';
            break;
          case 'unavailable':
            errorMessage = 'Service temporarily unavailable. Please try again';
            break;
          default:
            errorMessage = err.message || 'Failed to post job';
        }
      }
      
      alert('Failed to post job: ' + errorMessage);
      
    } finally {
      setPostingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  // Share job handler
  const handleShare = (job) => {
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const shareText = `Check out this job opportunity: ${job.jobTitle} at ${job.company?.name || job.companyName || job.company || 'Company'}`;
    
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

  // Delete job handler using your existing service
  const handleDelete = async (jobId) => {
    if (!jobId) return;
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    
    try {
      await deleteJob(jobId);
      console.log('🗑️ Job deleted successfully:', jobId);
    } catch (e) {
      console.error('❌ Failed to delete job:', e);
      alert('Failed to delete job: ' + (e?.message || 'Unknown error'));
    }
  };

  // Smart dropdown logic with auto "All" selection
  const toggleSchool = (jobId, school) => {
    setSelectedSchools(prev => {
      const jobSchools = new Set(prev[jobId] || []);
      const allIndividualSchools = SCHOOLS.filter(s => s !== 'All Schools');
      
      if (school === 'All Schools') {
        if (jobSchools.has('All Schools')) {
          jobSchools.delete('All Schools');
        } else {
          jobSchools.clear();
          jobSchools.add('All Schools');
        }
      } else {
        if (jobSchools.has('All Schools')) {
          jobSchools.delete('All Schools');
          jobSchools.add(school);
        } else {
          if (jobSchools.has(school)) {
            jobSchools.delete(school);
          } else {
            jobSchools.add(school);
          }
        }
        
        // Auto-convert to "All Schools" if all individual schools selected
        const selectedIndividualSchools = Array.from(jobSchools).filter(s => s !== 'All Schools');
        if (selectedIndividualSchools.length === allIndividualSchools.length) {
          jobSchools.clear();
          jobSchools.add('All Schools');
        }
      }
      
      return { ...prev, [jobId]: Array.from(jobSchools) };
    });
  };

  const toggleBatch = (jobId, batch) => {
    setSelectedBatches(prev => {
      const jobBatches = new Set(prev[jobId] || []);
      const allIndividualBatches = BATCHES.filter(b => b !== 'All Batches');
      
      if (batch === 'All Batches') {
        if (jobBatches.has('All Batches')) {
          jobBatches.delete('All Batches');
        } else {
          jobBatches.clear();
          jobBatches.add('All Batches');
        }
      } else {
        if (jobBatches.has('All Batches')) {
          jobBatches.delete('All Batches');
          jobBatches.add(batch);
        } else {
          if (jobBatches.has(batch)) {
            jobBatches.delete(batch);
          } else {
            jobBatches.add(batch);
          }
        }
        
        // Auto-convert to "All Batches" if all individual batches selected
        const selectedIndividualBatches = Array.from(jobBatches).filter(b => b !== 'All Batches');
        if (selectedIndividualBatches.length === allIndividualBatches.length) {
          jobBatches.clear();
          jobBatches.add('All Batches');
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

  // Get statistics
  const unpostedCount = jobs.filter(job => !isJobPosted(job)).length;
  const postedCount = jobs.filter(job => isJobPosted(job)).length;

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage & Post Jobs</h2>
          <p className="text-sm text-slate-600 mt-1">
            Select target schools and batches, then post jobs to students
          </p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              📝 {unpostedCount} Unposted
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              ✅ {postedCount} Posted
            </span>
          </div>
        </div>
      </div>

      {/* Jobs list */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold">Jobs ({jobs.length})</h3>
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader className="w-4 h-4 animate-spin" /> Loading jobs...
            </div>
          )}
        </div>
        
        <div className="divide-y py-4">
          {jobs.length === 0 && !loading && (
            <div className="p-6 text-center">
              <div className="text-slate-500 text-sm">No jobs available yet.</div>
              <div className="text-xs text-slate-400 mt-1">Jobs will appear here once they are created.</div>
            </div>
          )}
          
          {getSortedJobs().map((job, index) => {
            const sortedJobs = getSortedJobs();
            const isFirstPostedJob = index > 0 && 
                                   !isJobPosted(sortedJobs[index - 1]) && 
                                   isJobPosted(job);
            
            return (
              <React.Fragment key={job.id}>
                {/* Section divider before first posted job */}
                {isFirstPostedJob && (
                  <div className="mx-4 my-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-gray-50 px-4 py-1 text-sm font-medium text-gray-500 rounded-full">
                          Posted Jobs
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`relative border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-4 mx-4 ${
                  isJobPosted(job) ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                  <div className="p-4">
                    {/* First Row: Company, Interview Date, School, Batch, Actions */}
                    <div className="flex items-center justify-between gap-6">
                      {/* Company */}
                      <div className="flex-4 min-w-0">
                        <div className="flex items-center gap-2 mb-2 -mt-2">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-600">Company</span>
                          {isJobPosted(job) && (
                            <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
                              POSTED
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 text-xl truncate ml-[5%]">
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
                          {job.driveDate ? (
                            job.driveDate.toDate ? 
                            job.driveDate.toDate().toLocaleDateString('en-GB') :
                            new Date(job.driveDate).toLocaleDateString('en-GB')
                          ) : 'TBD'}
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
                            className={`w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-left flex items-center justify-between ${
                              selectedSchools[job.id]?.length ? 'bg-green-100' : 'bg-blue-100'
                            }`}
                            onClick={() => toggleSchoolDropdown(job.id)}
                            disabled={isJobPosted(job)}
                          >
                            <span className="truncate">
                              {selectedSchools[job.id]?.length ? selectedSchools[job.id].join(', ') : 'Select Schools'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          </button>
                          {showSchools[job.id] && !isJobPosted(job) && (
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
                            className={`w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-left flex items-center justify-between ${
                              selectedBatches[job.id]?.length ? 'bg-green-100' : 'bg-blue-100'
                            }`}
                            onClick={() => toggleBatchDropdown(job.id)}
                            disabled={isJobPosted(job)}
                          >
                            <span className="truncate">
                              {selectedBatches[job.id]?.length ? selectedBatches[job.id].join(', ') : 'Select Batches'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          </button>
                          {showBatches[job.id] && !isJobPosted(job) && (
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
                          disabled={!canPostJob(job) || postingJobs.has(job.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center min-w-[120px] ${
                            isJobPosted(job)
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : postingJobs.has(job.id)
                              ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                              : canPostJob(job)
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                              : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                          }`}
                        >
                          {isJobPosted(job) ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">{getPostedJobDisplay(job.id)}</span>
                            </>
                          ) : postingJobs.has(job.id) ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Posting...</span>
                            </>
                          ) : canPostJob(job) ? (
                            'Post Job'
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
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
