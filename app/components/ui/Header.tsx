"use client";

import { useState, useEffect } from "react";
import type { Club } from "@/types";
import { filterClubs, getLeagueColor, getLeagueTextColor } from "@/lib/clubs";
import { SearchIcon, MenuIcon, CloseIcon } from "./icons";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { FOCUS_RING, FOCUS_RING_ON_DARK } from "./focusRing";

type Section = "beranda" | "liga" | "tentang";

interface Props {
  clubs: Club[];
  onSelectClub: (club: Club) => void;
  activeSection: Section;
}

// Persistent "current section" state (not the transient CSS :active pseudo-
// class) — driven by HomePage's scroll-position IntersectionObserver, not a
// click/press state. Hover/press feedback stay as CSS pseudo-classes below;
// this is layered on top for whichever section is currently in view.
function desktopNavClass(active: boolean) {
  return `text-xs transition-colors rounded-full px-3 py-1.5 hover:text-[#fda4af] dark:hover:text-[#5eead4] hover:bg-[#fda4af]/10 dark:hover:bg-[#5eead4]/10 active:bg-[#f4645a]/20 dark:active:bg-[#0d9488]/25 ${
    active
      ? "text-[#fda4af] dark:text-[#5eead4] bg-[#f4645a]/15 dark:bg-[#0d9488]/20 font-semibold"
      : "text-white/70"
  } ${FOCUS_RING_ON_DARK}`;
}

function mobileNavClass(active: boolean, withBorder: boolean) {
  return `py-2.5 text-sm transition-colors rounded-lg -mx-3 px-3 hover:text-[#fda4af] dark:hover:text-[#5eead4] hover:bg-[#fda4af]/10 dark:hover:bg-[#5eead4]/10 active:bg-[#f4645a]/20 dark:active:bg-[#0d9488]/25 ${
    active
      ? "text-[#fda4af] dark:text-[#5eead4] bg-[#f4645a]/15 dark:bg-[#0d9488]/20 font-semibold"
      : "text-white/70"
  } ${withBorder ? "border-t border-white/10" : ""} ${FOCUS_RING_ON_DARK}`;
}

export function Header({ clubs, onSelectClub, activeSection }: Props) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const trimmed = query.trim();
  const hits =
    trimmed.length > 0
      ? filterClubs(clubs, "all", "all", trimmed).slice(0, 6)
      : [];

  return (
    <header className="relative bg-[#05111D]/80 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-50 gap-3 border-b border-white/10 h-14">
      {/* Logo + Search (left) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="logo-mark w-8 h-8 bg-gradient-to-br from-[#fb7185] to-[#fb923c] dark:from-[#2dd4bf] dark:to-[#38bdf8] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <circle cx="12" cy="11" r="7.2" fill="white" />
              <path d="M12 18.2c1.3 1.3 2.3 2.2 2.3 2.2s-.7.4-2.3.4-2.3-.4-2.3-.4 1-.9 2.3-2.2z" fill="white" />
              <path d="M12 6.3 L13.6 7.5 L13 9.5 L11 9.5 L10.4 7.5 Z" fill="#05111D" opacity="0.85" />
              <path d="M7.3 12.2 L8.9 10.2 L11 9.5 L11.7 11.6 L10.1 13.4 Z" fill="#05111D" opacity="0.85" />
              <path d="M16.7 12.2 L15.1 10.2 L13 9.5 L12.3 11.6 L13.9 13.4 Z" fill="#05111D" opacity="0.85" />
            </svg>
          </div>
          <div className="hidden sm:block font-bebas font-bold text-[18px] tracking-widest text-white leading-none">
            PETABOLA
          </div>
          <div className="sm:hidden font-bebas font-bold text-[16px] tracking-widest text-white">
            PETABOLA
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-[13rem] md:w-52 md:max-w-none md:flex-none">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <SearchIcon className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder="Cari klub, kota..."
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-white/10 border border-white/10 text-white placeholder-white/50 outline-none focus:bg-white focus:text-[#191c1e] focus:placeholder-[#44474c] focus:border-white transition-colors ${FOCUS_RING_ON_DARK}`}
          />
          {showResults && trimmed.length > 0 && (
            hits.length > 0 ? (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white/85 dark:bg-[#0d1b2a]/90 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-xl shadow-soft overflow-hidden z-50 max-h-52 overflow-y-auto">
                {hits.map((c) => (
                  <button
                    key={c.id}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:translate-x-0.5 border-b border-[#F3F4F6] dark:border-white/10 last:border-0 transition-all duration-200 ${FOCUS_RING}`}
                    onMouseDown={() => {
                      onSelectClub(c);
                      setQuery("");
                      setShowResults(false);
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold flex-shrink-0 bg-white"
                      style={{ borderColor: getLeagueColor(c.league), color: getLeagueTextColor(c.league) }}
                    >
                      {c.abbr}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#191c1e] dark:text-white">{c.name}</div>
                      <div className="text-[10px] text-[#44474c] dark:text-white/60">{c.city} · {c.league}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white/85 dark:bg-[#0d1b2a]/90 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-xl shadow-soft z-50 px-3 py-3 text-center text-[11px] text-[#44474c] dark:text-white/60">
                Klub &quot;{trimmed}&quot; tidak ditemukan.
              </div>
            )
          )}
        </div>
      </div>

      {/* Nav + theme toggle (right) */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className={`md:hidden flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors ${FOCUS_RING_ON_DARK}`}
        >
          {mobileMenuOpen ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
        </button>

        <nav className="hidden md:flex items-center gap-4">
          <a href="#beranda" aria-current={activeSection === "beranda" ? "location" : undefined} className={desktopNavClass(activeSection === "beranda")}>Beranda</a>
          <a href="#liga" aria-current={activeSection === "liga" ? "location" : undefined} className={desktopNavClass(activeSection === "liga")}>Liga</a>
          <a href="#tentang" aria-current={activeSection === "tentang" ? "location" : undefined} className={desktopNavClass(activeSection === "tentang")}>Tentang</a>
        </nav>

        <div className="hidden md:block w-px h-4 bg-white/10" />

        <ThemeToggleButton className={`text-white/60 hover:text-white hover:bg-white/10 ${FOCUS_RING_ON_DARK}`} />
      </div>

      <div
        id="mobile-nav-menu"
        aria-hidden={!mobileMenuOpen}
        className={`md:hidden absolute top-full left-0 right-0 z-40 bg-[#05111D]/95 backdrop-blur-xl border-b border-white/10 shadow-soft overflow-hidden transition-[max-height] duration-300 ${mobileMenuOpen ? "max-h-52" : "max-h-0"}`}
      >
        <nav className="flex flex-col px-4 py-2">
          <a
            href="#beranda"
            tabIndex={mobileMenuOpen ? undefined : -1}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={activeSection === "beranda" ? "location" : undefined}
            className={mobileNavClass(activeSection === "beranda", false)}
          >
            Beranda
          </a>
          <a
            href="#liga"
            tabIndex={mobileMenuOpen ? undefined : -1}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={activeSection === "liga" ? "location" : undefined}
            className={mobileNavClass(activeSection === "liga", true)}
          >
            Liga
          </a>
          <a
            href="#tentang"
            tabIndex={mobileMenuOpen ? undefined : -1}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={activeSection === "tentang" ? "location" : undefined}
            className={mobileNavClass(activeSection === "tentang", true)}
          >
            Tentang
          </a>
        </nav>
      </div>
    </header>
  );
}
