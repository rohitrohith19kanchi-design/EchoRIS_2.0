import { useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import AmbientStarfield from "./components/AmbientStarfield";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MemoryCard from "./components/MemoryCard";
import MemoryDetailModal from "./components/MemoryDetailModal";
import MemoryFormModal from "./components/MemoryFormModal";
import PeopleView from "./components/PeopleView";
import PlacesView from "./components/PlacesView";
import TimelineView from "./components/TimelineView";
import RelationalNexus from "./components/RelationalNexus";
import PinnedStoryteller from "./components/PinnedStoryteller";
import PinnedMemoryShowcase from "./components/PinnedMemoryShowcase";
import PinnedMemoryExploration from "./components/PinnedMemoryExploration";
import logoImg from "./assets/echoris_orbs.png";

const initialMemories = [
  {
    id: 1,
    title: "College fest",
    description:
      "A fun day spent with friends at the college fest. The live music reverberated through the courtyard, lanterns glowing in the evening dusk. One of those days I wish I could relive.",
    date: "October 29, 2026",
    people: ["Ananya"],
    place: "College campus",
    emotion: "Nostalgia",
    color: "from-violet-500/20 to-indigo-500/10",
  },
  {
    id: 2,
    title: "A quiet evening",
    description:
      "Watching the sunset bathe the skyline in amber light, talking about absolutely everything from childhood dreams to the mysteries of the universe.",
    date: "October 18, 2026",
    people: ["Rahul", "Ananya"],
    place: "Our favorite café",
    emotion: "Peace",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: 3,
    title: "The first project",
    description:
      "The sleepless thrill and shared excitement of building something together from scratch for the very first time. Whiteboards covered in diagrams and endless cups of chai.",
    date: "October 12, 2026",
    people: ["Rahul"],
    place: "College lab",
    emotion: "Pride",
    color: "from-amber-500/20 to-orange-500/10",
  },
];

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 24,
    restDelta: 0.5,
  });
  const orb1Y = useTransform(smoothScrollY, [0, 1000], [0, 70]);
  const orb2Y = useTransform(smoothScrollY, [0, 1000], [0, -55]);

  const [memories, setMemories] = useState(initialMemories);
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "timeline"

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    person: "",
    place: "",
    emotion: "",
  });

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const deleteMemory = () => {
    if (!selectedMemory) return;

    setMemories((previous) =>
      previous.filter((memory) => memory.id !== selectedMemory.id)
    );

    setSelectedMemory(null);
    setShowDeleteConfirm(false);
  };

  const createMemory = (event) => {
    event.preventDefault();

    const newMemory = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      date: form.date
        ? new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Date not specified",
      people: form.person
        .split(",")
        .map((person) => person.trim())
        .filter(Boolean),
      place: form.place || "Place not specified",
      emotion: form.emotion || "Wonder",
      color: "from-violet-500/20 to-indigo-500/10",
    };

    setMemories((previous) => [newMemory, ...previous]);
    setForm({
      title: "",
      description: "",
      date: "",
      person: "",
      place: "",
      emotion: "",
    });

    setShowForm(false);
    setActivePage("Memories");
  };

  // Filter memories based on search query and optional emotion filter
  const filteredMemories = memories.filter((memory) => {
    const searchableText = [
      memory.title,
      memory.description,
      (memory.people || []).join(" "),
      memory.place,
      memory.emotion,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());
    const matchesEmotion =
      selectedEmotion === "All" || memory.emotion === selectedEmotion;

    return matchesSearch && matchesEmotion;
  });

  // Calculate unique stats for Hero and Navigation
  const uniquePeople = new Set(memories.flatMap((m) => m.people || []));
  const uniquePlaces = new Set(
    memories.map((m) => m.place).filter((p) => p && p !== "Place not specified")
  );
  const uniqueEmotions = new Set(
    memories.map((m) => m.emotion).filter(Boolean)
  );
  const emotionList = ["All", ...Array.from(uniqueEmotions)];

  const pageTitle =
    activePage === "Dashboard"
      ? "Your memories, connected."
      : activePage === "Memories"
      ? "Your memory archive."
      : activePage === "Timeline"
      ? "The river of time."
      : activePage === "People"
      ? "The people in your story."
      : "Places that stay with you.";

  return (
    <div className="relative min-h-screen bg-[#07080e] text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0 overflow-x-clip">
      {/* Scroll-linked ambient atmospheric glow elements */}
      <motion.div
        aria-hidden="true"
        style={{ y: shouldReduceMotion ? 0 : orb1Y }}
        className="pointer-events-none fixed -top-24 right-10 h-[500px] w-[500px] rounded-full bg-violet-600/[0.04] blur-[120px] -z-10"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: shouldReduceMotion ? 0 : orb2Y }}
        className="pointer-events-none fixed top-1/2 -left-20 h-[450px] w-[450px] rounded-full bg-amber-500/[0.03] blur-[120px] -z-10"
      />

      {/* Background stardust particle canvas */}
      <AmbientStarfield />

      {/* Navigation (Desktop Sidebar & Mobile Header/Dock) */}
      <Navigation
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenCreate={() => setShowForm(true)}
        memoriesCount={memories.length}
        peopleCount={uniquePeople.size}
      />

      {/* Main Archival Canvas */}
      <main className="relative z-10 min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        {/* Curated Top Bar Header (Desktop only breadcrumb & quick actions) */}
        <header className="mb-8 hidden md:flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2 text-xs font-sans text-slate-400">
            <span className="text-amber-300 font-serif">✦</span>
            <span>Personal Vault</span>
            <span aria-hidden="true" className="text-slate-700">/</span>
            <span className="text-slate-200 font-medium">{activePage}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-slate-500 font-mono text-[11px]">
              VAULT STATUS: ENCRYPTED
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20 hover:border-amber-400"
            >
              <span>+ Inscribe Echo</span>
            </button>
          </div>
        </header>

        {/* Dashboard View */}
        {activePage === "Dashboard" && (
          <motion.div
            key="dashboard-view"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-16"
          >
            {/* Hero Section */}
            <HeroSection
              onInscribe={() => setShowForm(true)}
              onExploreTimeline={() => setActivePage("Timeline")}
              memoriesCount={memories.length}
              peopleCount={uniquePeople.size}
              placesCount={uniquePlaces.size}
              emotionsCount={uniqueEmotions.size}
            />

            {/* Pinned Scroll Storytelling Overture (Inspired by karchit.vercel.app) */}
            <PinnedStoryteller
              memoriesCount={memories.length}
              peopleCount={uniquePeople.size}
              placesCount={uniquePlaces.size}
              onInscribe={() => setShowForm(true)}
              onExploreNexus={() => {
                const el = document.getElementById("relational-nexus-anchor");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Relational Nexus discovery matrix */}
            <div id="relational-nexus-anchor" className="scroll-mt-6">
              <RelationalNexus
                memories={memories}
                onSelectMemory={(memory) => setSelectedMemory(memory)}
              />
            </div>

            {/* Featured Memories Pinned Showcase (Progressive scroll presentation) */}
            <PinnedMemoryShowcase
              memories={memories}
              onSelectMemory={(memory) => setSelectedMemory(memory)}
              onViewAll={() => setActivePage("Memories")}
            />

            {/* Recent Preserved Echoes Section */}
            <motion.section
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-amber-50">
                    Recently Preserved Echoes
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 font-sans">
                    The latest remembrances inscribed into the archival codex
                  </p>
                </div>

                <button
                  onClick={() => setActivePage("Memories")}
                  className="self-start sm:self-auto text-xs font-sans text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
                >
                  <span>View All Codex Entries</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {memories.slice(0, 3).map((memory, index) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    index={index}
                    onSelect={(mem) => setSelectedMemory(mem)}
                  />
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}

        {/* Memories / Codex View */}
        {activePage === "Memories" && (
          <motion.div
            key="memories-view"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-8"
          >
            {/* Page Header */}
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-amber-300/80 mb-2">
                Complete Archival Ledger
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-amber-50">
                {pageTitle}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
                Every moment inscribed into your personal vault. Search by narrative, filter by emotional resonance, or toggle into the chronological ledger.
              </p>
            </div>

            {/* Pinned Memory Exploration Sequence */}
            <PinnedMemoryExploration
              onSelectEmotion={(emo) => setSelectedEmotion(emo)}
              onSkipToSearch={() => {
                const el = document.getElementById("codex-controls-anchor");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              totalMemories={memories.length}
            />

            <div id="codex-controls-anchor" className="scroll-mt-6" />

            {/* Controls Ribbon: Search + Emotion Filter tabs + View toggle */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0c0e1a]/80 p-4 sm:p-5 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                    ⌕
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memories, companions, places, emotions..."
                    className="w-full rounded-xl border border-white/[0.09] bg-black/40 py-2.5 pl-9 pr-4 text-xs sm:text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Toggle: Grid vs Timeline */}
                <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      viewMode === "grid"
                        ? "bg-violet-600/30 text-amber-200 border border-violet-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Artifact Cards
                  </button>
                  <button
                    onClick={() => setViewMode("timeline")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      viewMode === "timeline"
                        ? "bg-violet-600/30 text-amber-200 border border-violet-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Timeline Rail
                  </button>
                </div>
              </div>

              {/* Emotion Filter Tabs (Interactive filter control) */}
              {emotionList.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.05] pt-3">
                  <span className="text-[11px] text-slate-500 mr-2 uppercase tracking-wider font-mono">
                    Resonance:
                  </span>
                  {emotionList.map((emo) => (
                    <button
                      key={emo}
                      onClick={() => setSelectedEmotion(emo)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        selectedEmotion === emo
                          ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                          : "text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-transparent"
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Display Memories (Cards or Timeline) */}
            {filteredMemories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.1] bg-[#0c0e1a]/40 py-20 px-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-950/20 text-2xl text-amber-300">
                  ✦
                </div>
                <h3 className="font-serif text-xl font-medium text-amber-100">
                  No Memories Found
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                  {search || selectedEmotion !== "All"
                    ? "No echoes match your current query. Try adjusting your search term or clearing resonance filters."
                    : "Your archive is currently waiting for its very first remembrance to be preserved."}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  {(search || selectedEmotion !== "All") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedEmotion("All");
                      }}
                      className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-medium text-slate-300 hover:bg-white/[0.04]"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-xl border border-amber-400/40 bg-amber-500/15 text-xs font-medium text-amber-200 hover:bg-amber-500/25"
                  >
                    + Inscribe New Memory
                  </button>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMemories.map((memory, index) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    index={index}
                    onSelect={(mem) => setSelectedMemory(mem)}
                  />
                ))}
              </div>
            ) : (
              <TimelineView
                memories={filteredMemories}
                onSelectMemory={(mem) => setSelectedMemory(mem)}
              />
            )}
          </motion.div>
        )}

        {/* Dedicated Timeline Page */}
        {activePage === "Timeline" && (
          <motion.div
            key="timeline-page"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <TimelineView
              memories={memories}
              onSelectMemory={(mem) => setSelectedMemory(mem)}
            />
          </motion.div>
        )}

        {/* People Page */}
        {activePage === "People" && (
          <motion.div
            key="people-page"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <PeopleView
              memories={memories}
              onSelectMemory={(mem) => setSelectedMemory(mem)}
              onSelectPlace={() => {
                setActivePage("Places");
              }}
            />
          </motion.div>
        )}

        {/* Places Page */}
        {activePage === "Places" && (
          <motion.div
            key="places-page"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <PlacesView
              memories={memories}
              onSelectMemory={(mem) => setSelectedMemory(mem)}
            />
          </motion.div>
        )}

        {/* Archival Colophon Footer */}
        <footer className="mt-20 border-t border-white/[0.06] pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-slate-500 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 shrink-0">
              <img
                src={logoImg}
                alt="EchoRIS"
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif text-sm font-semibold text-slate-300">
              EchoRIS
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Relational Memory Archive</span>
          </div>

          <p className="text-[11px] text-slate-600 font-serif italic text-center sm:text-right">
            Preserving life's echoes, companions, and sacred sanctuaries.
          </p>
        </footer>
      </main>

      {/* Memory Inscription Modal */}
      {showForm && (
        <MemoryFormModal
          form={form}
          updateForm={updateForm}
          onSubmit={createMemory}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Memory Folio Inspection Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => {
            setSelectedMemory(null);
            setShowDeleteConfirm(false);
          }}
          onDelete={deleteMemory}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          onSelectPerson={() => {
            setSelectedMemory(null);
            setActivePage("People");
          }}
          onSelectPlace={() => {
            setSelectedMemory(null);
            setActivePage("Places");
          }}
        />
      )}
    </div>
  );
}
