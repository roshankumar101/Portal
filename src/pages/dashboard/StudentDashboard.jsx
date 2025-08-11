import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <p className="mt-2">Welcome {user?.email}</p>
    </div>
  );
}


