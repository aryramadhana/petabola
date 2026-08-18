import { getAllClubs } from "@/lib/clubs";
import { getAllLeagues } from "@/lib/leagues";
import { getAllSeasons } from "@/lib/seasons";
import { getLastDataUpdate } from "@/lib/site-updated-at";
import { HomePage } from "./HomePage";

export const revalidate = false;

export default async function Page() {
  const [clubsRaw, leagues, seasons, lastDataUpdate] = await Promise.all([
    getAllClubs(),
    getAllLeagues(),
    getAllSeasons(),
    getLastDataUpdate(),
  ]);
  const clubs = clubsRaw.slice().sort((a, b) => a.name.localeCompare(b.name));
  return <HomePage clubs={clubs} leagues={leagues} seasons={seasons} lastDataUpdate={lastDataUpdate} />;
}
