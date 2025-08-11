import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Inserted user's Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyD_EylJRZJ3G3TzJP7wzGFPO1hJYi5m5As',
  authDomain: 'placement-portal-e11ab.firebaseapp.com',
  projectId: 'placement-portal-e11ab',
  storageBucket: 'placement-portal-e11ab.firebasestorage.app',
  messagingSenderId: '632561052922',
  appId: '1:632561052922:web:beee4a92f275925b65ad43',
  measurementId: 'G-MNTWBF748M',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;


