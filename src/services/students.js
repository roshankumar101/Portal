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
  limit,
  serverTimestamp
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
    
    // Normalize URLs
    const normalizedData = { ...profileData };
    const urlFields = ['linkedin', 'githubUrl', 'youtubeUrl', 'leetcode', 'codeforces', 'gfg', 'hackerrank'];
    
    urlFields.forEach(field => {
      if (normalizedData[field] && !normalizedData[field].startsWith('http')) {
        normalizedData[field] = 'https://' + normalizedData[field];
      }
    });
    
    // Normalize email to lowercase
    if (normalizedData.email) {
      normalizedData.email = normalizedData.email.toLowerCase();
    }
    
    await updateDoc(docRef, {
      ...normalizedData,
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
    
    // Normalize URLs
    const normalizedData = { ...profileData };
    const urlFields = ['linkedin', 'githubUrl', 'youtubeUrl', 'leetcode', 'codeforces', 'gfg', 'hackerrank'];
    
    urlFields.forEach(field => {
      if (normalizedData[field] && !normalizedData[field].startsWith('http')) {
        normalizedData[field] = 'https://' + normalizedData[field];
      }
    });
    
    // Normalize email to lowercase
    if (normalizedData.email) {
      normalizedData.email = normalizedData.email.toLowerCase();
    }
    
    await setDoc(docRef, {
      uid: studentId,
      ...normalizedData,
      stats: { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 },
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

// Delete educational background
export const deleteEducationalBackground = async (educationId) => {
  try {
    console.log('Service: Attempting to delete education with ID:', educationId);
    await deleteDoc(doc(db, 'educational_background', educationId));
    console.log('Service: Successfully deleted education with ID:', educationId);
    return true;
  } catch (error) {
    console.error('Service: Error deleting educational background:', error);
    throw error;
  }
};

// Sync education entries with student profile
export const syncEducationWithProfile = async (studentId, educationEntries) => {
  try {
    // Get existing education records
    const existingEducation = await getEducationalBackground(studentId);
    
    // Delete all existing records
    const deletePromises = existingEducation.map(edu => 
      deleteEducationalBackground(edu.id)
    );
    await Promise.all(deletePromises);
    
    // Add new education entries
    const addPromises = educationEntries.map(entry => 
      addEducationalBackground({
        studentId,
        ...entry
      })
    );
    await Promise.all(addPromises);
    
    return true;
  } catch (error) {
    console.error('Error syncing education with profile:', error);
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

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ============ ACHIEVEMENTS & CERTIFICATIONS ============

// Get student achievements and certifications
export const getStudentAchievements = async (studentId) => {
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

// Add a new achievement or certification
export const addAchievement = async (achievementData) => {
  try {
    const docRef = await addDoc(collection(db, 'achievements'), {
      ...achievementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Achievement added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

// Update an achievement or certification
export const updateAchievement = async (achievementId, achievementData) => {
  try {
    await updateDoc(doc(db, 'achievements', achievementId), {
      ...achievementData,
      updatedAt: serverTimestamp()
    });
    console.log('Achievement updated successfully');
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

// Delete an achievement or certification
export const deleteAchievement = async (achievementId) => {
  try {
    await deleteDoc(doc(db, 'achievements', achievementId));
    console.log('Achievement deleted successfully');
  } catch (error) {
    console.error('Error deleting achievement:', error);
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

// Sync coding profiles with student profile
export const syncCodingProfilesWithProfile = async (studentId, profileData) => {
  try {
    const codingPlatforms = [
      { platform: 'linkedin', url: profileData.linkedin },
      { platform: 'github', url: profileData.githubUrl },
      { platform: 'youtube', url: profileData.youtubeUrl },
      { platform: 'leetcode', url: profileData.leetcode },
      { platform: 'codeforces', url: profileData.codeforces },
      { platform: 'geeksforgeeks', url: profileData.gfg },
      { platform: 'hackerrank', url: profileData.hackerrank }
    ];
    
    const syncPromises = codingPlatforms.map(async ({ platform, url }) => {
      if (url && url.trim()) {
        // Extract username from URL for supported platforms
        let username = '';
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;
          
          switch (platform) {
            case 'github':
              username = pathname.split('/')[1] || '';
              break;
            case 'linkedin':
              username = pathname.split('/in/')[1] || pathname.split('/')[1] || '';
              break;
            case 'leetcode':
              username = pathname.split('/u/')[1] || pathname.split('/')[1] || '';
              break;
            case 'codeforces':
              username = pathname.split('/profile/')[1] || '';
              break;
            case 'geeksforgeeks':
              username = pathname.split('/user/')[1] || '';
              break;
            case 'hackerrank':
              username = pathname.split('/profile/')[1] || '';
              break;
            default:
              username = pathname.split('/').pop() || '';
          }
        } catch (e) {
          // If URL parsing fails, use the full URL as username
          username = url;
        }
        
        return addOrUpdateCodingProfile({
          studentId,
          platform,
          profileUrl: url,
          username: username.replace('/', '')
        });
      }
      return null;
    });
    
    await Promise.all(syncPromises.filter(Boolean));
    return true;
  } catch (error) {
    console.error('Error syncing coding profiles:', error);
    throw error;
  }
};

// Complete profile update with all related data
export const updateCompleteStudentProfile = async (studentId, profileData, educationEntries = []) => {
  try {
    // Update main profile
    await updateStudentProfile(studentId, profileData);
    
    // Sync education entries
    if (educationEntries.length > 0) {
      await syncEducationWithProfile(studentId, educationEntries);
    }
    
    // Sync coding profiles
    await syncCodingProfilesWithProfile(studentId, profileData);
    
    return true;
  } catch (error) {
    console.error('Error updating complete student profile:', error);
    throw error;
  }
};

// Create complete student profile with all related data
export const createCompleteStudentProfile = async (studentId, profileData, educationEntries = []) => {
  try {
    // Create main profile
    await createStudentProfile(studentId, profileData);
    
    // Add education entries
    if (educationEntries.length > 0) {
      await syncEducationWithProfile(studentId, educationEntries);
    }
    
    // Add coding profiles
    await syncCodingProfilesWithProfile(studentId, profileData);
    
    return true;
  } catch (error) {
    console.error('Error creating complete student profile:', error);
    throw error;
  }
};
