import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

const commonEmotions = [
  "Nostalgia",
  "Peace",
  "Pride",
  "Wonder",
  "Joy",
  "Reverence",
  "Melancholy",
  "Gratitude",
];

export default function MemoryFormModal({
  form,
  updateForm,
  onSubmit,
  onClose,
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 sm:p-6 backdrop-blur-md"
    >
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-auto w-full max-w-xl rounded-3xl border border-amber-400/25 bg-gradient-to-b from-[#121526] via-[#0d0f1c] to-[#080912] p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.7)] text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-amber-300/80">
              <span className="text-amber-400 text-sm">✦</span>
              <span>Preserve a Remembrance</span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-medium tracking-wide text-amber-50">
              Inscribe New Echo
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close inscription modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="mt-6 space-y-5 font-sans">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Title of Remembrance <span className="text-amber-300">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="e.g., Midnight conversation under the old banyan tree"
              className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-serif"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              What transpired? <span className="text-amber-300">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Inscribe the thoughts, sounds, and sensations that made this moment indelible..."
              className="w-full resize-none rounded-xl border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-sans leading-relaxed"
            />
          </div>

          {/* Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Date & Time of the Memory
              </label>
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  updateForm("date", today);
                }}
                className="text-[11px] text-amber-300/80 hover:text-amber-200 transition-colors"
              >
                Set to Today
              </button>
            </div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateForm("date", e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* People & Place in 2 Columns */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Companions Linked
              </label>
              <input
                value={form.person}
                onChange={(e) => updateForm("person", e.target.value)}
                placeholder="Names, comma-separated"
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Connects memory to people
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Sanctuary / Place
              </label>
              <input
                value={form.place}
                onChange={(e) => updateForm("place", e.target.value)}
                placeholder="Where did it happen?"
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Geography of your story
              </p>
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Emotional Resonance
            </label>
            <input
              value={form.emotion}
              onChange={(e) => updateForm("emotion", e.target.value)}
              placeholder="e.g. Nostalgia, Peace, Wonder..."
              className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60"
            />
            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {commonEmotions.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => updateForm("emotion", emo)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    form.emotion === emo
                      ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20"
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3.5 border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.12] bg-white/[0.03] py-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/25 via-violet-600/30 to-purple-700/30 py-3 text-xs font-semibold text-amber-100 shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all hover:border-amber-300 hover:bg-amber-400/35 hover:text-white"
            >
              ✦ Inscribe Into Vault
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
