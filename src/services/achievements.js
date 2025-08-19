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

// Get all achievements for a student
export const getAchievements = async (studentId) => {
  try {
    const q = query(
      collection(db, 'achievements'), 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

// Add a new achievement
export const addAchievement = async (studentId, achievementData) => {
  try {
    const docRef = await addDoc(collection(db, 'achievements'), {
      studentId,
      title: achievementData.title,
      description: achievementData.description,
      hasCertificate: achievementData.hasCertificate || false,
      certificateUrl: achievementData.certificateUrl || null,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

// Update an existing achievement
export const updateAchievement = async (achievementId, achievementData) => {
  try {
    const achievementRef = doc(db, 'achievements', achievementId);
    await updateDoc(achievementRef, {
      title: achievementData.title,
      description: achievementData.description,
      hasCertificate: achievementData.hasCertificate,
      certificateUrl: achievementData.certificateUrl,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

// Delete an achievement
export const deleteAchievement = async (achievementId) => {
  try {
    await deleteDoc(doc(db, 'achievements', achievementId));
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};
