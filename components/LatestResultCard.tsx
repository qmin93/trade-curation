import Link from "next/link";
import { getRecentResults, MONTHLY_STATS } from "@/lib/results";

/**
 * 홈 "오늘 마감 리포트" 프루프 카드 — 최근 일자 결과를 홈에서 바로 보이게.
 * 끝난 결과(검증)는 공개 = 신뢰 자산. 상세(전체 래더)는 /results/[date]로.
 */
export function LatestResultCard() {
  const [latest] = getRecentResults(1);
  if (!latest) return null;
  const pos = latest.totalReturn >= 0;

  return (
    <Link
      href={`/results/${latest.date}`}
      className="group mb-6 block rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/[0.05] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/[0.08]"
    >
      <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          검증 · {latest.date} 마감
        </span>
        <span className={`mono text-sm font-semibold tabular-nums ${pos ? "text-[var(--red)]" : "text-[var(--green)]"}`}>
          {pos ? "▲ +" : "▼ "}
          {Math.abs(latest.totalReturn).toFixed(2)}%
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
          전체 기록
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {latest.picks.map((p) => (
          <span key={p.ticker} className="inline-flex items-center gap-1.5">
            <span className="font-medium text-[var(--text)]">{p.stockName}</span>
            {p.status === "hit" && (
              <span className="mono text-[10px] text-[var(--text-caption)]">{p.targetReached}차</span>
            )}
            {p.status === "stop" && (
              <span className="mono text-[10px] text-[var(--green)]">손절</span>
            )}
            <span className={`mono font-semibold tabular-nums ${p.resultPercent >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"}`}>
              {p.resultPercent >= 0 ? "+" : ""}
              {p.resultPercent.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>

      <div className="mt-3 mono text-[10px] tabular-nums text-[var(--text-caption)]">
        6월 승률 {MONTHLY_STATS.winRate}% · 누적 +{MONTHLY_STATS.cumulativeReturn}% · 적중 {MONTHLY_STATS.hitCount}·손절 {MONTHLY_STATS.missCount}
      </div>
    </Link>
  );
}
