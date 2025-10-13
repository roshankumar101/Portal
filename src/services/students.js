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
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';

// Generate unique ID for array items
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get student profile
export const getStudentProfile = async (studentId) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        // Ensure arrays exist with default empty arrays
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        achievements: data.achievements || [],
        certifications: data.certifications || [],
        // Ensure job tracking arrays exist
        availableJobs: data.availableJobs || [],
        appliedJobs: data.appliedJobs || [],
        viewedJobs: data.viewedJobs || []
      };
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
      // Initialize arrays for array-based storage
      education: [],
      skills: [],
      projects: [],
      achievements: [],
      certifications: [],
      // Initialize job tracking arrays
      availableJobs: [],
      appliedJobs: [],
      viewedJobs: [],
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

// Get all students for admin directory
export const getAllStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const students = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        id: doc.id,
        uid: data.uid,
        fullName: data.fullName || data.name || 'N/A',
        email: data.email || 'N/A',
        center: data.center || 'N/A',
        school: data.school || 'N/A',
        cgpa: data.cgpa || 'N/A',
        phone: data.phone || 'N/A',
        batch: data.batch || 'N/A',
        enrollmentId: data.enrollmentId || data.studentId || 'N/A',
        status: data.status || 'Active',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        stats: data.stats || { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 }
      });
    });
    
    // Sort by creation date (newest first)
    students.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA;
    });
    
    return students;
  } catch (error) {
    console.error('Error getting all students:', error);
    throw error;
  }
};

// Update student status (for blocking/unblocking)
export const updateStudentStatus = async (studentId, status, blockDetails = null) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (blockDetails) {
      updateData.blockDetails = {
        ...blockDetails,
        blockedAt: new Date()
      };
    }
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating student status:', error);
    throw error;
  }
};

// ============================================================================
// ARRAY-BASED STORAGE METHODS (New Implementation)
// ============================================================================

