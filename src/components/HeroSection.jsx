import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import vaultImg from "../assets/images/archive_vault_chamber_1794409981374.jpg";
import logoImg from "../assets/echoris_orbs.png";

export default function HeroSection({
  onInscribe,
  onExploreTimeline,
  memoriesCount,
  peopleCount,
  placesCount,
  emotionsCount,
}) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Gentle scroll-linked parallax for the archival background with natural inertia
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 25,
    restDelta: 0.001,
  });

  const bgY = useTransform(smoothScroll, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(smoothScroll, [0, 1], [1.04, 1.11]);

  return (
    <motion.section
      ref={sectionRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative mb-12 overflow-hidden rounded-3xl border border-amber-400/20 bg-[#0c0e1a] shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
    >
      {/* Background Archival Chamber Image with subtle scroll-linked parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : bgY,
            scale: shouldReduceMotion ? 1.05 : bgScale,
          }}
          className="h-full w-full"
        >
          <img
            src={vaultImg}
            alt="EchoRIS Archival Chamber"
            className="h-full w-full object-cover object-center opacity-35"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080912] via-[#080912]/85 to-[#080912]/40" />
        <div className="absolute inset-0 bg-radial-archival opacity-80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="max-w-3xl">
          {/* Curatorial Kicker with original EchoRIS logo (unanimated, perfectly preserved) */}
          <div className="mb-4 flex items-center gap-3 text-xs text-amber-300/90 font-sans tracking-[0.25em] uppercase">
            <div className="h-7 w-7 shrink-0 drop-shadow-[0_0_10px_rgba(167,139,250,0.3)]">
              <img
                src={logoImg}
                alt="EchoRIS Logo"
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>Relational Memory Archive</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 normal-case tracking-normal font-serif italic text-sm">
              Sanctum of Living Remembrances
            </span>
          </div>

          {/* Majestic Editorial Title */}
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.19, 1, 0.22, 1] }}
            className="font-serif text-3xl font-normal tracking-tight text-amber-50 sm:text-4xl lg:text-5xl leading-[1.15]"
          >
            Preserve the moments that shaped your existence.
          </motion.h2>

          {/* Atmospheric description */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.19, 1, 0.22, 1] }}
            className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-slate-300 font-light"
          >
            An enchanted digital codex where life's echoes remain eternally woven with the companions who shared them, the sanctuaries where they unfolded, and the emotional resonance that endures.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onInscribe}
              className="flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-violet-600/25 px-5 py-3 text-xs font-semibold tracking-wide text-amber-100 shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-200 hover:border-amber-300 hover:bg-amber-400/25 hover:text-white"
            >
              <span className="text-amber-300 font-serif text-sm">✦</span>
              <span>Inscribe an Echo</span>
            </button>

            <button
              onClick={onExploreTimeline}
              className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-xs font-medium tracking-wide text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
            >
              <span>Explore Timeline</span>
              <span className="text-slate-500 text-sm">→</span>
            </button>
          </motion.div>
        </div>

        {/* Archival Metrics Ribbon (Clean, Unboxed, Zero-Pill) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.42, ease: [0.19, 1, 0.22, 1] }}
          className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-white/[0.08] pt-6 font-sans"
        >
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Echoes Preserved
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber-100 tabular-nums">
              {memoriesCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Memories in Vault</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Companions
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber-100 tabular-nums">
              {peopleCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Entwined in Story</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Sanctuaries
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber-100 tabular-nums">
              {placesCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sacred Spaces</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Emotional Spectrum
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber-100 tabular-nums">
              {emotionsCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Resonances felt</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
