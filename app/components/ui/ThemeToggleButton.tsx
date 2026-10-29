"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "./icons";

const subscribeNoop = () => () => {};

interface Props {
  className?: string;
}

export function ThemeToggleButton({ className = "" }: Props) {
  // false during SSR and hydration, true afterwards — keeps the icon and
  // aria-label identical to the server HTML until the theme is known.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={mounted && resolvedTheme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${className}`}
    >
      {mounted && resolvedTheme === "dark" ? (
        <SunIcon className="w-3.5 h-3.5" />
      ) : (
        <MoonIcon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
