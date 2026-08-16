export type League = "Liga 1" | "Liga 2" | "Liga 3";

export type Region =
  | "Jawa"
  | "Sumatra"
  | "Kalimantan"
  | "Sulawesi"
  | "Bali & Nusa Tenggara"
  | "Papua & Maluku";

export interface Club {
  id: string;
  name: string;
  abbr: string;
  city: string;
  province: string;
  region: Region;
  stadium: string;
  stadiumCapacity?: number;
  founded: number;
  nickname: string;
  supporters: string;
  league: League;
  group?: string;
  lat: number;
  lng: number;
  colors?: string[]; // hex colors
  website?: string;
  wikipediaTitle?: string;
}

export type FilterLeague = "all" | League;
export type FilterRegion = "all" | Region;
