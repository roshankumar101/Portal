import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const JOBS_COLL = 'jobs';
const APPS_COLL = 'applications';

// EXISTING FUNCTIONS (keeping your original functions)
export async function listJobs({ limitTo = 50, recruiterId, status } = {}) {
  try {
    const constraints = [orderBy('postedDate', 'desc'), limit(limitTo)];
    if (recruiterId) constraints.unshift(where('recruiterId', '==', recruiterId));
    if (status) constraints.unshift(where('isActive', '==', status));
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    const snap = await getDocs(q);
    
    const jobs = [];
    for (const docSnap of snap.docs) {
      const jobData = { id: docSnap.id, ...docSnap.data() };
      
      try {
        if (jobData.companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', jobData.companyId));
          if (companyDoc.exists()) {
            jobData.company = companyDoc.data();
          }
        }
      } catch (err) {
        console.warn('Error fetching company for job:', err);
      }
      
      jobs.push(jobData);
    }
    
    return jobs;
  } catch (error) {
    console.error('Error listing jobs:', error);
    return [];
  }
}

export async function getJob(jobId) {
  const snap = await getDoc(doc(db, JOBS_COLL, jobId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getJobDetails(jobId) {
  try {
    const jobSnap = await getDoc(doc(db, JOBS_COLL, jobId));
    if (!jobSnap.exists()) {
      return null;
    }

    const jobData = { id: jobSnap.id, ...jobSnap.data() };

    if (jobData.companyId) {
      try {
        const companyDoc = await getDoc(doc(db, 'companies', jobData.companyId));
        if (companyDoc.exists()) {
          jobData.company = companyDoc.data();
        }
      } catch (err) {
        console.warn('Error fetching company details:', err);
      }
    }

    return jobData;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
}

export async function createJob(recruiterId, data) {
  const payload = {
    ...data,
    recruiterId,
    status: data.status || 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, JOBS_COLL), payload);
  return ref.id;
}

export async function updateJob(jobId, data) {
  await updateDoc(doc(db, JOBS_COLL, jobId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJob(jobId) {
  await deleteDoc(doc(db, JOBS_COLL, jobId));
}

export async function listApplicationsForJob(jobId) {
  const q = query(collection(db, APPS_COLL), where('jobId', '==', jobId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function applyToJob(jobId, studentId, data = {}) {
  const payload = {
    jobId,
    studentId,
    status: 'applied',
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, APPS_COLL), payload);
  return ref.id;
}

export async function updateApplication(appId, data) {
  await updateDoc(doc(db, APPS_COLL, appId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteApplication(appId) {
  await deleteDoc(doc(db, APPS_COLL, appId));
}

export async function listApplicationsForStudent(studentId) {
  const q = query(collection(db, APPS_COLL), where('studentId', '==', studentId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Job status constants
export const JOB_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review', // NEW: For jobs submitted for review
  ACTIVE: 'active',
  POSTED: 'posted', // NEW: Added for your use case
  ARCHIVED: 'archived'
};

export async function saveJobDraft(jobData) {
  try {
    const payload = {
      ...jobData,
      status: JOB_STATUS.DRAFT,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, JOBS_COLL), payload);
    return { jobId: ref.id, ...payload };
  } catch (error) {
    console.error('Error saving job draft:', error);
    throw error;
  }
}

export async function submitJobForReview(jobData) {
  try {
    const payload = {
      ...jobData,
      status: JOB_STATUS.IN_REVIEW,
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, JOBS_COLL), payload);
    return { jobId: ref.id, ...payload };
  } catch (error) {
    console.error('Error submitting job for review:', error);
    throw error;
  }
}

export async function addAnotherPositionDraft(jobData) {
  try {
    const saved = await saveJobDraft(jobData);
    
    const autofill = {
      company: jobData.company || '',
      website: jobData.website || '',
      linkedin: jobData.linkedin || '',
      companyLocation: jobData.companyLocation || '',
      spocs: jobData.spocs || [{ fullName: '', email: '', phone: '' }],
      serviceAgreement: jobData.serviceAgreement || '',
      baseRoundDetails: jobData.baseRoundDetails || ['', '', ''],
      extraRounds: jobData.extraRounds || []
    };
    
    return { saved, autofill };
  } catch (error) {
    console.error('Error adding another position:', error);
    throw error;
  }
}

// MODIFIED: Enhanced postJob function with student job tracking
export async function postJob(jobId, postData = {}) {
  try {
    console.log('🚀 Posting job in database:', jobId, postData);
    
    // Update job status in database
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      // Status fields for posted jobs
      status: JOB_STATUS.POSTED,
      isPosted: true,
      posted: true,
      
      // Posted metadata
      postedAt: serverTimestamp(),
      postedBy: postData.postedBy || 'admin',
      
      // School, batch, and center targeting
      targetSchools: postData.selectedSchools || [],
      targetBatches: postData.selectedBatches || [],
      targetCenters: postData.selectedCenters || [],
      
      // Update tracking
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Job posted successfully in database:', jobId);
    
    // Get the complete job data
    const jobDoc = await getDoc(doc(db, JOBS_COLL, jobId));
    if (jobDoc.exists()) {
      const jobData = { id: jobDoc.id, ...jobDoc.data() };
      
      // Add job to relevant students' available jobs arrays
      try {
        await addJobToRelevantStudents(jobData, {
          targetSchools: postData.selectedSchools || [],
          targetBatches: postData.selectedBatches || [],
          targetCenters: postData.selectedCenters || []
        });
        console.log('✅ Job added to relevant students');
      } catch (studentError) {
        console.error('❌ Error adding job to students:', studentError);
        // Don't fail the job posting if student update fails
      }
      
      // Send email notifications (if available)
      try {
        const { sendJobPostingNotifications } = await import('./emailNotifications.js');
        
        sendJobPostingNotifications(
          jobData,
          postData.selectedCenters || [],
          postData.selectedSchools || [],
          postData.selectedBatches || []
        ).then(emailResult => {
          console.log('📧 Email notification result:', emailResult);
        }).catch(emailError => {
          console.error('📧 Email notification error:', emailError);
        });
        
      } catch (emailServiceError) {
        console.warn('⚠️ Email service not available:', emailServiceError);
      }
    }
    
    return { success: true, jobId };
    
  } catch (error) {
    console.error('❌ Error posting job:', error);
    throw error;
  }
}

// NEW: Enhanced subscribeJobs for your ManageJobs component
export function subscribeJobs(onChange, opts = {}) {
  try {
    let constraints = [];
    
    // Add filters first
    if (opts.status) {
      constraints.push(where('status', '==', opts.status));
    }
    if (opts.recruiterId) {
      constraints.push(where('recruiterId', '==', opts.recruiterId));
    }
    
    // Only add ordering if no filters are present (to avoid composite index requirement)
    if (!opts.status && !opts.recruiterId) {
      constraints.push(orderBy('createdAt', 'desc'));
    }
    constraints.push(limit(opts.limitTo || 50));
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📡 Real-time update - Jobs snapshot received');
      const jobs = [];
      
      for (const docSnap of snapshot.docs) {
        const jobData = { id: docSnap.id, ...docSnap.data() };
        
        // Fetch company details if needed
        try {
          if (jobData.companyId) {
            const companyDoc = await getDoc(doc(db, 'companies', jobData.companyId));
            if (companyDoc.exists()) {
              jobData.company = companyDoc.data();
            }
          }
        } catch (err) {
          console.warn('Error fetching company for job:', err);
        }
        
        jobs.push(jobData);
      }
      
      console.log('📊 Jobs processed:', jobs.length, 'total');
      onChange(jobs);
    }, (error) => {
      console.error('❌ Error in jobs subscription:', error);
      onChange([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up jobs subscription:', error);
    return () => {};
  }
}

// EXISTING FUNCTIONS (keeping the rest of your original functions)
export async function fetchJobs(opts = {}) {
  try {
    let constraints = [];
    
    if (opts.status) {
      constraints.push(where('status', '==', opts.status));
    }
    if (opts.recruiterId) {
      constraints.push(where('recruiterId', '==', opts.recruiterId));
    }
    
    // Only add ordering if no filters are present (to avoid composite index requirement)
    if (!opts.status && !opts.recruiterId) {
      constraints.push(orderBy('createdAt', 'desc'));
    }
    constraints.push(limit(opts.limitTo || 50));
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    const snap = await getDocs(q);
    
    const jobs = [];
    for (const docSnap of snap.docs) {
      const jobData = { id: docSnap.id, ...docSnap.data() };
      
      try {
        if (jobData.companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', jobData.companyId));
          if (companyDoc.exists()) {
            jobData.company = companyDoc.data();
          }
        }
      } catch (err) {
        console.warn('Error fetching company for job:', err);
      }
      
      jobs.push(jobData);
    }
    
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function updateJobData(jobId, patch) {
  try {
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      ...patch,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function getRecruiterDirectory() {
  try {
    const q = query(
      collection(db, JOBS_COLL), 
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    
    const companyMap = new Map();
    
    snap.docs.forEach(docSnap => {
      const jobData = { id: docSnap.id, ...docSnap.data() };
      const companyName = jobData.company?.trim();
      
      if (!companyName) return;
      
      const firstSpoc = jobData.spocs?.[0];
      if (!firstSpoc?.fullName || !firstSpoc?.email) return;
      
      const location = jobData.driveVenues?.[0] || jobData.companyLocation || 'Not specified';
      
      const companyKey = companyName.toLowerCase();
      
      if (!companyMap.has(companyKey)) {
        companyMap.set(companyKey, {
          id: `company_${companyMap.size + 1}`,
          companyName: companyName,
          recruiterName: firstSpoc.fullName,
          email: firstSpoc.email,
          location: location,
          lastJobPostedAt: jobData.createdAt,
          totalJobPostings: 1,
          status: 'Active',
          jobs: [jobData]
        });
      } else {
        const existing = companyMap.get(companyKey);
        existing.totalJobPostings += 1;
        existing.jobs.push(jobData);
        
        if (jobData.createdAt && jobData.createdAt.toMillis() > existing.lastJobPostedAt.toMillis()) {
          existing.lastJobPostedAt = jobData.createdAt;
        }
      }
    });
    
    const recruiters = Array.from(companyMap.values()).map(recruiter => ({
      ...recruiter,
      lastJobPostedAt: recruiter.lastJobPostedAt 
        ? new Date(recruiter.lastJobPostedAt.toMillis()).toLocaleDateString()
        : 'Never',
      activityHistory: recruiter.jobs.map(job => ({
        type: job.jobTitle || 'Job Posted',
        date: job.createdAt ? new Date(job.createdAt.toMillis()).toLocaleDateString() : 'Unknown',
        location: job.driveVenues?.[0] || job.companyLocation || 'Not specified',
        status: job.status || 'Active'
      }))
    }));
    
    return recruiters;
  } catch (error) {
    console.error('Error fetching recruiter directory:', error);
    return [];
  }
}

// NEW: Additional helper functions for your use case
export async function unpostJob(jobId) {
  try {
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      status: JOB_STATUS.DRAFT,
      isPosted: false,
      posted: false,
      unpostedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, jobId };
  } catch (error) {
    console.error('Error unposting job:', error);
    throw error;
  }
}

// OPTIMIZED: One-time fetch for posted jobs to prevent listener overflow
export async function fetchPostedJobs(opts = {}) {
  try {
    let constraints = [
      where('status', '==', JOB_STATUS.POSTED),
      limit(opts.limitTo || 50)
    ];
    
    if (opts.recruiterId) {
      constraints.unshift(where('recruiterId', '==', opts.recruiterId));
    }
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    const snapshot = await getDocs(q);
    
    const jobs = [];
    for (const docSnap of snapshot.docs) {
      const jobData = { id: docSnap.id, ...docSnap.data() };
      jobs.push(jobData);
    }
    
    return jobs;
    
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    return [];
  }
}

// LEGACY: Keep subscription function for backwards compatibility but with better cleanup
export function subscribePostedJobs(onChange, opts = {}) {
  // For student dashboard, use one-time fetch instead of subscription
  fetchPostedJobs(opts)
    .then(jobs => onChange(jobs))
    .catch(error => {
      console.error('Error in subscribePostedJobs:', error);
      if (opts.onError) opts.onError(error);
      else onChange([]);
    });
  
  // Return empty unsubscribe function since no listener is created
  return () => {};
}

// NEW: Get only unposted jobs
export function subscribeUnpostedJobs(onChange, opts = {}) {
  try {
    let constraints = [
      where('status', 'in', [JOB_STATUS.DRAFT, JOB_STATUS.IN_REVIEW, JOB_STATUS.ACTIVE]),
      limit(opts.limitTo || 50)
    ];
    
    if (opts.recruiterId) {
      constraints.unshift(where('recruiterId', '==', opts.recruiterId));
    }

    const q = query(collection(db, JOBS_COLL), ...constraints);
    
    return onSnapshot(q, async (snapshot) => {
      const jobs = [];
      for (const docSnap of snapshot.docs) {
        const jobData = { id: docSnap.id, ...docSnap.data() };
        jobs.push(jobData);
      }
      onChange(jobs);
    });
  } catch (error) {
    console.error('Error subscribing to unposted jobs:', error);
    return () => {};
  }
}

// Helper function to add job to relevant students (OPTIMIZED)
export async function addJobToRelevantStudents(jobData, targeting) {
  try {
    console.log(`🎯 Starting job distribution for job ${jobData.id}:`, {
      title: jobData.title || jobData.jobTitle,
      company: jobData.company || jobData.companyName,
      targeting: targeting
    });
    
    // Import student service methods dynamically to avoid circular dependencies
    const { getAllStudents, addJobToMultipleStudents } = await import('./students.js');
    
    // Get all students
    const allStudents = await getAllStudents();
    console.log(`📊 Total students in database: ${allStudents.length}`);
    
    // Start with all students and filter step by step
    let relevantStudents = allStudents;
    
    // SCHOOL FILTERING (optimized for "ALL" case)
    if (targeting.targetSchools && targeting.targetSchools.length > 0) {
      if (!targeting.targetSchools.includes('ALL')) {
        const beforeCount = relevantStudents.length;
        relevantStudents = relevantStudents.filter(student => 
          student.school && targeting.targetSchools.includes(student.school.trim())
        );
        console.log(`🏫 School filter: ${beforeCount} → ${relevantStudents.length} students (${targeting.targetSchools.join(', ')})`);
      } else {
        console.log(`🏫 School filter: ALL schools (${relevantStudents.length} students)`);
      }
    }
    
    // BATCH FILTERING (optimized for "ALL" case)
    if (targeting.targetBatches && targeting.targetBatches.length > 0) {
      if (!targeting.targetBatches.includes('ALL')) {
        const beforeCount = relevantStudents.length;
        relevantStudents = relevantStudents.filter(student => 
          student.batch && targeting.targetBatches.includes(student.batch.trim())
        );
        console.log(`🎓 Batch filter: ${beforeCount} → ${relevantStudents.length} students (${targeting.targetBatches.join(', ')})`);
      } else {
        console.log(`🎓 Batch filter: ALL batches (${relevantStudents.length} students)`);
      }
    }
    
    // CENTER FILTERING (optimized for "ALL" case)
    if (targeting.targetCenters && targeting.targetCenters.length > 0) {
      if (!targeting.targetCenters.includes('ALL')) {
        const beforeCount = relevantStudents.length;
        relevantStudents = relevantStudents.filter(student => 
          student.center && targeting.targetCenters.includes(student.center.trim())
        );
        console.log(`🏢 Center filter: ${beforeCount} → ${relevantStudents.length} students (${targeting.targetCenters.join(', ')})`);
      } else {
        console.log(`🏢 Center filter: ALL centers (${relevantStudents.length} students)`);
      }
    }
    
    // Filter out students without required fields
    const validStudents = relevantStudents.filter(student => {
      const hasRequiredFields = student.uid && (student.fullName || student.name);
      if (!hasRequiredFields) {
        console.warn(`⚠️ Skipping student with missing required fields:`, {
          uid: student.uid,
          name: student.fullName || student.name
        });
      }
      return hasRequiredFields;
    });
    
    console.log(`✅ Final student count after filtering: ${validStudents.length}`);
    
    // Extract student IDs
    const studentIds = validStudents.map(student => student.uid || student.id).filter(Boolean);
    
    if (studentIds.length > 0) {
      // Show sample of students who will receive the job
      const sampleStudents = validStudents.slice(0, 3).map(s => `${s.fullName || s.name} (${s.school}-${s.batch}-${s.center})`);
      console.log(`👥 Sample students receiving job:`, sampleStudents);
      if (validStudents.length > 3) {
        console.log(`   ... and ${validStudents.length - 3} more students`);
      }
      
      // Add job to all relevant students
      await addJobToMultipleStudents(studentIds, jobData);
      console.log(`✅ Job ${jobData.id} successfully distributed to ${studentIds.length} students`);
    } else {
      console.warn(`⚠️ No students match the targeting criteria for job ${jobData.id}`);
      console.log('🔍 Targeting criteria was:', {
        schools: targeting.targetSchools,
        batches: targeting.targetBatches,
        centers: targeting.targetCenters
      });
    }
    
    // Return detailed results for admin dashboard
    const result = {
      success: true,
      studentsCount: studentIds.length,
      targeting: targeting,
      students: validStudents.map(s => ({ 
        uid: s.uid,
        name: s.fullName || s.name, 
        school: s.school, 
        batch: s.batch, 
        center: s.center 
      })),
      distribution: {
        totalStudentsInDB: allStudents.length,
        studentsMatchingCriteria: validStudents.length,
        jobsDistributed: studentIds.length
      }
    };
    
    console.log(`📈 Job distribution summary:`, result.distribution);
    return result;
    
  } catch (error) {
    console.error(`❌ Error adding job to relevant students:`, error);
    throw error;
  }
}