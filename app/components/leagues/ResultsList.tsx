import type { Match, MatchStatus } from "@/types/match";
import type { Club } from "@/types";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
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

const STATUS_LABEL: Record<MatchStatus, string> = {
  scheduled: "Terjadwal",
  postponed: "Ditunda",
  cancelled: "Dibatalkan",
  finished: "Selesai",
};

function ResultRows({ matches, clubs }: { matches: Match[]; clubs: Club[] }) {
  return (
    <div className="divide-y divide-[#F3F4F6] dark:divide-white/10">
      {matches.map((m) => {
        const home = getClub(clubs, m.homeClubId);
        const away = getClub(clubs, m.awayClubId);
        return (
          <div key={m.id} className="p-4 flex flex-col gap-2 text-[11px]">
            <div className="flex items-center justify-between gap-2 text-[#1A1A2E] dark:text-white font-medium">
              <span className="flex-1 min-w-0 flex items-center gap-1.5">
                <ClubAvatar clubId={m.homeClubId} abbr={home?.abbr ?? "?"} league={home?.league ?? "Liga 1"} size={20} />
                <span className="truncate">{home?.name ?? m.homeClubId}</span>
              </span>
              <span className="flex-1 min-w-0 flex items-center justify-end gap-1.5">
                <span className="truncate">{away?.name ?? m.awayClubId}</span>
                <ClubAvatar clubId={m.awayClubId} abbr={away?.abbr ?? "?"} league={away?.league ?? "Liga 1"} size={20} />
              </span>
            </div>
            <div className="text-center">
              {m.status === "finished" ? (
                <span
                  className="text-[15px] font-bold text-[#1A1A2E] dark:text-white"
                  aria-label={`${home?.name ?? m.homeClubId} ${m.homeScore}, ${away?.name ?? m.awayClubId} ${m.awayScore}`}
                >
                  {m.homeScore} - {m.awayScore}
                </span>
              ) : (
                <span className="font-semibold text-[#9EA3AE] dark:text-white/50">
                  {STATUS_LABEL[m.status]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9EA3AE] dark:text-white/50">
              <span>{formatIndonesianDate(m.date)}</span>
              <span>·</span>
              <span>Pekan {m.matchweek}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ResultsList({ matches, clubs, groupedMatches }: Props) {
  const isEmpty = groupedMatches
    ? groupedMatches.every((g) => g.matches.length === 0)
    : matches.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft">
        <EmptyState message="Belum ada hasil pertandingan yang tersedia." />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden">
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
                    Belum ada hasil pertandingan yang tersedia untuk grup ini.
                  </p>
                ) : (
                  <ResultRows matches={g.matches} clubs={clubs} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <ResultRows matches={matches} clubs={clubs} />
        )}
      </div>
    </div>
  );
}
