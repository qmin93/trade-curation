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

  // 오늘 픽 한 줄 — 장중 live면 🔴진행 중, 마감이면 종목명(결과%는 우측 별도), 없으면 텔레그램 안내.
  const status = getMarketStatus(new Date());
  const monthLabel = `${Number(MONTHLY_STATS.month.split("-")[1])}월`;
  let pickLine: string;
  if (ACTIVE_PICK && ACTIVE_PICK.status === "live") {
    pickLine = status.isLive
      ? `오늘 픽 · ${ACTIVE_PICK.stockName} 진행 중`
      : `오늘 픽 · ${ACTIVE_PICK.stockName} 포착`;
  } else if (ACTIVE_PICK && ACTIVE_PICK.status === "done") {
    pickLine = `최근 픽 · ${ACTIVE_PICK.stockName}`;
  } else {
    pickLine = "오늘의 픽은 텔레그램에서 실시간 공개";
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="검증된 기록 공개"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card-hover)] overflow-hidden"
      >
        {/* 닫기 */}
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
        >
          ✕
        </button>

        {/* 검증 성과 카드 (HomeHero 동일 결) */}
        <div className="px-7 pt-9 pb-2 bg-gradient-to-br from-[var(--accent)]/[0.06] to-transparent">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] mb-3">
            검증된 기록 공개
          </div>
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--text-caption)]">
            {monthLabel} 검증 성과
          </div>
          <div className="mt-1.5 text-5xl font-bold tabular-nums leading-none text-[var(--red)]">
            +{MONTHLY_STATS.cumulativeReturn.toFixed(1)}%
          </div>
          <div className="mt-2 text-sm text-[var(--text-muted)]">누적 수익률 · 추천별 단순 합산</div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { v: `${MONTHLY_STATS.winRate}%`, l: "승률" },
              { v: `${MONTHLY_STATS.hitCount}`, l: "적중" },
              { v: `${MONTHLY_STATS.missCount}`, l: "손절" },
            ].map((t) => (
              <div key={t.l} className="rounded-xl bg-[var(--bg-subtle)] px-2 py-3 text-center">
                <div className="text-xl font-bold tabular-nums text-[var(--text)]">{t.v}</div>
                <div className="mt-0.5 text-xs text-[var(--text-muted)]">{t.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근/오늘 픽 */}
        <div className="px-7 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-subtle)] px-4 py-3.5">
            <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              {ACTIVE_PICK && ACTIVE_PICK.status === "live" && status.isLive && (
                <span className="h-2 w-2 rounded-full bg-[var(--red)] pulse-dot" />
              )}
              {pickLine}
            </span>
            {ACTIVE_PICK && ACTIVE_PICK.status === "done" && typeof ACTIVE_PICK.resultPercent === "number" && (
              <span
                className={`text-sm font-bold tabular-nums ${ACTIVE_PICK.resultPercent >= 0 ? "text-[var(--red)]" : "text-[var(--accent)]"}`}
              >
                {ACTIVE_PICK.resultPercent >= 0 ? "+" : ""}
                {ACTIVE_PICK.resultPercent}%
              </span>
            )}
          </div>
          {ACTIVE_PICK && ACTIVE_PICK.status === "live" && (
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-caption)]">
              정확한 진입·목표·손절가는 텔레그램에서 실시간 공개합니다.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="px-7 pb-6">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--accent)]/90 hover:shadow-[var(--shadow-card-hover)]"
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
