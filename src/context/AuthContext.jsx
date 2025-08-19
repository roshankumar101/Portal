import React, { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'recruiter' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch role from Firestore: users/{uid} -> { role }
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log('User document data:', data);
            
            // Check if role exists, if not, infer from document structure
            let userRole = data.role;
            if (!userRole) {
              // Infer role based on existing fields
              if (data.cgpa !== undefined || data.rollNo !== undefined || data.department !== undefined) {
                userRole = 'student';
              } else if (data.company !== undefined || data.recruiterVerified !== undefined) {
                userRole = 'recruiter';
              } else {
                userRole = 'student'; // Default to student
              }
              console.log('Inferred role:', userRole);
            }
            setRole(userRole);
          } else {
            console.log('No user document found for UID:', firebaseUser.uid);
            setRole(null);
          }
        } catch (e) {
          console.error('Failed to fetch role', e);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    // Redirect to landing page after logout
    window.location.href = '/';
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const firebaseUser = res.user;
    // Ensure user doc exists
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: null,
        createdAt: serverTimestamp(),
      });
    }
    return firebaseUser;
  };

  const registerWithEmail = async ({ email, password, role, profile = {} }) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = res.user;
    const normalizedRole = role ?? 'student';
    const base = {
      email,
      role: normalizedRole,
      profile,
      createdAt: serverTimestamp(),
    };
    // Ensure recruiterVerified exists for recruiters
    const payload = normalizedRole === 'recruiter' ? { ...base, recruiterVerified: false } : base;
    await setDoc(doc(db, 'users', firebaseUser.uid), payload);
    return firebaseUser;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = useMemo(() => ({ user, role, loading, login, logout, loginWithGoogle, registerWithEmail, resetPassword }), [user, role, loading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}


