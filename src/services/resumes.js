import { doc, setDoc, updateDoc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getResumeDocRef = (uid, resumeId = 'default') => doc(db, 'users', uid, 'resumes', resumeId);

export const ensureResumeDoc = async (uid, resumeId = 'default') => {
  const ref = getResumeDocRef(uid, resumeId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      originalText: '',
      enhancedText: '',
      previewMode: 'original',
      updatedAt: serverTimestamp()
    });
  }
  return ref;
};

export const subscribeResume = (uid, resumeId = 'default', callback, error) => {
  const ref = getResumeDocRef(uid, resumeId);
  return onSnapshot(ref, callback, error);
};

export const upsertResume = async (uid, resumeId = 'default', partial) => {
  const ref = getResumeDocRef(uid, resumeId);
  try {
    await updateDoc(ref, {
      ...partial,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    // If doc doesn't exist yet, create it
    if (e.code === 'not-found') {
      await setDoc(ref, {
        originalText: '',
        enhancedText: '',
        previewMode: 'original',
        ...partial,
        updatedAt: serverTimestamp()
      });
    } else {
      throw e;
    }
  }
};

export const getResume = async (uid, resumeId = 'default') => {
  const ref = getResumeDocRef(uid, resumeId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
