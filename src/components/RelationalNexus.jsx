import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function RelationalNexus({
  memories,
  onSelectMemory,
}) {
  const [selectedEntity, setSelectedEntity] = useState(null); // { type: 'person'|'place', name: string }
  const shouldReduceMotion = useReducedMotion();

  // Extract all people and places
  const allPeople = Array.from(
    new Set(memories.flatMap((m) => m.people || []))
  ).filter(Boolean);

  const allPlaces = Array.from(
    new Set(
      memories
        .map((m) => m.place)
        .filter((p) => p && p !== "Place not specified")
    )
  );

  // If an entity is selected, find its connections
  let connectedMemories = memories;
  let connectedPeople = allPeople;
  let connectedPlaces = allPlaces;

  if (selectedEntity) {
    if (selectedEntity.type === "person") {
      connectedMemories = memories.filter((m) =>
        (m.people || []).includes(selectedEntity.name)
      );
      connectedPlaces = Array.from(
        new Set(
          connectedMemories
            .map((m) => m.place)
            .filter((p) => p && p !== "Place not specified")
        )
      );
    } else if (selectedEntity.type === "place") {
      connectedMemories = memories.filter(
        (m) => m.place === selectedEntity.name
      );
      connectedPeople = Array.from(
        new Set(connectedMemories.flatMap((m) => m.people || []))
      );
    }
  }

  return (
    <motion.section
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
      className="rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#111326] via-[#0d0f1e] to-[#080912] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-violet-300">
            <span>✦</span>
            <span>Relational Constellation</span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-amber-50 mt-1">
            Discover Intertwined Echoes
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Select a companion or sanctuary to unveil the invisible threads connecting your life's story.
          </p>
        </div>

        {selectedEntity && (
          <button
            onClick={() => setSelectedEntity(null)}
            className="self-start sm:self-auto text-xs text-amber-300 hover:text-amber-200 border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reset Nexus View ✕
          </button>
        )}
      </div>

      {/* Nodes: Companions & Sanctuaries */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Companions Ring */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-violet-300 font-medium mb-3 flex items-center gap-2">
            <span>◈</span>
            <span>Companions in the Web</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {allPeople.map((person) => {
              const isSelected =
                selectedEntity?.type === "person" &&
                selectedEntity?.name === person;
              const isConnected =
                !selectedEntity ||
                isSelected ||
                connectedPeople.includes(person);

              return (
                <motion.button
                  key={person}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() =>
                    setSelectedEntity(
                      isSelected ? null : { type: "person", name: person }
                    )
                  }
                  className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs transition-colors ${
                    isSelected
                      ? "border border-violet-400 bg-violet-600/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : isConnected
                      ? "border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-violet-400/50 hover:bg-white/[0.06]"
                      : "opacity-40 border border-transparent bg-white/[0.01] text-slate-500"
                  }`}
                >
                  <span className="text-violet-400 text-xs font-serif font-bold">
                    {person.charAt(0)}
                  </span>
                  <span>{person}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sanctuaries Ring */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-amber-300 font-medium mb-3 flex items-center gap-2">
            <span>⌖</span>
            <span>Sanctuaries in the Atlas</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {allPlaces.map((place) => {
              const isSelected =
                selectedEntity?.type === "place" &&
                selectedEntity?.name === place;
              const isConnected =
                !selectedEntity ||
                isSelected ||
                connectedPlaces.includes(place);

              return (
                <motion.button
                  key={place}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() =>
                    setSelectedEntity(
                      isSelected ? null : { type: "place", name: place }
                    )
                  }
                  className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs transition-colors ${
                    isSelected
                      ? "border border-amber-400 bg-amber-500/25 text-amber-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : isConnected
                      ? "border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-amber-400/50 hover:bg-white/[0.06]"
                      : "opacity-40 border border-transparent bg-white/[0.01] text-slate-500"
                  }`}
                >
                  <span className="text-amber-400 text-xs">⌖</span>
                  <span>{place}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Relational Results Preview */}
      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-400">
            {selectedEntity ? (
              <>
                Echoes connected to{" "}
                <strong className="text-amber-200">
                  {selectedEntity.name}
                </strong>
                :
              </>
            ) : (
              "All Relational Echoes in Vault:"
            )}
          </span>
          <span className="text-slate-500 tabular-nums">
            {connectedMemories.length} {connectedMemories.length === 1 ? "echo" : "echoes"}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {connectedMemories.slice(0, 6).map((mem) => (
            <button
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-violet-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>{mem.date}</span>
                <span className="text-violet-300">{mem.emotion}</span>
              </div>
              <p className="font-serif text-sm font-medium text-slate-200 line-clamp-1">
                {mem.title}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 truncate">
                {mem.place && `⌖ ${mem.place}`}
                {mem.people?.length > 0 && ` · ◈ ${mem.people.join(", ")}`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
