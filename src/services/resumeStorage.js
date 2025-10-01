import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

// Convert file to base64 for Firestore storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Upload resume file to Firebase Storage
const uploadResumeFile = async (userId, file) => {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed');
    if (file.size > 10 * 1024 * 1024) throw new Error('File size must be less than 10MB');

    const timestamp = Date.now();
    const storageRef = ref(storage, `resumes/${userId}/${timestamp}_${file.name}`);
    
    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Store metadata in Firestore
    const resumeData = {
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      uploadedAt: new Date(),
      timestamp
    };
    
    // Store in Firestore with the user's ID as the document ID
    const resumeDocRef = doc(db, 'resumes', userId);
    await setDoc(resumeDocRef, {
      ...resumeData,
      userId, // Ensure userId is set for security rules
      lastUpdated: new Date()
    });
    
    // Update user document
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      hasResume: true,
      resumeUrl: downloadURL,
      resumeFileName: file.name,
      resumeUploadedAt: new Date()
    }, { merge: true });

    return {
      url: downloadURL,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

// Delete resume file from both Storage and Firestore
const deleteResumeFile = async (userId) => {
  try {
    // Get resume document using the user's ID as the document ID
    const resumeDocRef = doc(db, 'resumes', userId);
    const resumeDoc = await getDoc(resumeDocRef);
    
    if (resumeDoc.exists()) {
      const resumeData = resumeDoc.data();
      
      // Delete from Storage if path exists
      if (resumeData.storagePath) {
        try {
          const fileRef = ref(storage, resumeData.storagePath);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting storage file:', error);
          // Continue with Firestore deletion even if storage delete fails
        }
      }
      
      // Delete from Firestore
      await deleteDoc(resumeDocRef);
    }
    
    // Update user document
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      hasResume: false,
      resumeUrl: null,
      resumeFileName: null,
      resumeUploadedAt: null
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw new Error('Failed to delete resume. Please try again.');
  }
};

// Get resume information
const getResumeInfo = async (userId) => {
  try {
    const resumeDocRef = doc(db, 'resumes', userId);
    const resumeDoc = await getDoc(resumeDocRef);
    
    if (resumeDoc.exists()) {
      const resumeData = resumeDoc.data();
      return {
        url: resumeData.url,
        fileName: resumeData.fileName,
        fileSize: resumeData.fileSize,
        uploadedAt: resumeData.uploadedAt?.toDate() || new Date(),
        hasResume: true,
        fileType: resumeData.fileType || 'application/pdf',
        storagePath: resumeData.storagePath
      };
    }
    
    // Fallback to user document if resume document doesn't exist
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.hasResume && userData.resumeUrl) {
        return {
          url: userData.resumeUrl,
          fileName: userData.resumeFileName || 'resume.pdf',
          fileSize: userData.resumeFileSize || 0,
          uploadedAt: userData.resumeUploadedAt?.toDate() || new Date(),
          hasResume: true,
          fileType: userData.resumeFileType || 'application/pdf'
        };
      }
    }
    
    return {
      url: null,
      fileName: null,
      fileSize: null,
      uploadedAt: null,
      hasResume: false,
      fileType: null
    };
  } catch (error) {
    console.error('Error getting resume info:', error);
    return {
      url: null,
      fileName: null,
      fileSize: null,
      uploadedAt: null,
      hasResume: false,
      fileType: null
    };
  }
};

// Get resume data for display
const getResumeData = async (userId) => {
  try {
    const resumeDocRef = doc(db, 'resumes', `${userId}_resume`);
    const resumeDoc = await getDoc(resumeDocRef);
    
    if (resumeDoc.exists()) {
      const data = resumeDoc.data();
      return data.url; // Return the public URL
    }
    
    // Fallback to user document
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().resumeUrl) {
      return userDoc.data().resumeUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting resume data:', error);
    return null;
  }
};

// Validate resume file
const validateResumeFile = (file) => {
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
const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export {
  uploadResumeFile,
  deleteResumeFile,
  getResumeInfo,
  getResumeData,
  formatFileSize
};
