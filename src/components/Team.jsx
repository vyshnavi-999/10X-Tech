import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import ShineBorder from './ShineBorder';

const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const team = [
  {
    role: 'Founder',
    name: 'Mani Bhavan',
    initials: 'MB',
    photo: '/manibhavan.jpg',
    description: 'Visionary behind 10X Technologies and the driving force behind LUCA. Building emotionally intelligent AI hardware from India for the world.',
    email: 'mani@10xtechnologies.tech',
    mobile: '+91 00000 00000',
    linkedin: '#',
    gradientRgba: '167,139,250',
    accentColor: '#a78bfa',
  },
  {
    role: 'Co-Founder',
    name: 'Erfan Abdi',
    initials: 'EA',
    photo: '/erfan abdi.jpg',
    description: "Co-architect of LUCA's core AI intelligence and product strategy. Specialises in multilingual systems and cross-cultural human-device interaction.",
    email: 'erfan@10xtechnologies.tech',
    mobile: '+91 00000 00000',
    linkedin: '#',
    gradientRgba: '96,165,250',
    accentColor: '#60a5fa',
  },
  {
    role: 'OS VP',
    name: 'Dhina',
    initials: 'DH',
    photo: '/manibhavan.jpg',
    description: 'Leads the development of our custom embedded OS from the ground up. Optimises low-level hardware integration for real-time on-device AI inference.',
    email: 'dhina@10xtechnologies.tech',
    mobile: '+91 00000 00000',
    linkedin: '#',
    gradientRgba: '52,211,153',
    accentColor: '#34d399',
  },
  {
    role: 'LUCA VP',
    name: 'Vyshnavi',
    initials: 'VY',
    photo: '/vyshnavi.png',
    description: "Oversees LUCA's end-to-end product experience and emotional AI pipeline. Bridges hardware design with natural, intuitive human interaction.",
    email: 'vyshnavi@10xtechnologies.tech',
    mobile: '+91 00000 00000',
    linkedin: '#',
    gradientRgba: '251,191,36',
    accentColor: '#fbbf24',
  },
];

const Team = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-4 lg:py-6 max-w-[1360px] mx-auto px-6">
      <h2 className="text-tier-1 mb-6"><span className="text-violet-drift-c" style={{ animationDelay: '14s' }}>Our Team</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1: member list */}
        <div className="flex flex-col border-t border-white/[0.06] h-full">
          {team.map((member) => {
            const isSelected = selected?.name === member.name;
            return (
              <button
                key={member.name}
                onMouseEnter={() => setSelected(member)}
                onClick={() => setSelected(member)}
                onFocus={() => setSelected(member)}
                className={`flex-1 flex items-center gap-4 px-4 py-4 border-b border-white/[0.06] text-left transition-all duration-300
                  ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}
              >
                <span className="text-tagline-02 text-[#666] uppercase w-28 flex-shrink-0">{member.role}</span>
                <span className="text-body-01 text-white flex-1">{member.name}</span>
              </button>
            );
          })}
        </div>

        {/* Column 2: detail card */}
        <div className="flex h-full min-h-[350px]">
          {selected ? (
            <div
              key={selected.name}
              className="w-full glass-card rounded-2xl overflow-hidden flex transition-all duration-500 h-full relative"
              style={{
                border: `1px solid rgba(${selected.gradientRgba},0.1)`,
                boxShadow: `0 0 50px rgba(${selected.gradientRgba},0.08)`,
              }}
            >
              <ShineBorder 
                borderWidth={1}
                duration={10}
                shineColor={[selected.accentColor, selected.accentColor]}
                className="opacity-80 z-30"
              />
              {/* Left: image with seamless fade to card background */}
              <div className="relative w-2/5 flex-shrink-0 h-full bg-transparent">
                  {selected.photo ? (
                    <img
                      src={selected.photo.startsWith('/') ? `${import.meta.env.BASE_URL}${selected.photo.slice(1)}` : selected.photo}
                      alt={selected.name}
                      className="w-full h-full object-cover object-top"
                      decoding="async"
                      loading="lazy"
                      style={{
                        maskImage: 'linear-gradient(to right, black 95%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 95%, transparent 100%)',
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, rgba(${selected.gradientRgba},0.15) 0%, rgba(${selected.gradientRgba},0.05) 100%)`,
                      }}
                    >
                      <svg className="w-14 h-14 opacity-20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: selected.accentColor }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  )}
                </div>

              {/* Right: details */}
              <div className="flex-1 flex flex-col justify-between py-6 px-6 relative z-10">
                <div>
                  <h3 className="text-tier-2">{selected.name}</h3>
                  <p className="text-tagline-02 text-purple-400/80 uppercase mt-1.5">{selected.role}</p>
                </div>

                <p className="text-tier-3 line-clamp-3">
                  {selected.description}
                </p>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selected.email}`}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-[#666] hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={selected.linkedin}
                    target="_blank"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-[#666] hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center group hover:border-purple-500/20 transition-all duration-500 bg-white/[0.01]">
              <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-body-03 text-[#666]">Select a team member to view details</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Team;
