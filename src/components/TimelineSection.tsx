import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { CheckCircle2, ChevronRight, Flag, Gauge, Layers } from 'lucide-react';
import { TIMELINE_DATA } from '../data/mockData';
import { TimelineLog } from '../types';

const CIRCUIT_PATH = 'M 170 500 L 735 500 C 795 500 835 465 835 410 L 835 310 C 835 270 805 240 765 240 L 710 240 C 675 240 650 215 650 180 L 650 130 C 650 90 620 70 580 70 L 400 70 C 360 70 330 100 330 140 L 330 190 C 330 230 300 255 260 255 L 210 255 C 170 255 145 280 145 320 L 145 430 C 145 470 160 495 200 500 Z';

const STATIONS = [
  { x: 170, y: 500, label: 'START / FINISH' },
  { x: 710, y: 240, label: 'TURN 04' },
  { x: 330, y: 190, label: 'FINAL SECTOR' },
];

const getActiveIndex = (progress: number) => (progress < 0.4 ? 0 : progress < 0.76 ? 1 : 2);

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLog, setActiveLog] = useState<TimelineLog | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActiveIndex(getActiveIndex(progress));
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
                <span className="flex items-center gap-2"><Gauge className="h-3 w-3" /> Circuit 01</span>
                <span>One lap · Three stories</span>
              </div>
              <svg viewBox="0 0 1000 660" className="block max-h-[35vh] w-full sm:max-h-[48vh] lg:max-h-[62vh]" role="img" aria-label="aDOPE archive circuit; the route draws as the timeline advances">
                <path d={CIRCUIT_PATH} fill="none" stroke="#444" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#080808" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#777" strokeWidth="1.5" strokeDasharray="2 13" strokeLinecap="round" />
                <motion.path
                  d={CIRCUIT_PATH}
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: reduceMotion ? 1 : scrollYProgress }}
                />
                <path d="M 205 550 L 700 550 C 730 550 750 530 750 500" fill="none" stroke="#414141" strokeWidth="1.5" strokeDasharray="5 6" />
                <path d="M 156 480 L 184 480 L 184 520 L 156 520 Z" fill="none" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="228" y="585" fill="#666" fontSize="13" fontFamily="monospace" letterSpacing="3">PIT LANE</text>
                <text x="578" y="115" fill="#555" fontSize="12" fontFamily="monospace" letterSpacing="2">S3</text>
                <text x="620" y="420" fill="#555" fontSize="12" fontFamily="monospace" letterSpacing="2">S2</text>
                <text x="192" y="345" fill="#555" fontSize="12" fontFamily="monospace" letterSpacing="2">S1</text>

                {STATIONS.map((station, index) => {
                  const isActive = index === activeIndex;
                  const isPassed = index < activeIndex;
                  return (
                    <g key={station.label} aria-label={`${station.label}: ${TIMELINE_DATA[index].title}`}>
                      <circle cx={station.x} cy={station.y} r={isActive ? 25 : 20} fill="#101010" stroke={isActive ? '#fff' : isPassed ? '#aaa' : '#454545'} strokeWidth={isActive ? 2 : 1.5} />
                      <text x={station.x} y={station.y + 4} fill={isActive || isPassed ? '#fff' : '#858585'} textAnchor="middle" fontSize="11" fontFamily="monospace">0{index + 1}</text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-600 sm:mt-1 sm:text-[9px]">
                <span className="h-px w-6 bg-neutral-300" /> Scroll to follow the route
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
