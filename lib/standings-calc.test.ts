import { describe, expect, it } from "vitest";
import { computeStandings } from "@/lib/standings-calc";
import type { Match, MatchStatus } from "@/types/match";

let seq = 0;

/** Minimal finished match; only the fields the calculator reads matter. */
function match(
  home: string,
  homeScore: number | null,
  awayScore: number | null,
  away: string,
  status: MatchStatus = "finished"
): Match {
  seq += 1;
  return {
    id: `m${seq}`,
    seasonId: "s1",
    matchweek: 1,
    homeClubId: home,
    awayClubId: away,
    date: "2026-09-04",
    time: "15:30",
    timezone: "WIB",
    stadium: null,
    homeScore,
    awayScore,
    status,
  };
}

const order = (rows: { clubId: string }[]) => rows.map((r) => r.clubId);

describe("computeStandings — aggregation", () => {
  it("awards 3 points for a win and 0 for a loss", () => {
    const rows = computeStandings([match("a", 2, 1, "b")], ["a", "b"]);
    expect(rows).toEqual([
      {
        position: 1,
        clubId: "a",
        played: 1,
        won: 1,
        drawn: 0,
        lost: 0,
        goalsFor: 2,
        goalsAgainst: 1,
        goalDifference: 1,
        points: 3,
      },
      {
        position: 2,
        clubId: "b",
        played: 1,
        won: 0,
        drawn: 0,
        lost: 1,
        goalsFor: 1,
        goalsAgainst: 2,
        goalDifference: -1,
        points: 0,
      },
    ]);
  });

  it("awards 1 point each for a draw", () => {
    const rows = computeStandings([match("a", 1, 1, "b")], ["a", "b"]);
    expect(rows.map((r) => [r.clubId, r.points, r.drawn])).toEqual([
      ["a", 1, 1],
      ["b", 1, 1],
    ]);
  });

  it("accumulates goals across several matches", () => {
    const rows = computeStandings(
      [match("a", 3, 0, "b"), match("c", 1, 2, "a"), match("b", 0, 0, "c")],
      ["a", "b", "c"]
    );
    const a = rows.find((r) => r.clubId === "a")!;
    expect(a).toMatchObject({
      played: 2,
      won: 2,
      goalsFor: 5,
      goalsAgainst: 1,
      goalDifference: 4,
      points: 6,
    });
  });

  it("includes clubs that have not played yet, on zero", () => {
    const rows = computeStandings([match("a", 1, 0, "b")], ["a", "b", "c"]);
    expect(rows).toHaveLength(3);
    expect(rows.find((r) => r.clubId === "c")).toMatchObject({
      played: 0,
      points: 0,
      goalDifference: 0,
    });
  });
});

describe("computeStandings — what does not count", () => {
  it("ignores scheduled, postponed and cancelled matches", () => {
    const rows = computeStandings(
      [
        match("a", 1, 0, "b"),
        match("a", 9, 0, "b", "scheduled"),
        match("a", 9, 0, "b", "postponed"),
        match("a", 9, 0, "b", "cancelled"),
      ],
      ["a", "b"]
    );
    expect(rows.find((r) => r.clubId === "a")).toMatchObject({
      played: 1,
      goalsFor: 1,
      points: 3,
    });
  });

  it("ignores a finished match with a missing score", () => {
    const rows = computeStandings(
      [match("a", 1, 0, "b"), match("a", null, null, "b")],
      ["a", "b"]
    );
    expect(rows.find((r) => r.clubId === "a")!.played).toBe(1);
  });

  it("drops matches referencing a club outside the league", () => {
    // A stale reference left behind by a club changing league must not create
    // a phantom row, nor inflate the opponent's tally.
    const rows = computeStandings(
      [match("a", 1, 0, "b"), match("a", 5, 0, "relegated-club")],
      ["a", "b"]
    );
    expect(order(rows)).toEqual(["a", "b"]);
    expect(rows.find((r) => r.clubId === "a")).toMatchObject({
      played: 1,
      goalsFor: 1,
    });
  });

  it("returns an empty table when nothing has been played", () => {
    // Not rows of zeros: an unplayed season is unknown, not known-to-be-zero.
    expect(computeStandings([], ["a", "b", "c"])).toEqual([]);
    expect(
      computeStandings([match("a", null, null, "b", "scheduled")], ["a", "b"])
    ).toEqual([]);
  });
});

describe("computeStandings — point adjustments", () => {
  it("subtracts a deduction and reranks on the adjusted total", () => {
    const rows = computeStandings(
      [match("a", 1, 0, "b"), match("c", 0, 1, "d")],
      ["a", "b", "c", "d"],
      [{ clubId: "a", points: -2, reason: "Sanksi Komdis" }]
    );
    const a = rows.find((r) => r.clubId === "a")!;
    expect(a.points).toBe(1);
    // Won its match but now sits below the other winner.
    expect(order(rows)[0]).toBe("d");
    expect(a.won).toBe(1);
  });

  it("can push a club below zero", () => {
    const rows = computeStandings(
      [match("a", 0, 1, "b")],
      ["a", "b"],
      [{ clubId: "a", points: -2, reason: "Sanksi" }]
    );
    expect(rows.find((r) => r.clubId === "a")!.points).toBe(-2);
  });

  it("ignores an adjustment for a club outside the league", () => {
    const rows = computeStandings(
      [match("a", 1, 0, "b")],
      ["a", "b"],
      [{ clubId: "ghost", points: -5, reason: "?" }]
    );
    expect(rows).toHaveLength(2);
  });
});

