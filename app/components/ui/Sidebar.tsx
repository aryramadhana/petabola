"use client";

import type { Club, FilterLeague, League } from "@/types";
import { getLeagueColor } from "@/lib/clubs";
import { ClubAvatar } from "./ClubAvatar";
import { LeagueBadge } from "./LeagueBadge";
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
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({
  clubs,
  filtered,
  selectedId,
  leagueFilter,
  onLeagueChange,
  onSelectClub,
  open,
  onToggle,
}: Props) {
  return (
    <div className="hidden md:block absolute top-4 left-4 bottom-4 z-20">
      <div
        className={`h-full overflow-hidden transition-[width] duration-300 ${open ? "w-[280px]" : "w-0"
          }`}
      >
        <aside className="w-[280px] h-full flex flex-col bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-white/10">
            <div className="text-[10px] text-[#44474c] dark:text-white/60 mb-1">Klub sepak bola favoritmu, di mana pun dia berada.</div>
            <div className="font-bebas font-bold text-[15px] tracking-widest text-[#191c1e] dark:text-white">DAFTAR KLUB</div>
            <div className="text-[11px] text-[#44474c] dark:text-white/60 mt-0.5">
              Menampilkan{" "}
              <span className="font-semibold text-[#374151] dark:text-white/80">{filtered.length}</span>{" "}
              dari {clubs.length} klub
            </div>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              {LEGEND_LEAGUES.map((lg) => (
                <div key={lg} className="flex items-center gap-1 text-[9px] text-[#44474c] dark:text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getLeagueColor(lg) }} />
                  {lg}
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 py-2.5 border-b border-[#F3F4F6] dark:border-white/10 flex flex-wrap gap-1.5">
            {LEAGUE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => onLeagueChange(f.value)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${FOCUS_RING} ${leagueFilter === f.value
                  ? "bg-gradient-to-br from-[#fb7185] to-[#fb923c] dark:from-[#2dd4bf] dark:to-[#38bdf8] text-white"
                  : "bg-[#EFF1F4] dark:bg-white/10 text-[#44474c] dark:text-white/70 hover:bg-[#E6E8EB] dark:hover:bg-white/20"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-[#44474c] dark:text-white/60 text-xs">Klub yang kamu cari belum ada di daftar kami</div>
            ) : (
              filtered.map((club) => (
                <button
                  key={club.id}
                  onClick={() => onSelectClub(club)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 border-b border-[#F9FAFB] dark:border-white/5 transition-all border-l-[3px] ${FOCUS_RING} ${selectedId === club.id
                    ? "bg-[#F0F2F5] dark:bg-white/10"
                    : "hover:bg-black/[0.03] dark:hover:bg-white/5 hover:translate-x-0.5"
                    }`}
                  style={{ borderLeftColor: selectedId === club.id ? getLeagueColor(club.league) : "transparent" }}
                >
                  <ClubAvatar
                    clubId={club.id}
                    abbr={club.abbr}
                    league={club.league}
                    size={34}
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-[#191c1e] dark:text-white leading-tight truncate">{club.name}</div>
                    <div className="text-[10px] text-[#44474c] dark:text-white/60 mt-0.5 flex items-center gap-1">
                      <span>{club.city}</span>
                      <span>·</span>
                      <LeagueBadge league={club.league} size="xs" />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? "Sembunyikan daftar klub" : "Tampilkan daftar klub"}
        aria-pressed={open}
        className={`absolute top-1/2 -translate-y-1/2 z-30 w-5 h-12 bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-md border border-white/70 dark:border-white/10 rounded-r-lg shadow-soft flex items-center justify-center text-[#44474c] dark:text-white/70 hover:bg-white dark:hover:bg-[#16283b] hover:text-[#191c1e] dark:hover:text-white transition-all duration-300 cursor-pointer ${FOCUS_RING}`}
        style={{ left: open ? 280 : 0 }}
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          )}
        </svg>
      </button>
    </div>
  );
}
