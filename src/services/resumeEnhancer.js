import { collection, doc, addDoc, getDocs, getDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { upsertResume } from './resumes';

// Get analyses collection reference
const getAnalysesRef = (uid, resumeId = 'default') => 
  collection(db, 'users', uid, 'resumes', resumeId, 'analyses');

// ATS-like scoring heuristics
const calculateATSScore = (resumeText, jobDescription) => {
  if (!resumeText || !jobDescription) return 0;

  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();
  
  let score = 0;
  const maxScore = 100;

  // Basic structure checks (30 points)
  const hasContact = /email|phone|@/.test(resume);
  const hasExperience = /experience|work|job|position|role/.test(resume);
  const hasSkills = /skills|technologies|tools/.test(resume);
  const hasEducation = /education|degree|university|college/.test(resume);
  
  if (hasContact) score += 8;
  if (hasExperience) score += 8;
  if (hasSkills) score += 7;
  if (hasEducation) score += 7;

  // Keyword matching (40 points)
  const jdWords = jd.match(/\b\w{3,}\b/g) || [];
  const uniqueJdWords = [...new Set(jdWords)];
  const importantWords = uniqueJdWords.filter(word => 
    !['the', 'and', 'for', 'with', 'you', 'will', 'are', 'have', 'this', 'that', 'from', 'they', 'been', 'their'].includes(word)
  );
  
  const matchedWords = importantWords.filter(word => resume.includes(word));
  const keywordScore = Math.min(40, (matchedWords.length / Math.max(importantWords.length, 1)) * 40);
  score += keywordScore;

  // Length and formatting (20 points)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 800) score += 10;
  if (resumeText.includes('\n') || resumeText.includes('•')) score += 5;
  if (/\d{4}/.test(resumeText)) score += 5; // Has years

  // Action words (10 points)
  const actionWords = ['managed', 'led', 'developed', 'created', 'implemented', 'designed', 'built', 'achieved', 'improved', 'optimized'];
  const hasActionWords = actionWords.some(word => resume.includes(word));
  if (hasActionWords) score += 10;

  return Math.min(maxScore, Math.round(score));
};

// Extract keywords
const extractKeywords = (resumeText, jobDescription) => {
  if (!resumeText || !jobDescription) return { matched: [], missing: [] };

  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();
  
  // Extract important words from job description
  const jdWords = jd.match(/\b\w{3,}\b/g) || [];
  const uniqueJdWords = [...new Set(jdWords)];
  const importantWords = uniqueJdWords.filter(word => 
    !['the', 'and', 'for', 'with', 'you', 'will', 'are', 'have', 'this', 'that', 'from', 'they', 'been', 'their', 'can', 'our', 'we', 'us', 'or', 'an', 'as', 'at', 'be', 'by', 'do', 'he', 'if', 'in', 'is', 'it', 'my', 'no', 'of', 'on', 'so', 'to', 'up', 'we'].includes(word)
  );

  const matched = importantWords.filter(word => resume.includes(word));
  const missing = importantWords.filter(word => !resume.includes(word)).slice(0, 10); // Limit to top 10

  return { matched, missing };
};

// Generate suggestions based on analysis
const generateSuggestions = (resumeText, jobDescription, keywords) => {
  const suggestions = [];
  
  if (!resumeText || resumeText.length < 100) {
    suggestions.push({
      id: 'length',
      section: 'Overall',
      title: 'Expand Resume Content',
      body: 'Your resume appears too short. Add more details about your experience, projects, and achievements.',
      applied: false
    });
  }

  if (keywords.missing.length > 0) {
    suggestions.push({
      id: 'keywords',
      section: 'Keywords',
      title: 'Add Missing Keywords',
      body: `Consider incorporating these relevant keywords: ${keywords.missing.slice(0, 5).join(', ')}`,
      applied: false
    });
  }

  if (!/\b(managed|led|developed|created|implemented|designed|built|achieved|improved|optimized)\b/i.test(resumeText)) {
    suggestions.push({
      id: 'action-words',
      section: 'Experience',
      title: 'Use Strong Action Words',
      body: 'Start bullet points with action words like "Developed", "Managed", "Led", "Implemented", "Achieved".',
      applied: false
    });
  }

  if (!/\d+%|\d+x|\$\d+|\d+\+/i.test(resumeText)) {
    suggestions.push({
      id: 'quantify',
      section: 'Experience',
      title: 'Quantify Achievements',
      body: 'Add numbers and metrics to demonstrate impact (e.g., "Increased efficiency by 25%", "Managed team of 5").',
      applied: false
    });
  }

  return suggestions;
};

// Main analysis function
export const analyzeResume = async (uid, resumeId = 'default', jobDescription) => {
  try {
    // Get current resume text
    const resumeDoc = await getDoc(doc(db, 'users', uid, 'resumes', resumeId));
    if (!resumeDoc.exists()) {
      throw new Error('Resume not found');
    }

    const resumeData = resumeDoc.data();
    const resumeText = resumeData.originalText || '';

    // Perform analysis
    const score = calculateATSScore(resumeText, jobDescription);
    const keywords = extractKeywords(resumeText, jobDescription);
    const suggestions = generateSuggestions(resumeText, jobDescription, keywords);

    // Save analysis to Firestore
    const analysisData = {
      createdAt: serverTimestamp(),
      jobDescription,
      score,
      keywords,
      suggestions,
      summary: `ATS Score: ${score}/100. Found ${keywords.matched.length} matching keywords, ${keywords.missing.length} missing keywords.`,
      meta: {
        version: '1.0',
        method: 'heuristic'
      }
    };

    const analysesRef = getAnalysesRef(uid, resumeId);
    const docRef = await addDoc(analysesRef, analysisData);

    return {
      id: docRef.id,
      ...analysisData
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};

// Get analysis by ID
export const getAnalysis = async (uid, resumeId = 'default', analysisId) => {
  try {
    const docRef = doc(db, 'users', uid, 'resumes', resumeId, 'analyses', analysisId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting analysis:', error);
    throw error;
  }
};

// List all analyses for a resume
export const listAnalyses = async (uid, resumeId = 'default') => {
  try {
    const analysesRef = getAnalysesRef(uid, resumeId);
    const q = query(analysesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error listing analyses:', error);
    throw error;
  }
};

// Apply suggestions to create enhanced resume
export const applySuggestions = async (uid, resumeId = 'default', analysisId, suggestionIds) => {
  try {
    // Get current resume and analysis
    const [resumeDoc, analysisDoc] = await Promise.all([
      getDoc(doc(db, 'users', uid, 'resumes', resumeId)),
      getDoc(doc(db, 'users', uid, 'resumes', resumeId, 'analyses', analysisId))
    ]);

    if (!resumeDoc.exists() || !analysisDoc.exists()) {
      throw new Error('Resume or analysis not found');
    }

    const resumeData = resumeDoc.data();
    const analysisData = analysisDoc.data();
    
    let enhancedText = resumeData.originalText || '';
    const updatedSuggestions = analysisData.suggestions.map(suggestion => {
      if (suggestionIds.includes(suggestion.id)) {
        // Apply basic enhancements based on suggestion type
        if (suggestion.id === 'keywords' && analysisData.keywords.missing.length > 0) {
          const keywordsToAdd = analysisData.keywords.missing.slice(0, 3);
          enhancedText += `\n\nRelevant Skills: ${keywordsToAdd.join(', ')}`;
        }
        
        if (suggestion.id === 'action-words') {
          enhancedText = enhancedText.replace(/\b(worked on|did|was responsible for)\b/gi, 'Developed');
        }

        return { ...suggestion, applied: true };
      }
      return suggestion;
    });

    // Update resume with enhanced text and switch to enhanced mode
    await upsertResume(uid, resumeId, {
      enhancedText,
      previewMode: 'enhanced',
      lastAppliedAnalysisId: analysisId
    });

    // Update analysis with applied suggestions
    await updateDoc(doc(db, 'users', uid, 'resumes', resumeId, 'analyses', analysisId), {
      suggestions: updatedSuggestions,
      updatedAt: serverTimestamp()
    });

    return { enhancedText, appliedSuggestions: suggestionIds };
  } catch (error) {
    console.error('Error applying suggestions:', error);
    throw error;
  }
};

// Reset to original resume
export const resetToOriginal = async (uid, resumeId = 'default') => {
  try {
    await upsertResume(uid, resumeId, {
      previewMode: 'original',
      lastAppliedAnalysisId: null
    });
  } catch (error) {
    console.error('Error resetting to original:', error);
    throw error;
  }
};
