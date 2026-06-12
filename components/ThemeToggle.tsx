"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  // 기본은 흰색(light). 사용자가 직접 다크로 바꿔 저장한 경우만 다크.
  return stored === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
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
        {mounted ? (theme === "dark" ? "☀" : "☾") : "☾"}
      </span>
    </button>
  );
}
