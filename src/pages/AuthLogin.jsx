import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AuthLogin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = async (loggedInUser) => {
    const uid = loggedInUser?.uid || user?.uid;
    if (uid) {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        const role = snap.exists() ? snap.data()?.role : null;
        if (role === 'student') return navigate('/student', { replace: true });
        if (role === 'recruiter') return navigate('/recruiter', { replace: true });
        if (role === 'admin') return navigate('/admin', { replace: true });
      } catch {}
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Sign in</h1>
        <LoginForm onSuccess={handleSuccess} enableGoogle={false} />
        <div className="mt-4 text-sm flex justify-between">
          <Link className="text-blue-600" to="/register">Create account</Link>
          <Link className="text-blue-600" to="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}


