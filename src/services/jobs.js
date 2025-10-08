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

// MODIFIED: Enhanced postJob function for your ManageJobs component
export async function postJob(jobId, postData = {}) {
  try {
    console.log('🚀 Posting job in database:', jobId, postData);
    
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      // Status fields for posted jobs
      status: JOB_STATUS.POSTED,
      isPosted: true,
      posted: true,
      
      // Posted metadata
      postedAt: serverTimestamp(),
      postedBy: postData.postedBy || 'admin',
      
      // School, batch, and center targeting (NEW for your use case)
      targetSchools: postData.selectedSchools || [],
      targetBatches: postData.selectedBatches || [],
      targetCenters: postData.selectedCenters || [],
      
      // Update tracking
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Job posted successfully in database:', jobId);
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
    
    // Add filters first, then ordering and limit
    if (opts.status) {
      constraints.push(where('status', '==', opts.status));
    }
    if (opts.recruiterId) {
      constraints.push(where('recruiterId', '==', opts.recruiterId));
    }
    
    // Add ordering and limit last
    constraints.push(orderBy('createdAt', 'desc'));
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
    
    constraints.push(orderBy('createdAt', 'desc'));
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

// NEW: Get only posted jobs
export function subscribePostedJobs(onChange, opts = {}) {
  try {
    let constraints = [
      where('status', '==', JOB_STATUS.POSTED),
      orderBy('postedAt', 'desc'),
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
    console.error('Error subscribing to posted jobs:', error);
    return () => {};
  }
}

// NEW: Get only unposted jobs
export function subscribeUnpostedJobs(onChange, opts = {}) {
  try {
    let constraints = [
      where('status', 'in', [JOB_STATUS.DRAFT, JOB_STATUS.ACTIVE]),
      orderBy('createdAt', 'desc'),
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