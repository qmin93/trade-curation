import { ACTIVE_PICK } from "@/lib/picks";
import { TELEGRAM_INVITE_URL } from "@/lib/site";
import { getMarketStatus } from "@/lib/market-status";

/** 메인 최상단 "오늘의 픽" 스포트라이트 — 터미널에서 받은 픽을 이미지 카드처럼 강조 노출. */
export function PickSpotlight() {
  const pick = ACTIVE_PICK;
  const status = getMarketStatus(new Date());

  // 휴장(주말)엔 진행 중 픽이 없다 — 다음 거래일 안내로 대체.
  if (!pick || status.phase === "weekend") {
    return (
      <a
        href={TELEGRAM_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-8 block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 md:p-6 hover:border-[var(--accent)]/40 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-bold text-[var(--text)]">💤 오늘은 픽이 없습니다</span>
          <span className="text-sm text-[var(--text-muted)]">
            휴장일 · 다음 거래일에 새 픽이 올라옵니다.
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
            실시간 픽은 텔레그램
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </span>
        </div>
      </a>
    );
  }

  const live = pick.status === "live" && status.isLive;

  return (
    <a
      href={TELEGRAM_INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-2xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/15 via-[var(--bg-elevated)] to-[var(--bg-elevated)] p-6 md:p-8 mb-8"
    >
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        {/* 종목 */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
              오늘의 픽
            </span>
            {live ? (
              <span className="inline-flex items-center gap-1 mono text-[10px] uppercase tracking-widest text-[var(--red)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
                진행 중
              </span>
            ) : (
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                {pick.status === "done" ? "마감" : status.short}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {pick.stockName}
            </h2>
            <span className="mono text-sm text-[var(--text-caption)] tabular-nums">
              {pick.ticker}
            </span>
            {pick.resultPercent != null && (
              <span className="mono text-lg md:text-xl font-bold text-[var(--red)] tabular-nums">
                {pick.resultPercent > 0 ? "+" : ""}
                {pick.resultPercent}%
              </span>
            )}
          </div>
        </div>

        {/* 자리·목표·근거 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {pick.entry && (
              <span className="mono text-[11px] px-2 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
                진입 {pick.entry}
              </span>
            )}
            {pick.targets?.map((t) => (
              <span
                key={t}
                className="mono text-[11px] px-2 py-1 rounded-md bg-[var(--accent-dim)] border border-[var(--accent)]/30 text-[var(--accent)]"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
            {pick.thesis}
          </p>
        </div>

        {/* CTA */}
        <span className="shrink-0 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white group-hover:opacity-90 transition-opacity">
          근거·실시간 텔레그램
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </span>
      </div>
    </a>
  );
}
