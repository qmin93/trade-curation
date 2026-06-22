import Link from "next/link";
import { fetchTopGainers } from "@/lib/naver-trending";

/**
 * 단타 신호 밴드 — 코스피+코스닥 급등주를 거래대금 큰 순으로(네이버 금융).
 * '검색 인기'(LiveTrendingBand)와 달리 '실제 돈 몰려 급등 중'인 종목 = 단타 액션 신호.
 * 종목 클릭 시 사이트 내부 뉴스 검색(/search) — '왜 급등하는지'를 바로.
 */
export async function LiveGainersBand() {
  const stocks = await fetchTopGainers(12);
  if (stocks.length === 0) return null;

  return (
    <section className="mb-6 rounded-xl border border-[var(--red)]/30 bg-[var(--bg-elevated)] px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="mono text-[10px] uppercase tracking-widest text-[var(--red)]">
          ⚡ 급등·거래대금
        </span>
        <span className="mono text-[9px] text-[var(--text-caption)]">
          코스피·코스닥 · 돈 몰린 순 · 종목 클릭 시 뉴스
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {stocks.map((s) => {
          const up = s.direction !== "down";
          return (
            <Link
              key={s.ticker}
              href={`/search?q=${encodeURIComponent(s.name)}`}
              title={`${s.name} 관련 뉴스 보기`}
              className="inline-flex items-center gap-1.5 text-[13px] rounded px-1 -mx-1 hover:bg-[var(--red)]/10 transition-colors"
            >
              <span className="mono text-[var(--text-caption)] tabular-nums">{s.rank}</span>
              <span className="font-medium text-[var(--text)]">{s.name}</span>
              <span
                className={`mono tabular-nums font-semibold ${up ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {up ? "+" : ""}
                {s.changePercent.toFixed(1)}%
              </span>
              {s.tradingValue && (
                <span className="mono text-[10px] text-[var(--text-caption)] tabular-nums">
                  {s.tradingValue}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
