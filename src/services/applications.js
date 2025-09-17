import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  writeBatch,
  orderBy,
  getDoc,
  onSnapshot
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
      
      // Fetch company and job details with better error handling
      try {
        // First, always try to fetch the job document
        let jobData = null;
        let companyData = null;
        
        if (appData.jobId) {
          try {
            const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
            if (jobDoc.exists()) {
              jobData = jobDoc.data();
              console.log('Available company fields in job:', {
                company: jobData.company,
                companyName: jobData.companyName,
                companyId: jobData.companyId,
                allFields: Object.keys(jobData)
              });
              
              // If job has company info embedded, use it
              if (jobData.company) {
                companyData = jobData.company;
              } else if (jobData.companyId || appData.companyId) {
                // Try to fetch company document
                const companyId = jobData.companyId || appData.companyId;
                try {
                  const companyDoc = await getDoc(doc(db, 'companies', companyId));
                  if (companyDoc.exists()) {
                    companyData = companyDoc.data();
                  }
                } catch (companyErr) {
                  console.warn('Error fetching company document:', companyErr);
                }
              }
            }
          } catch (jobErr) {
            console.warn('Error fetching job document:', jobErr);
          }
        }
        
        // Set the final data with multiple fallback options for company name
        appData.company = companyData ? {
          name: companyData.name || companyData.companyName || companyData.company || 'Unknown Company',
          ...companyData
        } : (jobData && jobData.company) ? {
          name: jobData.company,
          ...jobData
        } : {
          name: 'Unknown Company',
          id: appData.companyId || 'unknown'
        };
        
        appData.job = jobData ? {
          jobTitle: jobData.jobTitle || jobData.title || 'Unknown Position',
          ...jobData
        } : {
          jobTitle: 'Unknown Position',
          id: appData.jobId || 'unknown'
        };
        
      } catch (err) {
        console.warn('Error fetching related data for application:', err);
        // Provide fallback data instead of null
        appData.company = {
          name: 'Unknown Company',
          id: appData.companyId || 'unknown'
        };
        appData.job = {
          jobTitle: 'Unknown Position',
          id: appData.jobId || 'unknown'
        };
      }
      
      applications.push(appData);
    }
    
    return applications;
  } catch (error) {
    console.error('Error getting student applications:', error);
    
    // Handle specific permission errors gracefully
    if (error.code === 'permission-denied') {
      console.warn('Permission denied for applications collection. User may not have proper access or no applications exist.');
      return []; // Return empty array instead of throwing
    }
    
    // For other errors, still throw to maintain error handling
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
    
    // Add application - handle undefined companyId
    const applicationRef = doc(collection(db, 'applications'));
    const applicationData = {
      studentId,
      jobId,
      appliedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      status: 'applied',
      interviewDate: null,
      createdAt: new Date()
    };
    
    // Only add companyId if it's defined
    if (companyId && companyId !== undefined) {
      applicationData.companyId = companyId;
    }
    
    batch.set(applicationRef, applicationData);
    
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

// Subscribe to real-time application updates for a student
export const subscribeStudentApplications = (studentId, onChange) => {
  try {
    const q = query(
      collection(db, 'applications'),
      where('studentId', '==', studentId),
      orderBy('appliedDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const applications = [];
      
      for (const docSnap of snapshot.docs) {
        const appData = { id: docSnap.id, ...docSnap.data() };
        
        // Fetch company and job details with better error handling
        console.log('Fetching data for application:', {
          applicationId: appData.id,
          jobId: appData.jobId,
          companyId: appData.companyId
        });
        
        try {
          // First, always try to fetch the job document
          let jobData = null;
          let companyData = null;
          
          if (appData.jobId) {
            try {
              const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
              if (jobDoc.exists()) {
                jobData = jobDoc.data();
                console.log('Job document found:', jobData);
                console.log('Available company fields in job:', {
                  company: jobData.company,
                  companyName: jobData.companyName,
                  companyId: jobData.companyId,
                  allFields: Object.keys(jobData)
                });
                
                // If job has company info embedded, use it
                if (jobData.company) {
                  companyData = jobData.company;
                  console.log('Using embedded company data from job:', companyData);
                } else if (jobData.companyId || appData.companyId) {
                  // Try to fetch company document
                  const companyId = jobData.companyId || appData.companyId;
                  try {
                    const companyDoc = await getDoc(doc(db, 'companies', companyId));
                    if (companyDoc.exists()) {
                      companyData = companyDoc.data();
                      console.log('Company document found:', companyData);
                    }
                  } catch (companyErr) {
                    console.warn('Error fetching company document:', companyErr);
                  }
                }
              } else {
                console.warn('Job document not found for ID:', appData.jobId);
              }
            } catch (jobErr) {
              console.warn('Error fetching job document:', jobErr);
            }
          }
          
          // Set the final data with multiple fallback options for company name
          appData.company = companyData ? {
            name: companyData.name || companyData.companyName || companyData.company || 'Unknown Company',
            ...companyData
          } : (jobData && jobData.company) ? {
            name: jobData.company,
            ...jobData
          } : {
            name: 'Unknown Company',
            id: appData.companyId || 'unknown'
          };
          
          appData.job = jobData ? {
            jobTitle: jobData.jobTitle || jobData.title || 'Unknown Position',
            ...jobData
          } : {
            jobTitle: 'Unknown Position',
            id: appData.jobId || 'unknown'
          };
          
          console.log('Final application data:', {
            company: appData.company,
            job: appData.job,
            rawJobData: jobData,
            rawCompanyData: companyData
          });
          
        } catch (err) {
          console.warn('Error fetching related data for application:', err);
          // Provide fallback data instead of null
          appData.company = {
            name: 'Unknown Company',
            id: appData.companyId || 'unknown'
          };
          appData.job = {
            jobTitle: 'Unknown Position',
            id: appData.jobId || 'unknown'
          };
        }
        
        applications.push(appData);
      }
      
      onChange(applications);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to applications:', error);
    onChange([]);
    return () => {}; // Return empty unsubscribe function
  }
};
