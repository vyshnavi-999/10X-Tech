import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SmartSpeakerHero from '../components/SmartSpeakerHero';
import ProductTabs from '../components/ProductTabs';
import ProductBento from '../components/ProductBento';
import LucaFeatureSection from '../components/LucaFeatureSection';
import ProductShowcase from '../components/ProductShowcase';
import TechnicalFiller from '../components/TechnicalFiller';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import Starfield from '../components/Starfield';

const ProductPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[100svh] bg-black text-white selection:bg-purple-500/30 font-sans relative w-full flex flex-col">
      <style>{`
        /* Scoped override to ensure no grid on product page */
        .bg-grid { display: none !important; }
        body { background-color: black !important; }
      `}</style>
      <div className="bg-noise fixed pointer-events-none z-50"></div>

      {/* Starfield */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] w-full pointer-events-none z-0 overflow-hidden">
        <Starfield />
      </div>


      <div className="relative z-10">
        <Navbar openContactModal={() => setIsContactModalOpen(true)} />
        
        <SmartSpeakerHero />
        {/* Spacer to replace TechnicalFiller height and margins without the dots */}
        <div className="w-full h-10 my-4 md:my-6 pointer-events-none" aria-hidden="true" />

        <ProductTabs />
        <TechnicalFiller />

        <ProductBento />
        <TechnicalFiller />

        <LucaFeatureSection openContactModal={() => setIsContactModalOpen(true)} />
        <TechnicalFiller />

        <ProductShowcase openContactModal={() => setIsContactModalOpen(true)} />
        
        {/* Elegant margin between Showcase and Footer */}
        <div className="w-full h-16 sm:h-24 bg-black pointer-events-none" aria-hidden="true" />

        <Footer minimal={true} openContactModal={() => setIsContactModalOpen(true)} />
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default ProductPage;
