import Link from "next/link";
import { fetchTopGainers } from "@/lib/naver-trending";

/** 홈이 이미 불러온 뉴스에서 매칭만 함(추가 fetch X). 최소 형태만 받는다. */
type NewsLike = {
  headline?: string;
  stocks?: string[];
  keywords?: string[];
};

/**
 * 🔥 오늘 급등 TOP — 코스피+코스닥 급등주(거래대금 순)에 "왜 뜨는지" 한 줄 뉴스를 바로 붙인다.
 * 기존 두 밴드(인기검색·급등) 교체. 종목=뉴스 입구. 클릭 시 사이트 내부 /search.
 */
export async function LiveGainersNews({ news }: { news: NewsLike[] }) {
  const gainers = await fetchTopGainers(8);
  if (gainers.length === 0) return null;

  const rows = gainers.map((g) => {
    const hit = news.find(
      (n) =>
        n.headline?.includes(g.name) ||
        n.stocks?.some((s) => s.includes(g.name) || g.name.includes(s)) ||
        n.keywords?.some((k) => k.includes(g.name)),
    );
    return { ...g, headline: hit?.headline ?? null };
  });

  return (
    <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]">
        <span className="text-sm font-bold text-[var(--text)]">🔥 오늘 급등 TOP</span>
        <span className="mono text-[10px] text-[var(--text-caption)]">
          거래대금 순 · 네이버 금융 · 종목 클릭 시 뉴스
        </span>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {rows.map((r) => {
          const up = r.direction !== "down";
          return (
            <Link
              key={r.ticker}
              href={`/search?q=${encodeURIComponent(r.name)}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--accent)]/[0.06] transition-colors group"
            >
              <span className="mono text-[11px] text-[var(--text-caption)] tabular-nums w-4 shrink-0">
                {r.rank}
              </span>
              <span className="font-semibold text-[var(--text)] text-[14px] shrink-0 w-[88px] truncate">
                {r.name}
              </span>
              <span
                className={`mono text-[13px] font-bold tabular-nums shrink-0 w-[58px] ${up ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {up ? "+" : ""}
                {r.changePercent.toFixed(1)}%
              </span>
              <span className="text-[13px] text-[var(--text-muted)] truncate flex-1 min-w-0">
                {r.headline ?? "관련 뉴스 보기"}
              </span>
              <span
                className="text-[var(--text-caption)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden
              >
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
