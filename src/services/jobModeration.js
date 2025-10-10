import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  limit, 
  onSnapshot, 
  orderBy, 
  query, 
  serverTimestamp, 
  startAfter, 
  updateDoc, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { createNotification } from './notifications';

const JOBS_COLL = 'jobs';
const USERS_COLL = 'users';
const COMPANIES_COLL = 'companies';
const NOTIFICATIONS_COLL = 'notifications';

// Real-time subscription to jobs with enhanced data resolution
export function subscribeJobsWithDetails(onChange, filters = {}) {
  try {
    // Build query constraints
    let constraints = [];
    
    // Add filters
    if (filters.status && filters.status !== 'all') {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters.recruiterId) {
      constraints.push(where('recruiterId', '==', filters.recruiterId));
    }
    
    if (filters.companyId) {
      constraints.push(where('companyId', '==', filters.companyId));
    }
    
    if (filters.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive));
    }
    
    // Date range filtering
    if (filters.startDate) {
      constraints.push(where('driveDate', '>=', filters.startDate));
    }
    if (filters.endDate) {
      constraints.push(where('driveDate', '<=', filters.endDate));
    }
    
    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }
    
    if (filters.startAfterDoc) {
      constraints.push(startAfter(filters.startAfterDoc));
    }
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📡 Real-time update - Jobs snapshot received:', snapshot.docs.length);
      
      const jobs = [];
      
      // Process each job and resolve related data
      for (const docSnap of snapshot.docs) {
        const jobData = { id: docSnap.id, ...docSnap.data() };
        
        // Resolve recruiter info
        try {
          if (jobData.recruiterId) {
            const recruiterDoc = await getDoc(doc(db, USERS_COLL, jobData.recruiterId));
            if (recruiterDoc.exists()) {
              const recruiterData = recruiterDoc.data();
              jobData.recruiter = {
                id: recruiterDoc.id,
                name: recruiterData.name || recruiterData.displayName || recruiterData.email,
                email: recruiterData.email,
                phone: recruiterData.phone,
                profileImage: recruiterData.profileImage
              };
            }
          }
        } catch (err) {
          console.warn('Error fetching recruiter for job:', err);
        }
        
        // Resolve company info
        try {
          if (jobData.companyId) {
            const companyDoc = await getDoc(doc(db, COMPANIES_COLL, jobData.companyId));
            if (companyDoc.exists()) {
              const companyData = companyDoc.data();
              jobData.companyDetails = {
                id: companyDoc.id,
                name: companyData.name || companyData.companyName,
                logo: companyData.logo || companyData.logoUrl,
                website: companyData.website,
                location: companyData.location
              };
            }
          }
        } catch (err) {
          console.warn('Error fetching company for job:', err);
        }
        
        jobs.push(jobData);
      }
      
      console.log('📊 Jobs processed with details:', jobs.length);
      onChange(jobs, snapshot);
    }, (error) => {
      console.error('❌ Error in jobs subscription:', error);
      onChange([], null);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up jobs subscription:', error);
    return () => {};
  }
}

// Get job analytics/statistics
export async function getJobAnalytics() {
  try {
    const [totalJobs, activeJobs, draftJobs, archivedJobs, rejectedJobs] = await Promise.all([
      getDocs(query(collection(db, JOBS_COLL))),
      getDocs(query(collection(db, JOBS_COLL), where('status', '==', 'active'))),
      getDocs(query(collection(db, JOBS_COLL), where('status', '==', 'draft'))),
      getDocs(query(collection(db, JOBS_COLL), where('status', '==', 'archived'))),
      getDocs(query(collection(db, JOBS_COLL), where('status', '==', 'rejected')))
    ]);
    
    return {
      total: totalJobs.size,
      active: activeJobs.size,
      draft: draftJobs.size,
      archived: archivedJobs.size,
      rejected: rejectedJobs.size,
      pendingApproval: draftJobs.size
    };
  } catch (error) {
    console.error('Error fetching job analytics:', error);
    throw error;
  }
}

// Real-time job analytics subscription
export function subscribeJobAnalytics(onChange) {
  try {
    const unsubscribe = onSnapshot(collection(db, JOBS_COLL), async (snapshot) => {
      const analytics = {
        total: snapshot.size,
        active: 0,
        draft: 0,
        archived: 0,
        rejected: 0,
        posted: 0
      };
      
      snapshot.docs.forEach(doc => {
        const job = doc.data();
        const status = job.status?.toLowerCase() || 'draft';
        
        if (analytics.hasOwnProperty(status)) {
          analytics[status]++;
        }
        
        if (job.isPosted || job.posted) {
          analytics.posted++;
        }
      });
      
      analytics.pendingApproval = analytics.draft;
      
      onChange(analytics);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up analytics subscription:', error);
    return () => {};
  }
}

// Approve job posting
export async function approveJob(jobId, adminUser) {
  try {
    const jobDoc = await getDoc(doc(db, JOBS_COLL, jobId));
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Update job status
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      status: 'active',
      isActive: true,
      isPosted: true,
      approvedAt: serverTimestamp(),
      approvedBy: adminUser.uid,
      updatedAt: serverTimestamp()
    });
    
    // Create notification for recruiter
    if (jobData.recruiterId) {
      await createNotification({
        userId: jobData.recruiterId,
        title: 'Job Approved',
        body: `${jobData.jobTitle} has been approved and is now live.`,
        data: {
          type: 'job_approval',
          jobId,
          adminId: adminUser.uid,
          adminName: adminUser.name || adminUser.email,
          priority: 'medium',
          date: new Date().toLocaleDateString(),
          time: serverTimestamp()
        }
      });
    }
    
    return {
      success: true,
      action: 'approved',
      job: { id: jobId, ...jobData, status: 'active', isActive: true, isPosted: true }
    };
  } catch (error) {
    console.error('Error approving job:', error);
    throw error;
  }
}

