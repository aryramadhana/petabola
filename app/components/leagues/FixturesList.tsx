import type { Match } from "@/types/match";
import type { Club } from "@/types";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { MapPinIcon } from "@/app/components/ui/icons";
import { formatIndonesianDate } from "@/app/components/shared/DataUpdatedAt";

interface GroupedMatches {
  groupId: string;
  groupLabel: string;
  matches: Match[];
}

interface Props {
  matches: Match[];
  clubs: Club[];
  groupedMatches?: GroupedMatches[];
}

function getClub(clubs: Club[], id: string) {
  return clubs.find((c) => c.id === id);
}

// Data is updated manually/periodically (see CLAUDE.md) — a fixture's real
// date can pass before someone flips its status away from "scheduled", so
// this is an honest "hasn't been confirmed yet" signal, not a live check.
function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function WeekGroups({ matches, clubs }: { matches: Match[]; clubs: Club[] }) {
  const byWeek = new Map<number, Match[]>();
  matches.forEach((m) => {
    const list = byWeek.get(m.matchweek) ?? [];
    list.push(m);
    byWeek.set(m.matchweek, list);
  });

  return (
    <div className="divide-y divide-[#F3F4F6] dark:divide-white/10">
      {[...byWeek.entries()].map(([week, weekMatches]) => (
        <div key={week} className="p-4">
          <div className="sticky top-0 z-10 -mx-4 -mt-4 px-4 pt-4 pb-2.5 mb-2.5 bg-white/95 dark:bg-[#0d1b2a]/95 backdrop-blur-sm text-[10px] font-semibold text-[#9EA3AE] dark:text-white/50 uppercase tracking-wide">
            Pekan {week}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {weekMatches.map((m) => {
              const past = isPastDate(m.date);
              const home = getClub(clubs, m.homeClubId);
              const away = getClub(clubs, m.awayClubId);
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-[#F3F4F6] dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-3 flex flex-col gap-2"
                >
                  <span className="text-[10px] text-[#9EA3AE] dark:text-white/50">
                    {formatIndonesianDate(m.date)} · {m.time} WIB
                  </span>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#1A1A2E] dark:text-white">
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <ClubAvatar clubId={m.homeClubId} abbr={home?.abbr ?? "?"} league={home?.league ?? "Liga 1"} size={18} />
                      <span className="truncate">{home?.name ?? m.homeClubId}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-end gap-1.5">
                      <span className="truncate">{away?.name ?? m.awayClubId}</span>
                      <ClubAvatar clubId={m.awayClubId} abbr={away?.abbr ?? "?"} league={away?.league ?? "Liga 1"} size={18} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-[#9EA3AE] dark:text-white/50 bg-black/5 dark:bg-white/10 rounded-full px-3 py-1">
                      VS
                    </span>
                    {past && (
                      <span className="text-[9px] font-medium text-[#9EA3AE] dark:text-white/50">
                        Menunggu update hasil
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#9EA3AE] dark:text-white/50 mt-auto pt-1">
                    <MapPinIcon className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{m.stadium ?? "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FixturesList({ matches, clubs, groupedMatches }: Props) {
  const isEmpty = groupedMatches
    ? groupedMatches.every((g) => g.matches.length === 0)
    : matches.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft">
        <EmptyState message="Belum ada jadwal pertandingan yang tersedia." />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden">
      {/* Roughly one matchweek's height at a time — the rest scrolls, with
          each week's own header staying pinned while its matches scroll by. */}
      <div className="max-h-[440px] overflow-y-auto">
        {groupedMatches ? (
          <div className="divide-y divide-[#F3F4F6] dark:divide-white/10">
            {groupedMatches.map((g) => (
              <div key={g.groupId}>
                <div className="px-4 pt-4 pb-1 text-[11px] font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wide">
                  {g.groupLabel}
                </div>
                {g.matches.length === 0 ? (
                  <p className="px-4 pb-4 text-[11px] text-[#9EA3AE] dark:text-white/50">
                    Belum ada jadwal pertandingan yang tersedia untuk grup ini.
                  </p>
                ) : (
                  <WeekGroups matches={g.matches} clubs={clubs} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <WeekGroups matches={matches} clubs={clubs} />
        )}
      </div>
    </div>
  );
}
