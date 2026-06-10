import { BACKTEST_HISTORY, PATTERN_STATS, getBacktestSummary } from "@/lib/backtest";
import { BacktestChart } from "@/components/BacktestChart";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "백테스트 시뮬레이션",
  description: "과거 픽 누적 수익률·패턴별 적중률 검증.",
};

export const revalidate = 3600;

export default function BacktestPage() {
  const summary = getBacktestSummary();
  return (
    <>
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--red)]/15 via-transparent to-transparent">
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
            Backtest · Pattern Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            백테스트 <span className="gradient-text">시뮬레이션</span>
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
            과거 픽의 누적 수익률·패턴별 적중률·평균 수익. 신호 검증은 본인 책임.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12">
        <section>
          <SectionHeader label="01 · Summary" title="누적 성과" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="누적 수익률" value={`+${summary.cumulativeReturn.toFixed(1)}%`} accent="red" />
            <Stat label="적중" value={`${summary.hitCount}`} unit="회" accent="red" />
            <Stat label="실패" value={`${summary.missCount}`} unit="회" accent="muted" />
            <Stat label="승률" value={`${summary.winRate.toFixed(1)}`} unit="%" accent="accent" />
          </div>
        </section>

        <section>
          <SectionHeader label="02 · Curve" title="누적 수익률 추이" />
          <BacktestChart />
        </section>

        <section>
          <SectionHeader label="03 · Pattern Stats" title="패턴별 검증" />
          <div className="grid sm:grid-cols-2 gap-4">
            {PATTERN_STATS.map((p) => (
              <div
                key={p.pattern}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-[var(--text)]">{p.pattern}</div>
                  <div className="mono text-lg font-bold text-[var(--red)] shrink-0">
                    {p.hitRate.toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  {p.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] mono text-[var(--text-caption)] uppercase tracking-widest">
                  <span>총 {p.totalSignals}회</span>
                  <span>적중 {p.hitCount}</span>
                  <span>평균 +{p.avgReturn}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader label="04 · History" title="일자별 누적" />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-subtle)] mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                <tr>
                  <th className="text-left py-2 px-4">일자</th>
                  <th className="text-right py-2 px-4">적중</th>
                  <th className="text-right py-2 px-4">실패</th>
                  <th className="text-right py-2 px-4">누적 수익률</th>
                </tr>
              </thead>
              <tbody>
                {[...BACKTEST_HISTORY].reverse().map((h) => (
                  <tr key={h.date} className="border-t border-[var(--border)]">
                    <td className="py-2.5 px-4 mono text-xs">{h.date}</td>
                    <td className="py-2.5 px-4 text-right mono text-xs">
                      {h.hitCount}
                    </td>
                    <td className="py-2.5 px-4 text-right mono text-xs text-[var(--text-caption)]">
                      {h.missCount}
                    </td>
                    <td className="py-2.5 px-4 text-right mono text-sm font-bold text-[var(--red)] tabular-nums">
                      +{h.cumulativeReturn.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent: "red" | "accent" | "muted";
}) {
  const color = {
    red: "text-[var(--red)]",
    accent: "text-[var(--accent)]",
    muted: "text-[var(--text-muted)]",
  }[accent];
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`mono text-3xl font-bold tabular-nums ${color}`}>
          {value}
        </span>
        {unit && (
          <span className="mono text-sm text-[var(--text-muted)]">{unit}</span>
        )}
      </div>
    </div>
  );
}
