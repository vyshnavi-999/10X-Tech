import React, { useState, useEffect, useCallback } from 'react';
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

// In-memory flag — resets on every full page reload/F5, survives SPA navigation.
// sessionStorage is intentionally NOT used: it persists across F5 within the same
// tab, which would prevent the intro from replaying on refresh (undesired).
let hasIntroPlayedInSession = false;

// Check if intro has already played in this in-memory JS session
const checkHasSeenIntro = () => hasIntroPlayedInSession;

// Mark intro as done so SPA navigation back to Home skips intro instantly
const markIntroDone = () => {
  hasIntroPlayedInSession = true;
};

const Home = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const alreadySeen = checkHasSeenIntro();

  // Phase states initialized according to whether intro already played
  const [isIntroVideoActive, setIsIntroVideoActive] = useState(!alreadySeen);
  const [hasStartedNavbar, setHasStartedNavbar] = useState(alreadySeen);
  const [isContentActive, setIsContentActive] = useState(alreadySeen);
  const [isLandingSequenceComplete, setIsLandingSequenceComplete] = useState(alreadySeen);

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

  const handleLogoComplete = useCallback(() => {
    markIntroDone();
    setIsContentActive(true);
    // Mark landing sequence complete after content settles (~1.2s)
    setTimeout(() => {
      setIsLandingSequenceComplete(true);
    }, 1200);
  }, []);

  return (
    <div className="min-h-[100svh] bg-black text-white selection:bg-purple-500/30 font-sans relative w-full flex flex-col">
      {/* Production Intro Video Portal - Plays ONLY on initial site entry */}
      {isIntroVideoActive && (
        <IntroVideo
          onDissolve={() => {
            markIntroDone();
            setHasStartedNavbar(true);
          }}
          onComplete={() => {
            markIntroDone();
            setIsIntroVideoActive(false);
          }}
        />
      )}

      {/* Global Noise Overlay */}
      <div className="bg-noise fixed pointer-events-none z-50"></div>

      {/* Top Navigation Bar - Enters first after pitch-black screen */}
      <Navbar 
        openContactModal={() => setIsContactModalOpen(true)} 
        isLandingActive={!isLandingSequenceComplete}
        hasStartedNavbar={hasStartedNavbar}
        onLogoComplete={handleLogoComplete}
      />

      {/* Starfield Backdrop - Fades in together with homepage content */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1000px] w-full pointer-events-none z-0 overflow-hidden"
        style={{
          opacity: isContentActive ? 1 : 0,
          transition: isLandingSequenceComplete ? 'none' : 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Starfield />
      </div>

      {/* Homepage Content - STRICTLY HIDDEN until navbar logo sequence finishes */}
      <div
        className="w-full flex-1 flex flex-col relative z-10"
        style={{
          opacity: isContentActive ? 1 : 0,
          transition: isLandingSequenceComplete
            ? 'none'
            : 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isContentActive ? 'auto' : 'none',
        }}
      >
        {/* Main Content Container */}
        <div className="relative z-10">
          {/* Full Viewport Hero Screen: Navbar at top, Hero centered in middle, Logos at bottom */}
          <div className="min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-24 relative">
            <Hero 
              openContactModal={() => setIsContactModalOpen(true)} 
              isLandingActive={!isLandingSequenceComplete}
              isContentActive={isContentActive}
            />
            <Logos 
              isLandingActive={!isLandingSequenceComplete}
              isContentActive={isContentActive}
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
