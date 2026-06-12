import { getBacktestSummary } from "@/lib/backtest";
import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 신뢰 포지셔닝 히어로 — "수익만 보여주는 다른 방 vs 손절까지 공개하는 우리".
 * 멘토(세력아카데미)의 핵심 차별화 메시지를 단타 트레이드 톤으로.
 * 수치는 백테스트 요약에서 자동 — 기록이 쌓이면 그대로 갱신.
 */
export function TrustHero() {
  const bt = getBacktestSummary();
  const totalSignals = bt.hitCount + bt.missCount;

  const stats = [
    { label: "누적 수익률", value: `+${bt.cumulativeReturn.toFixed(1)}%`, accent: true },
    { label: "승률", value: `${bt.winRate.toFixed(1)}%` },
    { label: "누적 신호", value: `${totalSignals}건` },
    { label: "적중 · 손절", value: `${bt.hitCount} · ${bt.missCount}` },
  ];

  return (
    <section className="relative border-b border-[var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/12 via-transparent to-transparent" />
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="relative max-w-[1100px] mx-auto px-4 py-16 md:py-24">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-5">
          제공 신호 100% 투명 공개
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.25] mb-6">
          <span className="text-[var(--text-muted)]">대부분의 단타방은</span>{" "}
          <span className="text-[var(--text)]">수익만 보여줍니다.</span>
          <br />
          단타 트레이드는{" "}
          <span className="gradient-text">손절까지 공개합니다.</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed mb-9">
          신호만 툭 던지지 않습니다. <span className="text-[var(--text)] font-semibold">왜 이 종목인지 — 실시간 뉴스·재료부터</span>{" "}
          보여드리고, 진입가·목표가·손절가와 결과까지 그대로 남깁니다. 잘된 것만
          고르지 않습니다. 가입 전, 먼저 기록을 확인하세요.
        </p>

        {/* 핵심 수치 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)] mb-9">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--bg-elevated)] px-4 py-5">
              <div
                className={`mono text-2xl md:text-3xl font-bold tabular-nums mb-1 ${
                  s.accent ? "text-[var(--red)]" : "text-[var(--text)]"
                }`}
              >
                {s.value}
              </div>
              <div className="text-[11px] text-[var(--text-caption)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            한 달 무료 체험하기
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
          <a
            href="#records"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            실제 신호 기록 보기
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-2 py-3.5 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            오늘의 시장 뉴스 무료로 보기
            <span aria-hidden>→</span>
          </a>
        </div>

        <p className="mono text-[10px] text-[var(--text-caption)] mt-5">
          정보 공유 목적 · 종목 추천 아님 · 수익 보장 아님 · 매매 본인 책임
        </p>
      </div>
    </section>
  );
}
