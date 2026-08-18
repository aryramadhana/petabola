-- Seed Liga 2 Matchweek 1 fixtures (real schedule, parsed from
-- public/isi/jadwalliga2 - jadwalliga2.csv, added 2026-08-18).
-- Run once via the Supabase SQL Editor — this file is the version-controlled
-- record of what was run, not an automated migration (see 0001's header).
-- Updating these two `matches` rows fires the on-demand revalidation webhook
-- (see app/api/revalidate/route.ts) automatically, so /liga/liga-2 refreshes
-- without a manual redeploy.

update matches
set matches = '[
  {
    "id": "m1",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "psis-semarang",
    "awayClubId": "psps-riau",
    "date": "2026-09-11",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Stadion Jatidiri",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m2",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "persikad-depok",
    "awayClubId": "psgc-ciamis",
    "date": "2026-09-12",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Stadion Pakansari",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m3",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "persiku-kudus",
    "awayClubId": "adhayaksa-fc",
    "date": "2026-09-12",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Stadion Sultan Agung",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m4",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "sumsel-united",
    "awayClubId": "psms-medan",
    "date": "2026-09-13",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Gelora Sriwijaya Jakabaring",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m5",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "persiraja-banda-aceh",
    "awayClubId": "semen-padang-fc",
    "date": "2026-09-13",
    "time": "20:30",
    "timezone": "WIB",
    "stadium": "Stadion H. Dimurthala",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  }
]'::jsonb,
    "updatedAt" = '2026-08-18'
where id = 'liga-2-barat';

update matches
set matches = '[
  {
    "id": "m1",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "de-red-fc",
    "awayClubId": "kendal-tornado-fc",
    "date": "2026-09-12",
    "time": "15:30",
    "timezone": "WIB",
    "stadium": "Gelora 10 November",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m2",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "ps-barito-putera",
    "awayClubId": "persipura-jayapura",
    "date": "2026-09-12",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Stadion 17 Mei Banjarmasin",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m3",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "rans-nusantara-fc",
    "awayClubId": "persiba-balikpapan",
    "date": "2026-09-13",
    "time": "15:30",
    "timezone": "WIB",
    "stadium": "Stadion Kanjuruhan",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m4",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "persela-lamongan",
    "awayClubId": "persis-solo",
    "date": "2026-09-13",
    "time": "15:30",
    "timezone": "WIB",
    "stadium": "Stadion Surajaya",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  },
  {
    "id": "m5",
    "seasonId": "liga-2-2026-2027",
    "matchweek": 1,
    "homeClubId": "psbs-biak",
    "awayClubId": "deltras-fc",
    "date": "2026-09-13",
    "time": "19:00",
    "timezone": "WIB",
    "stadium": "Gelora Joko Samudro",
    "homeScore": null,
    "awayScore": null,
    "status": "scheduled"
  }
]'::jsonb,
    "updatedAt" = '2026-08-18'
where id = 'liga-2-timur';

-- Real Matchweek-1 kickoff is 2026-09-11 (one day earlier than the season's
-- previous placeholder startDate of 2026-09-12) — corroborating evidence,
-- same pattern as Liga 1's startDate correction (see root CLAUDE.md).
update seasons
set "startDate" = '2026-09-11'
where id = 'liga-2-2026-2027';
