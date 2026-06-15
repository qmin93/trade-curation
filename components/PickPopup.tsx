"use client";

import { useEffect, useState } from "react";
import { ACTIVE_PICK } from "@/lib/picks";
import { MONTHLY_STATS } from "@/lib/results";
import { getMarketStatus } from "@/lib/market-status";
import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 진입 광고 팝업 — 멘토(reloadkospi/open) 스타일.
 * 검증 성과(승률·누적) + 오늘 픽 한 줄 + 텔레그램 CTA. "오늘 하루 보지 않기"로 당일 숨김.
 * 인라인 픽/성과 섹션을 대체한다(홈 본문은 뉴스 중심).
 */

const DISMISS_KEY = "pick-popup-dismissed";

/** KST 기준 오늘 날짜 (YYYY-MM-DD) */
function kstToday(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function PickPopup() {
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === kstToday()) return;
    } catch {
      /* noop */
    }
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    if (hideToday) {
      try {
        localStorage.setItem(DISMISS_KEY, kstToday());
      } catch {
        /* noop */
      }
    }
    setOpen(false);
  };

  if (!open) return null;

  // 오늘 픽 한 줄 — 장중 live면 🔴진행 중, 마감이면 결과, 없으면 텔레그램 안내.
  const status = getMarketStatus(new Date());
  let pickLine: string;
  if (ACTIVE_PICK && ACTIVE_PICK.status === "live") {
    pickLine = status.isLive
      ? `오늘 픽 · ${ACTIVE_PICK.stockName} ${ACTIVE_PICK.ticker} 진행 중 🔴`
      : `오늘 픽 · ${ACTIVE_PICK.stockName} ${ACTIVE_PICK.ticker} 포착`;
  } else if (ACTIVE_PICK && ACTIVE_PICK.status === "done") {
    const r = ACTIVE_PICK.resultPercent;
    pickLine = `오늘 픽 · ${ACTIVE_PICK.stockName} 마감${
      typeof r === "number" ? ` ${r > 0 ? "+" : ""}${r}%` : ""
    }`;
  } else {
    pickLine = "오늘의 픽은 텔레그램에서 실시간 공개";
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="검증된 기록 공개"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden"
      >
        {/* 닫기 */}
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
        >
          ✕
        </button>

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-[var(--accent)]/[0.12] to-transparent">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] mb-2">
            검증된 기록 공개
          </div>
          <div className="flex items-baseline gap-2">
            <span className="mono text-xs text-[var(--text-caption)]">
              {MONTHLY_STATS.month}
            </span>
            <span className="text-2xl font-bold text-[var(--text)]">
              승률 <span className="text-[var(--red)]">{MONTHLY_STATS.winRate}%</span>
            </span>
          </div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">
            누적{" "}
            <span className="font-semibold text-[var(--red)]">
              +{MONTHLY_STATS.cumulativeReturn}%
            </span>{" "}
            · 적중 {MONTHLY_STATS.hitCount}·손절 {MONTHLY_STATS.missCount} 전부 공개
          </div>
        </div>

        {/* 오늘 픽 */}
        <div className="px-6 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            {ACTIVE_PICK && ACTIVE_PICK.status === "live" && status.isLive && (
              <span className="h-2 w-2 rounded-full bg-[var(--red)] pulse-dot" />
            )}
            {pickLine}
          </div>
          {ACTIVE_PICK && (
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-caption)] line-clamp-2">
              {ACTIVE_PICK.thesis}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="px-6 pb-5">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            근거·실시간 텔레그램 →
          </a>
          <label className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--text-caption)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideToday}
              onChange={(e) => setHideToday(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            오늘 하루 보지 않기
          </label>
          <p className="mt-2 text-center mono text-[9px] text-[var(--text-caption)]">
            정보 공유 목적 · 종목 추천 아님 · 매매 본인 책임
          </p>
        </div>
      </div>
    </div>
  );
}
