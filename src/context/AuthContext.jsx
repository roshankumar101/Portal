import React, { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'recruiter' | 'admin' | 'super_admin'
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // 'active' | 'pending' | 'rejected'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setEmailVerified(firebaseUser?.emailVerified || false);
      if (firebaseUser) {
        // Fetch role from Firestore: users/{uid} -> { role }
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log('User document data:', data);
            
            setRole(data.role || null);
            setUserStatus(data.status || 'active');
          } else {
            console.log('No user document found for UID:', firebaseUser.uid);
            setRole(null);
            setUserStatus(null);
          }
        } catch (e) {
          console.error('Failed to fetch user data', e);
          setRole(null);
          setUserStatus(null);
        }
      } else {
        setRole(null);
        setUserStatus(null);
        setEmailVerified(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Domain validation helper functions
  const validateEmailDomain = (email, role) => {
    const emailLower = email.toLowerCase();
    
    switch (role) {
      case 'student':
        // Allow multiple student domains
        return emailLower.endsWith('@pwioi.com') || 
               emailLower.endsWith('@student.pwioi.com') ||
               emailLower.endsWith('@gmail.com') || // For testing
               emailLower.includes('@'); // Basic email validation
      case 'admin':
        return true; // Any valid email allowed for admin
      case 'recruiter':
        return true; // Any valid email allowed
      default:
        return false;
    }
  };

  // Role-based login with domain validation
  const login = async (email, password, selectedRole) => {
    // Validate email domain
    if (!validateEmailDomain(email, selectedRole)) {
      const domainError = selectedRole === 'student' 
        ? 'Students must use @pwioi.com email address'
        : 'Invalid email domain';
      throw new Error(domainError);
    }

    try {
      // Authenticate with Firebase
      const res = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      // Create or update user document for all roles (simplified)
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: email,
        role: selectedRole,
        status: 'active',
        createdAt: serverTimestamp(),
        emailVerified: firebaseUser.emailVerified
      });

      return { user: firebaseUser, role: selectedRole, status: 'active' };
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid credentials or unauthorized domain access.');
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
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
    
    // Send email verification
    await sendEmailVerification(firebaseUser);
    
    const normalizedRole = role ?? 'student';
    const base = {
      email,
      role: normalizedRole,
      profile,
      emailVerified: false,
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

  const resendEmailVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const checkEmailVerification = async () => {
    if (user) {
      await user.reload();
      setEmailVerified(user.emailVerified);
      
      // Update Firestore document if email is now verified
      if (user.emailVerified) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { emailVerified: true }, { merge: true });
      }
      
      return user.emailVerified;
    }
    return false;
  };

  // Admin management functions
  const getPendingAdminRequests = async () => {
    try {
      const requestsQuery = query(
        collection(db, 'admin_requests'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(requestsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      throw error;
    }
  };

  const approveAdminRequest = async (requestId, requestUid) => {
    try {
      // Update admin request status
      await updateDoc(doc(db, 'admin_requests', requestId), {
        status: 'approved',
        approvedBy: user.uid,
        approvedAt: serverTimestamp()
      });

      // Update user status to active
      await updateDoc(doc(db, 'users', requestUid), {
        status: 'active'
      });

      return true;
    } catch (error) {
      console.error('Error approving admin request:', error);
      throw error;
    }
  };

  const rejectAdminRequest = async (requestId, requestUid) => {
    try {
      // Update admin request status
      await updateDoc(doc(db, 'admin_requests', requestId), {
        status: 'rejected',
        rejectedBy: user.uid,
        rejectedAt: serverTimestamp()
      });

      // Update user status to rejected
      await updateDoc(doc(db, 'users', requestUid), {
        status: 'rejected'
      });

      return true;
    } catch (error) {
      console.error('Error rejecting admin request:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({ 
    user, 
    role, 
    userStatus,
    loading, 
    emailVerified, 
    login, 
    logout, 
    loginWithGoogle, 
    registerWithEmail, 
    resetPassword, 
    resendEmailVerification, 
    checkEmailVerification,
    getPendingAdminRequests,
    approveAdminRequest,
    rejectAdminRequest 
  }), [user, role, userStatus, loading, emailVerified]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}


