import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminPanel from '../admin/AdminPanel';

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Welcome {user?.email}</p>
      <div className="mt-6">
        <AdminPanel />
      </div>
    </div>
  );
}


