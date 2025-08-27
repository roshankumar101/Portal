import React from 'react';
import { BarChart2, Briefcase, Users } from 'lucide-react';

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Jobs</p>
              <h3 className="text-2xl font-semibold">—</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 grid place-items-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <h3 className="text-2xl font-semibold">—</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 grid place-items-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Applications</p>
              <h3 className="text-2xl font-semibold">—</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-purple-50 text-purple-600 grid place-items-center">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome</h2>
        <p className="text-slate-600 text-sm">Use the sidebar to navigate between Dashboard, Create Job, and Manage Jobs.</p>
      </div>
    </div>
  );
}
