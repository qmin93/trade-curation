import type { UnifiedNewsItem } from "@/lib/news-fetcher";

export function CompactNewsList({ items }: { items: UnifiedNewsItem[] }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
        <span>News Feed · 실시간</span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[var(--red)] pulse-dot" />
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map((n) => (
          <a
            key={n.id}
            href={n.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-1.5 py-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex items-start gap-2 text-[11px]">
              <span className="mono text-[10px] text-[var(--text-caption)] w-12 shrink-0 tabular-nums">
                {n.date.slice(5)}
              </span>
              <span className="text-[var(--text)] leading-snug line-clamp-1 flex-1">
                {n.headline}
              </span>
              <span className="mono text-[10px] text-[var(--accent)]/70 shrink-0">
                {n.source}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
