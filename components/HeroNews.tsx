"use client";

import { useState } from "react";
import type { UnifiedNewsItem } from "@/lib/news-fetcher";
import { NewsModal } from "./NewsModal";

// 무이미지 히어로 폴백 — 흰 배경에 어울리는 일관된 딥 인디고(매체별 랜덤색 폐기).
const HERO_GRADIENT = "from-indigo-950 via-slate-900 to-slate-950";

function gradientForSource(_source: string): string {
  return HERO_GRADIENT;
}

/** 게시 시각을 한국시간 "MM-DD HH:mm"로. 시각 정보 없으면 날짜만. */
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
  return news.date;
}

export function HeroNews({ news }: { news: UnifiedNewsItem }) {
  const grad = gradientForSource(news.source);
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      className="group block relative overflow-hidden rounded-2xl border border-[var(--border)] aspect-[16/9] md:aspect-[21/9] cursor-pointer"
    >
      {news.imageUrl ? (
        <>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 50%)",
            }}
          />
        </>
      )}
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/80">
            Featured
          </span>
          <span className="text-white/30">·</span>
          <span className="mono text-[10px] uppercase tracking-widest text-white/80">
            {news.source}
          </span>
          <span className="text-white/30">·</span>
          <span className="mono text-[10px] text-white/70 tabular-nums">
            {formatStamp(news)}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4 max-w-3xl line-clamp-3 group-hover:text-white transition-colors">
          {news.headline}
        </h2>
        <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-2xl line-clamp-3 mb-5">
          {news.summary}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 mono text-[11px] uppercase tracking-widest text-white font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            출처 가기
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              ↗
            </span>
          </a>
          {news.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              className="ml-2 text-[10px] mono px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/25 backdrop-blur-sm"
            >
              #{k}
            </span>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
