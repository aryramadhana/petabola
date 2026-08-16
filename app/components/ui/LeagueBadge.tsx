import type { League } from "@/types";
import { LEAGUE_BG } from "@/lib/clubs";

interface Props {
  league: League;
  size?: "xs" | "sm";
}

export function LeagueBadge({ league, size = "sm" }: Props) {
  const cls = LEAGUE_BG[league];
  const padding = size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-block rounded-full font-semibold ${padding} ${cls}`}>
      {league}
    </span>
  );
}
