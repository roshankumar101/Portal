import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import MasonryStats from './components/stats'
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
  const [loginType, setLoginType] = useState('Student')

  const triggerTimelineAnimation = () => {
    setTimelineAutoplay(true);
    // Reset after animation completes
    setTimeout(() => setTimelineAutoplay(false), 3500);
  };

  const openModal = (type = 'Student') => {
    setLoginType(type);
    setIsModalOpen(true);
    triggerTimelineAnimation();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Focus on company name input after scroll
      setTimeout(() => {
        const companyInput = document.querySelector('input[name="name"]');
        if (companyInput) {
          companyInput.focus();
        }
      }, 1000); // Wait for scroll to complete
    }
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <main className='w-full min-h-screen'>

          <NotificationModal />

          <Header onLoginOpen={openModal} />

          {/* Banner - Odd component #F2F0EA */}
          <div className='bg-gradient-to-b from-gray-50 to-[#FFEECE]'>
            <Banner />
          </div>

          {/* WhyPw - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <WhyPw />
          </div>

          {/* Stats - comes under WhyPw, before OurPartners */}
          <div className='bg-[#FFEECE]'>
            <MasonryStats />
          </div>

          {/* OurPartners - Odd component #F2F0EA */}
          <div id="our-partners" className='bg-[#FFEECE]'>
            <OurPartners />
          </div>

          {/* Records - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <Records onLoginOpen={openModal} />
          </div>

          {/* PlacementTimeline - #A8D5E3 background */}
          <div className='bg-[#FFEECE]'>
            <PlacementTimeline autoplay={timelineAutoplay} />
          </div>


          <div className='bg-[#FFEECE] py-10'>
            <AdminSlider />
          </div>

          {/* FoundersSection - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <RecruitersSection />
          </div>

          <div className='bg-[#FFEECE]'>
            <PlacementFAQ />
          </div>


          {/* Footer - Odd component #F2F0EA */}
          <div>
            <PWIOIFooter onLoginOpen={openModal} onContactTeam={scrollToContact} />
          </div>
        </main>
      )}

      {/* LoginModal rendered at app level for proper centering */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} defaultRole={loginType} />
    </>
  )
}

export default App;
