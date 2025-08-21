import React from 'react';
import DashboardNavbar from './DashboardNavbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Horizontal Navbar */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <main className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
