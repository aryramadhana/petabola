import type { Club } from "@/types";
import type { LeagueInfo } from "@/types/league";
import type { Season } from "@/types/season";
import { getActiveSeasonForLeague } from "@/lib/seasons";
import { getClubsByLeagueName, getLeagueColor } from "@/lib/clubs";
import { LeagueCard } from "@/app/components/leagues/LeagueCard";
import { ScrollReveal, staggerDelay } from "@/app/components/sections/ScrollReveal";
import { AmbientGlow } from "@/app/components/sections/AmbientGlow";

interface Props {
  clubs: Club[];
  leagues: LeagueInfo[];
  seasons: Season[];
}

export function LigaSection({ clubs, leagues, seasons }: Props) {
  return (
    <section id="liga" className="relative overflow-hidden scroll-mt-16 snap-start py-16 px-4">
      <AmbientGlow>
        <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ background: getLeagueColor("Liga 1") }} />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full blur-3xl opacity-25" style={{ background: getLeagueColor("Liga 2") }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-25" style={{ background: getLeagueColor("Liga 3") }} />
      </AmbientGlow>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <ScrollReveal>
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-bebas font-bold text-3xl tracking-widest text-[#191c1e] dark:text-white">
              DAFTAR LIGA
            </h2>
            <p className="text-sm text-[#44474c] dark:text-white/60 mt-2">
              {leagues.length} kompetisi sepak bola Indonesia — Liga 1, Liga 2, dan Liga 3
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {leagues.map((league, i) => {
            const clubCount = getClubsByLeagueName(clubs, league.name).length;
            const season = getActiveSeasonForLeague(seasons, league.id);
            return (
              <ScrollReveal key={league.id} delayMs={staggerDelay(i)} className="h-full">
                <LeagueCard
                  league={league}
                  clubCount={clubCount}
                  seasonName={season?.name}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
