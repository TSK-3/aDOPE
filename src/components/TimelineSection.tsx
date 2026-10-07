import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { CheckCircle2, ChevronRight, Flag, Gauge, Layers } from 'lucide-react';
import { TIMELINE_DATA } from '../data/mockData';
import { TimelineLog } from '../types';

const CIRCUIT_PATH = 'M 780 490 C 816 495 842 470 825 433 L 745 285 C 730 255 707 240 673 239 L 610 239 C 585 239 570 222 558 200 C 543 174 520 168 495 178 L 422 207 C 385 222 350 205 337 175 C 324 145 340 117 363 90 C 385 65 371 40 345 44 C 314 48 294 78 273 109 C 250 144 216 157 185 144 C 153 132 145 105 167 81 C 190 55 177 31 151 36 C 115 42 88 78 80 115 C 71 155 95 183 131 205 L 384 357 C 422 380 466 369 498 342 L 546 301 C 573 278 606 284 621 311 C 638 341 622 366 594 382 L 559 401 C 530 417 528 449 548 470 C 568 490 596 482 618 465 L 669 427 C 699 405 728 413 742 444 L 785 531 C 797 557 780 575 750 566 C 722 557 712 530 724 509 L 744 473 C 756 451 777 462 780 490 Z';

const STATIONS = [
  { x: 780, y: 490, label: 'ORIGIN / MGIT' },
  { x: 337, y: 175, label: 'TEAM OF 12' },
  { x: 384, y: 357, label: 'PUBLIC ARCHIVE' },
];

const getActiveIndex = (progress: number) => (progress < 0.4 ? 0 : progress < 0.76 ? 1 : 2);

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const laserHeadRef = useRef<SVGGElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLog, setActiveLog] = useState<TimelineLog | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActiveIndex(getActiveIndex(progress));
    const path = trackPathRef.current;
    const head = laserHeadRef.current;
    if (path && head) {
      const point = path.getPointAtLength(path.getTotalLength() * progress);
      head.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }
  });

  const activeItem = TIMELINE_DATA[activeIndex];

  return (
    <section ref={sectionRef} id="timeline" className="relative z-20 h-[300vh] bg-[#101010]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-4 sm:py-10 md:px-16 md:py-16">
          <div className="mb-3 flex items-end justify-between gap-4 sm:mb-8">
            <div>
              <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-500 sm:mb-3 sm:text-[10px]">04 / The aDOPE archive · MGIT, Hyderabad</span>
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.045em] text-white sm:text-5xl">A history in motion</h2>
            </div>
            <div className="shrink-0 pb-1 text-right font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500 sm:text-xs">
              <span className="text-white">0{activeIndex + 1}</span><span className="mx-1.5 text-neutral-700">/</span>0{TIMELINE_DATA.length}
            </div>
          </div>

          <div className="grid items-center gap-3 sm:gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-16">
            <div className="relative">
              <div className="mb-1 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:mb-3 sm:text-[9px]">
                <span className="flex items-center gap-2"><Gauge className="h-3 w-3" /> Circuit map / 01</span>
                <span>Three archive entries</span>
              </div>
              <svg viewBox="45 8 840 590" preserveAspectRatio="xMidYMid meet" className="mx-auto block max-h-[35vh] w-full max-w-[520px] sm:max-h-[48vh] lg:max-h-[62vh]" role="img" aria-label="aDOPE archive circuit; the route draws as the timeline advances">
                <defs>
                  <filter id="timeline-laser-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="timeline-head-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                  <radialGradient id="timeline-head-halo">
                    <stop offset="0%" stopColor="#b8fbff" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#59e7ff" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#59e7ff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path d={CIRCUIT_PATH} fill="none" stroke="#24282d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#454b52" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <motion.path
                  ref={trackPathRef}
                  d={CIRCUIT_PATH}
                  fill="none"
                  stroke="#37dfff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.42"
                  filter="url(#timeline-laser-glow)"
                  style={{ pathLength: scrollYProgress }}
                />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#8bf1ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#f1feff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />

                <g ref={laserHeadRef} transform={`translate(${STATIONS[0].x} ${STATIONS[0].y})`} pointerEvents="none">
                  <circle r="22" fill="url(#timeline-head-halo)" />
                  <circle r="11" fill="#62eaff" opacity="0.24" filter="url(#timeline-head-glow)" />
                  <circle r="4.5" fill="#76edff" />
                  <circle r="2" fill="#ffffff" />
                </g>

                {STATIONS.map((station, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <g key={station.label} aria-label={`${station.label}: ${TIMELINE_DATA[index].title}`}>
                      {isActive && <circle cx={station.x} cy={station.y} r="19" fill="#65eaff" opacity="0.12" />}
                      <circle cx={station.x} cy={station.y} r={isActive ? 12 : 10} fill="#101010" stroke={isActive ? '#8bf1ff' : '#59616a'} strokeWidth={isActive ? 1.8 : 1.2} />
                      <text x={station.x} y={station.y + 3} fill={isActive ? '#dffcff' : '#a3a3a3'} textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="monospace">0{index + 1}</text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-600 sm:mt-1 sm:text-[9px]">
                <span className="h-px w-6 bg-neutral-300" /> Scroll to follow the course
              </div>
            </div>

            <motion.article
              key={activeItem.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
              className="relative border-l border-white/20 py-2 pl-5 sm:pl-8 lg:pl-10"
              aria-live="polite"
            >
              <div className="mb-2 flex items-center justify-between gap-4 sm:mb-7">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[10px]">
                  <Flag className="h-3 w-3 text-white/70" /> {STATIONS[activeIndex].label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-600">Archive entry 0{activeIndex + 1}</span>
              </div>
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]">{activeItem.date}</span>
              <h3 className="mb-1 max-w-xl text-xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:mb-3 sm:text-4xl">{activeItem.title}</h3>
              <p className="max-w-xl text-xs leading-relaxed text-neutral-400 sm:text-sm sm:leading-7">{activeItem.description}</p>
              <button type="button" onClick={() => setActiveLog(activeItem)} className="group mt-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-white sm:mt-7 sm:text-[10px]">
                Read the story <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.article>
          </div>
        </div>
      </div>

      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveLog(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="timeline-dialog-title" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/15 bg-[#171717] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400"><Layers className="h-4 w-4 text-white" />{activeLog.version}</span>
              <button type="button" onClick={() => setActiveLog(null)} aria-label="Close event details" className="border border-white/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400 transition-colors hover:text-white">Close</button>
            </div>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">{activeLog.date}</span>
            <h3 id="timeline-dialog-title" className="mb-3 text-2xl font-semibold tracking-tight text-white">{activeLog.title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-neutral-300">{activeLog.description}</p>
            <div className="border-t border-white/10 pt-5">
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">Event notes</h4>
              <ul className="space-y-3">
                {activeLog.fullDetails.map((detail) => <li key={detail} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" /><span>{detail}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
