import { motion, useReducedMotion } from "motion/react";

export default function PeopleView({
  memories,
  onSelectMemory,
  onSelectPlace,
}) {
  const shouldReduceMotion = useReducedMotion();
  // Aggregate all unique people and their associated data
  const peopleMap = new Map();

  memories.forEach((memory) => {
    (memory.people || []).forEach((person) => {
      const trimmed = person.trim();
      if (!trimmed) return;
      if (!peopleMap.has(trimmed)) {
        peopleMap.set(trimmed, {
          name: trimmed,
          memories: [],
          places: new Set(),
          emotions: new Set(),
        });
      }
      const record = peopleMap.get(trimmed);
      record.memories.push(memory);
      if (memory.place) record.places.add(memory.place);
      if (memory.emotion) record.emotions.add(memory.emotion);
    });
  });

  const peopleList = Array.from(peopleMap.values()).sort(
    (a, b) => b.memories.length - a.memories.length
  );

  if (peopleList.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-[#0c0e1a]/60 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-950/20 text-2xl text-violet-300">
          ◈
        </div>
        <h3 className="font-serif text-xl font-medium text-amber-100">
          No Companions Recorded Yet
        </h3>
        <p className="mt-2 max-w-md mx-auto text-xs text-slate-400 font-sans leading-relaxed">
          When inscripting memories, add friends, family, or mentors in the companions field to weave them into your relational constellation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-amber-50">
            Companions in Your Story
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {peopleList.length} companions linked across your memories
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {peopleList.map((person, index) => {
          const placesArray = Array.from(person.places);
          const emotionsArray = Array.from(person.emotions);

          return (
            <motion.div
              key={person.name}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-35px" }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.1, 0.4),
                ease: [0.19, 1, 0.22, 1],
              }}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111322] to-[#0a0c16] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all hover:border-violet-400/30"
            >
              {/* Person Header */}
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-950/40 font-serif text-lg font-semibold text-amber-200">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-slate-100">
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      {person.memories.length} {person.memories.length === 1 ? "memory" : "memories"} entwined
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-amber-300/80">
                  ◈ LINKED
                </span>
              </div>

              {/* Connected places & emotions */}
              <div className="mt-4 space-y-2 text-xs">
                {placesArray.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400 text-xs shrink-0">⌖</span>
                    <span className="text-slate-400 text-[11px]">Sanctuaries:</span>
                    <span className="text-slate-200 truncate">
                      {placesArray.map((p, idx) => (
                        <span key={p}>
                          <button
                            type="button"
                            onClick={() => onSelectPlace && onSelectPlace(p)}
                            className="hover:text-amber-200 underline underline-offset-2 transition-colors"
                          >
                            {p}
                          </button>
                          {idx < placesArray.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                {emotionsArray.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-violet-400 text-xs shrink-0">✦</span>
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
                  Shared Remembrances
                </p>
                <div className="space-y-2">
                  {person.memories.map((mem) => (
                    <button
                      key={mem.id}
                      onClick={() => onSelectMemory(mem)}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5 text-left text-xs transition hover:bg-white/[0.06] hover:border-violet-500/30"
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
