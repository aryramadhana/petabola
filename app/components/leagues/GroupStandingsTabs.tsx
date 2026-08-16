"use client";

import { useState } from "react";
import type { StandingsRow } from "@/types/standing";
import type { Club } from "@/types";
import { StandingsTable } from "@/app/components/leagues/StandingsTable";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface GroupData {
  id: string;
  label: string;
  rows: StandingsRow[];
  clubs: Club[];
  updatedAt: string | null;
}

interface Props {
  groups: GroupData[];
  color: string;
}

function handleKeyDown(
  e: React.KeyboardEvent<HTMLButtonElement>,
  groups: GroupData[],
  setActive: (id: string) => void
) {
  const currentId = e.currentTarget.id.replace("group-tab-", "");
  const idx = groups.findIndex((g) => g.id === currentId);
  let nextIdx = idx;
  if (e.key === "ArrowRight") nextIdx = (idx + 1) % groups.length;
  else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + groups.length) % groups.length;
  else if (e.key === "Home") nextIdx = 0;
  else if (e.key === "End") nextIdx = groups.length - 1;
  else return;
  e.preventDefault();
  setActive(groups[nextIdx].id);
  document.getElementById(`group-tab-${groups[nextIdx].id}`)?.focus();
}

export function GroupStandingsTabs({ groups, color }: Props) {
  const [active, setActive] = useState<string>(groups[0]?.id ?? "");
  const activeGroup = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div className="h-full flex flex-col">
      <div
        role="tablist"
        aria-label="Pilih grup klasemen"
        className="inline-flex p-1 gap-1 rounded-full bg-black/5 dark:bg-white/10 mb-3 flex-shrink-0 w-fit"
      >
        {groups.map((g) => {
          const isActive = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`group-tab-${g.id}`}
              aria-selected={isActive}
              aria-controls={`group-panel-${g.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(g.id)}
              onKeyDown={(e) => handleKeyDown(e, groups, setActive)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${FOCUS_RING} ${
                isActive
                  ? "text-white"
                  : "text-[#6B7280] dark:text-white/60 hover:text-[#1A1A2E] dark:hover:text-white"
              }`}
              style={isActive ? { background: color } : undefined}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div
          id={`group-panel-${activeGroup.id}`}
          role="tabpanel"
          aria-labelledby={`group-tab-${activeGroup.id}`}
          className="flex-1 min-h-0"
        >
          <StandingsTable
            title={activeGroup.label.toUpperCase()}
            rows={activeGroup.rows}
            clubs={activeGroup.clubs}
            updatedAt={activeGroup.updatedAt}
          />
        </div>
      )}
    </div>
  );
}