describe("computeStandings — tie-breaking (Pasal 10)", () => {
  it("falls through to goal difference when tied clubs have not met", () => {
    // a and b both beat different opponents; head-to-head is empty for both,
    // so it separates nobody and is discarded.
    const rows = computeStandings(
      [match("a", 1, 0, "c"), match("b", 3, 0, "d")],
      ["a", "b", "c", "d"]
    );
    expect(order(rows).slice(0, 2)).toEqual(["b", "a"]);
  });

  it("uses goals scored when points and goal difference are level", () => {
    const rows = computeStandings(
      [match("a", 3, 2, "c"), match("b", 1, 0, "d")],
      ["a", "b", "c", "d"]
    );
    expect(order(rows).slice(0, 2)).toEqual(["a", "b"]);
  });

  it("ignores head-to-head until both legs between the tied clubs are played", () => {
    // Reproduces matchweek 3 of 2026/27: a beat b in their only meeting so far,
    // but b has the better overall goal difference. The official table ranks on
    // goal difference at this stage, so a must stay below b.
    const rows = computeStandings(
      [match("a", 1, 0, "b"), match("b", 5, 0, "c"), match("a", 0, 1, "c")],
      ["a", "b", "c"]
    );
    const a = rows.find((r) => r.clubId === "a")!;
    const b = rows.find((r) => r.clubId === "b")!;
    expect(a.points).toBe(b.points);
    expect(order(rows).indexOf("b")).toBeLessThan(order(rows).indexOf("a"));
  });

  it("prefers head-to-head over a better overall goal difference once both legs are played", () => {
    // a and b finish level on 8. b thrashed c and so has much the better
    // overall goal difference, but a took 4 points off b across their two
    // meetings — and that mini-league is complete, so it decides.
    const rows = computeStandings(
      [
        match("a", 1, 0, "b"),
        match("b", 0, 0, "a"),
        match("a", 0, 0, "c"),
        match("c", 0, 0, "a"),
        match("a", 0, 0, "d"),
        match("d", 0, 0, "a"),
        match("b", 5, 0, "c"),
        match("c", 0, 0, "b"),
        match("b", 2, 0, "d"),
        match("d", 1, 0, "b"),
      ],
      ["a", "b", "c", "d"]
    );
    const a = rows.find((r) => r.clubId === "a")!;
    const b = rows.find((r) => r.clubId === "b")!;
    expect([a.points, b.points]).toEqual([8, 8]);
    expect(b.goalDifference).toBeGreaterThan(a.goalDifference);
    expect(order(rows)).toEqual(["a", "b", "d", "c"]);
  });

  it("discards head-to-head entirely when it separates nobody", () => {
    // a and b drew both their meetings 0-0: head-to-head is level on every
    // key, so the whole procedure is voided and overall GD decides.
    const rows = computeStandings(
      [
        match("a", 0, 0, "b"),
        match("b", 0, 0, "a"),
        match("a", 1, 0, "c"),
        match("b", 4, 0, "c"),
      ],
      ["a", "b", "c"]
    );
    expect(order(rows).slice(0, 2)).toEqual(["b", "a"]);
  });

  it("recurses into the clubs head-to-head could not separate", () => {
    // a, b and c all finish on 8 points, having completed both legs against
    // each other. In their mini-league a takes top spot outright; b and c are
    // level on every head-to-head key, so that pairing falls through to overall
    // goal difference, where c is well ahead.
    const rows = computeStandings(
      [
        match("a", 1, 0, "b"),
        match("b", 0, 0, "a"),
        match("a", 1, 0, "c"),
        match("c", 0, 0, "a"),
        match("b", 0, 0, "c"),
        match("c", 0, 0, "b"),
        match("a", 0, 1, "d"),
        match("a", 0, 1, "e"),
        match("a", 0, 1, "f"),
        match("b", 2, 0, "d"),
        match("b", 0, 0, "e"),
        match("b", 0, 0, "f"),
        match("c", 5, 0, "d"),
        match("c", 0, 0, "e"),
        match("c", 0, 0, "f"),
      ],
      ["a", "b", "c", "d", "e", "f"]
    );

    const [a, b, c] = ["a", "b", "c"].map(
      (id) => rows.find((r) => r.clubId === id)!
    );
    expect([a.points, b.points, c.points]).toEqual([8, 8, 8]);

    // a finishes top despite the worst goal difference of the three.
    expect(a.goalDifference).toBeLessThan(b.goalDifference);
    expect(c.goalDifference).toBeGreaterThan(b.goalDifference);
    expect(order(rows)).toEqual(["a", "c", "b", "e", "f", "d"]);
  });

  it("orders by club id as a deterministic last resort", () => {
    // Identical in every computable respect. The regulation calls for a drawn
    // lot here; a website cannot draw lots, and a random order would reshuffle
    // the table on every rebuild.
    const rows = computeStandings(
      [match("zebra", 1, 1, "alpha")],
      ["zebra", "alpha"]
    );
    expect(order(rows)).toEqual(["alpha", "zebra"]);
  });

  it("numbers positions 1..n with no gaps", () => {
    const rows = computeStandings(
      [match("a", 1, 1, "b"), match("c", 1, 1, "d")],
      ["a", "b", "c", "d"]
    );
    expect(rows.map((r) => r.position)).toEqual([1, 2, 3, 4]);
  });
});
