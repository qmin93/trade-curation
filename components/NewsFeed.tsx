"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UnifiedNewsItem } from "@/lib/news-fetcher";
import { NewsListItem } from "./NewsListItem";

const PAGE = 12;

/**
 * 뉴스 피드 — 키워드 필터 + 무한스크롤.
 * 서버에서 받은 뉴스 배열을 클라이언트에서 필터/점진 로드.
 */
export function NewsFeed({ items }: { items: UnifiedNewsItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  // 자주 등장하는 키워드/종목을 필터칩으로
  const filters = useMemo(() => {
    const count = new Map<string, number>();
    for (const n of items) {
      for (const k of [...n.keywords, ...n.stocks]) {
        const key = k.trim();
        if (key.length >= 2) count.set(key, (count.get(key) ?? 0) + 1);
      }
    }
    return [...count.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([k]) => k);
  }, [items]);

  const filtered = useMemo(() => {
    if (!active) return items;
    return items.filter((n) => {
      const hay = `${n.headline} ${n.keywords.join(" ")} ${n.stocks.join(" ")}`;
      return hay.includes(active);
    });
  }, [items, active]);

  useEffect(() => setVisible(PAGE), [active]);

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting)
          setVisible((v) => Math.min(v + PAGE, filtered.length));
      },
      { rootMargin: "500px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [filtered.length]);

  const shown = filtered.slice(0, visible);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
        <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">뉴스</h2>
        <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
          {filtered.length}건
        </span>
      </div>

      {/* 키워드 필터 */}
      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChip label="전체" active={!active} onClick={() => setActive(null)} />
        {filters.map((k) => (
          <FilterChip
            key={k}
            label={`#${k}`}
            active={active === k}
            onClick={() => setActive(active === k ? null : k)}
          />
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-10 text-center">
          해당 키워드 뉴스가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {shown.map((n) => (
            <NewsListItem key={n.id} news={n} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div ref={sentinel} className="flex justify-center py-6">
          <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
            불러오는 중…
          </span>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-[var(--accent)] text-white"
          : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      {label}
    </button>
  );
}
