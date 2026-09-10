import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Logos from '../components/Logos';
import Team from '../components/Team';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import Starfield from '../components/Starfield';
import FeatureLinks from '../components/FeatureLinks';
import BackingCards from '../components/BackingCards';
import PageGateways from '../components/PageGateways';
import TechnicalFiller from '../components/TechnicalFiller';
import IntroVideo from '../components/IntroVideo';

const Home = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isIntroDissolving, setIsIntroDissolving] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-[100svh] bg-black text-white selection:bg-purple-500/30 font-sans relative w-full flex flex-col">
      {/* Production Intro Video Portal */}
      {!isIntroComplete && (
        <IntroVideo
          onDissolve={() => setIsIntroDissolving(true)}
          onComplete={() => setIsIntroComplete(true)}
        />
      )}

      {/* Global Noise Overlay */}
      <div className="bg-noise fixed pointer-events-none z-50"></div>

      {/* Homepage Content - Stable backdrop and base reveal */}
      <div
        className="w-full flex-1 flex flex-col relative z-10"
        style={{
          opacity: isIntroComplete || isIntroDissolving ? 1 : 0,
          transition: isIntroComplete
            ? 'none'
            : 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isIntroComplete ? 'auto' : 'none',
        }}
      >
        {/* Starfield */}
        <div className="absolute top-0 left-0 right-0 h-[1000px] w-full pointer-events-none z-0 overflow-hidden">
          <Starfield />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10">
          <Navbar 
            openContactModal={() => setIsContactModalOpen(true)} 
            isLandingActive={!isIntroComplete}
            isIntroDissolving={isIntroDissolving}
          />
        
          {/* Full Viewport Hero Screen: Navbar at top, Hero centered in middle, Logos at bottom */}
          <div className="min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-24 relative">
            <Hero 
              openContactModal={() => setIsContactModalOpen(true)} 
              isLandingActive={!isIntroComplete}
              isIntroDissolving={isIntroDissolving}
            />
            <Logos 
              isLandingActive={!isIntroComplete}
              isIntroDissolving={isIntroDissolving}
            />
          </div>

          <div className="relative z-20 w-full max-w-[1360px] mx-auto px-6 pt-12 sm:pt-16 pb-2 text-left">
            <h2 className="text-tier-1">Announcements</h2>
          </div>

          <BackingCards />
          <TechnicalFiller />

          <FeatureLinks mode="home" />
          <TechnicalFiller />

          <PageGateways />
          <TechnicalFiller />

          <Team />
          <TechnicalFiller />

          <Footer openContactModal={() => setIsContactModalOpen(true)} />
        </div>
      </div>

      {/* Global Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default Home;
