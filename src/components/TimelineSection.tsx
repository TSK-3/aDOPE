import React, { useState, useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { TIMELINE_DATA } from '../data/mockData';
import { TimelineLog } from '../types';
import { ChevronRight, CheckCircle2, Layers } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const [activeLog, setActiveLog] = useState<TimelineLog | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animation for timeline spiral — bound to the timeline container
  // so the spiral draws as the user scrolls through the section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  return (
    <section id="timeline" ref={containerRef} className="py-24 sm:py-32 bg-[#0E0E0E] relative z-20 border-b border-white/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center mb-20"
        >
          <div className="h-px bg-white/20 flex-grow mr-8" />
          <h2 className="font-sans text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white whitespace-nowrap">
            04 Archive Log
          </h2>
          <div className="h-px bg-white/20 w-16 ml-8" />
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative min-h-[600px] flex justify-center">
          {/* Animated Double-Helix Spiral Flow Lines */}
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-center">
            <svg
              className="w-full max-w-[500px] h-full overflow-visible"
              viewBox="0 0 400 1000"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="spiral-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#888888" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="spiral-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background faint guide paths */}
              <path
                d="M 200,0 C 380,120 380,220 200,330 C 20,440 20,540 200,660 C 380,780 380,880 200,1000"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 200,0 C 20,120 20,220 200,330 C 380,440 380,540 200,660 C 20,780 20,880 200,1000"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />

              {/* Animated Primary Spiral Path */}
              <motion.path
                d="M 200,0 C 380,120 380,220 200,330 C 20,440 20,540 200,660 C 380,780 380,880 200,1000"
                fill="none"
                stroke="url(#spiral-grad-1)"
                strokeWidth="3"
                filter="url(#glow-filter)"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scrollYProgress }}
                strokeLinecap="round"
              />

              {/* Animated Secondary Counter-Helix Path */}
              <motion.path
                d="M 200,0 C 20,120 20,220 200,330 C 380,440 380,540 200,660 C 20,780 20,880 200,1000"
                fill="none"
                stroke="url(#spiral-grad-2)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scrollYProgress }}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="w-full relative z-10 flex flex-col gap-16 md:gap-28 py-8">
            {TIMELINE_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-center gap-6 w-full ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Glowing Node on Line */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#131313] border-2 border-white z-20 hidden md:flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </motion.div>

                  {/* Card Side */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-end px-0 md:px-8 text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setActiveLog(item)}
                      className="bg-[#1A1A1A] border border-white/10 p-6 sm:p-8 relative hover:-translate-y-1 hover:border-white/40 transition-all duration-300 max-w-xl w-full cursor-pointer group shadow-xl"
                    >
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50 group-hover:border-white transition-colors" />

                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10">
                          {item.date}
                        </span>
                        <span className="font-mono text-xs text-white/50 group-hover:text-white flex items-center gap-1 transition-colors">
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-neutral-200 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Badge Side */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-start px-0 md:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.9 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    >
                      <span className="font-mono text-xs text-white uppercase tracking-widest border border-white/20 px-5 py-2.5 bg-[#131313] shadow-lg inline-block hover:border-white/50 transition-colors">
                        {item.version}
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#1A1A1A] border border-white/20 p-8 max-w-2xl w-full relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-white" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                  {activeLog.version}
                </span>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white border border-white/20 px-3 py-1"
              >
                Close [ESC]
              </button>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-3">
              {activeLog.title}
            </h3>
            <p className="text-sm text-neutral-300 mb-6 font-sans">
              {activeLog.description}
            </p>

            <div className="border-t border-white/10 pt-6">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-4">
                Architecture &amp; Release Specifications:
              </h4>
              <ul className="space-y-3">
                {activeLog.fullDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveLog(null)}
                className="bg-white text-[#131313] font-mono text-xs px-6 py-2.5 uppercase tracking-widest font-semibold hover:bg-neutral-200"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
