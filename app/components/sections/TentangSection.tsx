import { getLeagueColor } from "@/lib/clubs";
import { AmbientGlow } from "@/app/components/sections/AmbientGlow";
import { ScrollReveal, staggerDelay } from "@/app/components/sections/ScrollReveal";
import {
  CalendarIcon,
  DatabaseIcon,
  FlagIcon,
  RefreshIcon,
  ScaleIcon,
  ShieldIcon,
  TargetIcon,
} from "@/app/components/ui/icons";

const SECTIONS = [
  {
    title: "Tujuan PetaBola",
    body: "PetaBola membantu penggemar sepak bola Indonesia mengenal persebaran klub, identitas klub, serta informasi kompetisi Liga 1, Liga 2, dan Liga 3 melalui pengalaman eksplorasi berbasis peta.",
    icon: TargetIcon,
  },
  {
    title: "Bukan Situs Resmi",
    body: "PetaBola adalah proyek independen dan bukan situs resmi PSSI, PT Liga Indonesia Baru (LIB), liga, maupun klub mana pun. Seluruh identitas, logo, dan nama klub tetap menjadi hak masing-masing pemilik.",
    icon: ShieldIcon,
  },
  {
    title: "Sumber Data",
    body: "Informasi klub disusun dari situs resmi liga dan klub, publikasi resmi, Wikipedia, serta sumber statistik publik yang dapat diverifikasi. Prioritas sumber: situs resmi kompetisi → situs resmi klub → publikasi resmi → Wikipedia → sumber sekunder terpercaya.",
    icon: DatabaseIcon,
  },
  {
    title: "Cara Pembaruan",
    body: "Data klub diperiksa setiap awal musim, saat klub berpindah liga, atau saat nama/stadion berubah. Klasemen dan hasil pertandingan diperbarui secara berkala (idealnya mingguan), bukan secara real-time. Jadwal diperbarui saat jadwal resmi diumumkan atau berubah.",
    icon: RefreshIcon,
  },
  {
    title: "Batas Penggunaan Data",
    body: "Data pada PetaBola disediakan untuk tujuan informasi dan eksplorasi, bukan sebagai rujukan resmi untuk keperluan hukum, komersial, maupun taruhan. Selalu periksa sumber resmi liga/klub untuk kebutuhan yang bersifat resmi.",
    icon: ScaleIcon,
  },
];

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: React.ReactNode;
  featured?: boolean;
  className?: string;
}

function InfoCard({ icon: Icon, title, body, featured = false, className = "" }: InfoCardProps) {
  return (
    <div
      className={`relative overflow-hidden flex flex-col gap-2 bg-white/65 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 shadow-soft transition-all duration-200 hover:shadow-lg hover:border-white/90 dark:hover:border-white/20 before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 dark:before:via-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 ${featured ? "p-6" : "p-5"} ${className}`}
    >
      <div
        className={`flex items-center justify-center rounded-xl bg-[#be123c]/10 dark:bg-[#5eead4]/10 text-[#be123c] dark:text-[#5eead4] flex-shrink-0 ${featured ? "w-11 h-11" : "w-9 h-9"}`}
      >
        <Icon className={featured ? "w-5 h-5" : "w-4 h-4"} />
      </div>
      <h3 className={`font-bebas tracking-wider text-[#191c1e] dark:text-white ${featured ? "text-xl" : "text-lg"}`}>
        {title.toUpperCase()}
      </h3>
      <p className="text-[13px] text-[#374151] dark:text-white/70 leading-relaxed">{body}</p>
    </div>
  );
}

export function TentangSection() {
  return (
    <section id="tentang" className="relative overflow-hidden scroll-mt-16 snap-start py-14 px-4">
      <AmbientGlow>
        <div className="absolute -top-16 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: getLeagueColor("Liga 1") }} />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: getLeagueColor("Liga 2") }} />
      </AmbientGlow>

      <div className="relative z-10 max-w-4xl mx-auto space-y-4">
        <ScrollReveal>
          <div>
            <h2 className="font-bebas font-bold text-3xl tracking-widest text-[#191c1e] dark:text-white">
              TENTANG
            </h2>
            <p className="text-sm text-[#44474c] dark:text-white/60 mt-1">
              Tujuan, sumber data, dan batasan penggunaan PetaBola
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
          <ScrollReveal delayMs={staggerDelay(0)} className="lg:w-1/2">
            <InfoCard featured className="h-full" icon={SECTIONS[0].icon} title={SECTIONS[0].title} body={SECTIONS[0].body} />
          </ScrollReveal>
          <div className="flex flex-col gap-4 lg:w-1/2">
            <ScrollReveal delayMs={staggerDelay(1)}>
              <InfoCard icon={SECTIONS[1].icon} title={SECTIONS[1].title} body={SECTIONS[1].body} />
            </ScrollReveal>
            <ScrollReveal delayMs={staggerDelay(2)}>
              <InfoCard icon={SECTIONS[4].icon} title={SECTIONS[4].title} body={SECTIONS[4].body} />
            </ScrollReveal>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
          <ScrollReveal delayMs={staggerDelay(3)} className="lg:w-2/5">
            <InfoCard
              className="h-full"
              icon={CalendarIcon}
              title="Tanggal Pembaruan Terakhir"
              body={
                <>
                  Data liga dan musim terakhir diperbarui pada <strong>13 Agustus 2026</strong>. Tanggal
                  pembaruan per klub secara individual belum dicatat pada versi ini — lihat halaman
                  detail masing-masing klub untuk informasi yang tersedia.
                </>
              }
            />
          </ScrollReveal>
          <ScrollReveal delayMs={staggerDelay(4)} className="lg:w-3/5">
            <InfoCard className="h-full" icon={SECTIONS[2].icon} title={SECTIONS[2].title} body={SECTIONS[2].body} />
          </ScrollReveal>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
          <ScrollReveal delayMs={staggerDelay(5)} className="lg:w-2/5">
            <InfoCard
              className="h-full"
              icon={FlagIcon}
              title="Laporkan Data Yang Tidak Akurat"
              body={
                <>
                  Menemukan data klub, liga, atau kompetisi yang keliru? Laporkan ke Instagram{" "}
                  <a
                    href="https://www.instagram.com/dabelajar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#be123c] dark:text-[#5eead4] underline decoration-transparent hover:decoration-current transition-colors"
                  >
                    @dabelajar
                  </a>{" "}
                  agar dapat segera diperbaiki.
                </>
              }
            />
          </ScrollReveal>
          <ScrollReveal delayMs={staggerDelay(6)} className="lg:w-3/5">
            <InfoCard className="h-full" icon={SECTIONS[3].icon} title={SECTIONS[3].title} body={SECTIONS[3].body} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
