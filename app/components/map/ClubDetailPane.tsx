"use client";

import type { Club } from "@/types";
import { ClubAvatar } from "@/app/components/ui/ClubAvatar";
import { LeagueBadge } from "@/app/components/ui/LeagueBadge";
import { MapPinIcon } from "@/app/components/ui/icons";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface Props {
  club: Club | null;
  onClose: () => void;
  mobileOpen: boolean;
  showMobileOverlay?: boolean;
}

function DetailContent({ club, onClose }: { club: Club; onClose: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-white/10">
        <div
          className="relative overflow-hidden rounded-xl -m-1 p-1 flex items-center gap-3 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors duration-200
          before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px
          before:bg-gradient-to-r before:from-transparent before:via-white/80 dark:before:via-white/30 before:to-transparent
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        >
          <ClubAvatar clubId={club.id} abbr={club.abbr} league={club.league} size={56} />
          <div>
            <div className="font-bold text-[#191c1e] dark:text-white text-sm leading-tight">{club.name}</div>
            <div className="text-[#44474c] dark:text-white/60 text-[11px] mt-0.5">{club.abbr}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail klub"
          className={`text-[#44474c] dark:text-white/60 text-xl leading-none px-1 cursor-pointer hover:text-[#191c1e] dark:hover:text-white transition-colors rounded ${FOCUS_RING}`}
        >
          ×
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-[#44474c] dark:text-white/60 text-xs flex items-center gap-1">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            {club.city}, {club.province}
          </span>
          <LeagueBadge league={club.league} />
        </div>

        <div className="border-t border-[#E2E8F0] dark:border-white/10 pt-3 flex flex-col gap-2">
          <Field label="Stadion" value={club.stadium} />
          {club.stadiumCapacity ? (
            <Field label="Kapasitas" value={`${club.stadiumCapacity.toLocaleString("id")} kursi`} />
          ) : null}
          <Field label="Berdiri" value={String(club.founded)} />
          <Field label="Julukan" value={club.nickname} />
          <Field label="Suporter" value={club.supporters} />
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-[#44474c] dark:text-white/60 min-w-[72px]">{label}</span>
      <span className="text-[#191c1e] dark:text-white font-semibold">{value}</span>
    </div>
  );
}

export function ClubDetailPane({ club, onClose, mobileOpen, showMobileOverlay = true }: Props) {
  return (
    <>
      {/* Desktop: floating panel, slides in only when a club is selected */}
      <aside
        className={`hidden md:flex md:flex-col absolute top-4 right-4 bottom-4 w-[340px] z-20 bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 shadow-soft overflow-hidden transition-all duration-300 ${
          club ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {club ? <DetailContent club={club} onClose={onClose} /> : null}
      </aside>

      {/* Mobile: bottom sheet, only for direct marker taps, only while the map section is in view */}
      {showMobileOverlay && (
        <>
          <div
            className={`md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity ${
              mobileOpen && club ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
          />
          <div
            className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-xl rounded-t-2xl border-t border-white/70 dark:border-white/10 transition-transform duration-300 flex flex-col ${
              mobileOpen && club ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ maxHeight: "75vh", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#E2E8F0] dark:bg-white/20" />
            </div>
            {club ? <DetailContent club={club} onClose={onClose} /> : null}
          </div>
        </>
      )}
    </>
  );
}
