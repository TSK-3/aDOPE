import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Gauge } from 'lucide-react';
import { TIMELINE_DATA } from '../data/mockData';

const CIRCUIT_PATH = 'M 780 490 C 816 495 842 470 825 433 L 745 285 C 730 255 707 240 673 239 L 610 239 C 585 239 570 222 558 200 C 543 174 520 168 495 178 L 422 207 C 385 222 350 205 337 175 C 324 145 340 117 363 90 C 385 65 371 40 345 44 C 314 48 294 78 273 109 C 250 144 216 157 185 144 C 153 132 145 105 167 81 C 190 55 177 31 151 36 C 115 42 88 78 80 115 C 71 155 95 183 131 205 L 384 357 C 422 380 466 369 498 342 L 546 301 C 573 278 606 284 621 311 C 638 341 622 366 594 382 L 559 401 C 530 417 528 449 548 470 C 568 490 596 482 618 465 L 669 427 C 699 405 728 413 742 444 L 785 531 C 797 557 780 575 750 566 C 722 557 712 530 724 509 L 744 473 C 756 451 777 462 780 490 Z';

const STATIONS = [
  { x: 780, y: 490, label: 'ORIGIN / MGIT' },
  { x: 337, y: 175, label: 'TEAM OF 12' },
  { x: 384, y: 357, label: 'PUBLIC ARCHIVE' },
];

const getActiveIndex = (progress: number) => (progress < 0.4 ? 0 : progress < 0.76 ? 1 : 2);

const CHECKPOINT_POPUP_POSITIONS = [
  { x: 87.5, y: 81.7, above: true },
  { x: 34.8, y: 28.3, above: false },
  { x: 40.4, y: 59.1, above: false },
];

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const laserHeadRef = useRef<SVGGElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
        <div className="mx-auto w-full max-w-[1800px] px-4 py-3 sm:px-8 sm:py-6 lg:px-12">
          <div className="mb-2 text-center sm:mb-4">
            <div>
              <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.24em] text-neutral-500 sm:mb-3 sm:text-[10px]">04 / The aDOPE archive · MGIT, Hyderabad</span>
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.045em] text-white sm:text-5xl">A history in motion</h2>
            </div>
          </div>

          <div className="relative mx-auto h-[42vh] w-full sm:h-[54vh] lg:h-[62vh]">
            <div className="absolute left-0 top-0 z-10 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:text-[9px]">
              <Gauge className="h-3 w-3" /> Circuit map / 01 · Three archive entries
            </div>
            <svg viewBox="45 8 840 590" preserveAspectRatio="none" className="block h-full w-full" role="img" aria-label="aDOPE archive circuit; the route draws as the timeline advances">
                <defs>
                  <filter id="timeline-laser-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="timeline-head-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                  <radialGradient id="timeline-head-halo">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#ffffff" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path d={CIRCUIT_PATH} fill="none" stroke="#24282d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CIRCUIT_PATH} fill="none" stroke="#454b52" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <motion.path
                  ref={trackPathRef}
                  d={CIRCUIT_PATH}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.42"
                  filter="url(#timeline-laser-glow)"
                  style={{ pathLength: scrollYProgress }}
                />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />
                <motion.path d={CIRCUIT_PATH} fill="none" stroke="#f1feff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: scrollYProgress }} />

                <g ref={laserHeadRef} transform={`translate(${STATIONS[0].x} ${STATIONS[0].y})`} pointerEvents="none">
                  <circle r="22" fill="url(#timeline-head-halo)" />
                  <circle r="11" fill="#ffffff" opacity="0.24" filter="url(#timeline-head-glow)" />
                  <circle r="4.5" fill="#ffffff" />
                  <circle r="2" fill="#ffffff" />
                </g>

                {STATIONS.map((station, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <g key={station.label} aria-label={`${station.label}: ${TIMELINE_DATA[index].title}`}>
                      {isActive && <circle cx={station.x} cy={station.y} r="19" fill="#ffffff" opacity="0.12" />}
                      <circle cx={station.x} cy={station.y} r={isActive ? 12 : 10} fill="#101010" stroke={isActive ? '#ffffff' : '#59616a'} strokeWidth={isActive ? 1.8 : 1.2} />
                      <text x={station.x} y={station.y + 3} fill={isActive ? '#ffffff' : '#a3a3a3'} textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="monospace">0{index + 1}</text>
                    </g>
                  );
                })}
              </svg>

            <motion.article
              key={activeItem.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
              style={{
                left: `clamp(0.5rem, calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].x}% - 190px), calc(100% - min(380px, calc(100% - 1rem)) - 0.5rem))`,
                top: CHECKPOINT_POPUP_POSITIONS[activeIndex].above
                  ? `calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].y}% - 1rem)`
                  : `calc(${CHECKPOINT_POPUP_POSITIONS[activeIndex].y}% + 1rem)`,
                transform: CHECKPOINT_POPUP_POSITIONS[activeIndex].above ? 'translateY(-100%)' : undefined,
                width: 'min(380px, calc(100% - 1rem))',
              }}
              className="absolute z-20 grid grid-cols-[96px_1fr] gap-3 border border-white/20 bg-[#171717]/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.75)] backdrop-blur-md sm:grid-cols-[132px_1fr] sm:gap-4 sm:p-4"
              aria-live="polite"
            >
              <img src={activeItem.imageUrl} alt={activeItem.title} className="h-24 w-full object-cover grayscale sm:h-28" />
              <div className="self-center">
                <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500">{STATIONS[activeIndex].label} · {activeItem.date}</span>
                <h3 className="mb-1 text-sm font-semibold leading-tight tracking-[-0.035em] text-white sm:text-lg">{activeItem.title}</h3>
                <p className="text-[9px] leading-relaxed text-neutral-400 sm:text-[11px]">{activeItem.description}</p>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

    </section>
  );
};
