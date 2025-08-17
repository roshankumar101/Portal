import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

// Get student profile
export const getStudentProfile = async (studentId) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting student profile:', error);
    throw error;
  }
};

// Update student profile
export const updateStudentProfile = async (studentId, profileData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
};

// Create student profile
export const createStudentProfile = async (studentId, profileData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    await setDoc(docRef, {
      uid: studentId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error creating student profile:', error);
    throw error;
  }
};

// Get student's educational background
export const getEducationalBackground = async (studentId) => {
  try {
    const q = query(
      collection(db, 'educational_background'),
      where('studentId', '==', studentId)
    );
    const querySnapshot = await getDocs(q);
    const education = [];
    
    querySnapshot.forEach((doc) => {
      education.push({ id: doc.id, ...doc.data() });
    });
    
    return education;
  } catch (error) {
    console.error('Error getting educational background:', error);
    throw error;
  }
};

// Add educational background
export const addEducationalBackground = async (educationData) => {
  try {
    const docRef = await addDoc(collection(db, 'educational_background'), {
      ...educationData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding educational background:', error);
    throw error;
  }
};

// Update educational background
export const updateEducationalBackground = async (educationId, educationData) => {
  try {
    const docRef = doc(db, 'educational_background', educationId);
    await updateDoc(docRef, {
      ...educationData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating educational background:', error);
    throw error;
  }
};

// Get student's skills
export const getStudentSkills = async (studentId) => {
  try {
    const q = query(
      collection(db, 'skills'),
      where('studentId', '==', studentId),
      orderBy('skillName')
    );
    const querySnapshot = await getDocs(q);
    const skills = [];
    
    querySnapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...doc.data() });
    });
    
    return skills;
  } catch (error) {
    console.error('Error getting student skills:', error);
    throw error;
  }
};

// Add or update skill
export const addOrUpdateSkill = async (skillData) => {
  try {
    // Check if skill already exists for this student
    const q = query(
      collection(db, 'skills'),
      where('studentId', '==', skillData.studentId),
      where('skillName', '==', skillData.skillName)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing skill
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'skills', existingDoc.id), {
        rating: skillData.rating,
        updatedAt: new Date()
      });
      return existingDoc.id;
    } else {
      // Add new skill
      const docRef = await addDoc(collection(db, 'skills'), {
        ...skillData,
        createdAt: new Date()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding/updating skill:', error);
    throw error;
  }
};

// Delete skill
export const deleteSkill = async (skillId) => {
  try {
    await deleteDoc(doc(db, 'skills', skillId));
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Get student's projects
export const getStudentProjects = async (studentId) => {
  try {
    const q = query(
      collection(db, 'projects'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting student projects:', error);
    throw error;
  }
};

// Add project
export const addProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (projectId, projectData) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get student's coding profiles
export const getCodingProfiles = async (studentId) => {
  try {
    const q = query(
      collection(db, 'coding_profiles'),
      where('studentId', '==', studentId)
    );
    const querySnapshot = await getDocs(q);
    const profiles = [];
    
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles;
  } catch (error) {
    console.error('Error getting coding profiles:', error);
    throw error;
  }
};

// Add or update coding profile
export const addOrUpdateCodingProfile = async (profileData) => {
  try {
    // Check if profile already exists for this student and platform
    const q = query(
      collection(db, 'coding_profiles'),
      where('studentId', '==', profileData.studentId),
      where('platform', '==', profileData.platform)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing profile
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'coding_profiles', existingDoc.id), {
        profileUrl: profileData.profileUrl,
        username: profileData.username,
        updatedAt: new Date()
      });
      return existingDoc.id;
    } else {
      // Add new profile
      const docRef = await addDoc(collection(db, 'coding_profiles'), {
        ...profileData,
        createdAt: new Date()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding/updating coding profile:', error);
    throw error;
  }
};

// Delete coding profile
export const deleteCodingProfile = async (profileId) => {
  try {
    await deleteDoc(doc(db, 'coding_profiles', profileId));
    return true;
  } catch (error) {
    console.error('Error deleting coding profile:', error);
    throw error;
  }
};
