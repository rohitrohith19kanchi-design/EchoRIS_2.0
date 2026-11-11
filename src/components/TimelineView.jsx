import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import PinnedTimelineStory from "./PinnedTimelineStory";

export default function TimelineView({ memories, onSelectMemory }) {
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" (newest first) or "asc" (oldest first)
  const containerRef = useRef(null);
  const ledgerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked progression for the vertical timeline rail with organic liquid smoothing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 85%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Sort memories
  const sorted = [...memories].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const scrollToLedger = () => {
    ledgerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Pinned Chronological Storytelling Experience */}
      {memories.length > 0 && (
        <PinnedTimelineStory
          memories={memories}
          onSelectMemory={onSelectMemory}
          onSkipToLedger={scrollToLedger}
        />
      )}

      <div ref={ledgerRef} />

      <div ref={containerRef} className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-amber-50">
            The Chronological Ledger
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            A journey through the timeline of your preserved echoes
          </p>
        </div>

        {/* Chronological order toggle (Interactive filter control) */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSortOrder("desc")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              sortOrder === "desc"
                ? "bg-violet-600/30 text-amber-200 border border-violet-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder("asc")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              sortOrder === "asc"
                ? "bg-violet-600/30 text-amber-200 border border-violet-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Earliest First
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0e1a]/60 p-12 text-center">
          <p className="font-serif text-lg text-slate-300">No echoes in timeline</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8">
          {/* Subtle static background rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 top-3 left-2.5 sm:left-3.5 w-px bg-white/[0.08]"
          />

          {/* Scroll-drawn luminous starlight rail */}
          <motion.div
            aria-hidden="true"
            style={{
              height: shouldReduceMotion ? "100%" : lineHeight,
            }}
            className="absolute top-3 left-2.5 sm:left-3.5 w-px bg-gradient-to-b from-amber-400 via-violet-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)] z-0"
          />

          <div className="space-y-8 relative z-10">
            {sorted.map((mem, index) => {
              const accession = `ECH-${String(index + 1).padStart(3, "0")}`;

              return (
                <motion.div
                  key={mem.id}
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -14, y: 14 }
                  }
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.72,
                    delay: shouldReduceMotion ? 0 : Math.min((index % 6) * 0.09, 0.4),
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="relative group"
                >
                  {/* Glowing Node Marker on the Timeline */}
                  <motion.div
                    initial={
                      shouldReduceMotion ? { scale: 1 } : { scale: 0.5, opacity: 0 }
                    }
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: shouldReduceMotion ? 0 : Math.min((index % 6) * 0.09, 0.4) + 0.1,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    className="absolute -left-[27px] sm:-left-[31px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/60 bg-[#090b14] shadow-[0_0_12px_rgba(212,175,55,0.45)] transition-transform group-hover:scale-125"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  </motion.div>

                  {/* Timeline Entry Card */}
                  <button
                    onClick={() => onSelectMemory(mem)}
                    className="w-full text-left rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#111322] to-[#090b14] p-5 sm:p-6 transition-all duration-300 hover:border-amber-400/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  >
                    {/* Date and Ledger info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-white/[0.05] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-300 text-xs">
                          {accession}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-300 font-medium">
                          {mem.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-violet-300">✦</span>
                        <span className="text-slate-300">{mem.emotion}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl font-medium text-amber-50 group-hover:text-amber-200 transition-colors">
                      {mem.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 font-light line-clamp-2">
                      {mem.description}
                    </p>

                    {/* Connected companions and location */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-white/[0.05] pt-3">
                      {mem.people && mem.people.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-violet-400 text-xs">◈</span>
                          <span>{mem.people.join(", ")}</span>
                        </div>
                      )}

                      {mem.place && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400 text-xs">⌖</span>
                          <span>{mem.place}</span>
                        </div>
                      )}

                      <span className="ml-auto text-[11px] text-slate-400 group-hover:text-amber-300 transition-colors">
                        Inspect Folio →
                      </span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
