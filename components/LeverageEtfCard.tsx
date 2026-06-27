import { fetchLeverageEtfAuto } from "@/lib/leverage-etf";

function pct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}
function num(v: number) {
  return v.toLocaleString();
}

/**
 * 삼전닉스 레버리지 ETF 예상 시초가 — 메인 노출용 컴팩트 카드.
 * SOX 프록시 자동. 데이터 없으면(SOX 미집계) 렌더 안 함.
 */
export async function LeverageEtfCard() {
  const data = await fetchLeverageEtfAuto();
  if (!data) return null;
  return (
    <section className="rounded-2xl border border-[var(--red)]/30 bg-[var(--red)]/[0.05] p-5 mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-[var(--text)]">
          🔻 삼전닉스 레버리지 ETF 예상 시초가
        </h2>
        <a href="/premarket" className="text-xs text-[var(--accent)] hover:underline shrink-0 ml-2">
          장전 전체 →
        </a>
      </div>
      <div className="text-xs text-[var(--text-caption)] mb-3 leading-relaxed">
        SOX {pct(data.soxPct)} 기준 · 삼성전자 {pct(data.samsungPct)} · SK하이닉스 {pct(data.hynixPct)} → 각 2배 추종 (참고용 추정)
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {data.etfs.map((e) => (
          <div
            key={e.ticker}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
          >
            <div className="text-[11px] text-[var(--text-caption)] truncate mb-0.5">{e.name}</div>
            <div className="flex items-baseline gap-2">
              <span className="mono text-sm font-bold text-[var(--text)] tabular-nums">
                {num(e.estPrice)}
              </span>
              <span
                className={`mono text-xs font-semibold tabular-nums ${
                  e.estPct >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"
                }`}
              >
                {pct(e.estPct)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
