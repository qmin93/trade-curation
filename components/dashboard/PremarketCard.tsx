import Link from "next/link";
import { PREMARKET_ESTIMATES } from "@/lib/market-snapshot";

export function PremarketCard() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        Premarket · 예상 시초가
      </div>
      <div className="space-y-1">
        {PREMARKET_ESTIMATES.map((p) => (
          <Link
            key={p.ticker}
            href={`/stock/${p.ticker}`}
            className="flex items-center justify-between text-[11px] mono tabular-nums hover:bg-[var(--bg-hover)] rounded px-1.5 py-1 transition-colors"
          >
            <span className="text-[var(--text)] font-semibold truncate">
              {p.name}
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-[var(--text-muted)]">
                ₩{p.estimate.toLocaleString()}
              </span>
              <span
                className={`font-semibold w-12 text-right ${p.changePercent >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {p.changePercent >= 0 ? "+" : ""}
                {p.changePercent.toFixed(2)}%
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
