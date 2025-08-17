import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase';

// Get all applications for a student
export const getStudentApplications = async (studentId) => {
  try {
    const q = query(
      collection(db, 'applications'),
      where('studentId', '==', studentId),
      orderBy('appliedDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const applications = [];
    
    for (const docSnap of querySnapshot.docs) {
      const appData = { id: docSnap.id, ...docSnap.data() };
      
      // Fetch company and job details
      try {
        const [companyDoc, jobDoc] = await Promise.all([
          getDoc(doc(db, 'companies', appData.companyId)),
          getDoc(doc(db, 'jobs', appData.jobId))
        ]);
        
        appData.company = companyDoc.exists() ? companyDoc.data() : null;
        appData.job = jobDoc.exists() ? jobDoc.data() : null;
      } catch (err) {
        console.warn('Error fetching related data for application:', err);
        appData.company = null;
        appData.job = null;
      }
      
      applications.push(appData);
    }
    
    return applications;
  } catch (error) {
    console.error('Error getting student applications:', error);
    throw error;
  }
};

// Apply to a job
export const applyToJob = async (studentId, jobId, companyId) => {
  try {
    // Check if already applied
    const q = query(
      collection(db, 'applications'),
      where('studentId', '==', studentId),
      where('jobId', '==', jobId)
    );
    const existingApps = await getDocs(q);
    
    if (!existingApps.empty) {
      throw new Error('Already applied to this job');
    }
    
    const batch = writeBatch(db);
    
    // Add application
    const applicationRef = doc(collection(db, 'applications'));
    batch.set(applicationRef, {
      studentId,
      jobId,
      companyId,
      appliedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      status: 'applied',
      interviewDate: null,
      createdAt: new Date()
    });
    
    // Update student stats
    const studentRef = doc(db, 'students', studentId);
    const studentDoc = await getDoc(studentRef);
    
    if (studentDoc.exists()) {
      const currentStats = studentDoc.data().stats || { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 };
      batch.update(studentRef, {
        'stats.applied': currentStats.applied + 1,
        updatedAt: new Date()
      });
    }
    
    await batch.commit();
    return applicationRef.id;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId, newStatus, interviewDate = null) => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    const applicationDoc = await getDoc(applicationRef);
    
    if (!applicationDoc.exists()) {
      throw new Error('Application not found');
    }
    
    const applicationData = applicationDoc.data();
    const oldStatus = applicationData.status;
    
    const batch = writeBatch(db);
    
    // Update application
    const updateData = {
      status: newStatus,
      updatedAt: new Date()
    };
    
    if (interviewDate) {
      updateData.interviewDate = interviewDate;
    }
    
    batch.update(applicationRef, updateData);
    
    // Update student stats if status changed
    if (oldStatus !== newStatus) {
      const studentRef = doc(db, 'students', applicationData.studentId);
      const studentDoc = await getDoc(studentRef);
      
      if (studentDoc.exists()) {
        const currentStats = studentDoc.data().stats || { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 };
        
        // Decrease old status count
        if (oldStatus === 'shortlisted') currentStats.shortlisted = Math.max(0, currentStats.shortlisted - 1);
        else if (oldStatus === 'interviewed') currentStats.interviewed = Math.max(0, currentStats.interviewed - 1);
        else if (oldStatus === 'offered') currentStats.offers = Math.max(0, currentStats.offers - 1);
        
        // Increase new status count
        if (newStatus === 'shortlisted') currentStats.shortlisted += 1;
        else if (newStatus === 'interviewed') currentStats.interviewed += 1;
        else if (newStatus === 'offered') currentStats.offers += 1;
        
        batch.update(studentRef, {
          stats: currentStats,
          updatedAt: new Date()
        });
      }
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Get application statistics for a student
export const getApplicationStats = async (studentId) => {
  try {
    const q = query(
      collection(db, 'applications'),
      where('studentId', '==', studentId)
    );
    const querySnapshot = await getDocs(q);
    
    const stats = {
      applied: 0,
      shortlisted: 0,
      interviewed: 0,
      offers: 0
    };
    
    querySnapshot.forEach((doc) => {
      const status = doc.data().status;
      if (status === 'applied') stats.applied += 1;
      else if (status === 'shortlisted') stats.shortlisted += 1;
      else if (status === 'interviewed') stats.interviewed += 1;
      else if (status === 'offered') stats.offers += 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting application stats:', error);
    throw error;
  }
};
