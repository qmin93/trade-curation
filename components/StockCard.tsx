import Link from "next/link";
import type { Stock } from "@/lib/stocks";
import { SparklineChart } from "./SparklineChart";

export function StockCard({ stock }: { stock: Stock }) {
  const positive = stock.change >= 0;
  return (
    <Link
      href={`/stock/${stock.ticker}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-all duration-200 hover:border-[var(--accent)]/50 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(62,106,225,0.18)]"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-[var(--text)] group-hover:text-white transition-colors">
            {stock.name}
          </div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mt-0.5">
            {stock.exchange} · {stock.ticker}
          </div>
        </div>
        <SparklineChart data={stock.sparkline} positive={positive} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="mono text-lg font-bold tabular-nums">
            ₩{stock.price.toLocaleString()}
          </div>
        </div>
        <div
          className={`mono text-sm font-semibold ${positive ? "text-[var(--red)]" : "text-[var(--green)]"}`}
        >
          {positive ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
        </div>
      </div>
      {stock.themes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[var(--border)]">
          {stock.themes.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] mono px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
