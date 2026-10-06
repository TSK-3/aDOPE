import React from 'react';
import { SOCIAL_LINKS } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E0E0E] border-t border-white/10 w-full relative z-20 py-12 px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand Title */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            ADOPE CLUB
          </div>
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
            Mahatma Gandhi Institute of Technology
          </span>
        </div>

        {/* Copyright */}
        <div className="font-mono text-[11px] text-neutral-400 text-center md:text-left tracking-widest uppercase">
          ©2026 ADOPE CLUB · MGIT DESIGN CLUB
        </div>

        {/* Social / External Links */}
        <ul className="flex flex-wrap justify-center gap-6">
          <li>
            <a
              href={SOCIAL_LINKS.behance}
              className="font-mono text-xs text-neutral-400 hover:text-white transition-colors tracking-widest uppercase hover-glitch"
            >
              aDOPE Club
            </a>
          </li>
          <li>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-neutral-400 hover:text-white transition-colors tracking-widest uppercase hover-glitch"
            >
              Insta
            </a>
          </li>
          <li>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-neutral-400 hover:text-white transition-colors tracking-widest uppercase hover-glitch"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-neutral-400 hover:text-white transition-colors tracking-widest uppercase hover-glitch"
            >
              YouTube
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
