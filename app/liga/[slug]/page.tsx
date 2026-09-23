import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLeagues, getLeagueById, getLeagueDisplayName, getLeagueGroups, getLeagueLogo } from "@/lib/leagues";
import { getAllSeasons, getActiveSeasonForLeague } from "@/lib/seasons";
import { getAllClubs, getClubsByLeagueName, getLeagueColor, getLeagueTextColor, getLeagueTextColorDark } from "@/lib/clubs";
import { getStandingsRows } from "@/lib/standings";
import { getMatchesData, getFixtures, getResults } from "@/lib/matches";
import { computeTopScorers } from "@/lib/player-stats-calc";
import { getPlayerStatsData, getTopAssists } from "@/lib/player-stats";
import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";
import { LeagueSubNav } from "@/app/components/leagues/LeagueSubNav";
import { StandingsTable } from "@/app/components/leagues/StandingsTable";
import { GroupStandingsTabs } from "@/app/components/leagues/GroupStandingsTabs";
import { MatchesTabs } from "@/app/components/leagues/MatchesTabs";
import { PlayerStatsTabs } from "@/app/components/leagues/PlayerStatsTabs";
import { Footer } from "@/app/components/ui/Footer";
import { BallIcon } from "@/app/components/ui/icons";

interface Props {
  params: Promise<{ slug: string }>;
}

const SECTIONS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "pertandingan", label: "Pertandingan" },
];

export const revalidate = false;

export async function generateStaticParams() {
  const leagues = await getAllLeagues();
  return leagues.map((l) => ({ slug: l.id }));
}

