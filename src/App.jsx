import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import Preloader from './components/PreLoader'
import OurPartners from './components/OurPartners'
import PWIOIFooter from './components/Footer'
import PlacementTimeline from './components/PlacementTimeline'
import FoundersSection from './components/founder'
import Records from './components/Records'

function App() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [timelineAutoplay, setTimelineAutoplay] = useState(false)

  const triggerTimelineAnimation = () => {
    setTimelineAutoplay(true);
    // Reset after animation completes
    setTimeout(() => setTimelineAutoplay(false), 3500);
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <main className='w-full min-h-screen'>
          
          
          
          <Header onLoginOpen={triggerTimelineAnimation}/>
          
          {/* Banner - Photo display */}
          <Banner/>
          
          {/* WhyPw - Meteor gradient background */}
          <div className='relative overflow-hidden'
               style={{
                 background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
                 backgroundSize: '400% 400%',
                 animation: 'meteorShower 8s ease-in-out infinite'
               }}>
            <div className="absolute inset-0 opacity-20">
              {/* Shooting stars effect */}
              <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-32 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-40 right-1/4 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
            </div>
            <WhyPw/>
          </div>
          
          {/* OurPartners - Titan White background */}
          <div className='bg-[#DBD7F9]'>
            <OurPartners/>
          </div>
          
          {/* PlacementTimeline - Meteor gradient background */}
          <div className='relative overflow-hidden'
               style={{
                 background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
                 backgroundSize: '400% 400%',
                 animation: 'meteorShower 8s ease-in-out infinite'
               }}>
            <div className="absolute inset-0 opacity-20">
              {/* Shooting stars effect */}
              <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-32 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-40 right-1/4 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
            </div>
            <PlacementTimeline autoplay={timelineAutoplay}/>
          </div>
          
          {/* FoundersSection - Titan White background */}
          <div className='bg-[#DBD7F9]'>
            <FoundersSection/>
          </div>
          
          {/* Footer - Meteor gradient background */}
          <div className='relative overflow-hidden'
               style={{
                 background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
                 backgroundSize: '400% 400%',
                 animation: 'meteorShower 8s ease-in-out infinite'
               }}>
            <div className="absolute inset-0 opacity-20">
              {/* Shooting stars effect */}
              <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-32 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-40 right-1/4 w-1 h-1 bg-silver rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
            </div>
            <PWIOIFooter/>
          </div>

          <Records/>
        </main>
      )}
    </>
  )
}

export default App;
