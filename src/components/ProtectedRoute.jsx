import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ allowRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && Array.isArray(allowRoles) && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


