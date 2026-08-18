import { notFound } from "next/navigation";
import Link from "next/link";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { getAllClubs, getClubById, getLeagueColor } from "@/lib/clubs";
import { MapPinIcon } from "@/app/components/ui/icons";
import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";

export const revalidate = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const clubs = await getAllClubs();
  return clubs.map((c) => ({ slug: c.id }));
}

export default async function ClubDetailPage({ params }: Props) {
  const { slug } = await params;
  const club = await getClubById(slug);
  if (!club) notFound();

  const color = getLeagueColor(club.league);

  return (
    <div className="relative min-h-screen bg-[#F5F6FA] dark:bg-[#0d1b2a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-16 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: color }} />
        <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: color }} />
      </div>

      {/* Header */}
      <header className="relative bg-white/85 dark:bg-[#0d1b2a]/90 backdrop-blur-xl border-b border-white/70 dark:border-white/10 px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-[#9EA3AE] dark:text-white/50 hover:text-[#CE1126] transition-colors text-sm">
          ← Kembali
        </Link>
        <span className="text-[#EAECF0] dark:text-white/20">/</span>
        <span className="text-xs text-[#374151] dark:text-white/80 font-medium truncate">{club.name}</span>
        <ThemeToggleButton className="ml-auto text-[#6B7280] dark:text-white/60 hover:text-[#191c1e] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10" />
      </header>

      <main className="relative max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Hero card */}
        <div className="bg-white/65 dark:bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 shadow-soft">
          <div
            className="px-6 py-8 flex items-center gap-5"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
          >
            <ClubAvatar clubId={club.id} abbr={club.abbr} league={club.league} size={64} />
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">{club.name}</h1>
              <p className="text-white/75 text-sm mt-0.5 flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                {club.city}, {club.province}
              </p>
              <div className="mt-2">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                  {club.league}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 divide-x divide-y divide-[#F3F4F6] dark:divide-white/10">
            {[
              { label: "Didirikan", value: String(club.founded) },
              { label: "Julukan", value: club.nickname },
              { label: "Stadion", value: club.stadium },
              { label: "Suporter", value: club.supporters },
              { label: "Wilayah", value: club.region },
              { label: "Kapasitas", value: club.stadiumCapacity ? `${club.stadiumCapacity.toLocaleString("id")} kursi` : "—" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <div className="text-[10px] text-[#9EA3AE] dark:text-white/50 uppercase tracking-wide">{item.label}</div>
                <div className="text-[13px] font-semibold text-[#1A1A2E] dark:text-white mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map embed */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#EAECF0] dark:border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F3F4F6] dark:border-white/10">
            <span className="font-bebas tracking-widest text-[13px] text-[#1A1A2E] dark:text-white">LOKASI STADION</span>
          </div>
          <iframe
            title={`Lokasi ${club.stadium}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${club.lng - 0.05},${club.lat - 0.05},${club.lng + 0.05},${club.lat + 0.05}&layer=mapnik&marker=${club.lat},${club.lng}`}
            className="w-full"
            height={220}
            style={{ border: 0 }}
          />
        </div>

        {/* Back to map */}
        <Link
          href="/"
          className="block text-center py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: color, color: "white" }}
        >
          ← Kembali ke Peta
        </Link>
      </main>
    </div>
  );
}
