"use client";

import { useState } from "react";
import type { Match } from "@/types/match";
import type { Club } from "@/types";
import { FixturesList } from "@/app/components/leagues/FixturesList";
import { ResultsList } from "@/app/components/leagues/ResultsList";
import { DataUpdatedAt } from "@/app/components/shared/DataUpdatedAt";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface GroupedMatches {
  groupId: string;
  groupLabel: string;
  matches: Match[];
}

interface Props {
  fixtures: Match[];
  results: Match[];
  clubs: Club[];
  color: string;
  updatedAt: string | null;
  groupedFixtures?: GroupedMatches[];
  groupedResults?: GroupedMatches[];
}

const TABS = [
  { id: "jadwal", label: "Jadwal" },
  { id: "hasil", label: "Hasil" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, setActive: (id: TabId) => void) {
  const currentId = e.currentTarget.id.replace("tab-", "") as TabId;
  const idx = TABS.findIndex((t) => t.id === currentId);
  let nextIdx = idx;
  if (e.key === "ArrowRight") nextIdx = (idx + 1) % TABS.length;
  else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + TABS.length) % TABS.length;
  else if (e.key === "Home") nextIdx = 0;
  else if (e.key === "End") nextIdx = TABS.length - 1;
  else return;
  e.preventDefault();
  setActive(TABS[nextIdx].id);
  document.getElementById(`tab-${TABS[nextIdx].id}`)?.focus();
}

export function MatchesTabs({ fixtures, results, clubs, color, updatedAt, groupedFixtures, groupedResults }: Props) {
  const [active, setActive] = useState<TabId>("jadwal");

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div
          role="tablist"
          aria-label="Jadwal dan hasil pertandingan"
          className="inline-flex p-1 gap-1 rounded-full bg-black/5 dark:bg-white/10"
        >
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, setActive)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${FOCUS_RING} ${
                  isActive
                    ? "text-white"
                    : "text-[#6B7280] dark:text-white/60 hover:text-[#1A1A2E] dark:hover:text-white"
                }`}
                style={isActive ? { background: color } : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <DataUpdatedAt label="Jadwal & hasil" updatedAt={updatedAt} />
      </div>

      {active === "jadwal" ? (
        <div id="panel-jadwal" role="tabpanel" aria-labelledby="tab-jadwal">
          <FixturesList matches={fixtures} clubs={clubs} groupedMatches={groupedFixtures} />
        </div>
      ) : (
        <div id="panel-hasil" role="tabpanel" aria-labelledby="tab-hasil">
          <ResultsList matches={results} clubs={clubs} groupedMatches={groupedResults} />
        </div>
      )}
    </div>
  );
}
