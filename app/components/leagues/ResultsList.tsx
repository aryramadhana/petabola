import type { Match, MatchGoal, MatchStatus } from "@/types/match";
import type { Club } from "@/types";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { BallIcon, UserGroupIcon } from "@/app/components/ui/icons";
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

function formatGoalMinute(g: MatchGoal) {
  const minute = g.addedTime ? `${g.minute}+${g.addedTime}'` : `${g.minute}'`;
  if (g.penalty) return `${minute} (P)`;
  if (g.ownGoal) return `${minute} (GBD)`;
  return minute;
}

// One line per scorer, in order of their first goal: "Mitkov 54', 90+1'".
function groupByScorer(goals: MatchGoal[]) {
  const sorted = [...goals].sort(
    (a, b) => a.minute - b.minute || (a.addedTime ?? 0) - (b.addedTime ?? 0)
  );
  const byPlayer = new Map<string, string[]>();
  for (const g of sorted) {
    const minutes = byPlayer.get(g.player) ?? [];
    minutes.push(formatGoalMinute(g));
    byPlayer.set(g.player, minutes);
  }
  return [...byPlayer.entries()].map(([player, minutes]) => ({ player, minutes: minutes.join(", ") }));
}

function ScorerList({ goals, align }: { goals: MatchGoal[]; align: "left" | "right" }) {
  return (
    <ul className={`flex-1 min-w-0 flex flex-col gap-0.5 ${align === "right" ? "items-end text-right" : "items-start"}`}>
      {groupByScorer(goals).map(({ player, minutes }) => (
        <li key={player} className={`flex items-start gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <BallIcon className="w-3 h-3 mt-px flex-shrink-0" />
          <span>
            {player} <span className="whitespace-nowrap">{minutes}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function formatAttendance(attendance: number) {
  return attendance === 0
    ? "Tanpa penonton"
    : `${attendance.toLocaleString("id-ID")} penonton`;
}

function ResultRows({ matches, clubs }: { matches: Match[]; clubs: Club[] }) {
  return (
    <div className="divide-y divide-[#F3F4F6] dark:divide-white/10">
      {matches.map((m) => {
        const home = getClub(clubs, m.homeClubId);
        const away = getClub(clubs, m.awayClubId);
        return (
          <div key={m.id} className="p-4 flex flex-col gap-2 text-[11px]">
            <div className="flex items-center justify-between gap-2 text-[13px] text-[#1A1A2E] dark:text-white font-medium">
              <span className="flex-1 min-w-0 flex items-center gap-1.5">
                <ClubAvatar clubId={m.homeClubId} abbr={home?.abbr ?? "?"} league={home?.league ?? "Liga 1"} size={28} />
                <span className="truncate">{home?.name ?? m.homeClubId}</span>
              </span>
              <span className="flex-1 min-w-0 flex items-center justify-end gap-1.5">
                <span className="truncate">{away?.name ?? m.awayClubId}</span>
                <ClubAvatar clubId={m.awayClubId} abbr={away?.abbr ?? "?"} league={away?.league ?? "Liga 1"} size={28} />
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
            {m.status === "finished" && m.goals && m.goals.length > 0 && (
              <div
                className="flex items-start justify-between gap-3 text-[11px] text-[#44474c] dark:text-white/70"
                aria-label="Pencetak gol"
              >
                <ScorerList goals={m.goals.filter((g) => g.clubId === m.homeClubId)} align="left" />
                <ScorerList goals={m.goals.filter((g) => g.clubId === m.awayClubId)} align="right" />
              </div>
            )}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9EA3AE] dark:text-white/50">
              <span>{formatIndonesianDate(m.date)}</span>
              <span>·</span>
              <span>Pekan {m.matchweek}</span>
            </div>
            {m.status === "finished" && m.attendance != null && (
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#9EA3AE] dark:text-white/50">
                <UserGroupIcon className="w-3 h-3" />
                <span>{formatAttendance(m.attendance)}</span>
              </div>
            )}
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
