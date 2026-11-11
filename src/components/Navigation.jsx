import logoImg from "../assets/echoris_orbs.png";

const navigationItems = [
  { name: "Dashboard", label: "YOUR MEMORY WORLD", icon: "✦" },
  { name: "Memories", label: "MOMENTS PRESERVED", icon: "▤" },
  { name: "Timeline", label: "THE PASSAGE OF TIME", icon: "⎍" },
  { name: "People", label: "LIVES INTERTWINED", icon: "◈" },
  { name: "Places", label: "WHERE STORIES LIVE", icon: "⌖" },
];

export default function Navigation({
  activePage,
  setActivePage,
  onOpenCreate,
  memoriesCount = 0,
  peopleCount = 0,
}) {
  return (
    <>
      {/* Desktop Archival Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/[0.07] bg-[#090b14]/90 backdrop-blur-md px-6 py-8 md:flex z-10">
        {/* Brand Crest */}
        <div className="mb-10 flex items-center gap-3.5">
          <div className="relative h-11 w-11 shrink-0 drop-shadow-[0_0_12px_rgba(167,139,250,0.25)]">
            <img
              src={logoImg}
              alt="EchoRIS"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h1 className="font-serif text-xl font-semibold tracking-wide text-amber-100/95">
              EchoRIS
            </h1>
            <p className="text-[11px] font-sans tracking-wider uppercase text-slate-400">
              Memory Archive
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenCreate}
          className="mb-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-purple-700/30 px-4 py-3 text-xs font-medium tracking-wide text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-200 hover:border-violet-400/60 hover:from-violet-600/40 hover:text-white active:scale-[0.98]"
        >
          <span className="text-amber-300 font-serif text-base leading-none">✦</span>
          <span>Inscribe Memory</span>
        </button>

        {/* Section Label */}
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
          Curated Archive
        </p>

        {/* Navigation Links */}
        <nav className="space-y-1.5 font-sans">
          {navigationItems.map((item) => {
            const isActive = activePage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-transparent text-violet-100 border border-violet-500/35 shadow-[0_0_16px_rgba(139,92,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.08)]"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                        : "text-slate-400 group-hover:text-violet-300"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-slate-100 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`text-[9px] uppercase tracking-[0.14em] font-medium transition-all duration-200 whitespace-nowrap shrink-0 ml-2 ${
                    isActive
                      ? "text-violet-200 drop-shadow-[0_0_8px_rgba(196,181,253,0.35)]"
                      : "text-slate-400 group-hover:text-violet-200"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Relational Stats Card */}
        <div className="mt-auto rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-200/70 font-sans">
              Archive Index
            </span>
            <span className="text-amber-300 text-xs">◈</span>
          </div>
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-400">Echoes preserved</span>
            <span className="font-serif text-sm font-semibold text-slate-200 tabular-nums">
              {memoriesCount}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-400">Companions linked</span>
            <span className="font-serif text-sm font-semibold text-slate-200 tabular-nums">
              {peopleCount}
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500 italic font-serif">
            "Every echo is a thread woven through time."
          </p>
        </div>

        {/* Vault Status Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 font-serif text-amber-300 text-xs">
              R
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">Personal Codex</p>
              <p className="text-[10px] text-emerald-400/80">Vault Sealed</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-600 font-mono tracking-tighter">
            ENC-256
          </span>
        </div>
      </aside>

      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#090b14]/95 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0">
            <img
              src={logoImg}
              alt="EchoRIS"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-serif text-base font-semibold tracking-wide text-amber-100">
              EchoRIS
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-slate-500">
              {activePage}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-600/25 px-3 py-1.5 text-xs font-medium text-violet-200 active:bg-violet-600/40"
        >
          <span className="text-amber-300 font-serif">✦</span>
          <span>Inscribe</span>
        </button>
      </header>

      {/* Mobile Bottom Navigation Dock */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-white/[0.08] bg-[#090b14]/95 backdrop-blur-md md:hidden px-2">
        {navigationItems.map((item) => {
          const isActive = activePage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-xs transition-colors ${
                isActive ? "text-amber-300 font-medium" : "text-slate-400"
              }`}
            >
              <span className="text-base leading-none mb-1">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
