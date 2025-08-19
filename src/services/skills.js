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

// Get all skills for a student
export const getSkills = async (studentId) => {
  try {
    const q = query(
      collection(db, 'skills'), 
      where('studentId', '==', studentId),
      orderBy('skillName', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// Add a new skill
export const addSkill = async (studentId, skillData) => {
  try {
    const docRef = await addDoc(collection(db, 'skills'), {
      studentId,
      skillName: skillData.skillName,
      rating: skillData.rating,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

// Update an existing skill
export const updateSkill = async (skillId, skillData) => {
  try {
    const skillRef = doc(db, 'skills', skillId);
    await updateDoc(skillRef, {
      skillName: skillData.skillName,
      rating: skillData.rating,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

// Delete a skill
export const deleteSkill = async (skillId) => {
  try {
    await deleteDoc(doc(db, 'skills', skillId));
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};
