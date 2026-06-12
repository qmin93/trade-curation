"use client";

import { useState } from "react";
import type { UnifiedNewsItem } from "@/lib/news-fetcher";
import { NewsModal } from "./NewsModal";

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

/** 게시 시각을 한국시간 "MM-DD HH:mm"로. 시각 정보 없으면 날짜만 "MM-DD". */
function formatStamp(news: UnifiedNewsItem): string {
  if (news.publishedAt) {
    const d = new Date(news.publishedAt);
    if (!isNaN(d.getTime())) {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(d);
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      return `${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
    }
  }
  return news.date.slice(5);
}

export function NewsListItem({ news }: { news: UnifiedNewsItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
    {open && (
      <NewsModal news={news} stamp={formatStamp(news)} onClose={() => setOpen(false)} />
    )}
    <div
      onClick={() => setOpen(true)}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      className="card-surface group block p-4 md:p-5 cursor-pointer hover:border-[var(--accent)]/40"
    >
      <div className="flex gap-4 md:gap-5 items-start">
        {news.imageUrl ? (
          <div className="w-28 h-24 md:w-48 md:h-32 shrink-0 rounded-xl overflow-hidden bg-[var(--bg-subtle)] ring-1 ring-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-28 h-24 md:w-48 md:h-32 shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent)]/10 via-[var(--bg-subtle)] to-[var(--bg-hover)] ring-1 ring-[var(--border)] flex items-center justify-center">
            <span className={`mono text-xs uppercase tracking-widest font-semibold ${tintForSource(news.source)}`}>
              {news.source}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 text-[11px] mono uppercase tracking-widest">
            <span className={`font-semibold ${tintForSource(news.source)}`}>{news.source}</span>
            {news.keywords[0] && (
              <>
                <span className="text-[var(--text-caption)]">·</span>
                <span className="text-[var(--text-muted)]">#{news.keywords[0]}</span>
              </>
            )}
            <span className="ml-auto tabular-nums text-[var(--text-caption)]">
              {formatStamp(news)}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[var(--text)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2 tracking-tight">
            {news.headline}
          </h3>
          {news.summary && (
            <p className="text-sm md:text-[15px] text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-3">
              {news.summary}
            </p>
          )}

          {/* 종목 태그 + 액션 */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {news.stocks.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]"
              >
                {s}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-3">
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] group-hover:text-[var(--accent)] transition-colors">
                크게 보기 ⤢
              </span>
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-[11px] mono uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                출처 ↗
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
