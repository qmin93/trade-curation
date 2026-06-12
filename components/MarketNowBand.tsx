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
    <a
      href={status.primary.href}
      className="group mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 hover:border-[var(--accent)]/40 transition-colors"
    >
      <span className="text-sm font-bold text-[var(--text)] shrink-0">{status.badge}</span>
      <span className="hidden sm:inline text-xs text-[var(--text-caption)] shrink-0">
        {status.isLive ? "지금 강한 테마" : "장전 지표"}
      </span>
      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs">
        {stats.slice(0, 4).map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="text-[var(--text-muted)] truncate max-w-[7rem]">{s.label}</span>
            <span className={`mono font-semibold tabular-nums ${s.cls ?? "text-[var(--text)]"}`}>
              {s.value}
            </span>
          </span>
        ))}
      </div>
      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] shrink-0">
        {status.primary.label}
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </span>
    </a>
  );
}
