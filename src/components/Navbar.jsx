import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ openContactModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBentoExpanded, setIsBentoExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleExpandEvent = (e) => {
      setIsBentoExpanded(!!e.detail.expanded);
    };

    window.addEventListener('luca-bento-expand', handleExpandEvent);
    return () => window.removeEventListener('luca-bento-expand', handleExpandEvent);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Backdrop when Mobile/Tablet Menu is open */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-xl transition-opacity duration-300 pointer-events-auto"
        />
      )}

      {/* GPU-Accelerated Fixed Navbar Wrapper */}
      <div 
        className={`fixed w-full z-50 flex flex-col items-center px-3 sm:px-4 lg:px-6 pointer-events-none top-4 sm:top-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isBentoExpanded ? '-translate-y-[200%] opacity-0' : 'translate-y-0'
        }`}
      >
        <div className="relative w-full max-w-[1360px] flex flex-col items-center">
          <nav className="relative w-full px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto rounded-full">
            
            {/* Transparent Glass Background with Animated Border */}
            <div className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none border rounded-full bg-[#050505]/40 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.5)] ${isScrolled ? 'border-white/[0.18]' : 'border-white/[0.08]'}`}></div>

            {/* Left Nav Area: Logo & Core Navigation Links */}
            <div className="relative z-10 flex items-center gap-4 lg:gap-8 min-w-0">
              <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center cursor-pointer group shrink-0">
                <img 
                  src="https://i.ibb.co/Y781ky06/Screenshot-2026-05-26-000916-removebg-preview.png"
                  alt="10X Technologies Logo"
                  className={`h-7 sm:h-8 lg:h-9 xl:h-10 w-auto object-contain transition-all duration-700 group-hover:scale-[1.02] ${
                    location.pathname === '/' ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] brightness-110' : 'opacity-90 hover:opacity-100'
                  }`}
                />
              </Link>
              
              {/* Desktop Navigation Links â€” Shown on lg (1024px+) viewports */}
              <div className="hidden lg:flex items-center gap-5 xl:gap-8 text-white/80 shrink-0">
                <Link 
                  to="/product" 
                  onClick={(e) => handleNavClick(e, '/product')} 
                  className={`whitespace-nowrap shrink-0 text-sm xl:text-[15px] font-medium transition-all duration-300 inline-flex items-center gap-1.5 ${
                    location.pathname === '/product' 
                      ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]' 
                      : 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]'
                  }`}
                >
                  <span>LUCA</span>
                  <span className="inline-flex items-center gap-[3.5px] mx-0.5" aria-hidden="true">
                    <span className="w-[5px] h-[5px] xl:w-[5.5px] xl:h-[5.5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] inline-block"></span>
                    <span className="w-[5px] h-[5px] xl:w-[5.5px] xl:h-[5.5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] inline-block"></span>
                  </span>
                  <span className="text-white/50 mx-0.5">|</span>
                  <span>Smart Speaker</span>
                </Link>
                <Link 
                  to="/ai" 
                  onClick={(e) => handleNavClick(e, '/ai')} 
                  className={`whitespace-nowrap shrink-0 text-sm xl:text-[15px] font-medium transition-all duration-300 ${
                    location.pathname === '/ai' 
                      ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]' 
                      : 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]'
                  }`}
                >
                  LFM
                </Link>
                <Link 
                  to="/models" 
                  onClick={(e) => handleNavClick(e, '/models')} 
                  className={`whitespace-nowrap shrink-0 text-sm xl:text-[15px] font-medium transition-all duration-300 ${
                    location.pathname === '/models' 
                      ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]' 
                      : 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]'
                  }`}
                >
                  Institutions
                </Link>
              </div>
            </div>
            
            {/* Desktop Right Nav Buttons (Blog & Contact Us) */}
            <div className="relative z-10 hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
              <button 
                onClick={() => {
                  if (location.pathname === '/blog') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/blog');
                  }
                }}
                className="whitespace-nowrap shrink-0 h-9 xl:h-10 px-5 xl:px-7 rounded-full border border-white/10 bg-white/5 text-white text-xs xl:text-sm font-bold tracking-wide hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                BLOG
              </button>
              <button 
                onClick={openContactModal}
                className="whitespace-nowrap shrink-0 h-9 xl:h-10 px-5 xl:px-6 rounded-full text-xs xl:text-sm font-bold bg-gradient-to-r from-[#512da8] to-[#4c1d95] border border-purple-500/30 text-white shadow-[0_4px_20px_rgba(81,45,168,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.5)] hover:border-purple-400/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <span className="relative z-10 whitespace-nowrap">Contact Us</span>
              </button>
            </div>

            {/* Mobile & Tablet Toggle Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="relative z-10 lg:hidden w-9 h-9 rounded-full text-[#A0A0A0] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </nav>

          {/* Integrated Floating Card Drawer (Positioned cleanly below header with zero overlap) */}
          <div className={`w-full max-w-[540px] mt-2.5 sm:mt-3 pointer-events-auto lg:hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top ${
            isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-3 pointer-events-none hidden'
          }`}>
            <div className="bg-[#07070a]/95 border border-white/[0.12] rounded-[28px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(81,45,168,0.2)] backdrop-blur-2xl">
              <div className="flex flex-col gap-1.5">
                {/* Nav Option 1: Smart Speaker */}
                <Link 
                  to="/product" 
                  onClick={(e) => handleNavClick(e, '/product')}
                  className={`group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/product' 
                      ? 'bg-[#512da8]/15 border border-[#a882ff]/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(81,45,168,0.15)]' 
                      : 'text-white/75 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      location.pathname === '/product' 
                        ? 'bg-[#a882ff] shadow-[0_0_8px_#a882ff]' 
                        : 'bg-white/20 group-hover:bg-white/50'
                    }`} />
                    <span className="text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap inline-flex items-center gap-1.5">
                      <span>LUCA</span>
                      <span className="inline-flex items-center gap-[3px] mx-0.5" aria-hidden="true">
                        <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] inline-block"></span>
                        <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] inline-block"></span>
                      </span>
                      <span className="text-white/50 mx-0.5">|</span>
                      <span>Smart Speaker</span>
                    </span>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 transition-all duration-200 ${
                    location.pathname === '/product'
                      ? 'text-[#a882ff]'
                      : 'text-white/25 group-hover:text-white/70 group-hover:translate-x-1'
                  }`} />
                </Link>

                {/* Nav Option 2: LFM */}
                <Link 
                  to="/ai" 
                  onClick={(e) => handleNavClick(e, '/ai')} 
                  className={`group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/ai' 
                      ? 'bg-[#512da8]/15 border border-[#a882ff]/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(81,45,168,0.15)]' 
                      : 'text-white/75 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      location.pathname === '/ai' 
                        ? 'bg-[#a882ff] shadow-[0_0_8px_#a882ff]' 
                        : 'bg-white/20 group-hover:bg-white/50'
                    }`} />
                    <span className="text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap">LFM</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 transition-all duration-200 ${
                    location.pathname === '/ai'
                      ? 'text-[#a882ff]'
                      : 'text-white/25 group-hover:text-white/70 group-hover:translate-x-1'
                  }`} />
                </Link>

                {/* Nav Option 2.5: Institutions */}
                <Link 
                  to="/models" 
                  onClick={(e) => handleNavClick(e, '/models')} 
                  className={`group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/models' 
                      ? 'bg-[#512da8]/15 border border-[#a882ff]/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(81,45,168,0.15)]' 
                      : 'text-white/75 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      location.pathname === '/models' 
                        ? 'bg-[#a882ff] shadow-[0_0_8px_#a882ff]' 
                        : 'bg-white/20 group-hover:bg-white/50'
                    }`} />
                    <span className="text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap">Institutions</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 transition-all duration-200 ${
                    location.pathname === '/models'
                      ? 'text-[#a882ff]'
                      : 'text-white/25 group-hover:text-white/70 group-hover:translate-x-1'
                  }`} />
                </Link>

                {/* Nav Option 3: Blog */}
                <Link 
                  to="/blog" 
                  onClick={(e) => handleNavClick(e, '/blog')}
                  className={`group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/blog' || location.pathname.startsWith('/blog/')
                      ? 'bg-[#512da8]/15 border border-[#a882ff]/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(81,45,168,0.15)]' 
                      : 'text-white/75 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      location.pathname === '/blog' || location.pathname.startsWith('/blog/')
                        ? 'bg-[#a882ff] shadow-[0_0_8px_#a882ff]' 
                        : 'bg-white/20 group-hover:bg-white/50'
                    }`} />
                    <span className="text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap">Blog</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 transition-all duration-200 ${
                    location.pathname === '/blog' || location.pathname.startsWith('/blog/')
                      ? 'text-[#a882ff]'
                      : 'text-white/25 group-hover:text-white/70 group-hover:translate-x-1'
                  }`} />
                </Link>

                {/* Divider */}
                <div className="my-1 border-t border-white/[0.08]" />

                {/* Nav Option 4: Contact Us CTA */}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (openContactModal) openContactModal();
                  }}
                  className="group/cta w-full py-3.5 px-5 rounded-2xl text-center font-semibold text-white text-sm sm:text-base bg-gradient-to-r from-[#512da8] to-[#4c1d95] border border-purple-500/40 shadow-[0_4px_20px_rgba(81,45,168,0.35)] hover:shadow-[0_4px_28px_rgba(124,58,237,0.5)] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 text-purple-300 group-hover/cta:translate-x-1 transition-transform shrink-0" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default Navbar;



