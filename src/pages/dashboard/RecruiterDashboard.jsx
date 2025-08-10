import React from 'react';
import { useAuth } from '../../context/AuthContext';
import RecruiterJobs from '../recruiter/RecruiterJobs';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
      <p className="mt-2">Welcome {user?.email}</p>
      <div className="mt-6">
        <RecruiterJobs />
      </div>
    </div>
  );
}


