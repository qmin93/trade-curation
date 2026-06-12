import { getMarketStatus } from "@/lib/market-status";
import { fetchPremarket } from "@/lib/premarket";
import { fetchThemeMovers } from "@/lib/theme-movers";

/**
 * 홈 최상단 "지금" 밴드 — 시간대에 맞는 데이터를 먼저 보여준다.
 * 장중: 테마 주도주 / 장전·마감·휴장: 장전 체크(미국 마감·선물·예상 시초가·김프).
 * 멘토 reloadkospi의 "시간에 따라 화면이 다르다"를 홈에 적용.
 */
function pctCls(v: number) {
  return v >= 0 ? "text-[var(--red)]" : "text-[var(--green)]";
}
function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export async function MarketNowBand() {
  const status = getMarketStatus(new Date());

  let stats: { label: string; value: string; cls?: string }[] = [];
  if (status.isLive) {
    const movers = (await fetchThemeMovers(2)).slice(0, 4);
    stats = movers.map((m) => ({
      label: m.label,
      value: fmtPct(m.avgChange),
      cls: pctCls(m.avgChange),
    }));
  } else {
    const pm = await fetchPremarket();
    const nq = pm.futures.find((f) => f.symbol === "NQ=F");
    if (pm.kospi)
      stats.push({
        label: "코스피 예상",
        value: fmtPct(pm.kospi.estimatedChangePercent),
        cls: pctCls(pm.kospi.estimatedChangePercent),
      });
    if (nq)
      stats.push({
        label: "나스닥 선물",
        value: fmtPct(nq.changePercent),
        cls: pctCls(nq.changePercent),
      });
    if (pm.usdkrw)
      stats.push({
        label: "원/달러",
        value: pm.usdkrw.price.toLocaleString(),
        cls: pctCls(pm.usdkrw.changePercent),
      });
    if (pm.kimchi)
      stats.push({
        label: "김치프리미엄",
        value: fmtPct(pm.kimchi.premiumPercent),
        cls: pctCls(pm.kimchi.premiumPercent),
      });
  }

  return (
    <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden shadow-[var(--shadow-card)]">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* 상태 */}
        <div className="md:w-64 shrink-0 p-5 md:border-r border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/[0.07] to-transparent">
          <div className="text-sm font-bold text-[var(--text)] mb-1">{status.badge}</div>
          <div className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">{status.detail}</div>
          <a
            href={status.primary.href}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            {status.primary.label} 전체 보기
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* 데이터 */}
        <div className="flex-1 p-5">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-3">
            {status.isLive ? "지금 강한 테마" : "장전 핵심 지표"}
          </div>
          {stats.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">데이터를 불러오는 중…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[11px] text-[var(--text-caption)] truncate mb-0.5">{s.label}</div>
                  <div className={`mono text-lg font-bold tabular-nums ${s.cls ?? "text-[var(--text)]"}`}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
