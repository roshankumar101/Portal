import { addDoc, collection, query, where, getDocs, serverTimestamp, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAllStudents } from './students';

const EMAIL_NOTIFICATIONS_COLL = 'emailNotifications';
const UNSUBSCRIBED_USERS_COLL = 'unsubscribedUsers';

/**
 * Send email notifications to eligible students when a job is posted
 * @param {Object} jobData - The job data that was posted
 * @param {Array} targetCenters - Array of target centers
 * @param {Array} targetSchools - Array of target schools  
 * @param {Array} targetBatches - Array of target batches
 */
export async function sendJobPostingNotifications(jobData, targetCenters = [], targetSchools = [], targetBatches = []) {
  try {
    console.log('📧 Starting job posting email notifications...', {
      jobId: jobData.id,
      jobTitle: jobData.jobTitle,
      company: jobData.company || jobData.companyName,
      targetCenters,
      targetSchools,
      targetBatches
    });

    // Get all students from the database
    const allStudents = await getAllStudents();
    
    // Filter students based on target criteria
    const eligibleStudents = allStudents.filter(student => {
      // Skip if student has unsubscribed from email notifications
      if (student.emailNotificationsDisabled) {
        return false;
      }
      
      // If no target filters are set, all students are eligible
      if (targetCenters.length === 0 && targetSchools.length === 0 && targetBatches.length === 0) {
        return true;
      }
      
      // Check if student matches target criteria
      const centerMatch = targetCenters.length === 0 || targetCenters.includes(student.center);
      const schoolMatch = targetSchools.length === 0 || targetSchools.includes(student.school);
      const batchMatch = targetBatches.length === 0 || targetBatches.includes(student.batch);
      
      // Student must match all specified target criteria
      return centerMatch && schoolMatch && batchMatch;
    });

    console.log(`🎯 Found ${eligibleStudents.length} eligible students out of ${allStudents.length} total students`);

    if (eligibleStudents.length === 0) {
      console.log('⚠️ No eligible students found for email notifications');
      return { success: true, emailsSent: 0, message: 'No eligible students found' };
    }

    // Check for unsubscribed users
    const eligibleStudentsFiltered = [];
    for (const student of eligibleStudents) {
      const isUnsubscribed = await checkIfUnsubscribed(student.email);
      if (!isUnsubscribed) {
        eligibleStudentsFiltered.push(student);
      }
    }

    console.log(`📬 Sending emails to ${eligibleStudentsFiltered.length} students (${eligibleStudents.length - eligibleStudentsFiltered.length} unsubscribed)`);

    // Create email notifications in database (these would be picked up by a backend service)
    const emailPromises = eligibleStudentsFiltered.map(async (student) => {
      const unsubscribeToken = generateUnsubscribeToken(student.email);
      
      const emailData = {
        to: student.email,
        studentId: student.id,
        studentName: student.fullName,
        jobId: jobData.id,
        jobTitle: jobData.jobTitle,
        company: jobData.company || jobData.companyName || 'Company',
        driveDate: jobData.driveDate,
        salary: jobData.salary,
        location: jobData.location,
        jobDescription: jobData.jobDescription,
        applicationDeadline: jobData.applicationDeadline,
        unsubscribeToken,
        emailType: 'job_posting',
        status: 'pending',
        createdAt: serverTimestamp(),
        metadata: {
          targetCenters,
          targetSchools,
          targetBatches,
          studentCenter: student.center,
          studentSchool: student.school,
          studentBatch: student.batch
        }
      };

      return addDoc(collection(db, EMAIL_NOTIFICATIONS_COLL), emailData);
    });

    await Promise.all(emailPromises);

    console.log('✅ Email notifications queued successfully');
    return { 
      success: true, 
      emailsSent: eligibleStudentsFiltered.length,
      message: `Queued ${eligibleStudentsFiltered.length} email notifications` 
    };

  } catch (error) {
    console.error('❌ Error sending job posting notifications:', error);
    throw error;
  }
}

/**
 * Generate a unique unsubscribe token for a user
 * @param {string} email - User's email address
 * @returns {string} - Unique unsubscribe token
 */
