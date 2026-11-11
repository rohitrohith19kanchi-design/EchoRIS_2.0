import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export default function PinnedMemoryExploration({
  onSelectEmotion,
  onSkipToSearch,
  totalMemories = 0,
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeDimension, setActiveDimension] = useState(0);

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
    const step = Math.min(Math.floor(latest * 4), 3);
    setActiveDimension(step);
  });

  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Transitions for 4 dimensions
  const d0Opacity = useTransform(scrollYProgress, [0, 0.18, 0.26], [1, 1, 0]);
  const d0Y = useTransform(scrollYProgress, [0, 0.18, 0.26], [0, 0, -30]);

  const d1Opacity = useTransform(scrollYProgress, [0.22, 0.29, 0.44, 0.51], [0, 1, 1, 0]);
  const d1Y = useTransform(scrollYProgress, [0.22, 0.29, 0.44, 0.51], [30, 0, 0, -30]);

  const d2Opacity = useTransform(scrollYProgress, [0.47, 0.54, 0.69, 0.76], [0, 1, 1, 0]);
  const d2Y = useTransform(scrollYProgress, [0.47, 0.54, 0.69, 0.76], [30, 0, 0, -30]);

  const d3Opacity = useTransform(scrollYProgress, [0.72, 0.79, 1.0], [0, 1, 1]);
  const d3Y = useTransform(scrollYProgress, [0.72, 0.79, 1.0], [30, 0, 0]);

  const jumpToDimension = (index) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + (index / 4) * scrollableDistance + 12;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const dimensions = [
    {
      number: "01",
      roman: "I",
      name: "THE NARRATIVE INK",
      statement: "A memory unspoken is a memory vulnerable to silence.",
      reflection:
        "Every sentence inscribed into this ledger forms a permanent bulwark against oblivion. Your personal words preserve the texture of light, the exact phrasing of laughter, and the subtle thoughts otherwise lost to time.",
      filter: null,
      actionLabel: "Search by Narrative",
    },
    {
      number: "02",
      roman: "II",
      name: "RELATIONAL STRINGS",
      statement: "Who we were is inseparable from those who walked with us.",
      reflection:
        "Memories act as harmonic nodes between lives. Inscribing a companion weaves them deeper into your story, allowing you to trace shared journeys across months and decades.",
      filter: null,
      actionLabel: "Explore Companions",
    },
    {
      number: "03",
      roman: "III",
      name: "SACRED COORDINATES",
      statement: "Certain coordinates on earth become holy through memory.",
      reflection:
        "A bench facing the sea, a wooden table in an attic café, a bend in the river. Physical spaces soak in our human experience, waiting patiently for the mind to revisit them.",
      filter: null,
      actionLabel: "Locate Sanctuaries",
    },
    {
      number: "04",
      roman: "IV",
      name: "EMOTIONAL RESONANCE",
      statement: "Circumstances fade, but the emotional vibration endures forever.",
      reflection:
        "Whether tinted with tender Nostalgia, deep Peace, triumphant Pride, or quiet Reverence — each emotion provides the frequency by which your memories can be summoned.",
      filter: "Nostalgia",
      actionLabel: "Filter by Nostalgia",
    },
  ];

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[250vh] w-full mb-10"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden py-8 sm:py-10 px-4 sm:px-8 pointer-events-auto">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.05)_0%,transparent_70%)]"
        />

        {/* Top Story Header & Dimension Stepper */}
        <div className="relative z-20 flex flex-col gap-3 border-b border-white/[0.07] pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-violet-300 text-xs tracking-wider">
                DIMENSION {dimensions[activeDimension].number} / 04
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-400 uppercase tracking-[0.2em] text-[11px] font-medium hidden sm:inline">
                {dimensions[activeDimension].name}
              </span>
            </div>

            {/* Dimension Selectors */}
            <div className="flex items-center gap-1.5">
              {dimensions.map((dim, idx) => (
                <button
                  key={dim.number}
                  onClick={() => jumpToDimension(idx)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                    activeDimension === idx
                      ? "bg-violet-500/25 text-violet-200 border border-violet-400/50 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
                  }`}
                  title={dim.name}
                >
                  {dim.number}
                </button>
              ))}

              <span aria-hidden="true" className="text-slate-800 mx-1 hidden sm:inline">|</span>

              <button
                onClick={onSkipToSearch}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors hidden sm:inline px-2 py-1"
              >
                Skip to Search ↓
              </button>
            </div>
          </div>

          {/* Liquid Story Progress Rail */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              style={{ width: progressBarWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-400 via-amber-300 to-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.5)]"
            />
          </div>
        </div>

        {/* Center Stage: Progressive Exploration Statements */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-0">
          {/* Roman Numeral Watermark in Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span className="font-serif text-[180px] sm:text-[280px] font-light text-white/[0.02] transition-all duration-700">
              {dimensions[activeDimension].roman}
            </span>
          </div>

          {/* Dimension 0 Content */}
          <motion.div
            style={{
              opacity: d0Opacity,
              y: d0Y,
              pointerEvents: activeDimension === 0 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-violet-300 font-sans">
              <span>✦</span>
              <span>{dimensions[0].name}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-amber-50 leading-[1.15]">
              {dimensions[0].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {dimensions[0].reflection}
            </p>
          </motion.div>

          {/* Dimension 1 Content */}
          <motion.div
            style={{
              opacity: d1Opacity,
              y: d1Y,
              pointerEvents: activeDimension === 1 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-violet-300 font-sans">
              <span>◈</span>
              <span>{dimensions[1].name}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-amber-50 leading-[1.15]">
              {dimensions[1].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {dimensions[1].reflection}
            </p>
          </motion.div>

          {/* Dimension 2 Content */}
          <motion.div
            style={{
              opacity: d2Opacity,
              y: d2Y,
              pointerEvents: activeDimension === 2 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-300 font-sans">
              <span>⌖</span>
              <span>{dimensions[2].name}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-amber-50 leading-[1.15]">
              {dimensions[2].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {dimensions[2].reflection}
            </p>
          </motion.div>

          {/* Dimension 3 Content */}
          <motion.div
            style={{
              opacity: d3Opacity,
              y: d3Y,
              pointerEvents: activeDimension === 3 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-purple-300 font-sans">
              <span>❖</span>
              <span>{dimensions[3].name}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-amber-50 leading-[1.15]">
              {dimensions[3].statement}
            </h2>

            <p className="mt-5 font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {dimensions[3].reflection}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  onSelectEmotion?.("Nostalgia");
                  onSkipToSearch?.();
                }}
                className="px-4 py-2 rounded-xl border border-violet-400/40 bg-violet-600/20 text-xs text-violet-200 hover:bg-violet-600/30 transition-colors"
              >
                Filter Codex by Nostalgia →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Status & Scroll Cue */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-sans text-slate-500 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-violet-300">↓</span>
            <span>Scroll onward into the complete archival ledger</span>
          </div>

          <button
            onClick={onSkipToSearch}
            className="text-[11px] text-violet-300/80 hover:text-violet-200 font-mono"
          >
            SEARCH {totalMemories} ENTRIES ↓
          </button>
        </div>
      </div>
    </div>
  );
}
