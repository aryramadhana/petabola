"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export function ScrollReveal({ children, delayMs = 0, className = "" }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function staggerDelay(index: number, base = 150, step = 60, max = 450): number {
  return Math.min(base + index * step, max);
}
