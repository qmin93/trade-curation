"use client";

import { useState } from "react";
import type { UnifiedNewsItem } from "@/lib/news-fetcher";

const sourceTint: Record<string, string> = {
  ddaily: "text-purple-400",
  fnnews: "text-rose-400",
  newspim: "text-amber-400",
  etoday: "text-cyan-400",
  heraldcorp: "text-emerald-400",
  worktoday: "text-pink-400",
  yna: "text-violet-400",
  etnews: "text-blue-400",
  mtn: "text-yellow-400",
  hankyung: "text-sky-400",
  default: "text-[var(--accent)]",
};

function tintForSource(source: string): string {
  const key = source.toLowerCase().replace(/\..*$/, "");
  return sourceTint[key] ?? sourceTint.default;
}

export function NewsListItem({ news }: { news: UnifiedNewsItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
      className="group block py-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-elevated)] -mx-3 px-3 rounded-md transition-all cursor-pointer"
    >
      <div className="flex gap-4 items-start">
        {news.imageUrl ? (
          <div className="w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-md overflow-hidden bg-[var(--bg-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-md bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center">
            <span className={`mono text-[10px] uppercase tracking-widest ${tintForSource(news.source)}`}>
              {news.source}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 text-[10px] mono uppercase tracking-widest">
            <span className={tintForSource(news.source)}>{news.source}</span>
            <span className="text-[var(--text-caption)]">·</span>
            <span className="text-[var(--text-caption)] tabular-nums">
              {news.date.slice(5)}
            </span>
            {news.keywords[0] && (
              <>
                <span className="text-[var(--text-caption)]">·</span>
                <span className="text-[var(--text-muted)]">#{news.keywords[0]}</span>
              </>
            )}
            <span className="ml-auto normal-case tracking-normal text-[var(--text-caption)]">
              직접 정리
            </span>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-[var(--text)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {news.headline}
          </h3>
          {news.summary && (
            <p
              className={`text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed ${
                open ? "" : "line-clamp-2"
              }`}
            >
              {news.summary}
            </p>
          )}

          {/* Action row */}
          <div className="flex items-center gap-3 mt-2.5">
            {news.summary && (
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] group-hover:text-[var(--text-muted)] transition-colors">
                {open ? "접기 ▲" : "더보기 ▼"}
              </span>
            )}
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-[11px] mono uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              출처 가기
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
