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

// Get all projects for a student
export const getProjects = async (studentId) => {
  try {
    const q = query(
      collection(db, 'projects'), 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Add a new project
export const addProject = async (studentId, projectData) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      studentId,
      projectName: projectData.projectName,
      description: projectData.description,
      projectUrl: projectData.projectUrl,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      projectName: projectData.projectName,
      description: projectData.description,
      projectUrl: projectData.projectUrl,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
