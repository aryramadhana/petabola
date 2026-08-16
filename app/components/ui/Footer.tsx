import { FOCUS_RING_ON_DARK } from "./focusRing";

export function Footer() {
  return (
    <footer className="bg-[#05111D] px-4 py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <img
            src="/isi/mascot.png"
            alt="Maskot PetaBola"
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div>
            <div className="font-bebas font-bold text-sm tracking-widest text-white">
              PETABOLA
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              Supaya kita kenal sama klub-klub di Indonesia
            </div>
          </div>
        </div>

        <div className="text-[11px] text-white/50">
          Dibuat oleh{" "}
          <a
            href="https://www.instagram.com/dabelajar"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold text-[#fda4af] dark:text-[#5eead4] hover:underline rounded-sm ${FOCUS_RING_ON_DARK}`}
          >
            @dabelajar
          </a>
          <span className="mx-1.5">·</span>
          © 2026 PetaBola
        </div>
      </div>
    </footer>
  );
}
