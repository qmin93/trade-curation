"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches)
    return "light";
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={`${theme === "dark" ? "라이트" : "다크"} 모드로 전환`}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-hover)] transition-all text-sm"
    >
      <span aria-hidden suppressHydrationWarning>
        {mounted ? (theme === "dark" ? "☀" : "☾") : "☀"}
      </span>
    </button>
  );
}
