import Link from "next/link";
import { NEW_HIGHS, NEW_LOWS } from "@/lib/market-snapshot";

export function HighLowCard() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
        <span>New Highs / Lows</span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[var(--red)] pulse-dot" />
        </span>
      </div>
      <div className="space-y-1">
        {NEW_HIGHS.map((h) => (
          <div key={h.ticker} className="text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="mono text-[var(--red)] font-bold">▲</span>
              {h.ticker ? (
                <Link
                  href={`/stock/${h.ticker}`}
                  className="text-[var(--text)] font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  {h.name}
                </Link>
              ) : (
                <span className="text-[var(--text)] font-semibold">
                  {h.name}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-caption)] ml-3.5 leading-tight">
              {h.note}
            </p>
          </div>
        ))}
      </div>
      {NEW_LOWS.length > 0 && (
        <div className="space-y-1 mt-2 pt-2 border-t border-[var(--border)]">
          {NEW_LOWS.map((l) => (
            <div key={l.name} className="text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="mono text-[var(--green)] font-bold">▼</span>
                <span className="text-[var(--text)] font-semibold">
                  {l.name}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-caption)] ml-3.5 leading-tight">
                {l.note}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
