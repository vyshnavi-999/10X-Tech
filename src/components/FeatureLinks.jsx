import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ShineBorder from './ShineBorder';

const FeatureLinks = ({ mode = 'all' }) => {
  const navigate = useNavigate();

  const allCards = [
    {
      category: 'Product',
      title: 'LUCA AI',
      description: 'Emotionally aware & OS integration. Interacts naturally, feels more like a companion than an AI device.',
      image: '/resolution changed luca ai  image.png',
      link: 'https://shesettipavankumarswamy-luca.hf.space/',
      buttonText: 'Try LUCA'
    },
    {
      category: 'Product',
      title: 'Try Our Foundation Models',
      description: "We're launching open access to our native models for fine-tuning, inferencing, and deployment.",
      image: '/resolution changed lfm image.png',
      link: 'https://huggingface.co/spaces/shesettipavankumarswamy/lif-v1',
      route: '/models',
      buttonText: 'Try Now'
    },
    {
      category: 'Developer',
      title: 'Advanced Tokenizer & APIs',
      description: 'The future belongs to models with architectures crafted, optimized, and deployed for focused, low-latency tasks.',
      image: '/resolution chnaged tokenization.png',
      link: 'https://shesettipavankumarswamy-lif-v1.hf.space',
      buttonText: 'Try Now'
    },
    {
      category: 'BLOG & RESEARCH UPDATES',
      title: 'Inside 10X Technologies & LUCA',
      description: 'Read our latest announcements, SOTA - Research updates, product breakthroughs, behind the scenes stories and get to know about our journey in Redefining Technology!',
      image: '/resolution changed reserach container.png',
      link: '/blog',
      buttonText: 'Blog',
      features: [
        "Custom OS architecture for SLM optimization",
        "Closed-loop fine-tuning infrastructure",
        "Native Telugu tokenizer integration"
      ]
    }
  ];

  const cards = mode === 'home'
    ? [allCards[3]]
    : mode === 'ai'
      ? allCards.slice(0, 3)
      : allCards;

  const handleTryClick = (e, card) => {
    e.preventDefault();
    if (!card.link || card.link === '#') return;
    if (card.route) {
      navigate(card.route);
    } else {
      navigate('/try', { state: { url: card.link, title: card.title } });
    }
  };

  return (
    <section id="research-blog" className="relative z-20 w-full max-w-[1360px] mx-auto px-6 py-8 lg:py-12">
        {mode === 'home' && (
          <div className="mb-6 text-left">
            <h2 className="text-tier-1"><span className="text-violet-drift-b" style={{ animationDelay: '7s' }}>Research & Blog</span></h2>
          </div>
        )}
        {mode === 'ai' && (
          <div className="mb-6 text-left">
            <h2 className="text-tier-1"><span className="text-violet-drift-c" style={{ animationDelay: '11s' }}>Explore our Tech</span></h2>
          </div>
        )}
        
        <div className="flex flex-col gap-10 lg:gap-16">
          {cards.map((card, i) => {
            // Calculate the original index to preserve alternating logic and card 4's unique style
            const originalIndex = allCards.findIndex(c => c.title === card.title);

            return (
              <div
                key={i}
                className={originalIndex === 3 ? "group relative overflow-hidden rounded-[32px] bg-white/[0.01] backdrop-blur-md border border-white/[0.05] group-hover:border-transparent transition-all duration-500" : "py-8"}
              >
                {originalIndex === 3 && (
                  <>
                    <ShineBorder 
                      borderWidth={1}
                      duration={8}
                      shineColor={['#a78bfa', '#c084fc']}
                      className="opacity-[0.12] group-hover:opacity-[0.85] transition-opacity duration-500 z-30"
                    />
                    {/* Internal Premium Glows */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(167,139,250,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 ${originalIndex === 3 ? 'gap-0 items-stretch' : 'gap-10 lg:gap-24 items-center'} relative z-10`}>
                  {/* Image Section */}
                  <div className={`relative ${originalIndex === 3 ? 'w-full h-full min-h-[250px] md:min-h-0 flex items-center justify-center' : 'aspect-[16/10] rounded-[24px] overflow-hidden group w-full bg-[#08080f] border border-white/[0.05] hover:border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500'} ${
                    (originalIndex === 3) ? 'md:order-1' : (originalIndex === 1) ? 'md:order-1 md:mr-auto' : 'md:order-2 md:ml-auto'
                  }`}
                  >
                    {/* Image with Smoother Fade Sync */}
                    <img
                      src={`${import.meta.env.BASE_URL}${card.image.startsWith('/') ? card.image.slice(1) : card.image}`}
                      alt={card.title}
                      decoding="async"
                      loading="lazy"
                      className={originalIndex === 3 ? "w-full h-full object-cover object-left opacity-100 relative z-10" : "w-full h-full transition-all duration-1000 opacity-80 group-hover:opacity-100 object-contain object-center relative z-10"}
                      style={originalIndex === 3 ? {
                        maskImage: 'linear-gradient(to right, black 95%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 95%, transparent 100%)'
                      } : {}}
                    />
                  </div>

                  {/* Text Content Section */}
                  <div className={`flex flex-col h-full justify-center ${
                    (originalIndex === 3) ? 'md:order-2 items-start text-left p-6 md:p-12' : (originalIndex === 1) ? 'md:order-2 items-start text-left md:pl-12 lg:pl-16' : 'md:order-1 items-start text-left md:pr-12 lg:pr-16'
                  }`}>
                    {originalIndex === 3 ? (
                      <div className="flex flex-col items-start w-full ml-0">
                        <span className="text-tagline-02 text-purple-400 uppercase mb-1 opacity-60">
                          {card.category}
                        </span>
                        <h2 className="text-tier-2 mb-4">
                          <span className="text-white">Inside 10X Technologies & <span className="text-violet-drift-b" style={{ animationDelay: '3s' }}>LUCA</span></span>
                        </h2>
                        <p className="text-[0.95rem] text-[#A0A0A0] leading-[1.7] w-full mb-6">
                          Read our latest announcements, SOTA - Research updates, product breakthroughs, behind the scenes stories and get to know about our journey in Redefining Technology! Discover how we are pushing the boundaries of edge AI and building efficient, multilingual systems from the ground up. Join us as we explore the future of intelligent hardware and scalable on-device communication.
                        </p>

                        <Link
                          to={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-btn-secondary inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white uppercase hover:bg-white hover:text-black transition-all duration-500 group/btn"
                        >
                          <span>{card.buttonText}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        <span className="text-tagline-02 text-[#888] uppercase mb-4">{card.category}</span>
                        <h2 className="text-tier-2">
                          {card.title}
                        </h2>
                        <p className="text-[0.95rem] text-[#A0A0A0] leading-[1.7] max-w-lg mb-6">
                          {card.description}
                        </p>

                        <button
                          onClick={(e) => handleTryClick(e, card)}
                          className="text-btn-secondary inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white uppercase hover:bg-white hover:text-black transition-all duration-500 group/btn"
                        >
                          <span>{card.buttonText}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
  );
};

export default FeatureLinks;
