"use client";

import { useState } from "react";
import type { PlayerStat } from "@/types/player-stat";
import type { Club } from "@/types";
import { PlayerLeaderboard } from "@/app/components/leagues/PlayerLeaderboard";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface GroupedPlayers {
  groupId: string;
  groupLabel: string;
  players: PlayerStat[];
}

interface Props {
  topScorers: PlayerStat[];
  topAssists: PlayerStat[];
  clubs: Club[];
  color: string;
  textColor: string;
  textColorDark: string;
  updatedAt: string | null;
  groupedTopScorers?: GroupedPlayers[];
  groupedTopAssists?: GroupedPlayers[];
}

const TABS = [
  { id: "skor", label: "Skor" },
  { id: "assist", label: "Assist" },
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

export function PlayerStatsTabs({
  topScorers,
  topAssists,
  clubs,
  color,
  textColor,
  textColorDark,
  updatedAt,
  groupedTopScorers,
  groupedTopAssists,
}: Props) {
  const [active, setActive] = useState<TabId>("skor");

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <div
          role="tablist"
          aria-label="Statistik top skor dan top assist"
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
      </div>

      {active === "skor" ? (
        <div id="panel-skor" role="tabpanel" aria-labelledby="tab-skor" className="flex-1 min-h-0 flex flex-col">
          <PlayerLeaderboard title="TOP SKOR" players={topScorers} clubs={clubs} statKey="goals" updatedAt={updatedAt} textColor={textColor} textColorDark={textColorDark} groupedPlayers={groupedTopScorers} />
        </div>
      ) : (
        <div id="panel-assist" role="tabpanel" aria-labelledby="tab-assist" className="flex-1 min-h-0 flex flex-col">
          <PlayerLeaderboard title="TOP ASSIST" players={topAssists} clubs={clubs} statKey="assists" updatedAt={updatedAt} textColor={textColor} textColorDark={textColorDark} groupedPlayers={groupedTopAssists} />
        </div>
      )}
    </div>
  );
}
