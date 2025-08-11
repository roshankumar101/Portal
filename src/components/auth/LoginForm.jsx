import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm({ onSuccess, enableGoogle = false }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      onSuccess?.(loggedInUser);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      onSuccess?.(loggedInUser);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input className="w-full border px-3 py-2 rounded" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
      {enableGoogle && (
        <button type="button" onClick={handleGoogle} disabled={loading} className="w-full bg-white border mt-2 py-2 rounded disabled:opacity-60">{loading ? 'Please wait...' : 'Continue with Google'}</button>
      )}
    </form>
  );
}


