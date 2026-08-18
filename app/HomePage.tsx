"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Club, FilterLeague } from "@/types";
import type { LeagueInfo } from "@/types/league";
import type { Season } from "@/types/season";
import { filterClubs, getLeagueColor } from "@/lib/clubs";
import { Header } from "./components/ui/Header";
import { Sidebar } from "./components/ui/Sidebar";
import { MobileDrawer } from "./components/ui/MobileDrawer";
import { Footer } from "./components/ui/Footer";
import { ClubDetailPane } from "./components/map/ClubDetailPane";
import { LigaSection } from "./components/sections/LigaSection";
import { TentangSection } from "./components/sections/TentangSection";
import { AmbientGlow } from "./components/sections/AmbientGlow";

const MapView = dynamic(
  () => import("./components/map/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#F0F2F5] dark:bg-white/5 animate-pulse" /> }
);

interface Props {
  clubs: Club[];
  leagues: LeagueInfo[];
  seasons: Season[];
  lastDataUpdate: string | null;
}

export function HomePage({ clubs, leagues, seasons, lastDataUpdate }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState<FilterLeague>("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [berandaVisible, setBerandaVisible] = useState(true);
  const berandaRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<"beranda" | "liga" | "tentang">("beranda");

  const filtered = useMemo(
    () => filterClubs(clubs, leagueFilter, "all", ""),
    [clubs, leagueFilter]
  );

  const selectedClub = clubs.find((c) => c.id === selectedId) ?? null;

  function handleSelectClub(club: Club, meta?: { fromMap?: boolean }) {
    setSelectedId(club.id);
    if (meta?.fromMap) setMobileSheetOpen(true);
  }

  function handleHeaderSearchSelect(club: Club) {
    handleSelectClub(club);
    document.getElementById("beranda")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleClosePane() {
    setSelectedId(null);
    setMobileSheetOpen(false);
  }

  useEffect(() => {
    setSelectedId(null);
    setMobileSheetOpen(false);
  }, [leagueFilter]);

  useEffect(() => {
    const el = berandaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBerandaVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drives the sticky Header's nav highlight — recomputes which section's
  // own center is closest to the viewport's center on every scroll frame.
  // (Previously an IntersectionObserver watching a thin band near center,
  // same as LeagueSubNav.tsx used — replaced for the same reason: the band
  // could fire intersection events for two sections within one scroll
  // batch during a fast/large scroll, and since React batches state
  // updates, only the last `setActiveSection` in that batch ever rendered,
  // so a section could become briefly "active" and never visibly appear —
  // e.g. scrolling bottom-to-top skipping past "liga" straight to
  // "beranda". A direct per-frame calculation has no such ambiguity.)
  useEffect(() => {
    const ids = ["beranda", "liga", "tentang"] as const;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let frame: number | null = null;
    function update() {
      frame = null;
      const centerY = window.innerHeight / 2;
      let closest = elements[0];
      let closestDistance = Infinity;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - centerY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = el;
        }
      }
      // A short last section can never be scrolled up to the viewport
      // center once maxScrollY is reached — fall back to activating
      // "tentang" at the bottom of the page.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActiveSection(
        (atBottom ? "tentang" : closest.id) as (typeof ids)[number]
      );
    }
    function onScroll() {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bg-[#F0F2F5] dark:bg-[#0d1b2a]">
      <Header clubs={clubs} onSelectClub={handleHeaderSearchSelect} activeSection={activeSection} />

      <section
        id="beranda"
        ref={berandaRef}
        className="relative scroll-mt-16 snap-start h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden"
      >
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 isolate">
            <MapView
              clubs={filtered}
              selectedId={selectedId}
              onSelectClub={handleSelectClub}
            />
          </div>

          <AmbientGlow>
            <div className="absolute -top-16 -left-10 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: getLeagueColor("Liga 1") }} />
            <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: getLeagueColor("Liga 1") }} />
          </AmbientGlow>

          <Sidebar
            clubs={clubs}
            filtered={filtered}
            selectedId={selectedId}
            leagueFilter={leagueFilter}
            onLeagueChange={setLeagueFilter}
            onSelectClub={handleSelectClub}
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
          />

          <ClubDetailPane
            club={selectedClub}
            onClose={handleClosePane}
            mobileOpen={mobileSheetOpen}
            showMobileOverlay={berandaVisible}
          />
        </div>
      </section>

      <LigaSection clubs={clubs} leagues={leagues} seasons={seasons} />
      <TentangSection lastDataUpdate={lastDataUpdate} />
      <Footer />

      {berandaVisible && (
        <MobileDrawer
          clubs={clubs}
          filtered={filtered}
          selectedId={selectedId}
          leagueFilter={leagueFilter}
          onLeagueChange={setLeagueFilter}
          onSelectClub={handleSelectClub}
        />
      )}
    </div>
  );
}
