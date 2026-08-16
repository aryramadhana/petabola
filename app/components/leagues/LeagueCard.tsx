import Link from "next/link";
import type { LeagueInfo } from "@/types/league";
import { getLeagueColor, getLeagueTextColor, getLeagueTextColorDark } from "@/lib/clubs";
import { getLeagueLogo, getLeagueDisplayName } from "@/lib/leagues";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface Props {
  league: LeagueInfo;
  clubCount: number;
  seasonName?: string;
}

export function LeagueCard({ league, clubCount, seasonName }: Props) {
  const color = getLeagueColor(league.name);
  const textColor = getLeagueTextColor(league.name);
  const textColorDark = getLeagueTextColorDark(league.name);
  const logo = getLeagueLogo(league.id);

  return (
    <Link
      href={`/liga/${league.id}`}
      className={`group relative h-full bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 overflow-hidden shadow-soft hover:shadow-lg hover:-translate-y-1 hover:bg-white/75 dark:hover:bg-white/10 transition-all duration-300 flex flex-col before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px before:z-10 before:bg-gradient-to-r before:from-transparent before:via-white/80 dark:before:via-white/30 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 ${FOCUS_RING}`}
    >
      <div
        className="px-7 py-9 flex items-center justify-between gap-3"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
      >
        <div className="min-w-0">
          <div className="text-white font-bebas font-bold text-2xl tracking-widest break-words">
            {getLeagueDisplayName(league.name)}
          </div>
          <div className="text-white/75 text-xs mt-1">
            Level {league.level}
          </div>
        </div>
        {logo && (
          <div className="w-20 h-20 rounded-xl bg-white shadow-sm flex items-center justify-center p-3 flex-shrink-0">
            <img
              src={logo}
              alt={`Logo ${league.name}`}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col gap-3">
        <p className="text-sm text-[#44474c] dark:text-white/60 leading-relaxed">
          {league.description}
        </p>
        <div className="mt-auto pt-2 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-[#44474c] dark:text-white/60 border-t border-[#E2E8F0] dark:border-white/10 pt-3">
            <span>{clubCount} klub</span>
            {seasonName && <span>{seasonName}</span>}
          </div>
          <div
            className="w-full py-3 rounded-xl border-2 font-bold text-sm tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 border-[color:var(--text-color)] dark:border-[color:var(--text-color-dark)] text-[color:var(--text-color)] dark:text-[color:var(--text-color-dark)] group-hover:text-white group-hover:bg-[color:var(--league-color)]"
            style={{
              "--text-color": textColor,
              "--text-color-dark": textColorDark,
              "--league-color": color,
            } as React.CSSProperties}
          >
            Lihat Klasemen & Jadwal
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
