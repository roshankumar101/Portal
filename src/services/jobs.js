import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const JOBS_COLL = 'jobs';
const APPS_COLL = 'applications';

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
      
      // Fetch company details
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

// Get comprehensive job details with all related data
export async function getJobDetails(jobId) {
  try {
    const jobSnap = await getDoc(doc(db, JOBS_COLL, jobId));
    if (!jobSnap.exists()) {
      return null;
    }

    const jobData = { id: jobSnap.id, ...jobSnap.data() };

    // Fetch company details if companyId exists
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

// Job status type definition
export const JOB_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

// Save job as draft
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

// Add another position (same company, auto-fill)
export async function addAnotherPositionDraft(jobData) {
  try {
    // Save the current job as draft
    const saved = await saveJobDraft(jobData);
    
    // Return autofill data for next form
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

// Post job (change status from draft to active)
export async function postJob(jobId) {
  try {
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      status: JOB_STATUS.ACTIVE,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error posting job:', error);
    throw error;
  }
}

// Fetch jobs with optional status filter
export async function fetchJobs(opts = {}) {
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
    const snap = await getDocs(q);
    
    const jobs = [];
    for (const docSnap of snap.docs) {
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
    
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Subscribe to jobs with real-time updates
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
      
      onChange(jobs);
    }, (error) => {
      console.error('Error in jobs subscription:', error);
      onChange([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up jobs subscription:', error);
    return () => {};
  }
}

// Update job
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

