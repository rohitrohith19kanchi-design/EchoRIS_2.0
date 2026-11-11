import { motion, useReducedMotion } from "motion/react";

export default function PlacesView({ memories, onSelectMemory }) {
  const shouldReduceMotion = useReducedMotion();
  // Aggregate all unique places and their associated data
  const placesMap = new Map();

  memories.forEach((memory) => {
    const place = (memory.place || "").trim();
    if (!place || place === "Place not specified") return;

    if (!placesMap.has(place)) {
      placesMap.set(place, {
        name: place,
        memories: [],
        companions: new Set(),
        emotions: new Set(),
      });
    }

    const record = placesMap.get(place);
    record.memories.push(memory);
    (memory.people || []).forEach((p) => record.companions.add(p));
    if (memory.emotion) record.emotions.add(memory.emotion);
  });

  const placesList = Array.from(placesMap.values()).sort(
    (a, b) => b.memories.length - a.memories.length
  );

  if (placesList.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-[#0c0e1a]/60 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-950/20 text-2xl text-amber-300">
          ⌖
        </div>
        <h3 className="font-serif text-xl font-medium text-amber-100">
          No Sanctuaries Recorded Yet
        </h3>
        <p className="mt-2 max-w-md mx-auto text-xs text-slate-400 font-sans leading-relaxed">
          When inscripting memories, include the sanctuaries, cafés, cities, or landscapes where your memories transpired to populate your memory atlas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-amber-50">
            Atlas of Sanctuaries & Settings
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {placesList.length} locations etched into your story
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {placesList.map((place, index) => {
          const companionsArray = Array.from(place.companions);
          const emotionsArray = Array.from(place.emotions);

          return (
            <motion.div
              key={place.name}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-35px" }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.1, 0.4),
                ease: [0.19, 1, 0.22, 1],
              }}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111322] to-[#0a0c16] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all hover:border-amber-400/30"
            >
              {/* Place Header */}
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/30 font-serif text-lg text-amber-300">
                    ⌖
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-slate-100">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      {place.memories.length} {place.memories.length === 1 ? "moment" : "moments"} etched
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-amber-300/80">
                  ⌖ SANCTUARY
                </span>
              </div>

              {/* Connected Companions & Emotions */}
              <div className="mt-4 space-y-2 text-xs">
                {companionsArray.length > 0 ? (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-violet-400 text-xs shrink-0">◈</span>
                    <span className="text-slate-400 text-[11px]">Companions:</span>
                    <span className="text-slate-200 truncate">
                      {companionsArray.join(", ")}
                    </span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px] italic">
                    Solitary visits
                  </div>
                )}

                {emotionsArray.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400 text-xs shrink-0">✦</span>
                    <span className="text-slate-400 text-[11px]">Resonances:</span>
                    <span className="text-slate-200 truncate">
                      {emotionsArray.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Associated Memory Folios */}
              <div className="mt-5 border-t border-white/[0.05] pt-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2.5 font-medium">
                  Moments in this Place
                </p>
                <div className="space-y-2">
                  {place.memories.map((mem) => (
                    <button
                      key={mem.id}
                      onClick={() => onSelectMemory(mem)}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5 text-left text-xs transition hover:bg-white/[0.06] hover:border-amber-500/30"
                    >
                      <div className="truncate pr-3">
                        <span className="font-serif text-slate-200 group-hover:text-amber-200 transition-colors">
                          {mem.title}
                        </span>
                        <span className="ml-2 text-[10px] text-slate-400">
                          {mem.date}
                        </span>
                      </div>
                      <span className="text-slate-400 group-hover:text-amber-300 text-xs transition-colors shrink-0">
                        View Folio →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
