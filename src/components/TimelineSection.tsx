import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { TIMELINE_DATA } from '../data/mockData';
import { TimelineLog } from '../types';
import { ChevronRight, CheckCircle2, Flag, Gauge, Layers } from 'lucide-react';

const STATION_POSITIONS = [
  { x: '12%', y: '74%', label: 'START / FINISH', type: 'PIT 01' },
  { x: '72%', y: '39%', label: 'CHICANE', type: 'TURN 02' },
  { x: '31%', y: '15%', label: 'FINAL SECTOR', type: 'TURN 03' },
];

const getActiveIndex = (progress: number) => {
  if (progress >= 0.68) return 2;
  if (progress >= 0.34) return 1;
  return 0;
};

export const TimelineSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLog, setActiveLog] = useState<TimelineLog | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActiveIndex(getActiveIndex(progress));
  });

  const activeItem = TIMELINE_DATA[activeIndex];

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative z-20 h-[300vh] border-b border-white/10 bg-[#0E0E0E]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex items-center gap-4 sm:mb-10"
          >
            <div className="h-px flex-1 bg-white/20" />
            <h2 className="whitespace-nowrap text-2xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              04 Archive Circuit
            </h2>
            <div className="hidden h-px w-16 bg-white/20 sm:block" />
          </motion.div>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative mx-auto aspect-[1.35/1] w-full max-w-[860px] overflow-hidden border border-white/10 bg-[#111] p-3 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 sm:left-6 sm:top-6">
                <Gauge className="h-3.5 w-3.5" />
                Archive Grand Prix / Lap 01
              </div>

              <svg
                viewBox="0 0 1000 740"
                className="relative h-full w-full"
                role="img"
                aria-label="aDOPE archive circuit timeline"
              >
                <defs>
                  <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="active-track" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="55%" stopColor="#d4d4d4" />
                    <stop offset="100%" stopColor="#777777" />
                  </linearGradient>
                </defs>

                <path
                  d="M 135 555 C 80 490 95 390 170 350 C 235 315 275 365 335 400 C 425 452 485 420 500 330 C 515 240 595 165 700 190 C 805 215 865 300 812 380 C 770 445 700 450 635 415 C 565 378 530 420 570 490 C 612 565 570 650 450 650 L 230 650 C 175 650 145 615 135 555"
                  fill="none"
                  stroke="#2b2b2b"
                  strokeWidth="68"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 135 555 C 80 490 95 390 170 350 C 235 315 275 365 335 400 C 425 452 485 420 500 330 C 515 240 595 165 700 190 C 805 215 865 300 812 380 C 770 445 700 450 635 415 C 565 378 530 420 570 490 C 612 565 570 650 450 650 L 230 650 C 175 650 145 615 135 555"
                  fill="none"
                  stroke="#090909"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 135 555 C 80 490 95 390 170 350 C 235 315 275 365 335 400 C 425 452 485 420 500 330 C 515 240 595 165 700 190 C 805 215 865 300 812 380 C 770 445 700 450 635 415 C 565 378 530 420 570 490 C 612 565 570 650 450 650 L 230 650 C 175 650 145 615 135 555"
                  fill="none"
                  stroke="#888"
                  strokeDasharray="18 18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 135 555 C 80 490 95 390 170 350 C 235 315 275 365 335 400 C 425 452 485 420 500 330 C 515 240 595 165 700 190 C 805 215 865 300 812 380 C 770 445 700 450 635 415 C 565 378 530 420 570 490 C 612 565 570 650 450 650 L 230 650 C 175 650 145 615 135 555"
                  fill="none"
                  stroke="url(#active-track)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#track-glow)"
                  style={{ pathLength: reduceMotion ? 1 : scrollYProgress }}
                />
                <path
                  d="M 110 575 L 160 535 M 105 595 L 155 555 M 790 405 L 835 365 M 775 425 L 820 385 M 440 625 L 440 675 M 470 625 L 470 675"
                  stroke="#f1f1f1"
                  strokeWidth="9"
                  strokeDasharray="12 10"
                  opacity="0.7"
                />

                {STATION_POSITIONS.map((station, index) => {
                  const isActive = index === activeIndex;
                  const isComplete = index < activeIndex;
                  return (
                    <g key={station.type}>
                      <circle
                        cx={parseFloat(station.x) * 10}
                        cy={parseFloat(station.y) * 7.4}
                        r={isActive ? 22 : 17}
                        fill="#0e0e0e"
                        stroke={isActive ? '#fff' : isComplete ? '#aaa' : '#555'}
                        strokeWidth={isActive ? 3 : 2}
                      />
                      <circle
                        cx={parseFloat(station.x) * 10}
                        cy={parseFloat(station.y) * 7.4}
                        r={isActive ? 6 : 4}
                        fill={isActive || isComplete ? '#fff' : '#555'}
                      />
                    </g>
                  );
                })}
              </svg>

              {STATION_POSITIONS.map((station, index) => (
                <button
                  key={station.type}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 text-left font-mono text-[9px] uppercase tracking-widest transition-colors ${
                    index === activeIndex ? 'text-white' : 'text-white/40 hover:text-white'
                  }`}
                  style={{ left: station.x, top: station.y }}
                  aria-label={`Go to ${TIMELINE_DATA[index].title}`}
                >
                  <span className="block whitespace-nowrap border border-white/20 bg-[#0e0e0e]/90 px-2 py-1">
                    {station.type}
                  </span>
                </button>
              ))}

              <motion.div
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0e0e0e] shadow-[0_0_24px_rgba(255,255,255,0.8)]"
                style={{
                  left: STATION_POSITIONS[activeIndex].x,
                  top: STATION_POSITIONS[activeIndex].y,
                }}
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <motion.article
              key={activeItem.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              className="relative border border-white/15 bg-[#1A1A1A] p-6 shadow-2xl sm:p-8"
            >
              <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-white" />
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  <Flag className="h-3.5 w-3.5 text-white" />
                  {STATION_POSITIONS[activeIndex].label}
                </span>
                <span className="font-mono text-[10px] text-white/40">
                  0{activeIndex + 1} / 0{TIMELINE_DATA.length}
                </span>
              </div>
              <span className="mb-3 inline-block border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                {activeItem.date}
              </span>
              <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">{activeItem.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-neutral-400">{activeItem.description}</p>
              <button
                type="button"
                onClick={() => setActiveLog(activeItem)}
                className="group flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                Inspect event
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.article>
          </div>
        </div>
      </div>

      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-[#1A1A1A] p-6 sm:p-8">
            <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-white" />
            <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-white" />
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-white" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                  {activeLog.version}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                className="border border-white/20 px-3 py-1 font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
              >
                Close [ESC]
              </button>
            </div>
            <h3 className="mb-3 text-2xl font-extrabold text-white">{activeLog.title}</h3>
            <p className="mb-6 text-sm text-neutral-300">{activeLog.description}</p>
            <div className="border-t border-white/10 pt-6">
              <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-white">
                Architecture &amp; Release Specifications:
              </h4>
              <ul className="space-y-3">
                {activeLog.fullDetails.map((detail) => (
                  <li key={detail} className="flex items-start gap-3 text-xs text-neutral-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                className="bg-white px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#131313] hover:bg-neutral-200"
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
