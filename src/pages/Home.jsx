import React, { useState } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import WhyPw from '../components/WhyPw';
import Preloader from '../components/PreLoader';
import OurPartners from '../components/OurPartners';
import PWIOIFooter from '../components/Footer';
import PlacementTimeline from '../components/PlacementTimeline';
import RecruitersSection from '../components/founder';
import Records from '../components/Records';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [timelineAutoplay, setTimelineAutoplay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerTimelineAnimation = () => {
    setTimelineAutoplay(true);
    setTimeout(() => setTimelineAutoplay(false), 3500);
  };

  const openModal = () => {
    setIsModalOpen(true);
    triggerTimelineAnimation();
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <main className="w-full min-h-screen">
          <Header onLoginOpen={openModal} />
          <div className="bg-[#f8f5e1]"><Banner /></div>
          <div className="bg-[#f1f1ef]"><WhyPw /></div>
          <div id="our-partners" className="bg-[#FFFEFD]"><OurPartners /></div>
          <div className="bg-[#F2F0D6]"><Records onLoginOpen={openModal} /></div>
          <div className="bg-[#f1f1ef]"><PlacementTimeline autoplay={timelineAutoplay} /></div>
          <div className="bg-[#F2F0D6]"><RecruitersSection /></div>
          <div><PWIOIFooter /></div>
        </main>
      )}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}


