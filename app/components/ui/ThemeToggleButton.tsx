"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "./icons";

interface Props {
  className?: string;
}

export function ThemeToggleButton({ className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={mounted && resolvedTheme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ${className}`}
    >
      {mounted && resolvedTheme === "dark" ? (
        <SunIcon className="w-3.5 h-3.5" />
      ) : (
        <MoonIcon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
