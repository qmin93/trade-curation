import Link from "next/link";
import { MONTHLY_STATS, getRecentResults } from "@/lib/results";
import { getBacktestSummary } from "@/lib/backtest";

export function PerformanceStrip() {
  const monthly = MONTHLY_STATS;
  const backtest = getBacktestSummary();
  const recent = getRecentResults(1)[0];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
        <Link href="/results" className="hover:text-[var(--accent)]">
          Performance ↗
        </Link>
        <Link href="/backtest" className="hover:text-[var(--accent)]">
          Backtest ↗
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Stat label="누적 수익" value={`+${monthly.cumulativeReturn}%`} positive />
        <Stat label="누적 승률" value={`${monthly.winRate}%`} />
        <Stat label="백테스트" value={`+${backtest.cumulativeReturn}%`} positive />
        <Stat
          label={recent ? recent.date.slice(5) : "최근"}
          value={recent ? `+${recent.totalReturn.toFixed(1)}%` : "—"}
          positive
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-1">
        {label}
      </div>
      <div
        className={`mono text-base font-bold tabular-nums ${positive ? "text-[var(--red)]" : "text-[var(--text)]"}`}
      >
        {value}
      </div>
    </div>
  );
}
