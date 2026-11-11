import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export default function PinnedStoryteller({
  memoriesCount = 0,
  peopleCount = 0,
  placesCount = 0,
  onInscribe,
  onExploreNexus,
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);

  // Scroll tracking across the pinned track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  // Track active chapter index for chapter indicator and pills
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(Math.floor(latest * 4), 3);
    setActiveChapter(step);
  });

  // Smooth progress bar width
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Chapter 0 Transforms
  const c0Opacity = useTransform(scrollYProgress, [0, 0.18, 0.26], [1, 1, 0]);
  const c0Y = useTransform(scrollYProgress, [0, 0.18, 0.26], [0, 0, -32]);

  // Chapter 1 Transforms
  const c1Opacity = useTransform(scrollYProgress, [0.22, 0.29, 0.44, 0.51], [0, 1, 1, 0]);
  const c1Y = useTransform(scrollYProgress, [0.22, 0.29, 0.44, 0.51], [32, 0, 0, -32]);

  // Chapter 2 Transforms
  const c2Opacity = useTransform(scrollYProgress, [0.47, 0.54, 0.69, 0.76], [0, 1, 1, 0]);
  const c2Y = useTransform(scrollYProgress, [0.47, 0.54, 0.69, 0.76], [32, 0, 0, -32]);

  // Chapter 3 Transforms
  const c3Opacity = useTransform(scrollYProgress, [0.72, 0.79, 1.0], [0, 1, 1]);
  const c3Y = useTransform(scrollYProgress, [0.72, 0.79, 1.0], [32, 0, 0]);

  // Interactive Chapter Jump
  const jumpToChapter = (index) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + (index / 4) * scrollableDistance + 12;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const skipSequence = () => {
    if (!containerRef.current) return;
    const targetY = containerRef.current.offsetTop + containerRef.current.offsetHeight - 40;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const chapters = [
    {
      number: "01",
      roman: "I",
      kicker: "THE ARCHIVE'S CREED",
      statement: "We do not merely keep memories; memories keep us whole.",
      description:
        "Every preserved moment is an ember from a fire that once warmed you. In EchoRIS, no remembrance is cast aside into oblivion. Each echo is inscribed in timeless fidelity, awaiting your return.",
      meta: `${memoriesCount} ${memoriesCount === 1 ? "Echo" : "Echoes"} Inscribed in Vault`,
      highlight: "text-amber-200",
    },
    {
      number: "02",
      roman: "II",
      kicker: "LIVES INTERTWINED",
      statement: "No moment lives in solitude. Meaning is born where lives converge.",
      description:
        "Memories are not isolated islands. Every companion leaves an indelible frequency upon your story. Track how souls cross, diverge, and reunite through your living relational web.",
      meta: `${peopleCount} ${peopleCount === 1 ? "Companion" : "Companions"} in Constellation`,
      highlight: "text-violet-300",
    },
    {
      number: "03",
      roman: "III",
      kicker: "WHERE STORIES LIVE",
      statement: "Places are sacred vessels that cradle who you once were.",
      description:
        "From rain-slicked cobblestones in ancient towns to silent pine cabins under starlight. Sanctuaries hold the coordinates on earth where your life deepened and transformed.",
      meta: `${placesCount} ${placesCount === 1 ? "Sanctuary" : "Sanctuaries"} Recorded in Atlas`,
      highlight: "text-amber-300",
    },
    {
      number: "04",
      roman: "IV",
      kicker: "THE LIVING CONTINUUM",
      statement: "Your story is an open codex, written forward with every breath.",
      description:
        "The past does not lock behind you; it illuminates the path ahead. Journey through the relational nexus below, trace the river of time, and inscribe the moments that define your soul.",
      meta: "Vault Status: Living & Encrypted",
      highlight: "text-purple-300",
    },
  ];

  // If user prefers reduced motion, render a clean, beautiful static editorial showcase
  if (shouldReduceMotion) {
    return (
      <section className="my-16 space-y-6 rounded-3xl border border-white/[0.08] bg-[#0c0e1a]/80 p-6 sm:p-10 font-sans">
        <div className="border-b border-white/[0.08] pb-4">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
            Archival Principles
          </p>
          <h3 className="font-serif text-2xl text-amber-50 mt-1">
            The Philosophy of EchoRIS
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {chapters.map((ch) => (
            <div
              key={ch.number}
              className="rounded-2xl border border-white/[0.06] bg-black/30 p-6"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>{ch.number} / 04</span>
                <span className="text-amber-300">{ch.kicker}</span>
              </div>
              <h4 className="font-serif text-xl font-medium text-amber-100">
                {ch.statement}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {ch.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[320vh] w-full"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden py-8 sm:py-12 px-4 sm:px-8 lg:px-12 pointer-events-auto">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)]"
        />

        {/* Top Story Ribbon: Chapter Stepper & Progress Tracker */}
        <div className="relative z-20 flex flex-col gap-3 border-b border-white/[0.07] pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-sans">
            {/* Active Chapter Label */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-amber-300 text-xs tracking-wider">
                CHAPTER {chapters[activeChapter].number} / 04
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-400 uppercase tracking-[0.2em] text-[11px] font-medium hidden sm:inline">
                {chapters[activeChapter].kicker}
              </span>
            </div>

            {/* Chapter Jump Selectors (01 · 02 · 03 · 04) */}
            <div className="flex items-center gap-1">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.number}
                  onClick={() => jumpToChapter(idx)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                    activeChapter === idx
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
                  }`}
                  title={`Jump to ${ch.kicker}`}
                >
                  {ch.number}
                </button>
              ))}

              <span aria-hidden="true" className="text-slate-800 mx-1 hidden sm:inline">|</span>

              <button
                onClick={skipSequence}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors hidden sm:inline px-2 py-1"
              >
                Skip Story ↓
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

        {/* Center Stage: Progressive Statements Transitioning on Scroll */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-0">
          {/* Subtle Roman Numeral Watermark in Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span className="font-serif text-[180px] sm:text-[280px] lg:text-[340px] font-light text-white/[0.02] transition-all duration-700">
              {chapters[activeChapter].roman}
            </span>
          </div>

          {/* Chapter 0 Content */}
          <motion.div
            style={{
              opacity: c0Opacity,
              y: c0Y,
              pointerEvents: activeChapter === 0 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans">
              <span className="text-amber-300">✦</span>
              <span>{chapters[0].kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {chapters[0].statement}
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {chapters[0].description}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>{chapters[0].meta}</span>
            </div>
          </motion.div>

          {/* Chapter 1 Content */}
          <motion.div
            style={{
              opacity: c1Opacity,
              y: c1Y,
              pointerEvents: activeChapter === 1 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-violet-300 font-sans">
              <span className="text-violet-400">◈</span>
              <span>{chapters[1].kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {chapters[1].statement}
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {chapters[1].description}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span>{chapters[1].meta}</span>
            </div>
          </motion.div>

          {/* Chapter 2 Content */}
          <motion.div
            style={{
              opacity: c2Opacity,
              y: c2Y,
              pointerEvents: activeChapter === 2 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-300 font-sans">
              <span className="text-amber-400">⌖</span>
              <span>{chapters[2].kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {chapters[2].statement}
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {chapters[2].description}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>{chapters[2].meta}</span>
            </div>
          </motion.div>

          {/* Chapter 3 Content */}
          <motion.div
            style={{
              opacity: c3Opacity,
              y: c3Y,
              pointerEvents: activeChapter === 3 ? "auto" : "none",
            }}
            className="absolute inset-x-0 mx-auto max-w-3xl text-center px-4"
          >
            <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-purple-300 font-sans">
              <span className="text-purple-400">❖</span>
              <span>{chapters[3].kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.14]">
              {chapters[3].statement}
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
              {chapters[3].description}
            </p>

            {/* Interactive CTAs on the Final Chapter */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onInscribe}
                className="flex items-center gap-2 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-violet-600/25 px-5 py-2.5 text-xs font-semibold text-amber-100 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition hover:border-amber-300 hover:bg-amber-400/25"
              >
                <span>✦ Inscribe an Echo</span>
              </button>

              <button
                onClick={onExploreNexus}
                className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <span>Explore Nexus Below ↓</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Cadence Hint */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-sans text-slate-500 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-amber-300">↓</span>
            <span>Scroll to continue the living journey</span>
          </div>

          <div className="font-mono text-slate-600 text-[10px]">
            STORY PROGRESSION: {Math.round(activeChapter * 33.33)}%
          </div>
        </div>
      </div>
    </div>
  );
}
