import { fetchThemeMovers } from "@/lib/theme-movers";
import { fetchTrendingStocks, naverStockUrl } from "@/lib/naver-trending";

/**
 * 장중 발굴 — 멘토(reload.kospi)의 /open 화면.
 * 테마별 주도주 + 실시간 인기 검색종목을 한 화면에. Threads 카드로 바로 캡처.
 */
export const metadata = {
  title: "장중 발굴 · 테마 주도주·인기 종목",
  description: "장중 테마별 주도주와 실시간 인기 검색종목을 한 화면에. 오늘 매매할 종목을 한눈에.",
};

export const revalidate = 60;

function pctCls(v: number) {
  return v >= 0 ? "text-[var(--red)]" : "text-[var(--green)]";
}
function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export default async function LivePage() {
  const [movers, trending] = await Promise.all([
    fetchThemeMovers(4),
    fetchTrendingStocks(10),
  ]);
  const kst = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-10">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
        Live · 장중 발굴
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        오늘 매매할 종목, 한 화면에
      </h1>
      <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed mb-2">
        지금 자금이 몰리는 테마 주도주와 실시간 인기 검색종목을 모았습니다.
      </p>
      <div className="flex items-center gap-3 mb-8">
        <span className="mono text-[10px] text-[var(--text-caption)]">
          업데이트 {kst} KST · 60초 갱신
        </span>
        <a
          href="/api/card/theme?brand=1"
          download="theme.png"
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          📷 테마 카드 이미지 저장
        </a>
      </div>

      {/* 테마별 주도주 */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)]">🔥 테마별 주도주</h2>
          <span className="text-xs text-[var(--text-caption)]">강한 테마 순</span>
        </div>
        {movers.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">데이터를 불러오지 못했습니다.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {movers.map((m) => (
              <div key={m.slug} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[var(--text)]">
                    {m.emoji ? `${m.emoji} ` : ""}
                    {m.label}
                  </span>
                  <span className={`mono text-sm font-semibold ${pctCls(m.avgChange)}`}>
                    {fmtPct(m.avgChange)}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {m.leaders.map((q) => (
                    <li key={q.ticker}>
                      <a
                        href={naverStockUrl(q.ticker)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-[13px] hover:bg-[var(--bg-subtle)] rounded px-1 -mx-1"
                      >
                        <span className="text-[var(--text-muted)]">{q.name}</span>
                        <span className={`mono tabular-nums font-semibold ${pctCls(q.changePercent)}`}>
                          {fmtPct(q.changePercent)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 인기 검색종목 */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)]">🔎 실시간 인기 검색종목</h2>
          <span className="text-xs text-[var(--text-caption)]">네이버 금융</span>
        </div>
        {trending.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">데이터를 불러오지 못했습니다.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {trending.map((s) => (
              <a
                key={s.ticker}
                href={naverStockUrl(s.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:bg-[var(--bg-subtle)] rounded px-2 py-1 -mx-2"
              >
                <span className="mono w-5 text-[var(--text-caption)] tabular-nums">{s.rank}</span>
                <span className="flex-1 truncate text-[var(--text)]">{s.name}</span>
                <span className="mono tabular-nums text-[var(--text-muted)]">{s.price}</span>
                <span className={`mono tabular-nums w-16 text-right font-semibold ${pctCls(s.changePercent)}`}>
                  {fmtPct(s.changePercent)}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      <p className="mono text-[10px] text-[var(--text-caption)] mt-8 leading-relaxed border-t border-[var(--border)] pt-5">
        데이터: 네이버 금융(실시간 지연 가능). 정보 공유 목적 · 종목 추천 아님 ·
        투자 판단과 책임은 본인에게 있습니다.
      </p>
    </div>
  );
}
