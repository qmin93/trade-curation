"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-sm">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="키워드·종목 검색…"
        className="w-full px-4 py-2 pr-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] hover:text-[var(--accent)] transition-colors"
        aria-label="검색"
      >
        ⏎
      </button>
    </form>
  );
}
