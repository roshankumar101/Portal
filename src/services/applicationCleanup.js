import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Find applications that reference non-existent jobs
 * @param {string} studentId - Optional: filter by specific student
 * @returns {Array} List of orphaned applications
 */
export const findOrphanedApplications = async (studentId = null) => {
  try {
    console.log('🔍 Scanning for orphaned applications...');
    
    // Build query based on whether studentId is provided
    let q;
    if (studentId) {
      q = query(
        collection(db, 'applications'),
        where('studentId', '==', studentId)
      );
    } else {
      q = query(collection(db, 'applications'));
    }
    
    const querySnapshot = await getDocs(q);
    const orphanedApplications = [];
    const validApplications = [];
    
    console.log(`📊 Found ${querySnapshot.size} applications to check`);
    
    for (const appDoc of querySnapshot.docs) {
      const appData = { id: appDoc.id, ...appDoc.data() };
      
      if (appData.jobId) {
        try {
          const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
          
          if (!jobDoc.exists()) {
            console.log(`❌ Orphaned application found: ${appData.id} -> Job ID: ${appData.jobId}`);
            orphanedApplications.push({
              ...appData,
              reason: 'Job document not found'
            });
          } else {
            validApplications.push(appData);
          }
        } catch (error) {
          console.warn(`⚠️ Error checking job ${appData.jobId}:`, error);
          orphanedApplications.push({
            ...appData,
            reason: 'Error accessing job document',
            error: error.message
          });
        }
      } else {
        console.log(`❌ Application with missing jobId: ${appData.id}`);
        orphanedApplications.push({
          ...appData,
          reason: 'Missing jobId field'
        });
      }
    }
    
    console.log(`✅ Scan complete: ${validApplications.length} valid, ${orphanedApplications.length} orphaned`);
    
    return {
      orphaned: orphanedApplications,
      valid: validApplications,
      summary: {
        total: querySnapshot.size,
        valid: validApplications.length,
        orphaned: orphanedApplications.length
      }
    };
  } catch (error) {
    console.error('Error finding orphaned applications:', error);
    throw error;
  }
};

/**
 * Mark orphaned applications with a special status instead of deleting them
 * @param {Array} orphanedApplications - List of orphaned applications from findOrphanedApplications
 * @returns {Object} Results of the marking operation
 */
export const markOrphanedApplications = async (orphanedApplications) => {
  try {
    console.log(`🏷️ Marking ${orphanedApplications.length} orphaned applications...`);
    
    const results = {
      marked: 0,
      errors: []
    };
    
    for (const app of orphanedApplications) {
      try {
        await updateDoc(doc(db, 'applications', app.id), {
          status: 'job_removed',
          markedOrphaned: true,
          orphanedReason: app.reason,
          markedAt: new Date(),
          originalJobId: app.jobId
        });
        
        results.marked++;
        console.log(`✅ Marked application ${app.id} as orphaned`);
      } catch (error) {
        console.error(`❌ Error marking application ${app.id}:`, error);
        results.errors.push({
          applicationId: app.id,
          error: error.message
        });
      }
    }
    
    console.log(`✅ Marking complete: ${results.marked} marked, ${results.errors.length} errors`);
    return results;
  } catch (error) {
    console.error('Error marking orphaned applications:', error);
    throw error;
  }
};

/**
 * Clean up orphaned applications by deleting them (use with caution!)
 * @param {Array} orphanedApplications - List of orphaned applications from findOrphanedApplications
 * @returns {Object} Results of the deletion operation
 */
export const deleteOrphanedApplications = async (orphanedApplications) => {
  try {
    console.log(`🗑️ DELETING ${orphanedApplications.length} orphaned applications...`);
    console.warn('⚠️ This operation cannot be undone!');
    
    const results = {
      deleted: 0,
      errors: []
    };
    
    for (const app of orphanedApplications) {
      try {
        await deleteDoc(doc(db, 'applications', app.id));
        results.deleted++;
        console.log(`✅ Deleted orphaned application ${app.id}`);
      } catch (error) {
        console.error(`❌ Error deleting application ${app.id}:`, error);
        results.errors.push({
          applicationId: app.id,
          error: error.message
        });
      }
    }
    
    console.log(`✅ Deletion complete: ${results.deleted} deleted, ${results.errors.length} errors`);
    return results;
  } catch (error) {
    console.error('Error deleting orphaned applications:', error);
    throw error;
  }
};

/**
 * Get a summary of application data integrity for a student
 * @param {string} studentId - Student ID to analyze
 * @returns {Object} Data integrity report
 */
export const getApplicationIntegrityReport = async (studentId) => {
  try {
    const result = await findOrphanedApplications(studentId);
    
    const report = {
      studentId,
      timestamp: new Date().toISOString(),
      ...result.summary,
      issues: result.orphaned.map(app => ({
        applicationId: app.id,
        jobId: app.jobId,
        reason: app.reason,
        appliedDate: app.appliedDate,
        status: app.status
      })),
      recommendations: []
    };
    
    if (result.orphaned.length > 0) {
      report.recommendations.push(
        'Consider marking orphaned applications with "job_removed" status',
        'Review why job documents are missing (deleted jobs, data migration issues)',
        'Update UI to handle missing job references gracefully'
      );
    }
    
    if (result.orphaned.length === 0) {
      report.recommendations.push('All applications have valid job references - no action needed');
    }
    
    return report;
  } catch (error) {
    console.error('Error generating integrity report:', error);
    throw error;
  }
};

/**
 * Run a comprehensive cleanup for a student's applications
 * @param {string} studentId - Student ID to clean up
 * @param {boolean} markOnly - If true, only mark orphaned apps, don't delete
 * @returns {Object} Cleanup results
 */
export const cleanupStudentApplications = async (studentId, markOnly = true) => {
  try {
    console.log(`🧹 Starting cleanup for student: ${studentId}`);
    
    // Find orphaned applications
    const scanResult = await findOrphanedApplications(studentId);
    
    if (scanResult.orphaned.length === 0) {
      console.log('✅ No cleanup needed - all applications are valid');
      return {
        action: 'no_action_needed',
        summary: scanResult.summary
      };
    }
    
    // Either mark or delete orphaned applications
    let cleanupResult;
    if (markOnly) {
      cleanupResult = await markOrphanedApplications(scanResult.orphaned);
    } else {
      cleanupResult = await deleteOrphanedApplications(scanResult.orphaned);
    }
    
    return {
      action: markOnly ? 'marked_orphaned' : 'deleted_orphaned',
      scanResult: scanResult.summary,
      cleanupResult,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in cleanup process:', error);
    throw error;
  }
};