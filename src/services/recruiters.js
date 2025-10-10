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
  updateDoc, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { createNotification } from './notifications';

const RECRUITERS_COLL = 'recruiters';
const JOBS_COLL = 'jobs';
const USERS_COLL = 'users';
const NOTIFICATIONS_COLL = 'notifications';

// Real-time subscription to recruiter directory
export function subscribeRecruiterDirectory(onChange, options = {}) {
  try {
    // Build query constraints
    let constraints = [orderBy('createdAt', 'desc')];
    
    if (options.status) {
      constraints.unshift(where('status', '==', options.status));
    }
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, JOBS_COLL), ...constraints);
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📡 Real-time update - Recruiter directory snapshot received');
      
      const companyMap = new Map();
      const recruiters = [];
      
      // Process job documents to build recruiter directory
      for (const docSnap of snapshot.docs) {
        const jobData = { id: docSnap.id, ...docSnap.data() };
        const companyName = jobData.company?.trim();
        
        if (!companyName) continue;
        
        const firstSpoc = jobData.spocs?.[0];
        if (!firstSpoc?.fullName || !firstSpoc?.email) continue;
        
        const location = jobData.driveVenues?.[0] || jobData.companyLocation || 'Not specified';
        const companyKey = companyName.toLowerCase();
        
        if (!companyMap.has(companyKey)) {
          // Try to get recruiter profile from users collection
          let recruiterProfile = null;
          try {
            const userQuery = query(
              collection(db, USERS_COLL),
              where('email', '==', firstSpoc.email),
              where('role', '==', 'recruiter')
            );
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              recruiterProfile = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() };
            }
          } catch (err) {
            console.warn('Error fetching recruiter profile:', err);
          }
          
          companyMap.set(companyKey, {
            id: recruiterProfile?.id || `company_${companyMap.size + 1}`,
            companyName: companyName,
            recruiterName: firstSpoc.fullName,
            email: firstSpoc.email,
            phone: firstSpoc.phone || 'Not provided',
            location: location,
            lastJobPostedAt: jobData.createdAt,
            totalJobPostings: 1,
            status: recruiterProfile?.status || 'Active',
            blockInfo: recruiterProfile?.blockInfo || null,
            createdAt: recruiterProfile?.createdAt || jobData.createdAt,
            jobs: [jobData],
            profile: recruiterProfile
          });
        } else {
          const existing = companyMap.get(companyKey);
          existing.totalJobPostings += 1;
          existing.jobs.push(jobData);
          
          if (jobData.createdAt && jobData.createdAt.toMillis() > existing.lastJobPostedAt.toMillis()) {
            existing.lastJobPostedAt = jobData.createdAt;
          }
        }
      }
      
      const recruitersArray = Array.from(companyMap.values()).map(recruiter => ({
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
      
      console.log('📊 Recruiters processed:', recruitersArray.length, 'total');
      onChange(recruitersArray);
    }, (error) => {
      console.error('❌ Error in recruiter directory subscription:', error);
      onChange([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up recruiter directory subscription:', error);
    return () => {};
  }
}

// Get recruiter profile by ID or email
export async function getRecruiterProfile(identifier) {
  try {
    let recruiterDoc;
    
    // Check if identifier is an email or UID
    if (identifier.includes('@')) {
      const q = query(
        collection(db, USERS_COLL),
        where('email', '==', identifier),
        where('role', '==', 'recruiter')
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      recruiterDoc = snap.docs[0];
    } else {
      recruiterDoc = await getDoc(doc(db, USERS_COLL, identifier));
    }
    
    if (!recruiterDoc.exists()) return null;
    
    const profile = { id: recruiterDoc.id, ...recruiterDoc.data() };
    
    // Get recruiter's job history
    const jobsQuery = query(
      collection(db, JOBS_COLL),
      where('spocs', 'array-contains', { email: profile.email }),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    try {
      const jobsSnap = await getDocs(jobsQuery);
      profile.jobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (jobError) {
      console.warn('Error fetching recruiter jobs:', jobError);
      profile.jobs = [];
    }
    
    return profile;
  } catch (error) {
    console.error('Error fetching recruiter profile:', error);
    throw error;
  }
}

// Get recruiter's job postings
export async function getRecruiterJobs(recruiterEmail) {
  try {
    const q = query(
      collection(db, JOBS_COLL),
      where('spocs', 'array-contains', { email: recruiterEmail }),
      orderBy('createdAt', 'desc')
    );
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    throw error;
  }
}

// Get recruiter activity history
export async function getRecruiterHistory(recruiterId) {
  try {
    // Get notifications related to this recruiter
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLL),
      where('data.recruiterId', '==', recruiterId),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const notificationsSnap = await getDocs(notificationsQuery);
    const notifications = notificationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get job posting history
    const recruiterProfile = await getRecruiterProfile(recruiterId);
    const jobs = recruiterProfile?.jobs || [];
    
    // Combine activity history
    const history = {
      jobPostings: jobs.map(job => ({
        id: job.id,
        type: 'job_posted',
        jobTitle: job.jobTitle,
        company: job.company,
        date: job.createdAt,
        status: job.status,
        location: job.companyLocation,
        venues: job.driveVenues
      })),
      notifications: notifications.map(notif => ({
        id: notif.id,
        type: notif.type || 'general',
        title: notif.title,
        body: notif.body,
        date: notif.createdAt,
        data: notif.data
      })),
      loginHistory: [], // Would need to implement user session tracking
      statusChanges: notifications.filter(notif => 
        notif.type === 'recruiter_blocked' || notif.type === 'recruiter_unblocked'
      )
    };
    
    return history;
  } catch (error) {
    console.error('Error fetching recruiter history:', error);
    throw error;
  }
}

// Block or unblock recruiter
export async function blockUnblockRecruiter(recruiterId, blockData, adminUser) {
  try {
    const { isUnblocking, blockType, endDate, endTime, reason, notes } = blockData;
    
    // Get recruiter profile
    const recruiterProfile = await getRecruiterProfile(recruiterId);
    if (!recruiterProfile) {
      throw new Error('Recruiter not found');
    }
    
    const updateData = {
      status: isUnblocking ? 'Active' : 'Blocked',
      updatedAt: serverTimestamp()
    };
    
    if (isUnblocking) {
      updateData.blockInfo = null;
    } else {
      updateData.blockInfo = {
        type: blockType,
        endDate: blockType === 'temporary' ? endDate : null,
        endTime: blockType === 'temporary' ? endTime : null,
        reason,
        notes,
        blockedAt: serverTimestamp(),
        blockedBy: adminUser.id,
        blockedByName: adminUser.name || adminUser.email
      };
    }
    
    // Update recruiter status in users collection
    await updateDoc(doc(db, USERS_COLL, recruiterId), updateData);
    
    // Create notification for audit trail
    await createNotification({
      userId: recruiterId,
      title: isUnblocking ? 'Account Unblocked' : 'Account Blocked',
      body: isUnblocking 
        ? 'Your recruiter account has been unblocked and you can now post jobs.'
        : `Your recruiter account has been blocked. Reason: ${reason}`,
      data: {
        type: isUnblocking ? 'recruiter_unblocked' : 'recruiter_blocked',
        recruiterId,
        adminId: adminUser.id,
        adminName: adminUser.name || adminUser.email,
        reason: isUnblocking ? null : reason,
        notes: isUnblocking ? null : notes,
        blockType: isUnblocking ? null : blockType,
        endDate: isUnblocking ? null : endDate,
        endTime: isUnblocking ? null : endTime
      }
    });
    
    return {
      success: true,
      action: isUnblocking ? 'unblocked' : 'blocked',
      recruiter: {
        ...recruiterProfile,
        status: updateData.status,
        blockInfo: updateData.blockInfo
      }
    };
  } catch (error) {
    console.error('Error blocking/unblocking recruiter:', error);
    throw error;
  }
}

// Update recruiter status
export async function updateRecruiterStatus(recruiterId, status, adminUser) {
  try {
    await updateDoc(doc(db, USERS_COLL, recruiterId), {
      status,
      updatedAt: serverTimestamp(),
      updatedBy: adminUser.id
    });
    
    // Create notification for audit trail
    await createNotification({
      userId: recruiterId,
      title: `Status Updated to ${status}`,
      body: `Your recruiter account status has been updated to ${status}.`,
      data: {
        type: 'recruiter_status_updated',
        recruiterId,
        adminId: adminUser.id,
        adminName: adminUser.name || adminUser.email,
        oldStatus: null, // Would need to track previous status
        newStatus: status
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating recruiter status:', error);
    throw error;
  }
}

// Search recruiters with Firestore queries
export async function searchRecruiters(searchTerm, filters = {}) {
  try {
    let constraints = [];
    
    // Add filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    // For search, we'll need to do client-side filtering since Firestore doesn't support full-text search
    // In production, you might want to use Algolia or similar for better search
    const q = query(collection(db, USERS_COLL), where('role', '==', 'recruiter'), ...constraints);
    const snap = await getDocs(q);
    
    let recruiters = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      recruiters = recruiters.filter(recruiter => 
        (recruiter.name && recruiter.name.toLowerCase().includes(searchLower)) ||
        (recruiter.email && recruiter.email.toLowerCase().includes(searchLower)) ||
        (recruiter.company && recruiter.company.toLowerCase().includes(searchLower)) ||
        (recruiter.location && recruiter.location.toLowerCase().includes(searchLower))
      );
    }
    
    return recruiters;
  } catch (error) {
    console.error('Error searching recruiters:', error);
    throw error;
  }
}

// Send email to recruiter (placeholder - would integrate with actual email service)
export async function sendEmailToRecruiter(recruiterId, emailData, adminUser) {
  try {
    // In a real implementation, this would send email via Firebase Functions or external service
    console.log('Sending email to recruiter:', recruiterId, emailData);
    
    // Create notification for audit trail
    await createNotification({
      userId: recruiterId,
      title: `Email: ${emailData.subject}`,
      body: emailData.body.substring(0, 200) + (emailData.body.length > 200 ? '...' : ''),
      data: {
        type: 'email_sent',
        recruiterId,
        adminId: adminUser.id,
        adminName: adminUser.name || adminUser.email,
        subject: emailData.subject,
        from: emailData.from || adminUser.email,
        cc: emailData.cc,
        bcc: emailData.bcc
      }
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      messageId: `msg_${Date.now()}`,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending email to recruiter:', error);
    throw error;
  }
}

// Get recruiter analytics/summary
export async function getRecruiterSummary(recruiterId) {
  try {
    const history = await getRecruiterHistory(recruiterId);
    const profile = await getRecruiterProfile(recruiterId);
    
    const centers = ['Lucknow', 'Pune', 'Bangalore', 'Delhi'];
    const schools = ['SOT', 'SOH', 'SOM'];
    
    // Calculate jobs per center/school from actual job data
    const jobsPerCenter = centers.reduce((acc, center) => {
      acc[center] = (profile?.jobs || []).filter(job => 
        job.driveVenues?.some(venue => venue.includes(center)) ||
        job.companyLocation?.includes(center)
      ).length;
      return acc;
    }, {});
    
    const jobsPerSchool = schools.reduce((acc, school) => {
      acc[school] = (profile?.jobs || []).filter(job => 
        job.targetSchools?.includes(school)
      ).length;
      return acc;
    }, {});
    
    return {
      jobsPerCenter,
      jobsPerSchool,
      totalJobs: profile?.jobs?.length || 0,
      activeJobs: (profile?.jobs || []).filter(job => job.status === 'active').length,
      relationshipType: profile?.relationshipType || 'Partner Company',
      zone: profile?.zone || 'North Zone',
      joinDate: profile?.createdAt,
      lastActivity: profile?.lastLoginAt,
      emailsSent: history.notifications.filter(n => n.type === 'email_sent').length,
      statusChanges: history.statusChanges.length
    };
  } catch (error) {
    console.error('Error getting recruiter summary:', error);
    throw error;
  }
}

export default {
  subscribeRecruiterDirectory,
  getRecruiterProfile,
  getRecruiterJobs,
  getRecruiterHistory,
  blockUnblockRecruiter,
  updateRecruiterStatus,
  searchRecruiters,
  sendEmailToRecruiter,
  getRecruiterSummary
};