import type { MonthlyStats } from "@/lib/results";

export function PerformanceStats({ stats }: { stats: MonthlyStats }) {
  const positive = stats.cumulativeReturn >= 0;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatBox
        label="적중"
        value={`${stats.hitCount}`}
        unit="종목"
        accent="red"
      />
      <StatBox
        label="실패"
        value={`${stats.missCount}`}
        unit="종목"
        accent="muted"
      />
      <StatBox
        label="승률"
        value={`${stats.winRate.toFixed(1)}`}
        unit="%"
        accent="accent"
      />
      <StatBox
        label="누적 수익률"
        value={`${positive ? "+" : ""}${stats.cumulativeReturn.toFixed(2)}`}
        unit="%"
        accent={positive ? "red" : "green"}
      />
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: "red" | "green" | "accent" | "muted";
}) {
  const color = {
    red: "text-[var(--red)]",
    green: "text-[var(--green)]",
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
        <span className="mono text-sm text-[var(--text-muted)]">{unit}</span>
      </div>
    </div>
  );
}
