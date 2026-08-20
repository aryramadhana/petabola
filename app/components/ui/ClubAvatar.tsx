"use client";

import { useState } from "react";
import { getLeagueColor, getLeagueTextColor } from "@/lib/clubs";
import type { League } from "@/types";

interface Props {
  clubId: string;
  abbr: string;
  league: League;
  size?: number;
}

export function ClubAvatar({ clubId, abbr, league, size = 34 }: Props) {
  const [imgError, setImgError] = useState(false);
  const color = getLeagueColor(league);
  const textColor = getLeagueTextColor(league);

  if (!imgError) {
    return (
      <img
        src={`/logos/${clubId}.png`}
        alt={abbr}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          flexShrink: 0,
        }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <span style={{ fontSize: size * 0.4, fontWeight: 700, color: textColor }}>
        {abbr}
      </span>
    </div>
  );
}