// Reject job posting
export async function rejectJob(jobId, rejectionReason, adminUser) {
  try {
    const jobDoc = await getDoc(doc(db, JOBS_COLL, jobId));
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Update job status
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      status: 'rejected',
      isActive: false,
      isPosted: false,
      rejectionReason: rejectionReason || 'No reason provided',
      rejectedAt: serverTimestamp(),
      rejectedBy: adminUser.uid,
      updatedAt: serverTimestamp()
    });
    
    // Create notification for recruiter
    if (jobData.recruiterId) {
      await createNotification({
        userId: jobData.recruiterId,
        title: 'Job Rejected',
        body: `${jobData.jobTitle} has been rejected by Admin.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
        data: {
          type: 'job_rejection',
          jobId,
          adminId: adminUser.uid,
          adminName: adminUser.name || adminUser.email,
          rejectionReason: rejectionReason || 'No reason provided',
          priority: 'high',
          date: new Date().toLocaleDateString(),
          time: serverTimestamp()
        }
      });
    }
    
    return {
      success: true,
      action: 'rejected',
      job: { id: jobId, ...jobData, status: 'rejected', isActive: false, isPosted: false }
    };
  } catch (error) {
    console.error('Error rejecting job:', error);
    throw error;
  }
}

// Archive job posting
export async function archiveJob(jobId, adminUser) {
  try {
    const jobDoc = await getDoc(doc(db, JOBS_COLL, jobId));
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Update job status
    await updateDoc(doc(db, JOBS_COLL, jobId), {
      status: 'archived',
      isActive: false,
      archivedAt: serverTimestamp(),
      archivedBy: adminUser.uid,
      updatedAt: serverTimestamp()
    });
    
    // Create notification for recruiter
    if (jobData.recruiterId) {
      await createNotification({
        userId: jobData.recruiterId,
        title: 'Job Archived',
        body: `${jobData.jobTitle} has been archived.`,
        data: {
          type: 'job_status',
          jobId,
          adminId: adminUser.uid,
          adminName: adminUser.name || adminUser.email,
          priority: 'low',
          date: new Date().toLocaleDateString(),
          time: serverTimestamp()
        }
      });
    }
    
    return {
      success: true,
      action: 'archived',
      job: { id: jobId, ...jobData, status: 'archived', isActive: false }
    };
  } catch (error) {
    console.error('Error archiving job:', error);
    throw error;
  }
}

// Get all companies for dropdown
export async function getCompaniesForDropdown() {
  try {
    const companiesSnap = await getDocs(collection(db, COMPANIES_COLL));
    return companiesSnap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || doc.data().companyName,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

// Get all recruiters for dropdown
export async function getRecruitersForDropdown() {
  try {
    const recruitersQuery = query(
      collection(db, USERS_COLL),
      where('role', '==', 'recruiter')
    );
    const recruitersSnap = await getDocs(recruitersQuery);
    
    return recruitersSnap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || doc.data().displayName || doc.data().email,
      email: doc.data().email,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching recruiters:', error);
    return [];
  }
}

// Search jobs by title or company name
export async function searchJobs(searchTerm, additionalFilters = {}) {
  try {
    // Note: Firestore doesn't support full-text search, so we'll do a simple approach
    // In production, you'd want to use Algolia or similar for better search
    let constraints = [];
    
    // Add other filters first
    if (additionalFilters.status) {
      constraints.push(where('status', '==', additionalFilters.status));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(collection(db, JOBS_COLL), ...constraints);
    const snapshot = await getDocs(q);
    
    // Client-side filtering for search (not ideal for large datasets)
    const jobs = [];
    for (const doc of snapshot.docs) {
      const jobData = { id: doc.id, ...doc.data() };
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = jobData.jobTitle?.toLowerCase().includes(searchLower);
        const companyMatch = (jobData.company || jobData.companyName || '')
          .toLowerCase().includes(searchLower);
        
        if (!titleMatch && !companyMatch) {
          continue;
        }
      }
      
      jobs.push(jobData);
    }
    
    return jobs;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
}

// Auto-archive expired jobs
export async function autoArchiveExpiredJobs(adminUser) {
  try {
    const now = new Date();
    const expiredJobsQuery = query(
      collection(db, JOBS_COLL),
      where('applicationDeadline', '<', now),
      where('status', '==', 'active')
    );
    
    const expiredJobsSnap = await getDocs(expiredJobsQuery);
    const archivePromises = [];
    
    for (const jobDoc of expiredJobsSnap.docs) {
      archivePromises.push(archiveJob(jobDoc.id, adminUser));
    }
    
    const results = await Promise.allSettled(archivePromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    return {
      total: expiredJobsSnap.size,
      successful,
      failed: expiredJobsSnap.size - successful
    };
  } catch (error) {
    console.error('Error auto-archiving expired jobs:', error);
    throw error;
  }
}

export default {
  subscribeJobsWithDetails,
  getJobAnalytics,
  subscribeJobAnalytics,
  approveJob,
  rejectJob,
  archiveJob,
  getCompaniesForDropdown,
  getRecruitersForDropdown,
  searchJobs,
  autoArchiveExpiredJobs
};