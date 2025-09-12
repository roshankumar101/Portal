import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Convert file to base64 for Firestore storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Upload resume file using Firestore (base64 storage)
export const uploadResumeFile = async (userId, file) => {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed');
    if (file.size > 5 * 1024 * 1024) throw new Error('File size must be less than 5MB');

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    const timestamp = Date.now();
    
    // Store in Firestore instead of Storage
    const resumeDocRef = doc(db, 'resumes', `${userId}_${timestamp}`);
    await setDoc(resumeDocRef, {
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      base64Data,
      uploadedAt: new Date(),
      timestamp
    });

    // Update user profile with resume reference
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      resumeId: `${userId}_${timestamp}`,
      resumeFileName: file.name,
      resumeUploadedAt: new Date(),
      hasResume: true
    }, { merge: true });

    return {
      url: `firestore://${userId}_${timestamp}`, // Custom URL format
      fileName: file.name,
      size: file.size,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

// Delete resume file from Firestore
export const deleteResumeFile = async (userId) => {
  try {
    // Get user document to find resume ID
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Delete from resumes collection if resume ID exists
      if (userData.resumeId) {
        const resumeDocRef = doc(db, 'resumes', userData.resumeId);
        await setDoc(resumeDocRef, {}, { merge: false }); // Clear the document
      }

      // Update user document
      await setDoc(userDocRef, {
        resumeId: null,
        resumeFileName: null,
        resumeUploadedAt: null,
        hasResume: false
      }, { merge: true });
    }

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Get resume information
export const getResumeInfo = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        url: userData.resumeId ? `firestore://${userData.resumeId}` : null,
        fileName: userData.resumeFileName || null,
        uploadedAt: userData.resumeUploadedAt || null,
        hasResume: !!userData.resumeId
      };
    }
    
    return {
      url: null,
      fileName: null,
      uploadedAt: null,
      hasResume: false
    };
  } catch (error) {
    console.error('Error getting resume info:', error);
    throw error;
  }
};

// Get resume base64 data for display
export const getResumeData = async (resumeId) => {
  try {
    const resumeDocRef = doc(db, 'resumes', resumeId);
    const resumeDoc = await getDoc(resumeDocRef);
    
    if (resumeDoc.exists()) {
      const resumeData = resumeDoc.data();
      return resumeData.base64Data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting resume data:', error);
    throw error;
  }
};

// Create or update resume metadata
export const updateResumeMetadata = async (userId, metadata) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    const updateData = {
      ...metadata,
      resumeUpdatedAt: new Date()
    };

    if (userDoc.exists()) {
      await updateDoc(userDocRef, updateData);
    } else {
      await setDoc(userDocRef, updateData, { merge: true });
    }

    return true;
  } catch (error) {
    console.error('Error updating resume metadata:', error);
    throw error;
  }
};

// Validate resume file
export const validateResumeFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  if (file.type !== 'application/pdf') {
    errors.push('Only PDF files are allowed');
  }
  
  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size must be less than 10MB');
  }
  
  if (file.size < 1024) {
    errors.push('File appears to be too small');
  }
  
  return errors;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
