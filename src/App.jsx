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
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import Preloader from './components/PreLoader'
import OurPartners from './components/OurPartners'
import PWIOIFooter from './components/Footer'
import PlacementTimeline from './components/PlacementTimeline'
import RecruitersSection from './components/founder'
import Records from './components/Records'
import AdminSlider from './components/CareerService'
import PlacementFAQ from './components/FAQs'
import LoginModal from './components/LoginModal'
import cursor from './components/cursor'
import NotificationModal from './components/Notification'

function App() {
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
           <Header onLoginOpen={openModal}/>
           
           {/* Banner - Odd component #F2F0EA */}
           <div className='bg-[#f8f5e1]'>
             <Banner/>
           </div>
            
           {/* WhyPw - Even component #A8D5E3 */}
           <div className='bg-[#f1f1ef]'>
             <WhyPw/>
           </div>
            
           {/* OurPartners - Odd component #F2F0EA */}
           <div id="our-partners" className='bg-[#FFFEFD]'>
             <OurPartners/>
           </div>
            
           {/* Records - Even component #A8D5E3 */}
           <div className='bg-[#F2F0D6]'>
             <Records onLoginOpen={openModal}/>
           </div>
            
          {/* PlacementTimeline - #A8D5E3 background */}
            <div className='bg-[#f1f1ef]'>
              <PlacementTimeline autoplay={timelineAutoplay}/>
            </div>
            
           {/* FoundersSection - Even component #A8D5E3 */}
           <div className='bg-[#F2F0D6]'>
             <RecruitersSection/>
           </div>
            
           {/* Footer - Odd component #F2F0EA */}
           <div>
             <PWIOIFooter/>
           </div>
        </main>
      )}
      
      {/* LoginModal rendered at app level for proper centering */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default App;
