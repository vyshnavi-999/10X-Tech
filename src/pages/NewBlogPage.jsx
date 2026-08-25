import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import CenterExpandingGrid from '../components/CenterExpandingGrid';

const NewBlogPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[100svh] bg-black text-white selection:bg-[#512da8]/30 font-sans relative w-full flex flex-col overflow-x-hidden">
      
      {/* Global Noise Overlay */}
      <div className="bg-noise fixed pointer-events-none z-50"></div>

      {/* Fullscreen Digital Matrix Background */}
      <div className="absolute top-0 left-0 right-0 w-full h-[100svh] pointer-events-none z-0 overflow-hidden">
        <CenterExpandingGrid />
      </div>

      <div className="relative z-10 flex flex-col min-h-[90svh]">
        <Navbar openContactModal={() => setIsContactModalOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-grow pt-24 sm:pt-28 pb-16 sm:pb-20">
          
          {/* SECTION 1 — Blog Hero Section (Identical to existing Blog page) */}
          <section className="relative w-full mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-12 sm:pb-20 min-h-[50svh] sm:min-h-[75svh] flex flex-col justify-center items-center overflow-hidden border-b border-white/5">
            <div className="relative z-10 flex flex-col items-center max-w-[1360px] mx-auto w-full text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-[#0a0a0f] mb-6 shadow-[0_0_15px_rgba(81,45,168,0.15)]">
                <div className="w-2 h-2 rounded-full bg-[#512da8] animate-pulse"></div>
                <span className="text-[#ccc] text-xs sm:text-sm font-medium">Latest updates</span>
              </div>

              <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-4 sm:mb-6 max-w-4xl text-center px-2">
                BLOG
              </h1>
              
              <p className="text-[#888] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-light text-center px-4">
                Explore our research updates, engineering insights, technical guides, product development, and behind-the-scenes stories from what we’re building at 10X Technologies.
              </p>
            </div>
          </section>

          {/* New Content Section immediately after description */}
          <section className="relative z-20 w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-16">
            
            {/* 1. BUTTONS (Screenshot 4 Reference: 5 pill buttons, visible bright-purple active vs dark-purple inactive) */}
            <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-12 sm:mb-16 flex-wrap pb-2">
              {/* Button 1 (Active/Selected): Brighter purple/lavender fill, vibrant lavender border & purple glow */}
              <button 
                type="button"
                className="w-[76px] sm:w-[88px] h-[42px] sm:h-[46px] rounded-full border border-[#c084fc] bg-[#6d28d9] shadow-[0_0_24px_rgba(168,85,247,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] shrink-0 transition-all duration-300 pointer-events-auto cursor-default"
                aria-label="Category filter button active"
              />
              
              {/* Button 2: Noticeably wider width, visible dark purple/lavender fill, subtle purple border */}
              <button 
                type="button"
                className="w-[176px] sm:w-[204px] h-[42px] sm:h-[46px] rounded-full border border-[#5c3098]/75 bg-[#231245] hover:bg-[#2e1859] hover:border-[#8b5cf6]/80 transition-all duration-300 shrink-0 pointer-events-auto cursor-default shadow-[0_0_12px_rgba(81,45,168,0.12)]"
                aria-label="Category filter button"
              />
              
              {/* Button 3: Medium width, visible dark purple/lavender fill */}
              <button 
                type="button"
                className="w-[116px] sm:w-[134px] h-[42px] sm:h-[46px] rounded-full border border-[#5c3098]/75 bg-[#231245] hover:bg-[#2e1859] hover:border-[#8b5cf6]/80 transition-all duration-300 shrink-0 pointer-events-auto cursor-default shadow-[0_0_12px_rgba(81,45,168,0.12)]"
                aria-label="Category filter button"
              />

              {/* Button 4: Medium width, visible dark purple/lavender fill */}
              <button 
                type="button"
                className="w-[102px] sm:w-[118px] h-[42px] sm:h-[46px] rounded-full border border-[#5c3098]/75 bg-[#231245] hover:bg-[#2e1859] hover:border-[#8b5cf6]/80 transition-all duration-300 shrink-0 pointer-events-auto cursor-default shadow-[0_0_12px_rgba(81,45,168,0.12)]"
                aria-label="Category filter button"
              />

              {/* Button 5: Medium width, visible dark purple/lavender fill */}
              <button 
                type="button"
                className="w-[118px] sm:w-[138px] h-[42px] sm:h-[46px] rounded-full border border-[#5c3098]/75 bg-[#231245] hover:bg-[#2e1859] hover:border-[#8b5cf6]/80 transition-all duration-300 shrink-0 pointer-events-auto cursor-default shadow-[0_0_12px_rgba(81,45,168,0.12)]"
                aria-label="Category filter button"
              />
            </div>

            {/* 2. CARDS (Screenshot 5 Reference Layout: 1 Large Left Card + 2 Horizontal Stacked Right Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              
              {/* LEFT: One Large Featured Card */}
              <div 
                className="group flex flex-col justify-between rounded-[24px] overflow-hidden border border-white/[0.15] hover:border-purple-500/40 bg-[#07070b]/60 p-4 sm:p-6 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.6)] h-full"
                aria-hidden="true"
              >
                {/* Large Empty Image Area */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-[18px] overflow-hidden mb-5 sm:mb-6 border border-white/[0.12] group-hover:border-purple-500/30 bg-[#040407] transition-all duration-500 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent"></div>
                </div>

                {/* Empty Content Area Below Image */}
                <div className="w-full flex-1 min-h-[120px] sm:min-h-[140px] rounded-[14px] border border-white/[0.08] bg-white/[0.01]"></div>
              </div>

              {/* RIGHT: Two Smaller Cards Stacked Vertically (Horizontal Layout: Image Left, Content Right) */}
              <div className="flex flex-col gap-6 sm:gap-8 h-full justify-between">
                
                {/* Right Card 1 */}
                <div 
                  className="group flex flex-col sm:flex-row rounded-[24px] overflow-hidden border border-white/[0.15] hover:border-purple-500/40 bg-[#07070b]/60 p-4 sm:p-5 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.6)] gap-4 sm:gap-5 flex-1 items-stretch"
                  aria-hidden="true"
                >
                  {/* Empty Image Area on Left */}
                  <div className="w-full sm:w-[42%] sm:min-w-[170px] aspect-[16/10] sm:aspect-square md:aspect-[4/3] rounded-[18px] overflow-hidden border border-white/[0.12] group-hover:border-purple-500/30 bg-[#040407] shrink-0 transition-all duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent"></div>
                  </div>

                  {/* Empty Content Area on Right */}
                  <div className="flex-1 w-full min-h-[100px] rounded-[14px] border border-white/[0.08] bg-white/[0.01]"></div>
                </div>

                {/* Right Card 2 */}
                <div 
                  className="group flex flex-col sm:flex-row rounded-[24px] overflow-hidden border border-white/[0.15] hover:border-purple-500/40 bg-[#07070b]/60 p-4 sm:p-5 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.6)] gap-4 sm:gap-5 flex-1 items-stretch"
                  aria-hidden="true"
                >
                  {/* Empty Image Area on Left */}
                  <div className="w-full sm:w-[42%] sm:min-w-[170px] aspect-[16/10] sm:aspect-square md:aspect-[4/3] rounded-[18px] overflow-hidden border border-white/[0.12] group-hover:border-purple-500/30 bg-[#040407] shrink-0 transition-all duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent"></div>
                  </div>

                  {/* Empty Content Area on Right */}
                  <div className="flex-1 w-full min-h-[100px] rounded-[14px] border border-white/[0.08] bg-white/[0.01]"></div>
                </div>

              </div>

            </div>
          </section>
          
        </main>
        
        {/* Footer */}
        <Footer openContactModal={() => setIsContactModalOpen(true)} hideCommunitySupport={true} hideWaitlist={true} hideSearchAndStatus={true} />
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default NewBlogPage;
