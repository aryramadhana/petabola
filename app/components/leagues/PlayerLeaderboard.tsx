import type { PlayerStat } from "@/types/player-stat";
import type { Club } from "@/types";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { DataUpdatedAt } from "@/app/components/shared/DataUpdatedAt";

interface GroupedPlayers {
  groupId: string;
  groupLabel: string;
  players: PlayerStat[];
}

interface Props {
  title: string;
  players: PlayerStat[];
  clubs: Club[];
  statKey: "goals" | "assists";
  updatedAt: string | null;
  textColor: string;
  textColorDark: string;
  groupedPlayers?: GroupedPlayers[];
}

const RANK_ACCENT: Record<number, string> = {
  1: "#eab308",
  2: "#94a3b8",
  3: "#b45309",
};

function PlayerGrid({
  players,
  clubs,
  statKey,
}: {
  players: PlayerStat[];
  clubs: Club[];
  statKey: "goals" | "assists";
}) {
  return (
    <div
      className="grid grid-cols-2 gap-x-2"
      style={{
        gridTemplateRows: `repeat(${Math.ceil(players.length / 2)}, auto)`,
        gridAutoFlow: "column",
      }}
    >
      {players.map((p, i) => {
        const club = clubs.find((c) => c.id === p.clubId);
        const rank = i + 1;
        const accent = RANK_ACCENT[rank];
        return (
          <div
            key={p.id}
            className="flex items-center gap-2 py-1.5 pl-2 pr-2 text-[11px] border-l-[3px]"
            style={{ borderLeftColor: accent ?? "transparent" }}
          >
            {accent ? (
              <span
                className="flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                style={{ background: accent }}
              >
                {rank}
              </span>
            ) : (
              <span className="flex-shrink-0 w-3.5" aria-hidden="true" />
            )}
            <div
              className="flex-shrink-0"
              aria-label={club?.name ?? p.clubId}
              title={club?.name ?? p.clubId}
            >
              <ClubAvatar
                clubId={p.clubId}
                abbr={club?.abbr ?? "?"}
                league={club?.league ?? "Liga 1"}
                size={20}
              />
            </div>
            <div className="flex-1 min-w-0 font-semibold text-[#1A1A2E] dark:text-white truncate">
              {p.name}
            </div>
            <span className="flex-shrink-0 min-w-[14px] text-right font-bold text-[color:var(--stat-color)] dark:text-[color:var(--stat-color-dark)]">
              {p[statKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PlayerLeaderboard({
  title,
  players,
  clubs,
  statKey,
  updatedAt,
  textColor,
  textColorDark,
  groupedPlayers,
}: Props) {
  const emptyMessage =
    statKey === "goals"
      ? "Data top skor untuk kompetisi ini belum tersedia dari sumber yang dapat diverifikasi."
      : "Data top assist untuk kompetisi ini belum tersedia dari sumber yang dapat diverifikasi.";

  const isEmpty = groupedPlayers
    ? groupedPlayers.every((g) => g.players.length === 0)
    : players.length === 0;

  return (
    <div
      className="h-full flex flex-col bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden"
      style={{ "--stat-color": textColor, "--stat-color-dark": textColorDark } as React.CSSProperties}
    >
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#F3F4F6] dark:border-white/10 flex items-center justify-between gap-2">
        <span className="font-bebas tracking-widest text-[13px] text-[#1A1A2E] dark:text-white">
          {title}
        </span>
        <DataUpdatedAt updatedAt={updatedAt} />
      </div>

      {isEmpty ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <EmptyState message={emptyMessage} />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto p-2.5">
          {groupedPlayers ? (
            <div className="flex flex-col gap-3">
              {groupedPlayers.map((g) => (
                <div key={g.groupId}>
                  <div className="text-[10px] font-bold text-[#9EA3AE] dark:text-white/50 uppercase tracking-wide mb-1.5 px-2">
                    {g.groupLabel}
                  </div>
                  {g.players.length === 0 ? (
                    <p className="text-[11px] text-[#9EA3AE] dark:text-white/50 px-2">
                      Belum ada data untuk grup ini.
                    </p>
                  ) : (
                    <PlayerGrid players={g.players} clubs={clubs} statKey={statKey} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <PlayerGrid players={players} clubs={clubs} statKey={statKey} />
          )}
        </div>
      )}
    </div>
  );
}
