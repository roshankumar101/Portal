import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'resume_builder_data';

/**
 * Save resume data to Firestore
 * @param {string} userId - User ID
 * @param {object} resumeData - Resume data object
 * @returns {Promise<void>}
 */
export const saveResumeData = async (userId, resumeData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    
    const dataToSave = {
      ...resumeData,
      updatedAt: serverTimestamp(),
      userId: userId
    };

    // Check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, dataToSave);
    } else {
      // Create new document
      await setDoc(docRef, {
        ...dataToSave,
        createdAt: serverTimestamp()
      });
    }
    
    console.log('Resume data saved successfully');
  } catch (error) {
    console.error('Error saving resume data:', error);
    throw new Error('Failed to save resume data: ' + error.message);
  }
};

/**
 * Get resume data from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Resume data or null if not found
 */
export const getResumeData = async (userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove Firestore metadata
      const { createdAt, updatedAt, userId: docUserId, ...resumeData } = data;
      return resumeData;
    } else {
      console.log('No resume data found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting resume data:', error);
    throw new Error('Failed to load resume data: ' + error.message);
  }
};

/**
 * Delete resume data from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteResumeData = async (userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await deleteDoc(docRef);
    console.log('Resume data deleted successfully');
  } catch (error) {
    console.error('Error deleting resume data:', error);
    throw new Error('Failed to delete resume data: ' + error.message);
  }
};

/**
 * Check if user has resume data
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if user has resume data
 */
export const hasResumeData = async (userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking resume data:', error);
    return false;
  }
};

/**
 * Get resume metadata (without full content)
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Resume metadata or null if not found
 */
export const getResumeMetadata = async (userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        hasData: true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        personalName: data.personal?.fullName || 'Untitled Resume',
        sectionsCount: data.sections?.length || 0
      };
    } else {
      return {
        hasData: false,
        createdAt: null,
        updatedAt: null,
        personalName: null,
        sectionsCount: 0
      };
    }
  } catch (error) {
    console.error('Error getting resume metadata:', error);
    throw new Error('Failed to load resume metadata: ' + error.message);
  }
};

/**
 * Export resume data as JSON
 * @param {string} userId - User ID
 * @returns {Promise<string>} JSON string of resume data
 */
export const exportResumeData = async (userId) => {
  try {
    const resumeData = await getResumeData(userId);
    if (!resumeData) {
      throw new Error('No resume data found to export');
    }
    
    return JSON.stringify(resumeData, null, 2);
  } catch (error) {
    console.error('Error exporting resume data:', error);
    throw new Error('Failed to export resume data: ' + error.message);
  }
};

/**
 * Import resume data from JSON
 * @param {string} userId - User ID
 * @param {string} jsonData - JSON string of resume data
 * @returns {Promise<void>}
 */
export const importResumeData = async (userId, jsonData) => {
  try {
    const resumeData = JSON.parse(jsonData);
    
    // Validate basic structure
    if (!resumeData.personal || !resumeData.sections) {
      throw new Error('Invalid resume data format');
    }
    
    await saveResumeData(userId, resumeData);
    console.log('Resume data imported successfully');
  } catch (error) {
    console.error('Error importing resume data:', error);
    throw new Error('Failed to import resume data: ' + error.message);
  }
};

/**
 * Create a duplicate/template from existing resume
 * @param {string} sourceUserId - Source user ID
 * @param {string} targetUserId - Target user ID
 * @param {object} overrides - Data to override in the duplicate
 * @returns {Promise<void>}
 */
export const duplicateResumeData = async (sourceUserId, targetUserId, overrides = {}) => {
  try {
    const sourceData = await getResumeData(sourceUserId);
    if (!sourceData) {
      throw new Error('Source resume data not found');
    }
    
    // Clear personal information for privacy
    const duplicateData = {
      ...sourceData,
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: ''
      },
      ...overrides
    };
    
    await saveResumeData(targetUserId, duplicateData);
    console.log('Resume data duplicated successfully');
  } catch (error) {
    console.error('Error duplicating resume data:', error);
    throw new Error('Failed to duplicate resume data: ' + error.message);
  }
};

/**
 * Validate resume data structure
 * @param {object} resumeData - Resume data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateResumeData = (resumeData) => {
  const errors = [];
  
  // Check required structure
  if (!resumeData) {
    errors.push('Resume data is required');
    return { isValid: false, errors };
  }
  
  if (!resumeData.personal) {
    errors.push('Personal information is required');
  } else {
    if (!resumeData.personal.fullName?.trim()) {
      errors.push('Full name is required');
    }
    if (!resumeData.personal.email?.trim()) {
      errors.push('Email is required');
    }
  }
  
  if (!resumeData.sections || !Array.isArray(resumeData.sections)) {
    errors.push('Sections array is required');
  }
  
  if (!resumeData.settings) {
    errors.push('Settings are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get resume completion percentage
 * @param {object} resumeData - Resume data
 * @returns {number} Completion percentage (0-100)
 */
export const getResumeCompletionPercentage = (resumeData) => {
  if (!resumeData) return 0;
  
  let totalFields = 0;
  let completedFields = 0;
  
  // Personal information (7 fields, 3 required)
  const personal = resumeData.personal || {};
  const personalFields = ['fullName', 'email', 'phone', 'location', 'website', 'linkedin', 'github'];
  const requiredPersonalFields = ['fullName', 'email', 'phone'];
  
  personalFields.forEach(field => {
    totalFields++;
    if (personal[field]?.trim()) {
      completedFields++;
    }
  });
  
  // Professional summary
  totalFields++;
  if (resumeData.summary?.trim()) {
    completedFields++;
  }
  
  // Sections with items
  const sections = resumeData.sections || [];
  sections.forEach(section => {
    totalFields++;
    if (section.items && section.items.length > 0) {
      completedFields++;
    }
  });
  
  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};
