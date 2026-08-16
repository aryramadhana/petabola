"use client";

import { useState } from "react";
import type { Club, FilterLeague, League } from "@/types";
import { getLeagueColor } from "@/lib/clubs";
import { ClubAvatar } from "./ClubAvatar";
import { LeagueBadge } from "./LeagueBadge";
import { MapPinIcon, UserGroupIcon } from "./icons";
import { FOCUS_RING } from "./focusRing";

const LEAGUE_FILTERS: { label: string; value: FilterLeague }[] = [
  { label: "Semua", value: "all" },
  { label: "Liga 1", value: "Liga 1" },
  { label: "Liga 2", value: "Liga 2" },
  { label: "Liga 3", value: "Liga 3" },
];

const LEGEND_LEAGUES: League[] = ["Liga 1", "Liga 2", "Liga 3"];

interface Props {
  clubs: Club[];
  filtered: Club[];
  selectedId: string | null;
  leagueFilter: FilterLeague;
  onLeagueChange: (v: FilterLeague) => void;
  onSelectClub: (club: Club) => void;
}

export function MobileDrawer({
  clubs,
  filtered,
  selectedId,
  leagueFilter,
  onLeagueChange,
  onSelectClub,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`md:hidden fixed bottom-6 right-4 z-40 bg-gradient-to-br from-[#fb7185D9] to-[#fb923cD9] dark:from-[#2dd4bfD9] dark:to-[#38bdf8D9] backdrop-blur-md text-white rounded-full px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border border-white/30 shadow-[0_4px_20px_rgba(244,100,90,0.35)] dark:shadow-[0_4px_20px_rgba(13,148,136,0.35)] hover:shadow-[0_6px_28px_rgba(244,100,90,0.5)] dark:hover:shadow-[0_6px_28px_rgba(13,148,136,0.5)] transition-shadow duration-200 ${FOCUS_RING}`}
      >
        <UserGroupIcon className="w-4 h-4" />
        <span>Lihat {filtered.length} Klub</span>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-xl rounded-t-2xl shadow-soft transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"
          }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E2E8F0] dark:bg-white/20" />
        </div>

        <div className="px-4 py-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#44474c] dark:text-white/60 mb-1">Klub sepak bola favoritmu, di mana pun dia berada.</div>
            <span className="font-bebas font-bold text-[15px] tracking-widest text-[#191c1e] dark:text-white">DAFTAR KLUB</span>
            <span className="ml-2 text-[10px] text-[#44474c] dark:text-white/60">{filtered.length} dari {clubs.length}</span>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              {LEGEND_LEAGUES.map((lg) => (
                <div key={lg} className="flex items-center gap-1 text-[9px] text-[#44474c] dark:text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getLeagueColor(lg) }} />
                  {lg}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Tutup daftar klub" className={`text-[#44474c] dark:text-white/60 text-xl leading-none rounded ${FOCUS_RING}`}>×</button>
        </div>

        <div className="px-4 pb-2 flex gap-1.5 flex-wrap border-b border-[#F3F4F6] dark:border-white/10">
          {LEAGUE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onLeagueChange(f.value)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${FOCUS_RING} ${leagueFilter === f.value
                ? "bg-gradient-to-br from-[#fb7185] to-[#fb923c] dark:from-[#2dd4bf] dark:to-[#38bdf8] text-white"
                : "bg-[#EFF1F4] dark:bg-white/10 text-[#44474c] dark:text-white/70"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {filtered.map((club) => (
            <button
              key={club.id}
              onClick={() => { onSelectClub(club); setOpen(false); }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-[#F9FAFB] dark:border-white/5 transition-all border-l-4 ${FOCUS_RING} ${selectedId === club.id
                ? "bg-[#F0F2F5] dark:bg-white/10"
                : "active:bg-black/[0.03] dark:active:bg-white/5 hover:translate-x-0.5"
                }`}
              style={{ borderLeftColor: selectedId === club.id ? getLeagueColor(club.league) : "transparent" }}
            >
              <ClubAvatar
                clubId={club.id}
                abbr={club.abbr}
                league={club.league}
                size={34}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[#191c1e] dark:text-white truncate">{club.name}</div>
                <div className="text-[10px] text-[#44474c] dark:text-white/60 mt-0.5 flex items-center gap-1">
                  <MapPinIcon className="w-2.5 h-2.5 flex-shrink-0" />
                  <span>{club.city}</span>
                  <span>·</span>
                  <LeagueBadge league={club.league} size="xs" />
                </div>
              </div>
              <svg className="w-4 h-4 text-[#E2E8F0] dark:text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
