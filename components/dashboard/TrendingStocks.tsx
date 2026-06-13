import { fetchTrendingStocks, naverStockUrl } from "@/lib/naver-trending";

/**
 * 실시간 인기 검색 종목 — "지금 사람들이 뭘 검색하나" = 라이브 트래픽 신호.
 * 네이버 금융 검색 상위. 5분 캐시. 데이터 없으면 렌더 안 함.
 */
export async function TrendingStocks({ limit = 8 }: { limit?: number }) {
  const stocks = await fetchTrendingStocks(limit);
  if (stocks.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)]">
          🔥 인기 검색 종목
        </div>
        <span className="mono text-[8px] text-[var(--text-caption)]">실시간</span>
      </div>
      <ol className="space-y-1">
        {stocks.map((s) => {
          const up = s.direction === "up";
          const flat = s.direction === "flat";
          const color = flat
            ? "text-[var(--text-muted)]"
            : up
              ? "text-[var(--red)]"
              : "text-[var(--green)]";
          return (
            <li key={s.ticker}>
              <a
                href={naverStockUrl(s.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] hover:bg-[var(--bg-subtle)] rounded px-1 py-0.5 -mx-1 transition-colors"
              >
                <span className="mono w-4 text-[var(--text-caption)] tabular-nums">
                  {s.rank}
                </span>
                <span className="flex-1 min-w-0 truncate text-[var(--text)] font-medium">
                  {s.name}
                </span>
                <span className="mono tabular-nums text-[var(--text-muted)] shrink-0">
                  {s.price}
                </span>
                <span className={`mono tabular-nums w-14 text-right font-semibold shrink-0 ${color}`}>
                  {up ? "+" : ""}
                  {s.changePercent.toFixed(2)}%
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="mono text-[8px] text-[var(--text-caption)] mt-2 text-right">
        출처 네이버 금융
      </p>
    </div>
  );
}
