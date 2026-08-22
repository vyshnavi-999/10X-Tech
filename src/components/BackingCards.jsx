import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PartnerModal from './PartnerModal';

const BackingCards = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const backers = [
    {
      name: 'AWS | 10X Technologies',
      tagline: 'CLOUD INFRASTRUCTURE',
      heroImage: 'https://i.ibb.co/7xm7tHpW/10-X-AWS-Announcement.png',
      description: 'Leveraging AWS cloud infrastructure to scale multilingual AI research, optimize edge inference, and accelerate LUCA’s real-world deployment.',
      fullContent: (
        <>
          <span className="block mb-4">10X Technologies secured Amazon Web Services (AWS) Credits!</span>
          <span className="block mb-4">Compute has always been a constraint for us when building from the ground up and now that constraint just shifted.</span>
          <span className="block mb-4">We’re using our AWS credits to accelerate the development of LUCA ●● our on-device, multilingual AI system engineered for real hardware, not just the cloud. From training pipelines to inference optimization, this unlocks faster iteration across the entire stack. It also enables us to pursue deeper, world-class research across language, efficiency, and edge AI systems. All of which is being built and scaled on AWS infrastructure.</span>
          <span className="block mb-4">The focus remains unchanged: building efficient, edge-native intelligence that actually works in the real world.</span>
          <span className="block mb-4">Grateful to Amazon Web Services (AWS) for enabling this, and special thanks to MoreYeahs for facilitating it.</span>
          <span className="block">More coming.</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              to="/blog/1"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              Read in Blog
            </Link>
            <a 
              href="#"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              LinkedIn Post
            </a>
          </div>
        </>
      ),
      highlights: [],
      accentColor: '#ff9900',
      borderHover: 'hover:border-orange-400/30',
      gradientRgba: '255,153,0',
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
          alt="AWS Logo"
          decoding="async"
          loading="lazy"
          className="h-16 w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,153,0,0.8)]"
        />
      )
    },
    {
      name: 'MeitY | 10X Technologies',
      tagline: 'GOVERNMENT OF INDIA',
      heroImage: '/MeitY.jpg',
      description: 'We are backed by MeitY Startup Hub under the GENESIS program, marking the first institutional investment for 10X Technologies',
      fullContent: (
        <>
          <span className="block mb-4">Government of India (GoI) is now backing 10X Technologies 🇮🇳</span>
          <span className="block mb-4">I started working on this idea five years ago. Five years of showing up every single day. Without funding, without backing, without a single rupee ever flowing into the company.</span>
          <span className="block mb-4">Just conviction. Discipline. And loyalty to what this company was meant to become.</span>
          <span className="block mb-4">Today, that changes!</span>
          <span className="block mb-4">10X Technologies has been selected under EiR-2 of the MeitY GENESIS program and we are now officially backed by the Government of India (MeitY Startup Hub - Ministry of Electronics and Information Technology).</span>
          <span className="block mb-4">For the first time, our vision has moved from belief to institutional backing by MeitY Startup Hub. This is the first real validation. The first stepping stone. The first institutional funding we have ever received.</span>
          <span className="block mb-4">This support will directly fuel our vision of building the World’s 1st truly AI-powered smart speaker, designed from the ground up to feel natural, intelligent, and alive. With this funding, LUCA moves closer to reality from an idea carried for years, to a product that will be felt globally.</span>
          <span className="block">Grateful to the MeitY Startup Hub, Atal Incubation Centre, ALEAP WE-Hub and Dr. Y. Muralidhar Reddy for backing our journey at its foundation.</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              to="/blog/2"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              Read in Blog
            </Link>
            <a 
              href="#"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              LinkedIn Post
            </a>
          </div>
        </>
      ),
      highlights: [],
      accentColor: '#1e90ff',
      borderHover: 'hover:border-blue-500/30',
      gradientRgba: '30,144,255',
      logo: (
        <img
          src={`${import.meta.env.BASE_URL}govt of india-remove.bg.png`}
          alt="Govt of India"
          decoding="async"
          loading="lazy"
          className="h-16 md:h-20 w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(30,144,255,0.8)]"
        />
      )
    },
    {
      name: 'NVIDIA | 10X Technologies',
      tagline: 'INCEPTION PROGRAM',
      heroImage: '/nvidia.png',
      description: 'Accepted into NVIDIA Inception to accelerate LUCA through advanced AI infrastructure, edge computing support, and hardware-level optimization.',
      fullContent: (
        <>
          <span className="block mb-4">10X Technologies is now part of NVIDIA Inception</span>
          <span className="block mb-4">From building with almost no compute… To being recognized by one of the most critical AI ecosystems in the world.</span>
          <span className="block mb-4">10X Technologies has been accepted into the NVIDIA Inception program. NVIDIA’s global initiative supporting startups pushing the boundaries of AI, edge computing, and accelerated systems.</span>
          <span className="block mb-4">This is a strong validation of the direction we are taking. We are building LUCA ●● an on-device, multilingual AI system designed to run efficiently on real hardware, not just in the cloud. From tokenizer to model architecture to system integration, everything is being built from the ground up to enable faster, more natural, and more cost-efficient intelligence.</span>
          <span className="block mb-4">The future of AI will not be purely cloud-based. It will be edge-native, efficient, and deeply integrated into everyday devices. This is exactly where we are building.</span>
          <span className="block mb-4">As a member of NVIDIA Inception program, we now have direct access to the ecosystem, tools, and support to move faster toward making LUCA a reality at scale.</span>
          <span className="block">More coming!</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              to="/blog/3"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              Read in Blog
            </Link>
            <a 
              href="#"
              className="text-btn-secondary px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 text-center flex items-center justify-center flex-1 sm:flex-none"
            >
              LinkedIn Post
            </a>
          </div>
        </>
      ),
      highlights: [],
      accentColor: '#76b900',
      borderHover: 'hover:border-[#76b900]/30',
      gradientRgba: '118,185,0',
      logo: (
        <img
          src={`${import.meta.env.BASE_URL}nvidia-remove.bg.png`}
          alt="NVIDIA Logo"
          decoding="async"
          loading="lazy"
          className="h-16 md:h-24 w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(118,185,0,0.8)] scale-[1.6]"
        />
      )
    }
  ];

  return (
    <>
    <section className="relative z-20 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-4 lg:py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {backers.map((backer, i) => (
          <div 
            key={i} 
            className={`relative h-full flex flex-col rounded-[28px] p-5 sm:p-6 overflow-hidden border border-white/[0.05] bg-white/[0.01] backdrop-blur-md ${backer.borderHover} transition-all duration-500 group`}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, rgba(${backer.gradientRgba},0.05) 0%, transparent 70%)` }}
            />
            <div className="relative z-10 h-24 flex items-center justify-center mb-6">
              {backer.logo}
            </div>
            <div className="relative z-10 flex flex-col items-center text-center flex-1">
              <span className="text-tagline-02 text-purple-400 uppercase mb-3">{backer.tagline}</span>
              <h3 className="text-[1.05rem] lg:text-[1.15rem] xl:text-[1.35rem] font-semibold text-white tracking-tight mb-4 w-full">{backer.name}</h3>
              <p className="text-[0.95rem] text-[#A0A0A0] leading-[1.7] mb-6 w-full max-w-[300px] mx-auto">{backer.description}</p>
              <button
                onClick={() => openModal(backer)}
                className="text-btn-secondary mt-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300 group/btn"
              >
                <span>Read more</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
    <PartnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} partner={selectedPartner} />
    </>
  );
};

export default BackingCards;
