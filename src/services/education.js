import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

// Get all educational background for a student
export const getEducationalBackground = async (studentId) => {
  try {
    const q = query(
      collection(db, 'educational_background'), 
      where('studentId', '==', studentId),
      orderBy('endYear', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching educational background:', error);
    throw error;
  }
};

// Add new educational background
export const addEducationalBackground = async (studentId, educationData) => {
  try {
    const docRef = await addDoc(collection(db, 'educational_background'), {
      studentId,
      instituteName: educationData.instituteName,
      degree: educationData.degree,
      fieldOfStudy: educationData.fieldOfStudy,
      startYear: educationData.startYear,
      endYear: educationData.endYear,
      percentage: educationData.percentage,
      cgpa: educationData.cgpa,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding educational background:', error);
    throw error;
  }
};

// Update existing educational background
export const updateEducationalBackground = async (educationId, educationData) => {
  try {
    const educationRef = doc(db, 'educational_background', educationId);
    await updateDoc(educationRef, {
      instituteName: educationData.instituteName,
      degree: educationData.degree,
      fieldOfStudy: educationData.fieldOfStudy,
      startYear: educationData.startYear,
      endYear: educationData.endYear,
      percentage: educationData.percentage,
      cgpa: educationData.cgpa,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating educational background:', error);
    throw error;
  }
};

// Delete educational background
export const deleteEducationalBackground = async (educationId) => {
  try {
    await deleteDoc(doc(db, 'educational_background', educationId));
  } catch (error) {
    console.error('Error deleting educational background:', error);
    throw error;
  }
};
