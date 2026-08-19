import type { StandingsRow } from "@/types/standing";
import type { Club } from "@/types";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { DataUpdatedAt } from "@/app/components/shared/DataUpdatedAt";

interface Props {
  rows: StandingsRow[];
  clubs: Club[];
  updatedAt: string | null;
  title?: string;
}

const DASH = "–";
const DASH_CLASS = "text-center py-2 px-2 text-[#9EA3AE] dark:text-white/50";

export function StandingsTable({ rows, clubs, updatedAt, title = "KLASEMEN" }: Props) {
  const hasStats = rows.length > 0;
  const sortedClubs = [...clubs].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#F3F4F6] dark:border-white/10 flex items-center justify-between gap-2">
        <span className="font-bebas tracking-widest text-[13px] text-[#1A1A2E] dark:text-white">
          {title}
        </span>
        <DataUpdatedAt updatedAt={updatedAt} />
      </div>

      {!hasStats && clubs.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <EmptyState message="Data klasemen untuk kompetisi ini belum tersedia dari sumber yang dapat diverifikasi." />
        </div>
      ) : (
        <>
          {!hasStats && (
            <p className="flex-shrink-0 px-4 pt-3 text-[11px] text-[#9EA3AE] dark:text-white/50">
              Urutan &amp; statistik klasemen belum tersedia dari sumber yang dapat diverifikasi. Berikut klub peserta liga ini:
            </p>
          )}
          <div className="flex-1 min-h-0 overflow-x-auto">
            <div className="h-full overflow-y-auto">
              <table className="w-full text-[11px] min-w-[560px]">
                <thead className="sticky top-0 z-10 bg-white/95 dark:bg-[#0d1b2a]/95 backdrop-blur-sm">
                  <tr className="text-[#9EA3AE] dark:text-white/50 text-[10px] uppercase tracking-wide border-b border-[#F3F4F6] dark:border-white/10">
                    <th className="text-left py-2 px-3 w-8">#</th>
                    <th className="text-left py-2 px-3">Klub</th>
                    <th className="text-center py-2 px-2">MP</th>
                    <th className="text-center py-2 px-2">W</th>
                    <th className="text-center py-2 px-2">D</th>
                    <th className="text-center py-2 px-2">L</th>
                    <th className="text-center py-2 px-2">GF</th>
                    <th className="text-center py-2 px-2">GA</th>
                    <th className="text-center py-2 px-2">GD</th>
                    <th className="text-center py-2 px-3">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {hasStats
                    ? rows.map((row) => {
                        const club = clubs.find((c) => c.id === row.clubId);
                        return (
                          <tr
                            key={row.clubId}
                            className="border-b border-[#F9FAFB] dark:border-white/5 last:border-0"
                          >
                            <td className="py-2 px-3 text-[#9EA3AE] dark:text-white/50 font-semibold">
                              {row.position}
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <ClubAvatar
                                  clubId={row.clubId}
                                  abbr={club?.abbr ?? "?"}
                                  league={club?.league ?? "Liga 1"}
                                  size={32}
                                />
                                <span className="text-[13px] font-semibold text-[#1A1A2E] dark:text-white truncate">
                                  {club?.name ?? row.clubId}
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-2 px-2">{row.played}</td>
                            <td className="text-center py-2 px-2">{row.won}</td>
                            <td className="text-center py-2 px-2">{row.drawn}</td>
                            <td className="text-center py-2 px-2">{row.lost}</td>
                            <td className="text-center py-2 px-2">{row.goalsFor}</td>
                            <td className="text-center py-2 px-2">{row.goalsAgainst}</td>
                            <td className="text-center py-2 px-2">{row.goalDifference}</td>
                            <td className="text-center py-2 px-3 font-bold text-[#CE1126]">
                              {row.points}
                            </td>
                          </tr>
                        );
                      })
                    : sortedClubs.map((club, i) => (
                        <tr
                          key={club.id}
                          className="border-b border-[#F9FAFB] dark:border-white/5 last:border-0"
                        >
                          <td className="py-2 px-3 text-[#9EA3AE] dark:text-white/50 font-semibold">
                            {i + 1}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <ClubAvatar clubId={club.id} abbr={club.abbr} league={club.league} size={32} />
                              <span className="text-[13px] font-semibold text-[#1A1A2E] dark:text-white truncate">
                                {club.name}
                              </span>
                            </div>
                          </td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className={DASH_CLASS}>{DASH}</td>
                          <td className="text-center py-2 px-3 text-[#9EA3AE] dark:text-white/50">{DASH}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