function generateUnsubscribeToken(email) {
  // Create a simple token based on email and timestamp
  const timestamp = Date.now();
  const emailHash = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  return `${emailHash}_${timestamp}`;
}

/**
 * Check if a user has unsubscribed from email notifications
 * @param {string} email - User's email address
 * @returns {boolean} - True if user has unsubscribed
 */
export async function checkIfUnsubscribed(email) {
  try {
    const q = query(
      collection(db, UNSUBSCRIBED_USERS_COLL),
      where('email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking unsubscribe status:', error);
    return false; // Default to not unsubscribed if there's an error
  }
}

/**
 * Unsubscribe a user from email notifications
 * @param {string} email - User's email address
 * @param {string} token - Unsubscribe token for verification
 * @returns {Object} - Result of unsubscribe operation
 */
export async function unsubscribeUser(email, token) {
  try {
    console.log('🚫 Unsubscribing user:', email);
    
    // Validate token (basic validation - in production, you'd want more robust token validation)
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid unsubscribe token');
    }

    // Check if already unsubscribed
    const alreadyUnsubscribed = await checkIfUnsubscribed(email);
    if (alreadyUnsubscribed) {
      return { success: true, message: 'User was already unsubscribed' };
    }

    // Add user to unsubscribed list
    await addDoc(collection(db, UNSUBSCRIBED_USERS_COLL), {
      email: email.toLowerCase(),
      unsubscribedAt: serverTimestamp(),
      unsubscribeToken: token,
      source: 'job_posting_email'
    });

    console.log('✅ User unsubscribed successfully');
    return { success: true, message: 'Successfully unsubscribed from job notifications' };

  } catch (error) {
    console.error('❌ Error unsubscribing user:', error);
    throw error;
  }
}

/**
 * Re-subscribe a user to email notifications
 * @param {string} email - User's email address
 * @returns {Object} - Result of re-subscribe operation
 */
export async function resubscribeUser(email) {
  try {
    console.log('✅ Re-subscribing user:', email);
    
    // Find and remove unsubscribe record
    const q = query(
      collection(db, UNSUBSCRIBED_USERS_COLL),
      where('email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: true, message: 'User was not unsubscribed' };
    }

    // Delete unsubscribe records (there might be multiple)
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log('✅ User re-subscribed successfully');
    return { success: true, message: 'Successfully re-subscribed to job notifications' };

  } catch (error) {
    console.error('❌ Error re-subscribing user:', error);
    throw error;
  }
}

/**
 * Get email notification statistics
 * @param {string} jobId - Job ID to get stats for
 * @returns {Object} - Email notification statistics
 */
export async function getEmailNotificationStats(jobId) {
  try {
    const q = query(
      collection(db, EMAIL_NOTIFICATIONS_COLL),
      where('jobId', '==', jobId)
    );
    const querySnapshot = await getDocs(q);
    
    const stats = {
      total: querySnapshot.size,
      pending: 0,
      sent: 0,
      failed: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    };

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'pending';
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting email notification stats:', error);
    return { total: 0, pending: 0, sent: 0, failed: 0, delivered: 0, opened: 0, clicked: 0 };
  }
}

/**
 * Update email notification status (called by backend email service)
 * @param {string} notificationId - Notification document ID
 * @param {string} status - New status (sent, delivered, opened, clicked, failed)
 * @param {Object} metadata - Additional metadata
 */
export async function updateEmailNotificationStatus(notificationId, status, metadata = {}) {
  try {
    const docRef = doc(db, EMAIL_NOTIFICATIONS_COLL, notificationId);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      ...metadata
    };

    if (status === 'sent') {
      updateData.sentAt = serverTimestamp();
    } else if (status === 'delivered') {
      updateData.deliveredAt = serverTimestamp();
    } else if (status === 'opened') {
      updateData.openedAt = serverTimestamp();
    } else if (status === 'clicked') {
      updateData.clickedAt = serverTimestamp();
    } else if (status === 'failed') {
      updateData.failedAt = serverTimestamp();
      updateData.errorMessage = metadata.error || 'Unknown error';
    }

    await setDoc(docRef, updateData, { merge: true });
    console.log(`📊 Updated email notification ${notificationId} status to: ${status}`);
  } catch (error) {
    console.error('Error updating email notification status:', error);
    throw error;
  }
}

