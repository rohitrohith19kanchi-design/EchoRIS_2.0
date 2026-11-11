import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function MemoryDetailModal({
  memory,
  onClose,
  onDelete,
  showDeleteConfirm,
  setShowDeleteConfirm,
  onSelectPerson,
  onSelectPlace,
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!memory) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 sm:p-6 backdrop-blur-md"
    >
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-auto w-full max-w-2xl rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#121422] to-[#090b14] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-slate-100"
      >
        {/* Folio Header Header Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-2.5 text-xs font-sans text-slate-400">
            <span className="font-mono text-amber-300/90 text-xs tracking-wider">
              FOLIO ACCESSION
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{memory.date}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close folio"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Folio Main Title */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs font-sans text-violet-300 uppercase tracking-widest mb-2">
            <span>Resonance:</span>
            <span className="font-semibold text-amber-200">{memory.emotion}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide text-amber-50">
            {memory.title}
          </h2>
        </div>

        {/* Narrative Prose */}
        <div className="mt-6 rounded-2xl border border-white/[0.05] bg-black/25 p-6">
          <p className="font-serif text-base sm:text-lg leading-relaxed text-slate-200 first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-300 first-letter:float-left first-letter:mr-3 first-letter:leading-none whitespace-pre-wrap">
            {memory.description}
          </p>
        </div>

        {/* Relational Ties Matrix */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-white/[0.08] pt-6 font-sans">
          {/* Companions */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 mb-2">
              <span className="text-violet-400">◈</span>
              <span>Companions Entwined</span>
            </div>
            {memory.people && memory.people.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {memory.people.map((person) => (
                  <button
                    key={person}
                    type="button"
                    onClick={() => onSelectPerson && onSelectPerson(person)}
                    className="text-xs text-violet-200 hover:text-amber-200 underline underline-offset-4 transition-colors"
                  >
                    {person}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No companions recorded.</p>
            )}
          </div>

          {/* Sanctuary Location */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 mb-2">
              <span className="text-amber-400">⌖</span>
              <span>Sanctuary & Setting</span>
            </div>
            {memory.place ? (
              <button
                type="button"
                onClick={() => onSelectPlace && onSelectPlace(memory.place)}
                className="text-xs text-slate-200 hover:text-amber-200 underline underline-offset-4 transition-colors text-left"
              >
                {memory.place}
              </button>
            ) : (
              <p className="text-xs text-slate-500 italic">No location recorded.</p>
            )}
          </div>
        </div>

        {/* Two-Step Archival Deletion */}
        <div className="mt-8 border-t border-white/[0.08] pt-6">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-serif italic">
                Vault Record permanent preservation
              </span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-sans text-rose-400/80 hover:text-rose-300 transition-colors py-2 px-3 rounded-lg hover:bg-rose-950/20"
              >
                Dissolve this memory
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 font-sans">
              <p className="text-sm font-medium text-rose-200">
                Dissolve this memory from the archive?
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                This will permanently erase this remembrance and disconnect it from all associated companions and sanctuaries. This action cannot be reversed.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs text-slate-300 transition hover:bg-white/[0.08]"
                >
                  Preserve & Keep
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 rounded-xl bg-rose-600/80 hover:bg-rose-500 py-2.5 text-xs font-medium text-white transition shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                >
                  Yes, Dissolve Permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
