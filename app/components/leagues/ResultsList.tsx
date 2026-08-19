import Link from "next/link";
import type { Match, MatchStatus } from "@/types/match";
import type { Club } from "@/types";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";

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
          <div
            key={m.id}
            className="p-4 flex items-center justify-between text-[11px] gap-2"
          >
            <span className="text-[#9EA3AE] dark:text-white/50 w-20 flex-shrink-0">{m.date}</span>
            <span className="flex-1 flex items-center justify-center gap-2 text-[#1A1A2E] dark:text-white font-medium">
              <Link href={`/klub/${m.homeClubId}`} className="flex items-center gap-1.5 min-w-0 hover:text-[#CE1126]">
                <ClubAvatar clubId={m.homeClubId} abbr={home?.abbr ?? "?"} league={home?.league ?? "Liga 1"} size={20} />
                <span className="truncate">{home?.name ?? m.homeClubId}</span>
              </Link>
              <span className="font-bold flex-shrink-0">
                {m.status === "finished"
                  ? `${m.homeScore} - ${m.awayScore}`
                  : STATUS_LABEL[m.status]}
              </span>
              <Link href={`/klub/${m.awayClubId}`} className="flex items-center gap-1.5 min-w-0 hover:text-[#CE1126]">
                <ClubAvatar clubId={m.awayClubId} abbr={away?.abbr ?? "?"} league={away?.league ?? "Liga 1"} size={20} />
                <span className="truncate">{away?.name ?? m.awayClubId}</span>
              </Link>
            </span>
            <span className="text-[#9EA3AE] dark:text-white/50 text-[10px] w-14 text-right">
              Pekan {m.matchweek}
            </span>
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
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft">
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
  );
}
