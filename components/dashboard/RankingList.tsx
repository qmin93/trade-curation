import Link from "next/link";
import type { RankingItem } from "@/lib/market-snapshot";

export function RankingList({
  title,
  items,
  showVolume = false,
}: {
  title: string;
  items: RankingItem[];
  showVolume?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((it) => (
          <Link
            key={`${it.rank}-${it.ticker}`}
            href={`/stock/${it.ticker}`}
            className="flex items-center justify-between text-[11px] mono tabular-nums hover:bg-[var(--bg-hover)] rounded px-1.5 py-1 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[var(--text-caption)] w-3 shrink-0">
                {it.rank}
              </span>
              <span className="text-[var(--text)] font-semibold truncate">
                {it.name}
              </span>
              {showVolume && it.volume && (
                <span className="text-[10px] text-[var(--text-caption)] shrink-0">
                  {it.volume}
                </span>
              )}
            </div>
            <span
              className={`font-semibold shrink-0 ${it.changePercent >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"}`}
            >
              {it.changePercent >= 0 ? "+" : ""}
              {it.changePercent.toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
