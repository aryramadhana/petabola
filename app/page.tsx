import { getAllClubs } from "@/lib/clubs";
import { getAllLeagues } from "@/lib/leagues";
import { getAllSeasons } from "@/lib/seasons";
import { HomePage } from "./HomePage";

export const revalidate = 3600;

export default async function Page() {
  const [clubsRaw, leagues, seasons] = await Promise.all([
    getAllClubs(),
    getAllLeagues(),
    getAllSeasons(),
  ]);
  const clubs = clubsRaw.slice().sort((a, b) => a.name.localeCompare(b.name));
  return <HomePage clubs={clubs} leagues={leagues} seasons={seasons} />;
}
