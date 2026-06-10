"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KEYWORDS } from "@/lib/keywords";
import { STOCKS } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";

interface SuggestionItem {
  label: string;
  sub: string;
  href: string;
  category: "Keyword" | "Stock" | "Theme";
}

function buildIndex(): SuggestionItem[] {
  return [
    ...KEYWORDS.map((k) => ({
      label: k.label,
      sub: `Tier ${k.tier} · ${k.category}`,
      href: `/keyword/${k.slug}`,
      category: "Keyword" as const,
    })),
    ...STOCKS.map((s) => ({
      label: s.name,
      sub: `${s.exchange} · ${s.ticker}`,
      href: `/stock/${s.ticker}`,
      category: "Stock" as const,
    })),
    ...THEMES.map((t) => ({
      label: t.label,
      sub: `Tier ${t.tier} · Theme`,
      href: `/theme/${t.slug}`,
      category: "Theme" as const,
    })),
  ];
}

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const index = useMemo(() => buildIndex(), []);

  const lower = q.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!lower) return [];
    return index
      .filter(
        (i) =>
          i.label.toLowerCase().includes(lower) ||
          i.sub.toLowerCase().includes(lower),
      )
      .slice(0, 8);
  }, [index, lower]);

  useEffect(() => {
    setActiveIdx(0);
  }, [q]);

  function go(item: SuggestionItem) {
    router.push(item.href);
    setOpen(false);
    setQ("");
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(matches.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches[activeIdx]) {
        go(matches[activeIdx]);
      } else if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKey}
        placeholder="키워드·종목·테마 검색…"
        className="w-full px-4 py-2 pr-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] pointer-events-none">
        ⌘K
      </span>

      {open && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden z-50">
          {matches.map((m, i) => (
            <button
              key={`${m.category}-${m.href}`}
              onMouseDown={(e) => {
                e.preventDefault();
                go(m);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-3 py-2 transition-colors ${
                activeIdx === i
                  ? "bg-[var(--bg-hover)]"
                  : "hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[var(--text)] truncate">
                  {m.label}
                </span>
                <span className="text-[9px] mono uppercase tracking-widest text-[var(--text-caption)] shrink-0">
                  {m.category}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-caption)] mono">
                {m.sub}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
