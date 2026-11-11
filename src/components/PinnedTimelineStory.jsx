import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export default function PinnedTimelineStory({
  memories = [],
  onSelectMemory,
  onSkipToLedger,
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeEpoch, setActiveEpoch] = useState(0);

  // Sort memories chronologically oldest to newest
  const sorted = [...memories].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateA - dateB;
  });

  const earliestMem = sorted[0];
  const midMem = sorted[Math.floor(sorted.length / 2)];
  const latestMem = sorted[sorted.length - 1];

  const earliestYear = earliestMem ? new Date(earliestMem.date).getFullYear() || "Genesis" : "2020";
  const latestYear = latestMem ? new Date(latestMem.date).getFullYear() || "Present" : "2025";

  const epochs = [
    {
      number: "01",
      roman: "I",
      name: "THE GENESIS",
      period: `Circa ${earliestYear}`,
      statement: "Every personal archive begins with a solitary spark in time.",
      narrative:
        "Before the constellation expanded, there was a foundational memory. A quiet dawn, a single sanctuary, a moment so vivid its reverberation travels across the years.",
      memory: earliestMem,
      accent: "text-amber-300",
      tag: "FIRST INSCRIPTION",
    },
    {
      number: "02",
      roman: "II",
      name: "THE CONVERGENCE",
      period: "The Unfolding Years",
      statement: "As seasons turn, our solitary paths entwine with companions.",
      narrative:
        "The archive deepens. Friends, mentors, and loved ones join the narrative. Journeys take shape across unfamiliar sanctuaries, turning geography into emotional tapestry.",
      memory: midMem,
      accent: "text-violet-300",
      tag: "RELATIONAL WEAVING",
    },
    {
      number: "03",
      roman: "III",
      name: "THE LIVING HORIZON",
      period: `Into ${latestYear}`,
      statement: "The river flows unbroken into the present hour.",
      narrative:
        "Your archive is not a relic of the past, but a living compass. Today's quiet moments are tomorrow's most sacred echoes, waiting to be revisited and cherished.",
      memory: latestMem,
      accent: "text-amber-200",
      tag: "THE PRESENT CONTINUUM",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(Math.floor(latest * 3), 2);
    setActiveEpoch(step);
  });

  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Epoch 0 Transforms
  const e0Opacity = useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0]);
  const e0Y = useTransform(scrollYProgress, [0, 0.22, 0.33], [0, 0, -32]);

  // Epoch 1 Transforms
  const e1Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const e1Y = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [32, 0, 0, -32]);

  // Epoch 2 Transforms
  const e2Opacity = useTransform(scrollYProgress, [0.67, 0.77, 1.0], [0, 1, 1]);
  const e2Y = useTransform(scrollYProgress, [0.67, 0.77, 1.0], [32, 0, 0]);

  const jumpToEpoch = (index) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + (index / 3) * scrollableDistance + 12;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  if (memories.length === 0) {
    return null;
  }

  // Reduced motion fallback
  if (shouldReduceMotion) {
    return (
      <div className="mb-12 rounded-2xl border border-white/[0.08] bg-[#0c0e1a]/80 p-6 sm:p-8 font-sans">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
          Chronological Storyline
        </p>
        <h3 className="font-serif text-2xl text-amber-50 mt-1">
          Epochs of Your Timeline
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {epochs.map((ep) => (
            <div key={ep.number} className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
              <span className="text-[11px] font-mono text-amber-300">{ep.period}</span>
              <h4 className="font-serif text-lg text-slate-100 mt-1">{ep.name}</h4>
              <p className="text-xs text-slate-300 mt-1 font-light">{ep.statement}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[270vh] w-full mb-12"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden py-8 sm:py-12 px-4 sm:px-8 pointer-events-auto">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]"
        />

        {/* Top Story Header & Epoch Stepper */}
        <div className="relative z-20 flex flex-col gap-3 border-b border-white/[0.07] pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-amber-300 text-xs tracking-wider">
                EPOCH {epochs[activeEpoch].number} / 03
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-400 uppercase tracking-[0.2em] text-[11px] font-medium hidden sm:inline">
                {epochs[activeEpoch].name} ({epochs[activeEpoch].period})
              </span>
            </div>

            {/* Epoch Selector Buttons */}
            <div className="flex items-center gap-1.5">
              {epochs.map((ep, idx) => (
                <button
                  key={ep.number}
                  onClick={() => jumpToEpoch(idx)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                    activeEpoch === idx
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
                  }`}
                  title={ep.name}
                >
                  {ep.number}
                </button>
              ))}

              <span aria-hidden="true" className="text-slate-800 mx-1 hidden sm:inline">|</span>

              <button
                onClick={onSkipToLedger}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors hidden sm:inline px-2 py-1"
              >
                Skip to Ledger Rail ↓
              </button>
            </div>
          </div>

          {/* Liquid Story Progress Rail */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              style={{ width: progressBarWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-violet-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            />
          </div>
        </div>

        {/* Center Stage: Epoch Storytelling Sequence */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-0">
          {/* Roman Numeral Watermark in Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span className="font-serif text-[180px] sm:text-[280px] font-light text-white/[0.02] transition-all duration-700">
              {epochs[activeEpoch].roman}
            </span>
          </div>

          {/* Epoch 0 Content */}
          <motion.div
            style={{
              opacity: e0Opacity,
              y: e0Y,
              pointerEvents: activeEpoch === 0 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-300 font-sans">
              <span>✦</span>
              <span>{epochs[0].tag} · {epochs[0].period}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {epochs[0].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {epochs[0].narrative}
            </p>

            {epochs[0].memory && (
              <button
                onClick={() => onSelectMemory(epochs[0].memory)}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/40 px-5 py-3 text-left transition hover:border-amber-400/40 hover:bg-white/[0.03]"
              >
                <span className="text-amber-400 text-sm">⌖</span>
                <div className="text-xs">
                  <p className="text-amber-200 font-medium font-serif text-sm">
                    {epochs[0].memory.title}
                  </p>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {epochs[0].memory.date} · {epochs[0].memory.place || "Sacred sanctuary"}
                  </p>
                </div>
                <span className="text-slate-500 text-xs ml-2">Inspect →</span>
              </button>
            )}
          </motion.div>

          {/* Epoch 1 Content */}
          <motion.div
            style={{
              opacity: e1Opacity,
              y: e1Y,
              pointerEvents: activeEpoch === 1 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-violet-300 font-sans">
              <span>◈</span>
              <span>{epochs[1].tag} · {epochs[1].period}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {epochs[1].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {epochs[1].narrative}
            </p>

            {epochs[1].memory && (
              <button
                onClick={() => onSelectMemory(epochs[1].memory)}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/40 px-5 py-3 text-left transition hover:border-violet-400/40 hover:bg-white/[0.03]"
              >
                <span className="text-violet-400 text-sm">◈</span>
                <div className="text-xs">
                  <p className="text-violet-200 font-medium font-serif text-sm">
                    {epochs[1].memory.title}
                  </p>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {epochs[1].memory.date} · Companions: {epochs[1].memory.people?.join(", ") || "Intimate moments"}
                  </p>
                </div>
                <span className="text-slate-500 text-xs ml-2">Inspect →</span>
              </button>
            )}
          </motion.div>

          {/* Epoch 2 Content */}
          <motion.div
            style={{
              opacity: e2Opacity,
              y: e2Y,
              pointerEvents: activeEpoch === 2 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-200 font-sans">
              <span>☼</span>
              <span>{epochs[2].tag} · {epochs[2].period}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {epochs[2].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {epochs[2].narrative}
            </p>

            {epochs[2].memory && (
              <button
                onClick={() => onSelectMemory(epochs[2].memory)}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/40 px-5 py-3 text-left transition hover:border-amber-400/40 hover:bg-white/[0.03]"
              >
                <span className="text-amber-300 text-sm">✦</span>
                <div className="text-xs">
                  <p className="text-amber-100 font-medium font-serif text-sm">
                    {epochs[2].memory.title}
                  </p>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {epochs[2].memory.date} · {epochs[2].memory.emotion}
                  </p>
                </div>
                <span className="text-slate-500 text-xs ml-2">Inspect →</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Bottom Status & Transition to Ledger Rail */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-sans text-slate-500 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-amber-300">↓</span>
            <span>Scroll onward into the complete chronological ledger</span>
          </div>

          <button
            onClick={onSkipToLedger}
            className="text-[11px] text-amber-300 hover:text-amber-200 font-mono"
          >
            ALL ENTRIES ({memories.length}) ↓
          </button>
        </div>
      </div>
    </div>
  );
}
