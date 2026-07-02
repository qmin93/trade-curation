import { MONTHLY_STATS } from "@/lib/results";
import { TELEGRAM_INVITE_URL } from "@/lib/site";
import { ACTIVE_PICK } from "@/lib/picks";

/**
 * 홈 메인 히어로 — 성과(검증) + 픽 중심 라이트 SaaS 히어로.
 * 좌: 헤드라인·CTA / 우: 검증 성과 카드(누적·승률·적중/손절·최근 픽).
 */
export function HomeHero() {
  const s = MONTHLY_STATS;
  const pos = s.cumulativeReturn >= 0;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-12 md:px-12 md:py-16 mb-8 shadow-[var(--shadow-card)]">
      <div aria-hidden className="absolute -top-28 -right-20 w-[28rem] h-[28rem] rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-[var(--red)]/[0.05] blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-[1.25fr_1fr] gap-10 items-center">
        {/* 좌: 헤드라인 */}
        <div>
          <div className="mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] mb-5">
            실시간 단타 큐레이션 · 검증 공개
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-[var(--text)]">
            시초가 직전,<br />
            <span className="gradient-text">단타 뉴스·픽·성과</span><br />
            한 화면에.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-xl">
            Tier-1 뉴스부터 실시간 급등주, 검증된 픽까지 — 흩어진 단타 정보를 한 곳에서 봅니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={TELEGRAM_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_-8px_var(--accent-glow)] hover:brightness-110 transition"
            >
              텔레그램 무료 알림 →
            </a>
            <a
              href="/results"
              className="rounded-xl border border-[var(--border)] px-7 py-3.5 text-base font-semibold text-[var(--text)] hover:bg-[var(--bg-subtle)] transition"
            >
              검증 성과 보기
            </a>
          </div>
        </div>

        {/* 우: 검증 성과 카드 */}
        <div className="card-surface p-7 md:p-9">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--text-caption)]">
            누적 검증 성과
          </div>
          <div
            className={`mt-2 text-6xl font-bold tabular-nums leading-none ${pos ? "text-[var(--red)]" : "text-[var(--accent)]"}`}
          >
            {pos ? "+" : ""}
            {s.cumulativeReturn.toFixed(1)}%
          </div>
          <div className="mt-2 text-sm text-[var(--text-muted)]">누적 수익률 · 추천별 단순 합산</div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <Stat value={`${s.winRate.toFixed(1)}%`} label="승률" />
            <Stat value={`${s.hitCount}`} label="적중" />
            <Stat value={`${s.missCount}`} label="손절" />
          </div>

          {ACTIVE_PICK && (
            <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--bg-subtle)] px-4 py-3.5">
              <span className="text-sm text-[var(--text-muted)]">
                최근 픽 · {ACTIVE_PICK.stockName}
              </span>
              {ACTIVE_PICK.status === "done" && ACTIVE_PICK.resultPercent != null && (
                <span
                  className={`text-base font-bold tabular-nums ${ACTIVE_PICK.resultPercent >= 0 ? "text-[var(--red)]" : "text-[var(--accent)]"}`}
                >
                  {ACTIVE_PICK.resultPercent >= 0 ? "+" : ""}
                  {ACTIVE_PICK.resultPercent}%
                </span>
              )}
            </div>
          )}

          <div className="mt-5 text-xs leading-relaxed text-[var(--text-caption)]">
            손절까지 전부 공개 · 잘된 것만 고르지 않습니다 · 수익 보장 아님
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-subtle)] px-3 py-4 text-center">
      <div className="text-2xl font-bold tabular-nums text-[var(--text)]">{value}</div>
      <div className="mt-1 text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  );
}
