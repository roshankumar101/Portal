import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import Preloader from './components/PreLoader'
import OurPartners from './components/OurPartners'
import PWIOIFooter from './components/Footer'
import PlacementTimeline from './components/PlacementTimeline'
import AdminSlider from './components/CareerService'
import RecruitersSection from './components/founder'
import Records from './components/Records'
import LoginModal from './components/LoginModal'
import NotificationModal from './components/Notification'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

// Landing page component
function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timelineAutoplay, setTimelineAutoplay] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const triggerTimelineAnimation = () => {
    setTimelineAutoplay(true);
    // Reset after animation completes
    setTimeout(() => setTimelineAutoplay(false), 3500);
  };

  const openModal = () => {
    setIsModalOpen(true);
    triggerTimelineAnimation();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <main className='w-full min-h-screen'>
          <Header onLoginOpen={openModal} />


          <NotificationModal />

          {/* Banner - Odd component #F2F0EA */}
          <div className='bg-[#f8f5e1]'>
            <Banner />
          </div>

          {/* WhyPw - Even component #A8D5E3 */}
          <div className='bg-[#f8f5e1]'>
            <WhyPw />
          </div>

          {/* OurPartners - Odd component #F2F0EA */}
          <div id="our-partners" className='bg-[#f8f5e1]'>
            <OurPartners />
          </div>

          {/* Records - Even component #A8D5E3 */}
          <div className='bg-[#F2F0D6]'>
            <Records onLoginOpen={openModal} />
          </div>

          {/* PlacementTimeline - #A8D5E3 background */}
          <div className='bg-[#f8f5e1]'>
            <PlacementTimeline autoplay={timelineAutoplay} />
          </div>

          <div className='bg-[#f8f5e1]'>
            <AdminSlider />
          </div>

          {/* FoundersSection - Even component #A8D5E3 */}
          <div className='bg-[#F2F0D6]'>
            <RecruitersSection />
          </div>

          {/* Footer - Odd component #F2F0EA */}
          <div>
            <PWIOIFooter />
          </div>
        </main>
      )}

      {/* LoginModal rendered at app level for proper centering */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowRoles={['student']} />}>
        <Route path="/student" element={<StudentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowRoles={['recruiter']} />}>
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;
