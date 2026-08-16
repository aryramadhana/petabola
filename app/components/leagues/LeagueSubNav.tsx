"use client";

import { useEffect, useState } from "react";
import { FOCUS_RING } from "@/app/components/ui/focusRing";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

// Same site accent + same mechanism as Header.tsx's homepage nav: hover/press
// are plain CSS states, but the persistent "current section" highlight is
// driven by scroll position, not CSS — a fixed class only lasts while
// hovered/pressed and can't reflect scroll state.
function navClass(active: boolean) {
  return `px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap hover:text-[#be123c] dark:hover:text-[#5eead4] hover:bg-[#be123c]/10 dark:hover:bg-[#5eead4]/10 active:bg-[#f4645a]/20 dark:active:bg-[#0d9488]/25 ${
    active
      ? "text-[#be123c] dark:text-[#5eead4] bg-[#f4645a]/15 dark:bg-[#0d9488]/20 font-semibold"
      : "text-[#6B7280] dark:text-white/60"
  } ${FOCUS_RING}`;
}

export function LeagueSubNav({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // Directly compute which section's own center is closest to the
    // viewport's center on every scroll frame, instead of an
    // IntersectionObserver watching a thin band. The band approach could
    // fire intersection events for two sections within the same scroll
    // batch during a fast/large scroll (e.g. dragging the scrollbar), and
    // since React batches state updates, only the last `setActive` in that
    // batch ever rendered — a section could become briefly "active" and
    // never actually appear on screen. A single per-frame calculation has
    // no such ambiguity: exactly one section is closest at any moment.
    let frame: number | null = null;
    function update() {
      frame = null;
      const centerY = window.innerHeight / 2;
      let closestId = elements[0].id;
      let closestDistance = Infinity;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - centerY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = el.id;
        }
      }
      // A short trailing section can never be scrolled up to the viewport
      // center once the page has no more room left to scroll — fall back
      // to activating the last section once scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? elements[elements.length - 1].id : closestId);
    }
    function onScroll() {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="relative sticky top-0 z-30 bg-white/80 dark:bg-[#0d1b2a]/90 backdrop-blur-xl border-b border-white/70 dark:border-white/10 overflow-x-auto">
      <div className="flex gap-1 px-4 py-2 min-w-max">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={navClass(active === s.id)}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
