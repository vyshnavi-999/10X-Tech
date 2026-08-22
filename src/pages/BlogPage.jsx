import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import TechnicalFiller from '../components/TechnicalFiller';
import CenterExpandingGrid from '../components/CenterExpandingGrid';
import SlmGuideContent from '../data/slmGuideContent';

export const blogPosts = [
  // 3 Category Placeholders (At Top)
  {
    id: 'announcements',
    category: 'Announcements',
    title: 'Upcoming Announcement',
    coverText: 'ANNOUNCEMENTS',
    description: 'Stay tuned for official product announcements, press coverage, and partnership milestones.',
    date: 'Coming Soon',
    authorName: '10X Tech Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=10x1',
    content: (
      <>
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12 first:mt-0">Upcoming Announcement</h2>
        <p className="mb-6">
          Our team will be sharing key product announcements, strategic partnerships, and coverage from leading news and government organizations.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Key Highlights</h2>
        <p className="mb-6">
          Full details and media releases will be published here shortly once the official press materials are released.
        </p>
        
        <div className="my-14 p-6 rounded-[24px] bg-[#512da8]/10 border border-[#512da8]/30 shadow-[0_0_30px_rgba(81,45,168,0.1)]">
          <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed m-0 text-center">
            "Pioneering sovereign deep-tech solutions for local and global impact."
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Next Steps</h2>
        <p className="mb-6">
          Check back soon for the complete story and downloadable press releases.
        </p>
      </>
    )
  },
  {
    id: 'research',
    category: 'Research',
    title: 'Upcoming Research',
    coverText: 'RESEARCH',
    description: 'Deep-dives into sovereign AI model architectures, SLM optimizations, and indigenous tokenizer benchmarks.',
    date: 'Coming Soon',
    authorName: '10X R&D Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=10x2',
    content: (
      <>
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12 first:mt-0">Upcoming R&D Insights</h2>
        <p className="mb-6">
          Our R&D team is preparing technical papers on sovereign AI architectures, efficient small language models (SLMs), and native tokenization algorithms.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Architecture Overview</h2>
        <p className="mb-6">
          Detailed benchmarks, training methodologies, and hardware acceleration techniques will be documented in upcoming publications.
        </p>
        
        <div className="my-14 p-6 rounded-[24px] bg-[#512da8]/10 border border-[#512da8]/30 shadow-[0_0_30px_rgba(81,45,168,0.1)]">
          <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed m-0 text-center">
            "Advancing native language processing through targeted hardware and model codesign."
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Publication Roadmap</h2>
        <p className="mb-6">
          Full whitepapers and technical reports will be available for download here soon.
        </p>
      </>
    )
  },
  {
    id: 'guide',
    category: 'Guides',
    title: 'A Practical Guide to Small Language Models',
    displayTitle: (
      <>
        A Practical Guide to
        <br />
        Small Language Models
      </>
    ),
    image: '/quantum_funnel_4by3.png',
    heroBanner: '/quantum_funnel_16by9.png',
    imageFit: 'object-contain object-top bg-black',
    description: 'What small language models are, how they differ from general-purpose models, where they work, where they fail, and what it takes to build and deploy them.',
    date: '14 Aug 2026',
    authorName: 'Mani Bhavan',
    authorAvatar: '/manibhavan.jpg',
    content: <SlmGuideContent />
  },

  // Original Blog Posts (Preserved 100%)
  {
    id: '1',
    category: 'Announcements',
    title: 'AWS',
    image: 'https://i.ibb.co/7xm7tHpW/10-X-AWS-Announcement.png',
    imageBg: 'bg-[#050505]',
    imageFit: 'object-cover',
    imagePadding: 'p-0',
    date: 'Sep 6, 2025',
    authorName: 'John Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=1',
    content: (
      <>
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12 first:mt-0">Cloud Infrastructure</h2>
        <p className="mb-6">
          Leveraging AWS global cloud infrastructure for high-performance model training and secure, scalable deployment. Our infrastructure provides the backbone for secure data pipelines, model versioning, and the mission-critical APIs that developers rely on to access advanced AI models at scale.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">AI Deployment Scalability</h2>
        <p className="mb-6">
          With scalable inference endpoints via Amazon SageMaker, we ensure that our foundation models remain accessible worldwide with consistently low latency and high availability, even during unprecedented traffic spikes.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">High-Performance Training Systems</h2>
        <p className="mb-6">
          Our distributed model training on AWS EC2 P-series instances allows us to accelerate research and development significantly, pushing the boundaries of what's possible with our custom-built models.
        </p>
        
        <div className="my-14 p-6 rounded-[24px] bg-[#512da8]/10 border border-[#512da8]/30 shadow-[0_0_30px_rgba(81,45,168,0.1)]">
          <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed m-0 text-center">
            "The future of AI deployment relies on robust, scalable, and highly available cloud infrastructure."
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Infrastructure Reliability</h2>
        <p className="mb-6">
          Secure data storage and versioning with S3 and DynamoDB ensures that our infrastructure remains highly reliable under immense workloads, establishing trust with enterprise partners globally.
        </p>
      </>
    )
  },
  {
    id: '2',
    category: 'Announcements',
    title: 'Govt of India',
    image: '/MeitY.jpg',
    imageBg: 'bg-white',
    imageFit: 'object-contain',
    imagePadding: 'p-6',
    date: 'Sep 6, 2025',
    authorName: 'Evelyn Parker',
    authorAvatar: 'https://i.pravatar.cc/150?u=2',
    content: (
      <>
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12 first:mt-0">Innovation Ecosystem</h2>
        <p className="mb-6">
          Supported and backed by the Ministry of Electronics and Information Technology through the MeitY Startup Hub. This robust ecosystem fosters deep-tech innovation and accelerates indigenous AI development across India.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Startup Support</h2>
        <p className="mb-6">
          Being selected under the MeitY GENESIS EiR-2 cohort provides us with crucial grant funding for AI hardware R&D, accelerating our mission to build language models strictly tailored for linguistic diversity and localized nuances.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">AI Initiatives & MeitY Collaboration</h2>
        <p className="mb-6">
          Our collaboration with MeitY offers unparalleled access to government pilot programs and testbeds, allowing us to rapidly deploy and iterate our models in real-world administrative and public-sector scenarios.
        </p>
        
        <div className="my-14 p-6 rounded-[24px] bg-[#512da8]/10 border border-[#512da8]/30 shadow-[0_0_30px_rgba(81,45,168,0.1)]">
          <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed m-0 text-center">
            "Empowering national AI development requires strong public-private partnerships to scale impactful technologies."
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">National AI Development</h2>
        <p className="mb-6">
          Recognized as a deep-tech startup of national interest, we are heavily committed to shaping the future of AI in India by building secure, sovereign, and indigenous compute infrastructure.
        </p>
      </>
    )
  },
  {
    id: '3',
    category: 'Announcements',
    title: 'NVIDIA',
    image: '/nvidia.png',
    imageBg: 'bg-white',
    imageFit: 'object-contain',
    imagePadding: 'p-6',
    date: 'Sep 6, 2025',
    authorName: 'Lucas Morgan',
    authorAvatar: 'https://i.pravatar.cc/150?u=3',
    content: (
      <>
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12 first:mt-0">AI Acceleration</h2>
        <p className="mb-6">
          Collaborating through the NVIDIA Inception Program dramatically accelerates our AI compute capabilities. We leverage cutting-edge GPU infrastructure to train robust foundation models efficiently and at massive scale.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">GPU Optimization</h2>
        <p className="mb-6">
          With access to NVIDIA DGX Cloud compute, we can optimize our large language models at the hardware level, ensuring maximum operational efficiency, minimal latency, and optimal resource utilization across distributed nodes.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Hardware-Level Inference</h2>
        <p className="mb-6">
          Hardware-level optimization for Telugu LLM inference allows us to deliver unprecedented, industry-leading performance both on-device and within large-scale, high-concurrency cloud environments.
        </p>
        
        <div className="my-14 p-6 rounded-[24px] bg-[#512da8]/10 border border-[#512da8]/30 shadow-[0_0_30px_rgba(81,45,168,0.1)]">
          <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed m-0 text-center">
            "Hardware and software codesign is the absolute key to unlocking the true potential of advanced AI compute infrastructure."
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight mt-12">Model Performance & Compute Infrastructure</h2>
        <p className="mb-6">
          Continuous technical mentorship from NVIDIA AI engineers and priority access to state-of-the-art GPU architectures significantly enhance our overall model performance, paving the way for the next generation of AI.
        </p>
      </>
    )
  },
  {
    id: '4',
    category: 'Research',
    title: 'The Architecture Behind LUCA: A Deep Dive into OS-level AI.',
    image: '/resolution changed luca ai  image.png',
    date: 'Oct 15, 2025',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: '5',
    category: 'Research',
    title: 'Closed-Loop Fine-Tuning: Expanding SLM Capabilities.',
    image: '/new_preview.webp',
    date: 'Nov 02, 2025',
    authorName: 'David Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=5'
  },
  {
    id: '6',
    category: 'Guides',
    title: 'Native Language Integration: Building the Telugu Tokenizer.',
    image: '/preview_for_founder.webp',
    date: 'Nov 20, 2025',
    authorName: 'Priya Sharma',
  }
];

const BlogPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

// Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter to show only the approved active blog card (SLM Guide)
  const visiblePosts = blogPosts.filter(post => post.id === 'guide');

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
          
          {/* Blog Hero Section */}
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
          {/* All Blog Grid Section (Showing only approved SLM Guide card) */}
          <section className="relative z-20 w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-x-8 md:gap-y-12 lg:gap-y-16">
              {visiblePosts.map((post) => (
                <Link 
                  to={`/blog/${post.id}`}
                  key={post.id} 
                  className="group flex flex-col no-cursor-track"
                >
                  {/* Thumbnail */}
                  <div className={`relative w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-6 border border-white/10 group-hover:border-[#512da8]/40 transition-all duration-500 ${post.imageBg || 'bg-[#0a0a0f]'}`}>
                    {post.coverText ? (
                      <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-black relative overflow-hidden group-hover:bg-[#050508] transition-colors duration-500">
                        {/* Scattered White Pixel Dots matching home background */}
                        <div className="absolute inset-0 pointer-events-none select-none">
                          <svg className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" xmlns="http://www.w3.org/2000/svg">
                            <rect x="15%" y="22%" width="2.5" height="2.5" fill="#ffffff" opacity="0.9" />
                            <rect x="35%" y="12%" width="2" height="2" fill="#ffffff" opacity="0.7" />
                            <rect x="42%" y="8%" width="3" height="3" fill="#ffffff" opacity="1" />
                            <rect x="48%" y="24%" width="2" height="2" fill="#ffffff" opacity="0.6" />
                            <rect x="28%" y="18%" width="2" height="2" fill="#ffffff" opacity="0.8" />
                            <rect x="80%" y="28%" width="2" height="2" fill="#ffffff" opacity="0.8" />
                            <rect x="86%" y="34%" width="2.5" height="2.5" fill="#ffffff" opacity="0.9" />
                            <rect x="30%" y="45%" width="3" height="3" fill="#ffffff" opacity="0.85" />
                            <rect x="29%" y="58%" width="2.5" height="2.5" fill="#ffffff" opacity="0.7" />
                            <rect x="22%" y="71%" width="2" height="2" fill="#ffffff" opacity="0.6" />
                            <rect x="50%" y="82%" width="2" height="2" fill="#ffffff" opacity="0.5" />
                            <rect x="60%" y="78%" width="2.5" height="2.5" fill="#ffffff" opacity="0.8" />
                            <rect x="70%" y="65%" width="2" height="2" fill="#ffffff" opacity="0.7" />
                            <rect x="97%" y="52%" width="2" height="2" fill="#ffffff" opacity="0.9" />
                            <rect x="95%" y="88%" width="2.5" height="2.5" fill="#ffffff" opacity="1" />
                            <rect x="91%" y="92%" width="2" height="2" fill="#ffffff" opacity="0.6" />
                            <rect x="12%" y="88%" width="2" height="2" fill="#ffffff" opacity="0.5" />
                            <rect x="68%" y="15%" width="2.5" height="2.5" fill="#ffffff" opacity="0.6" />
                            <rect x="74%" y="40%" width="2" height="2" fill="#ffffff" opacity="0.4" />
                            <rect x="18%" y="50%" width="2" height="2" fill="#ffffff" opacity="0.5" />
                            <rect x="62%" y="32%" width="2.5" height="2.5" fill="#ffffff" opacity="0.75" />
                          </svg>
                        </div>
                        <span className="relative z-10 text-white text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-center font-sans select-none">
                          {post.coverText}
                        </span>
                      </div>
                    ) : (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className={`w-full h-full ${post.imageFit || 'object-cover'} ${post.imagePadding || ''}`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Category & Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {post.category && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#512da8]/40 bg-[#512da8]/10 text-[#a882ff]">
                        <Tag className="w-3 h-3" />
                        <span className="text-[11px] font-semibold tracking-wide uppercase">{post.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111]">
                      <Calendar className="w-3 h-3 text-[#888]" />
                      <span className="text-[#aaa] text-xs font-medium">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111]">
                      <img src={post.authorAvatar} alt={post.authorName} className="w-3.5 h-3.5 rounded-full" />
                      <span className="text-[#aaa] text-xs font-medium">{post.authorName}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight leading-[1.3] group-hover:text-[#512da8] transition-colors duration-300 mb-2">
                    {post.displayTitle || post.title}
                  </h2>

                  {/* Short Description */}
                  {post.description && (
                    <p className="text-[#888] text-sm leading-relaxed font-light line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
          
        </main>
        
        <Footer openContactModal={() => setIsContactModalOpen(true)} hideCommunitySupport={true} hideWaitlist={true} hideSearchAndStatus={true} />
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default BlogPage;
