import React from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import AuthForgot from './pages/AuthForgot';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthLogin />} />
      <Route path="/register" element={<AuthRegister />} />
      <Route path="/forgot" element={<AuthForgot />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route element={<ProtectedRoute allowRoles={["student"]} />}> 
        <Route path="/student" element={<StudentDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowRoles={["recruiter"]} />}> 
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowRoles={["admin"]} />}> 
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App;
