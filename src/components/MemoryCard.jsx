import { motion, useReducedMotion } from "motion/react";

// Emotion tone styling mapping for subtle ambient glow
const emotionToneMap = {
  Nostalgia: {
    accent: "text-violet-300",
    border: "group-hover:border-violet-400/40",
    glow: "from-violet-950/25 via-[#0e1020] to-[#090b14]",
    mark: "◈",
  },
  Peace: {
    accent: "text-emerald-300",
    border: "group-hover:border-emerald-400/40",
    glow: "from-emerald-950/25 via-[#0e1020] to-[#090b14]",
    mark: "✦",
  },
  Pride: {
    accent: "text-amber-300",
    border: "group-hover:border-amber-400/40",
    glow: "from-amber-950/25 via-[#0e1020] to-[#090b14]",
    mark: "☼",
  },
  Wonder: {
    accent: "text-cyan-300",
    border: "group-hover:border-cyan-400/40",
    glow: "from-cyan-950/25 via-[#0e1020] to-[#090b14]",
    mark: "✧",
  },
  Reverence: {
    accent: "text-purple-300",
    border: "group-hover:border-purple-400/40",
    glow: "from-purple-950/25 via-[#0e1020] to-[#090b14]",
    mark: "❖",
  },
  Joy: {
    accent: "text-rose-300",
    border: "group-hover:border-rose-400/40",
    glow: "from-rose-950/25 via-[#0e1020] to-[#090b14]",
    mark: "✶",
  },
};

export default function MemoryCard({ memory, index = 0, onSelect }) {
  const shouldReduceMotion = useReducedMotion();
  const tone = emotionToneMap[memory.emotion] || {
    accent: "text-violet-300",
    border: "group-hover:border-violet-400/40",
    glow: "from-violet-950/20 via-[#0e1020] to-[#090b14]",
    mark: "✦",
  };

  // Archival accession code formatted cleanly
  const accessionCode = `ECH-${String(index + 1).padStart(3, "0")}`;

  return (
    <motion.button
      onClick={() => onSelect(memory)}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{
        duration: 0.72,
        delay: shouldReduceMotion ? 0 : Math.min((index % 6) * 0.1, 0.45),
        ease: [0.19, 1, 0.22, 1],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -5, transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] } }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      className="group relative flex flex-col h-full w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
    >
      <article
        className={`flex flex-col h-full w-full rounded-2xl border border-white/[0.08] bg-gradient-to-b ${tone.glow} p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-colors duration-300 ${tone.border}`}
      >
        {/* Top Ledger: Accession Code + Date + Privacy status */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.05] pb-3 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-wider text-amber-300/80">
              {accessionCode}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-300">{memory.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={tone.accent}>{tone.mark}</span>
            <span className="text-slate-300 font-medium">{memory.emotion}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-medium tracking-wide text-slate-100 group-hover:text-amber-100 transition-colors line-clamp-2">
          {memory.title}
        </h3>

        {/* Narrative Excerpt */}
        <p className="mt-3 line-clamp-3 font-sans text-xs sm:text-sm leading-relaxed text-slate-300 font-light flex-1">
          {memory.description}
        </p>

        {/* Relational Web Metadata (Unboxed, clean editorial metadata) */}
        <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-4 text-xs font-sans">
          {/* People connected */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-violet-400 text-xs shrink-0" title="Companions">◈</span>
            <span className="truncate">
              {memory.people && memory.people.length > 0 ? (
                <>
                  <span className="text-slate-400 text-[11px] mr-1">With:</span>
                  <span className="text-slate-200">{memory.people.join(", ")}</span>
                </>
              ) : (
                <span className="text-slate-500 italic text-[11px]">Solitary memory</span>
              )}
            </span>
          </div>

          {/* Place */}
          <div className="flex items-center justify-between text-slate-300 pt-0.5">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400/80 text-xs shrink-0" title="Sanctuary">⌖</span>
              <span className="truncate text-slate-300">
                {memory.place || "Unrecorded place"}
              </span>
            </div>

            <span className="text-[11px] text-slate-400 group-hover:text-amber-300 transition-colors shrink-0 ml-2">
              Inspect Folio →
            </span>
          </div>
        </div>
      </article>
    </motion.button>
  );
}
