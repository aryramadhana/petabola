-- League domain schema: leagues, seasons, matches, standings, player_stats.
-- One-row-per-league[-group] jsonb-blob tables for matches/standings/player_stats,
-- matching the app's access pattern (always fetches one league['s group] as a whole
-- unit, never queries into the payload at the SQL level). RLS: public anon SELECT
-- only, matching the pre-existing `clubs` table's policy. Run once via the Supabase
-- SQL Editor — this file is the version-controlled record of what was run, not an
-- automated migration (this project has no migration tooling / Supabase CLI setup).

create table leagues (
  id text primary key,
  name text not null,
  level integer not null,
  "activeSeasonId" text not null,
  description text not null,
  "updatedAt" text,
  groups jsonb
);

create table seasons (
  id text primary key,
  "leagueId" text not null references leagues(id),
  name text not null,
  status text not null,
  "startDate" text,
  "endDate" text
);

create table matches (
  id text primary key,
  "leagueId" text not null references leagues(id),
  "groupId" text,
  "seasonId" text not null,
  "updatedAt" text,
  matches jsonb not null default '[]'::jsonb
);

create table standings (
  id text primary key,
  "leagueId" text not null references leagues(id),
  "groupId" text,
  "seasonId" text not null,
  "updatedAt" text,
  rows jsonb not null default '[]'::jsonb
);

create table player_stats (
  id text primary key,
  "leagueId" text not null references leagues(id),
  "groupId" text,
  "seasonId" text not null,
  "updatedAt" text,
  players jsonb not null default '[]'::jsonb
);

alter table leagues enable row level security;
alter table seasons enable row level security;
alter table matches enable row level security;
alter table standings enable row level security;
alter table player_stats enable row level security;

create policy "Public read access" on leagues for select to anon using (true);
create policy "Public read access" on seasons for select to anon using (true);
create policy "Public read access" on matches for select to anon using (true);
create policy "Public read access" on standings for select to anon using (true);
create policy "Public read access" on player_stats for select to anon using (true);
