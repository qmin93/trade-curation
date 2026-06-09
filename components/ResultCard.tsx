import Link from "next/link";
import type { DailyResult } from "@/lib/results";

export function ResultCard({ result }: { result: DailyResult }) {
  const positive = result.totalReturn >= 0;
  return (
    <Link
      href={`/results/${result.date}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-all duration-200 hover:border-[var(--accent)]/50 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(62,106,225,0.18)]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="mono text-xs uppercase tracking-widest text-[var(--text-caption)]">
          {result.date}
        </span>
        <span
          className={`mono text-base font-bold ${positive ? "text-[var(--red)]" : "text-[var(--green)]"}`}
        >
          {positive ? "▲" : "▼"} {Math.abs(result.totalReturn).toFixed(2)}%
        </span>
      </div>
      <div className="space-y-1.5 mb-3">
        {result.picks.map((p) => (
          <div
            key={p.ticker}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="mono text-[10px] text-[var(--text-caption)]">
                #{p.rank}
              </span>
              <span className="text-[var(--text)] font-medium">
                {p.stockName}
              </span>
              <span className="mono text-[10px] text-[var(--text-caption)]">
                {p.ticker}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {p.status === "hit" && (
                <span className="text-[10px] mono uppercase tracking-widest text-[var(--red)]">
                  {p.targetReached}차
                </span>
              )}
              {p.status === "stop" && (
                <span className="text-[10px] mono uppercase tracking-widest text-[var(--green)]">
                  손절
                </span>
              )}
              <span
                className={`mono text-sm font-semibold ${p.resultPercent >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {p.resultPercent >= 0 ? "+" : ""}
                {p.resultPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      {result.summary && (
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 pt-3 border-t border-[var(--border)]">
          {result.summary}
        </p>
      )}
    </Link>
  );
}
