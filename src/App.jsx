import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import Preloader from './components/PreLoader'
import OurPartners from './components/OurPartners'
import PWIOIFooter from './components/Footer'
import PlacementTimeline from './components/PlacementTimeline'
import RecruitersSection from './components/founder'
import Records from './components/Records'
import LoginModal from './components/LoginModal'
import ScribbledText from './components/ScribbledText'

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
           <div className='bg-gradient-to-b from-[#F2F0EA] to-[#A8D5E5] to-80%'>
             <Banner/>
           </div>
            
           {/* WhyPw - Even component #A8D5E3 */}
           <div className='bg-gradient-to-b from-[#A8D5EA] from-0% via-[#F2F0EA] via-45% to-[#f1f1ef] to-90%'>
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
            <div className='bg-gradient-to-b from-[#f1f1ef] from-10% to-[#A8D5E5] to-30%'>
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