// Email template functions would typically be handled by a backend service
// These are placeholder functions that show the structure

/**
 * Generate HTML email template for job posting notification
 * @param {Object} emailData - Email data containing job and student information
 * @returns {string} - HTML email template
 */
export function generateJobPostingEmailHTML(emailData) {
  const {
    studentName,
    jobTitle,
    company,
    driveDate,
    salary,
    location,
    jobDescription,
    applicationDeadline,
    unsubscribeToken
  } = emailData;

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${(salary / 100000).toFixed(1)} LPA`;
    }
    return salary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // This would be handled by your backend email service
  const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(emailData.to)}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Opportunity - ${jobTitle}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New Job Opportunity!</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">A new position has been posted that matches your profile</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${studentName || 'Student'},</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">We're excited to inform you about a new job opportunity that matches your profile:</p>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px;">${jobTitle}</h2>
          <h3 style="color: #667eea; margin: 0 0 20px 0; font-size: 20px;">${company}</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <strong style="color: #555;">📍 Location:</strong><br>
              <span style="color: #333;">${location || 'Not specified'}</span>
            </div>
            <div>
              <strong style="color: #555;">💰 Salary:</strong><br>
              <span style="color: #333;">${formatSalary(salary)}</span>
            </div>
            <div>
              <strong style="color: #555;">📅 Drive Date:</strong><br>
              <span style="color: #333;">${formatDate(driveDate)}</span>
            </div>
            <div>
              <strong style="color: #555;">⏰ Apply Before:</strong><br>
              <span style="color: #333;">${formatDate(applicationDeadline)}</span>
            </div>
          </div>
          
          ${jobDescription ? `
          <div style="margin-top: 20px;">
            <strong style="color: #555;">Job Description:</strong>
            <p style="color: #666; margin: 10px 0; line-height: 1.5;">${jobDescription.substring(0, 200)}${jobDescription.length > 200 ? '...' : ''}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/student" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            View Job Details & Apply
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666;">
          <p><strong>What's next?</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Log in to your student dashboard to view complete job details</li>
            <li>Review the requirements and job description</li>
            <li>Apply directly through the portal before the deadline</li>
            <li>Track your application status in real-time</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⚡ Quick Tip:</strong> Apply early to increase your chances! Popular positions receive many applications within the first few hours of posting.
          </p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #888; margin: 10px 0;">
            Good luck with your application!<br>
            <strong>Placement Cell Team</strong>
          </p>
          
          <div style="margin-top: 20px; font-size: 12px; color: #aaa;">
            <p>
              You received this email because you're registered for job notifications.<br>
              <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe from job notifications</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email template for job posting notification
 * @param {Object} emailData - Email data containing job and student information
 * @returns {string} - Plain text email template
 */
export function generateJobPostingEmailText(emailData) {
  const {
    studentName,
    jobTitle,
    company,
    driveDate,
    salary,
    location,
    jobDescription,
    applicationDeadline,
    unsubscribeToken
  } = emailData;

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${(salary / 100000).toFixed(1)} LPA`;
    }
    return salary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(emailData.to)}`;

  return `
New Job Opportunity!

Dear ${studentName || 'Student'},

We're excited to inform you about a new job opportunity that matches your profile:

${jobTitle}
${company}

Job Details:
- Location: ${location || 'Not specified'}
- Salary: ${formatSalary(salary)}
- Drive Date: ${formatDate(driveDate)}
- Apply Before: ${formatDate(applicationDeadline)}

${jobDescription ? `Job Description:\n${jobDescription.substring(0, 300)}${jobDescription.length > 300 ? '...' : ''}\n\n` : ''}

What's next?
1. Log in to your student dashboard to view complete job details
2. Review the requirements and job description
3. Apply directly through the portal before the deadline
4. Track your application status in real-time

Apply now: ${window.location.origin}/student

Quick Tip: Apply early to increase your chances! Popular positions receive many applications within the first few hours of posting.

Good luck with your application!
Placement Cell Team

---
You received this email because you're registered for job notifications.
To unsubscribe: ${unsubscribeUrl}
  `;
}