// EDUCATION ARRAY METHODS
export const addEducationArray = async (studentId, educationData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const newEducation = {
      id: generateUniqueId(),
      ...educationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, {
      education: arrayUnion(newEducation),
      updatedAt: new Date()
    });
    
    return newEducation.id;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

export const updateEducationArray = async (studentId, educationId, educationData) => {
  try {
    const profile = await getStudentProfile(studentId);
    const education = profile.education.find(edu => edu.id === educationId);
    
    if (!education) {
      throw new Error('Education entry not found');
    }
    
    const updatedEducation = {
      ...education,
      ...educationData,
      id: educationId,
      updatedAt: new Date()
    };
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      education: arrayRemove(education)
    });
    
    await updateDoc(docRef, {
      education: arrayUnion(updatedEducation),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

export const deleteEducationArray = async (studentId, educationId) => {
  try {
    const profile = await getStudentProfile(studentId);
    const education = profile.education.find(edu => edu.id === educationId);
    
    if (!education) {
      throw new Error('Education entry not found');
    }
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      education: arrayRemove(education),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// SKILLS ARRAY METHODS
export const addOrUpdateSkillArray = async (studentId, skillData) => {
  try {
    const profile = await getStudentProfile(studentId);
    const existingSkill = profile.skills.find(skill => 
      skill.skillName.toLowerCase() === skillData.skillName.toLowerCase()
    );
    
    const docRef = doc(db, 'students', studentId);
    
    if (existingSkill) {
      const updatedSkill = {
        ...existingSkill,
        rating: skillData.rating,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, {
        skills: arrayRemove(existingSkill)
      });
      
      await updateDoc(docRef, {
        skills: arrayUnion(updatedSkill),
        updatedAt: new Date()
      });
      
      return existingSkill.id;
    } else {
      const newSkill = {
        id: generateUniqueId(),
        ...skillData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, {
        skills: arrayUnion(newSkill),
        updatedAt: new Date()
      });
      
      return newSkill.id;
    }
  } catch (error) {
    console.error('Error adding/updating skill:', error);
    throw error;
  }
};

export const deleteSkillArray = async (studentId, skillId) => {
  try {
    const profile = await getStudentProfile(studentId);
    const skill = profile.skills.find(s => s.id === skillId);
    
    if (!skill) {
      throw new Error('Skill not found');
    }
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      skills: arrayRemove(skill),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// PROJECTS ARRAY METHODS
export const addProjectArray = async (studentId, projectData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const newProject = {
      id: generateUniqueId(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, {
      projects: arrayUnion(newProject),
      updatedAt: new Date()
    });
    
    return newProject.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProjectArray = async (studentId, projectId, projectData) => {
  try {
    const profile = await getStudentProfile(studentId);
    const project = profile.projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...project,
      ...projectData,
      id: projectId,
      updatedAt: new Date()
    };
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      projects: arrayRemove(project)
    });
    
    await updateDoc(docRef, {
      projects: arrayUnion(updatedProject),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProjectArray = async (studentId, projectId) => {
  try {
    const profile = await getStudentProfile(studentId);
    const project = profile.projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      projects: arrayRemove(project),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ACHIEVEMENTS ARRAY METHODS
export const addAchievementArray = async (studentId, achievementData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const arrayName = achievementData.hasCertificate ? 'certifications' : 'achievements';
    
    const newAchievement = {
      id: generateUniqueId(),
      ...achievementData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, {
      [arrayName]: arrayUnion(newAchievement),
      updatedAt: new Date()
    });
    
    return newAchievement.id;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

export const updateAchievementArray = async (studentId, achievementId, achievementData) => {
  try {
    const profile = await getStudentProfile(studentId);
    
    let achievement = profile.achievements.find(a => a.id === achievementId);
    let arrayName = 'achievements';
    
    if (!achievement) {
      achievement = profile.certifications.find(c => c.id === achievementId);
      arrayName = 'certifications';
    }
    
    if (!achievement) {
      throw new Error('Achievement not found');
    }
    
    const updatedAchievement = {
      ...achievement,
      ...achievementData,
      id: achievementId,
      updatedAt: new Date()
    };
    
    const newArrayName = achievementData.hasCertificate ? 'certifications' : 'achievements';
    
    const docRef = doc(db, 'students', studentId);
    
    await updateDoc(docRef, {
      [arrayName]: arrayRemove(achievement)
    });
    
    await updateDoc(docRef, {
      [newArrayName]: arrayUnion(updatedAchievement),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

export const deleteAchievementArray = async (studentId, achievementId) => {
  try {
    const profile = await getStudentProfile(studentId);
    
    let achievement = profile.achievements.find(a => a.id === achievementId);
    let arrayName = 'achievements';
    
    if (!achievement) {
      achievement = profile.certifications.find(c => c.id === achievementId);
      arrayName = 'certifications';
    }
    
    if (!achievement) {
      throw new Error('Achievement not found');
    }
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      [arrayName]: arrayRemove(achievement),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};

// ============================================================================
// JOB TRACKING ARRAY METHODS (New Implementation)
// ============================================================================

// Add job to student's available jobs list
export const addAvailableJob = async (studentId, jobData) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const jobEntry = {
      jobId: jobData.id,
      title: jobData.title || jobData.jobTitle,
      company: jobData.company || jobData.companyName,
      postedAt: new Date(),
      isNew: true,
      viewed: false
    };
    
    await updateDoc(docRef, {
      availableJobs: arrayUnion(jobEntry),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding available job:', error);
    throw error;
  }
};

// Add job to multiple students (bulk operation)
export const addJobToMultipleStudents = async (studentIds, jobData) => {
  try {
    const promises = studentIds.map(studentId => addAvailableJob(studentId, jobData));
    await Promise.all(promises);
    console.log(`Job ${jobData.id} added to ${studentIds.length} students`);
    return true;
  } catch (error) {
    console.error('Error adding job to multiple students:', error);
    throw error;
  }
};

// Mark job as viewed
export const markJobAsViewed = async (studentId, jobId) => {
  try {
    const profile = await getStudentProfile(studentId);
    const jobIndex = profile.availableJobs.findIndex(job => job.jobId === jobId);
    
    if (jobIndex !== -1) {
      const job = profile.availableJobs[jobIndex];
      const updatedJob = { ...job, viewed: true, isNew: false, viewedAt: new Date() };
      
      const docRef = doc(db, 'students', studentId);
      await updateDoc(docRef, {
        availableJobs: arrayRemove(job)
      });
      
      await updateDoc(docRef, {
        availableJobs: arrayUnion(updatedJob),
        viewedJobs: arrayUnion({
          jobId: jobId,
          viewedAt: new Date()
        }),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error marking job as viewed:', error);
    throw error;
  }
};

// Add job to applied jobs
export const addAppliedJob = async (studentId, jobId, applicationData = {}) => {
  try {
    const profile = await getStudentProfile(studentId);
    const availableJob = profile.availableJobs.find(job => job.jobId === jobId);
    
    const appliedJobEntry = {
      jobId: jobId,
      title: availableJob?.title || 'Unknown Job',
      company: availableJob?.company || 'Unknown Company',
      appliedAt: new Date(),
      status: 'applied',
      ...applicationData
    };
    
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      appliedJobs: arrayUnion(appliedJobEntry),
      updatedAt: new Date()
    });
    
    // Also mark as viewed if not already
    await markJobAsViewed(studentId, jobId);
    
    return true;
  } catch (error) {
    console.error('Error adding applied job:', error);
    throw error;
  }
};

// Remove job from available jobs (e.g., when job expires or is no longer relevant)
export const removeAvailableJob = async (studentId, jobId) => {
  try {
    const profile = await getStudentProfile(studentId);
    const job = profile.availableJobs.find(job => job.jobId === jobId);
    
    if (job) {
      const docRef = doc(db, 'students', studentId);
      await updateDoc(docRef, {
        availableJobs: arrayRemove(job),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error removing available job:', error);
    throw error;
  }
};

// Get student's job statistics
export const getStudentJobStats = async (studentId) => {
  try {
    const profile = await getStudentProfile(studentId);
    
    const stats = {
      availableJobs: profile.availableJobs.length,
      newJobs: profile.availableJobs.filter(job => job.isNew).length,
      viewedJobs: profile.viewedJobs.length,
      appliedJobs: profile.appliedJobs.length,
      totalJobsReceived: profile.availableJobs.length + profile.appliedJobs.length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting student job stats:', error);
    throw error;
  }
};