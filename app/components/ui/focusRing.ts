// Shared focus-visible ring recipe — site accent, not tied to any league
// color: Sunset Sorbet (coral #f4645a) in light mode, Blue Surf (teal
// #0d9488) in dark mode. Two variants because ring-offset needs to match
// the surface's own background color (dark-mode convention here is plain
// `dark:` classes, not CSS custom properties — see CLAUDE.md).
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4645a] dark:focus-visible:ring-[#0d9488] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0F2F5] dark:focus-visible:ring-offset-[#0d1b2a]";

// For elements inside Header, which is always dark chrome (bg-[#05111D])
// regardless of light/dark theme — the background never changes, but the
// accent COLOR still swaps with theme (Sunset in light mode, Surf in dark
// mode), since the whole point of this palette is that switching themes
// reads as switching identity, not just inverting a fixed brand color.
export const FOCUS_RING_ON_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4645a] dark:focus-visible:ring-[#0d9488] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05111D]";
