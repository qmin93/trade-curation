import { fetchTrendingStocks } from "@/lib/naver-trending";

/**
 * 홈 공개 트래픽 밴드 — 실시간 급등·인기검색 종목(네이버 금융).
 * "지금 사람들이 뭘 검색하나" = 체류·재방문 유발 콘텐츠. 외부 이탈 방지 위해 표시 전용(링크 X).
 */
export async function LiveTrendingBand() {
  const stocks = await fetchTrendingStocks(12);
  if (stocks.length === 0) return null;

  return (
    <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
          🔥 실시간 급등·인기검색
        </span>
        <span className="mono text-[9px] text-[var(--text-caption)]">네이버 금융 · 실시간</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {stocks.map((s) => {
          const up = s.direction === "up";
          const color =
            s.direction === "flat"
              ? "text-[var(--text-muted)]"
              : up
                ? "text-[var(--red)]"
                : "text-[var(--green)]";
          return (
            <span key={s.ticker} className="inline-flex items-center gap-1.5 text-[13px]">
              <span className="mono text-[var(--text-caption)] tabular-nums">{s.rank}</span>
              <span className="font-medium text-[var(--text)]">{s.name}</span>
              <span className={`mono tabular-nums font-semibold ${color}`}>
                {up ? "+" : ""}
                {s.changePercent.toFixed(1)}%
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
