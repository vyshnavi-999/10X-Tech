import React from 'react';

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const XIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const UserSilhouette = ({ className = "w-28 h-28" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12s-3.5-1.57-3.5-3.5S10.07 5 12 5zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const team = [
  {
    role: 'Founder',
    name: 'Mani Bhavan',
    initials: 'MB',
    photo: '/manibhavan.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    accentColor: '#a78bfa',
    gradientRgba: '167,139,250',
  },
  {
    role: 'Co-Founder',
    name: 'Erfan Abdi',
    initials: 'EA',
    photo: '/erfan abdi.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    accentColor: '#a78bfa',
    gradientRgba: '167,139,250',
  },
  {
    role: 'OS VP',
    name: 'Dhina',
    initials: 'DH',
    photo: null,
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    accentColor: '#a78bfa',
    gradientRgba: '167,139,250',
  },
  {
    role: 'LUCA VP',
    name: 'Vyshnavi',
    initials: 'VY',
    photo: '/vyshnavi.png',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    accentColor: '#a78bfa',
    gradientRgba: '167,139,250',
  },
];

const Team = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 max-w-[1240px] mx-auto px-6 w-full relative">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header matching Reference Image */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div>
          <span className="font-mono text-purple-400 text-xs sm:text-sm tracking-[0.2em] uppercase mb-2 sm:mb-3 block font-semibold">
            [ OUR TEAM ]
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Meet <span className="bg-gradient-to-r from-[#B39DDB] via-[#9575CD] to-[#7E57C2] bg-clip-text text-transparent">The Experts</span>
          </h2>
        </div>
        <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-md leading-relaxed">
          Our world-class team of visionaries and engineers building emotionally intelligent AI hardware and small language models from India for the world.
        </p>
      </div>

      {/* 4 Cards Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {team.map((member) => {
          return (
            <div
              key={member.name}
              className="relative rounded-3xl bg-[#080918] border border-white/[0.08] hover:border-purple-500/60 hover:shadow-[0_12px_35px_-10px_rgba(168,85,247,0.25)] hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between p-6 group cursor-pointer aspect-[3/4.2] select-none"
            >
              {/* Ambient Spotlight inside card on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-0 opacity-0 group-hover:opacity-80"
                style={{
                  background: `radial-gradient(circle at 50% 60%, rgba(167, 139, 250, 0.25), transparent 70%)`
                }}
              />

              {/* Seamless Full-Bleed Portrait Photo with Blur on Hover ONLY */}
              {member.photo ? (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <img
                    src={member.photo.startsWith('/') ? `${import.meta.env.BASE_URL}${member.photo.slice(1)}` : member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 group-hover:blur-[6px] transition-all duration-300 ease-out"
                    decoding="async"
                    loading="lazy"
                  />
                  {/* Multi-stop seamless gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#080918]/80 via-transparent to-[#080918] pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080918] via-[#080918]/85 to-transparent pointer-events-none" />
                  {/* Subtle dark overlay when hovered */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                /* User Avatar Silhouette for Dhina in subtle Grey/Black */
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-b from-[#0e0f1c] to-[#080918] flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-36 h-36 rounded-full bg-white/[0.02] blur-xl" />
                    <UserSilhouette className="w-28 h-28 text-neutral-600 group-hover:text-neutral-400 group-hover:scale-105 transition-all duration-300" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080918] via-[#080918]/85 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Card Top: Role Badge */}
              <div className="relative z-10">
                <span className="inline-flex items-center text-neutral-400 font-medium text-xs tracking-wide transition-colors duration-300 group-hover:text-purple-300">
                  {member.role}
                </span>
              </div>

              {/* Card Bottom: Name & Social Icons */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95 group-hover:text-white transition-colors duration-300">
                  {member.name}
                </h3>

                {/* Social Icons - Appears strictly on hover */}
                <div className="flex items-center gap-2 pt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 ease-out">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-500/30 border border-white/15 hover:border-purple-400/50 flex items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-500/30 border border-white/15 hover:border-purple-400/50 flex items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label={`${member.name} Instagram`}
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-500/30 border border-white/15 hover:border-purple-400/50 flex items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label={`${member.name} X`}
                  >
                    <XIcon className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Team;
