import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/dashboard/shared/AdminLayout';
import AdminHome from '../../components/dashboard/admin/AdminHome';
import CreateJob from '../../components/dashboard/admin/CreateJob';
import ManageJobs from '../../components/dashboard/admin/ManageJobs';
import { Home, FilePlus2, Briefcase, GripVertical } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarWidth, setSidebarWidth] = useState(15); // % width, 5-15 like student
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'createJob', label: 'Create Job', icon: FilePlus2 },
    { id: 'manageJobs', label: 'Manage Jobs', icon: Briefcase },
  ];

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const windowWidth = window.innerWidth;
    const newWidth = (e.clientX / windowWidth) * 100;
    const constrainedWidth = Math.min(Math.max(newWidth, 5), 15);
    setSidebarWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminHome />;
      case 'createJob':
        return <CreateJob onCreated={() => setActiveTab('manageJobs')} />;
      case 'manageJobs':
        return <ManageJobs />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <AdminLayout>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="bg-white border-r border-gray-200 min-h-[calc(100vh-5rem)]"
          style={{ width: `${sidebarWidth}%` }}
        >
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-all ${
                    activeTab === id
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Draggable handle */}
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center"
          title="Drag to resize"
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>

        {/* Main content */}
        <section className="flex-1 p-4">
          {renderContent()}
        </section>
      </div>
    </AdminLayout>
  );
}


