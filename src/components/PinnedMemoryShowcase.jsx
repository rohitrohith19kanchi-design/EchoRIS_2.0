import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

const emotionColorStyles = {
  Nostalgia: {
    accent: "text-violet-300",
    border: "border-violet-500/40",
    glow: "rgba(139, 92, 246, 0.15)",
    mark: "◈",
  },
  Peace: {
    accent: "text-emerald-300",
    border: "border-emerald-500/40",
    glow: "rgba(16, 185, 129, 0.15)",
    mark: "✦",
  },
  Pride: {
    accent: "text-amber-300",
    border: "border-amber-500/40",
    glow: "rgba(245, 158, 11, 0.15)",
    mark: "☼",
  },
  Wonder: {
    accent: "text-cyan-300",
    border: "border-cyan-500/40",
    glow: "rgba(6, 182, 212, 0.15)",
    mark: "✧",
  },
  Reverence: {
    accent: "text-purple-300",
    border: "border-purple-500/40",
    glow: "rgba(168, 85, 247, 0.15)",
    mark: "❖",
  },
  Joy: {
    accent: "text-rose-300",
    border: "border-rose-500/40",
    glow: "rgba(244, 63, 94, 0.15)",
    mark: "✶",
  },
};

export default function PinnedMemoryShowcase({
  memories = [],
  onSelectMemory,
  onViewAll,
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeFolio, setActiveFolio] = useState(0);

  // Take top 3 or 4 real memories for the pinned showcase
  const featuredMemories = memories.slice(0, 3);
  const count = featuredMemories.length;

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
    if (count <= 1) {
      setActiveFolio(0);
      return;
    }
    const step = Math.min(Math.floor(latest * count), count - 1);
    setActiveFolio(step);
  });

  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Transitions for 3 memories
  const f0Opacity = useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0]);
  const f0Y = useTransform(scrollYProgress, [0, 0.22, 0.33], [0, 0, -35]);

  const f1Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const f1Y = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [35, 0, 0, -35]);

  const f2Opacity = useTransform(scrollYProgress, [0.67, 0.77, 1.0], [0, 1, 1]);
  const f2Y = useTransform(scrollYProgress, [0.67, 0.77, 1.0], [35, 0, 0]);

  const jumpToFolio = (index) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + (index / count) * scrollableDistance + 12;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  if (count === 0) {
    return null;
  }

  // Reduced motion fallback
  if (shouldReduceMotion) {
    return (
      <section className="my-16 space-y-6 rounded-3xl border border-white/[0.08] bg-[#0c0e1a]/80 p-6 sm:p-10 font-sans">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
              Archival Exhibition
            </p>
            <h3 className="font-serif text-2xl text-amber-50 mt-1">
              Featured Preserved Echoes
            </h3>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs text-amber-300 hover:text-amber-200"
          >
            View All Codex Entries →
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="cursor-pointer rounded-2xl border border-white/[0.08] bg-black/40 p-6 transition hover:border-amber-400/40"
            >
              <div className="text-xs text-amber-300 font-mono mb-2">
                {mem.date} · {mem.emotion}
              </div>
              <h4 className="font-serif text-xl font-medium text-amber-100">
                {mem.title}
              </h4>
              <p className="mt-2 text-xs text-slate-300 line-clamp-3">
                {mem.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const activeMem = featuredMemories[activeFolio] || featuredMemories[0];
  const activeTone = emotionColorStyles[activeMem?.emotion] || {
    accent: "text-violet-300",
    border: "border-violet-500/40",
    glow: "rgba(139, 92, 246, 0.15)",
    mark: "✦",
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[280vh] w-full"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden py-8 sm:py-12 px-4 sm:px-8 lg:px-12 pointer-events-auto">
        {/* Dynamic Emotion Glow in Background */}
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${activeTone.glow} 0%, transparent 65%)`,
          }}
          className="pointer-events-none absolute inset-0 -z-10 transition-all duration-700"
        />

        {/* Top Header & Chapter Progress */}
        <div className="relative z-20 flex flex-col gap-3 border-b border-white/[0.07] pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-amber-300 text-xs tracking-wider">
                FOLIO {String(activeFolio + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-400 uppercase tracking-[0.2em] text-[11px] font-medium hidden sm:inline">
                FEATURED ARTIFACT SHOWCASE
              </span>
            </div>

            {/* Folio Jump Controls */}
            <div className="flex items-center gap-1.5">
              {featuredMemories.map((mem, idx) => (
                <button
                  key={mem.id}
                  onClick={() => jumpToFolio(idx)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                    activeFolio === idx
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
                  }`}
                  title={mem.title}
                >
                  {String(idx + 1).padStart(2, "0")}
                </button>
              ))}

              <span aria-hidden="true" className="text-slate-800 mx-1 hidden sm:inline">|</span>

              <button
                onClick={onViewAll}
                className="text-[11px] text-amber-300 hover:text-amber-200 transition-colors hidden sm:inline px-2 py-1"
              >
                All Codex Entries →
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              style={{ width: progressBarWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-violet-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            />
          </div>
        </div>

        {/* Center Stage: Large Typography Memory Folios */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-0">
          {/* Folio 0 */}
          {featuredMemories[0] && (
            <motion.div
              style={{
                opacity: f0Opacity,
                y: f0Y,
                pointerEvents: activeFolio === 0 ? "auto" : "none",
              }}
              className="absolute inset-x-0 mx-auto max-w-4xl px-4 text-center sm:text-left"
            >
              <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-b from-[#111326]/90 via-[#0c0e1c]/80 to-[#07080f]/90 p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                {/* Meta Ledger Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-6 text-xs font-sans text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-amber-300 tracking-wider">ECH-001</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-300 font-medium">{featuredMemories[0].date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={activeTone.accent}>{activeTone.mark}</span>
                    <span className="text-slate-200 font-medium">{featuredMemories[0].emotion}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-[11px] font-mono text-slate-500">ENCRYPTED FOLIO</span>
                  </div>
                </div>

                {/* Monumental Title */}
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.12]">
                  {featuredMemories[0].title}
                </h2>

                {/* Narrative Passage */}
                <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-3xl line-clamp-4">
                  "{featuredMemories[0].description}"
                </p>

                {/* Connected Relational Nodes Strip */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6 font-sans text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    {featuredMemories[0].place && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">⌖</span>
                        <span className="text-slate-400 text-[11px]">Sanctuary:</span>
                        <span className="text-slate-200 font-medium">{featuredMemories[0].place}</span>
                      </div>
                    )}

                    {featuredMemories[0].people?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-violet-400">◈</span>
                        <span className="text-slate-400 text-[11px]">Companions:</span>
                        <span className="text-slate-200 font-medium">
                          {featuredMemories[0].people.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Primary Inspection Action */}
                  <button
                    onClick={() => onSelectMemory(featuredMemories[0])}
                    className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/25 hover:border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  >
                    <span>Inspect Full Folio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Folio 1 */}
          {featuredMemories[1] && (
            <motion.div
              style={{
                opacity: f1Opacity,
                y: f1Y,
                pointerEvents: activeFolio === 1 ? "auto" : "none",
              }}
              className="absolute inset-x-0 mx-auto max-w-4xl px-4 text-center sm:text-left"
            >
              <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-b from-[#111326]/90 via-[#0c0e1c]/80 to-[#07080f]/90 p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                {/* Meta Ledger Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-6 text-xs font-sans text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-amber-300 tracking-wider">ECH-002</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-300 font-medium">{featuredMemories[1].date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={activeTone.accent}>{activeTone.mark}</span>
                    <span className="text-slate-200 font-medium">{featuredMemories[1].emotion}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-[11px] font-mono text-slate-500">ENCRYPTED FOLIO</span>
                  </div>
                </div>

                {/* Monumental Title */}
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.12]">
                  {featuredMemories[1].title}
                </h2>

                {/* Narrative Passage */}
                <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-3xl line-clamp-4">
                  "{featuredMemories[1].description}"
                </p>

                {/* Connected Relational Nodes Strip */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6 font-sans text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    {featuredMemories[1].place && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">⌖</span>
                        <span className="text-slate-400 text-[11px]">Sanctuary:</span>
                        <span className="text-slate-200 font-medium">{featuredMemories[1].place}</span>
                      </div>
                    )}

                    {featuredMemories[1].people?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-violet-400">◈</span>
                        <span className="text-slate-400 text-[11px]">Companions:</span>
                        <span className="text-slate-200 font-medium">
                          {featuredMemories[1].people.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Primary Inspection Action */}
                  <button
                    onClick={() => onSelectMemory(featuredMemories[1])}
                    className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/25 hover:border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  >
                    <span>Inspect Full Folio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Folio 2 */}
          {featuredMemories[2] && (
            <motion.div
              style={{
                opacity: f2Opacity,
                y: f2Y,
                pointerEvents: activeFolio === 2 ? "auto" : "none",
              }}
              className="absolute inset-x-0 mx-auto max-w-4xl px-4 text-center sm:text-left"
            >
              <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-b from-[#111326]/90 via-[#0c0e1c]/80 to-[#07080f]/90 p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                {/* Meta Ledger Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-6 text-xs font-sans text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-amber-300 tracking-wider">ECH-003</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-300 font-medium">{featuredMemories[2].date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={activeTone.accent}>{activeTone.mark}</span>
                    <span className="text-slate-200 font-medium">{featuredMemories[2].emotion}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-[11px] font-mono text-slate-500">ENCRYPTED FOLIO</span>
                  </div>
                </div>

                {/* Monumental Title */}
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-amber-50 leading-[1.12]">
                  {featuredMemories[2].title}
                </h2>

                {/* Narrative Passage */}
                <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-light max-w-3xl line-clamp-4">
                  "{featuredMemories[2].description}"
                </p>

                {/* Connected Relational Nodes Strip */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6 font-sans text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    {featuredMemories[2].place && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">⌖</span>
                        <span className="text-slate-400 text-[11px]">Sanctuary:</span>
                        <span className="text-slate-200 font-medium">{featuredMemories[2].place}</span>
                      </div>
                    )}

                    {featuredMemories[2].people?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-violet-400">◈</span>
                        <span className="text-slate-400 text-[11px]">Companions:</span>
                        <span className="text-slate-200 font-medium">
                          {featuredMemories[2].people.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Primary Inspection Action */}
                  <button
                    onClick={() => onSelectMemory(featuredMemories[2])}
                    className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/25 hover:border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  >
                    <span>Inspect Full Folio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Navigation Hint */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-sans text-slate-500 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-amber-300">↓</span>
            <span>Scroll to browse featured memories</span>
          </div>

          <button
            onClick={onViewAll}
            className="text-[11px] text-amber-300/80 hover:text-amber-200 font-mono"
          >
            ALL ENTRIES ({memories.length}) →
          </button>
        </div>
      </div>
    </div>
  );
}