export default async function LeagueDetailPage({ params }: Props) {
  const { slug } = await params;
  const league = await getLeagueById(slug);
  if (!league) notFound();

  const clubs = await getAllClubs();
  const leagueClubs = getClubsByLeagueName(clubs, league.name);
  const seasons = await getAllSeasons();
  const season = getActiveSeasonForLeague(seasons, league.id);
  const color = getLeagueColor(league.name);
  const textColor = getLeagueTextColor(league.name);
  const textColorDark = getLeagueTextColorDark(league.name);
  const logo = getLeagueLogo(league.id);
  const groups = getLeagueGroups(league);

  // Non-grouped path (Liga 1/3 today): one matches fetch, shared by fixtures,
  // results, the standings table and the scoring chart — all four are derived
  // from the same blob now. For a grouped league this resolves to undefined
  // (the flat "liga-2" key no longer exists), which is harmless since the
  // grouped branch below never reads it.
  const matchesData = await getMatchesData(league.id);
  const leagueMatches = matchesData?.matches ?? [];
  const fixtures = getFixtures(leagueMatches);
  const results = getResults(leagueMatches);
  const topScorers = computeTopScorers(leagueMatches, 20);
  const standingsRows = await getStandingsRows(
    league.id,
    leagueClubs.map((c) => c.id)
  );
  // The assist chart is the one player statistic match data cannot produce, so
  // it still comes from the hand-entered player_stats table, with its own date.
  const playerStatsData = await getPlayerStatsData(league.id);
  const topAssists = await getTopAssists(league.id, 20);

  // Standings and the scoring chart are computed from match results, so their
  // freshness is the freshness of those results — not a separate entry date.
  const derivedUpdatedAt = matchesData?.updatedAt ?? null;

  // Grouped path (Liga 2 today): one fetch per group, same sharing.
  const groupMatches = await Promise.all(
    groups.map(async (g) => ({
      group: g,
      clubs: leagueClubs.filter((c) => c.group === g.id),
      data: await getMatchesData(league.id, g.id),
    }))
  );
  const groupStandings = await Promise.all(
    groupMatches.map(async ({ group, clubs, data }) => ({
      id: group.id,
      label: group.label,
      rows: await getStandingsRows(
        league.id,
        clubs.map((c) => c.id),
        group.id
      ),
      clubs,
      updatedAt: data?.updatedAt ?? null,
    }))
  );
  const groupedFixtures = groupMatches.map(({ group, data }) => ({
    groupId: group.id,
    groupLabel: group.label,
    matches: getFixtures(data?.matches ?? []),
    updatedAt: data?.updatedAt ?? null,
  }));
  const groupedResults = groupMatches.map(({ group, data }) => ({
    groupId: group.id,
    groupLabel: group.label,
    matches: getResults(data?.matches ?? []),
    updatedAt: data?.updatedAt ?? null,
  }));
  const groupedTopScorers = groupMatches.map(({ group, data }) => ({
    groupId: group.id,
    groupLabel: group.label,
    players: computeTopScorers(data?.matches ?? [], 20),
    updatedAt: data?.updatedAt ?? null,
  }));
  const groupedTopAssists = await Promise.all(
    groups.map(async (g) => ({
      groupId: g.id,
      groupLabel: g.label,
      players: await getTopAssists(league.id, 20, g.id),
      updatedAt: (await getPlayerStatsData(league.id, g.id))?.updatedAt ?? null,
    }))
  );

  return (
    <div className="relative min-h-screen bg-[#F5F6FA] dark:bg-[#0d1b2a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-16 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: color }} />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: color }} />
      </div>

      <header className="relative bg-white/85 dark:bg-[#0d1b2a]/90 backdrop-blur-xl border-b border-white/70 dark:border-white/10 px-4 h-14 flex items-center gap-3">
        <Link
          href="/#liga"
          className="text-[#9EA3AE] dark:text-white/50 hover:text-[#CE1126] transition-colors text-sm"
        >
          ← Kembali
        </Link>
        <span className="text-[#EAECF0] dark:text-white/20">/</span>
        <span className="text-xs text-[#374151] dark:text-white/80 font-medium truncate">
          {league.name}
        </span>
        <ThemeToggleButton className="ml-auto text-[#6B7280] dark:text-white/60 hover:text-[#191c1e] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10" />
      </header>

      <LeagueSubNav sections={SECTIONS} />

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[560px]">
          <section id="ringkasan" className="scroll-mt-24 flex flex-col gap-4 lg:h-full lg:min-h-0">
            <div
              className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-[#EAECF0] dark:border-white/10 shadow-sm px-6 py-8 sm:px-8 sm:py-10"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
            >
              <BallIcon className="absolute -right-8 -bottom-12 w-56 h-56 sm:w-64 sm:h-64 text-white/10 pointer-events-none select-none" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-white font-bebas font-bold text-3xl sm:text-4xl tracking-widest">
                    {getLeagueDisplayName(league.name)}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mt-1">{league.description}</p>
                  <div className="flex gap-6 mt-4 sm:mt-6">
                    <div>
                      <div className="font-bebas text-xl sm:text-2xl text-white">
                        {leagueClubs.length}
                      </div>
                      <div className="text-[10px] text-white/70 uppercase tracking-wide">
                        Klub
                      </div>
                    </div>
                    <div>
                      <div className="font-bebas text-xl sm:text-2xl text-white">
                        Level {league.level}
                      </div>
                      <div className="text-[10px] text-white/70 uppercase tracking-wide">
                        Kasta
                      </div>
                    </div>
                    {season && (
                      <div>
                        <div className="font-bebas text-xl sm:text-2xl text-white">
                          {season.name}
                        </div>
                        <div className="text-[10px] text-white/70 uppercase tracking-wide">
                          Musim Aktif
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {logo && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white shadow-sm flex items-center justify-center p-2.5 sm:p-3 flex-shrink-0">
                    <img
                      src={logo}
                      alt={`Logo ${league.name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <section id="statistik-pemain" className="scroll-mt-24 flex-1 min-h-0 flex flex-col">
              <PlayerStatsTabs
                topScorers={topScorers}
                topAssists={topAssists}
                clubs={leagueClubs}
                color={color}
                textColor={textColor}
                textColorDark={textColorDark}
                scorersUpdatedAt={derivedUpdatedAt}
                assistsUpdatedAt={playerStatsData?.updatedAt ?? null}
                groupedTopScorers={groups.length > 0 ? groupedTopScorers : undefined}
                groupedTopAssists={groups.length > 0 ? groupedTopAssists : undefined}
              />
            </section>
          </section>

          <section id="klasemen" className="scroll-mt-24 lg:h-full lg:min-h-0">
            {groups.length > 0 ? (
              <GroupStandingsTabs groups={groupStandings} color={color} />
            ) : (
              <StandingsTable
                rows={standingsRows}
                clubs={leagueClubs}
                updatedAt={derivedUpdatedAt}
              />
            )}
          </section>
        </div>

        <section id="pertandingan" className="scroll-mt-24">
          <h2 className="font-bebas text-lg tracking-wider text-[#1A1A2E] dark:text-white mb-3">
            PERTANDINGAN
          </h2>
          <MatchesTabs
            fixtures={fixtures}
            results={results}
            clubs={leagueClubs}
            color={color}
            updatedAt={matchesData?.updatedAt ?? null}
            groupedFixtures={groups.length > 0 ? groupedFixtures : undefined}
            groupedResults={groups.length > 0 ? groupedResults : undefined}
          />
        </section>

      </main>

      <Footer />
    </div>
  );
}
