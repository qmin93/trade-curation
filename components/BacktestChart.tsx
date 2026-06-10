import { BACKTEST_HISTORY } from "@/lib/backtest";

export function BacktestChart() {
  const data = BACKTEST_HISTORY;
  if (data.length === 0) return null;

  const width = 600;
  const height = 200;
  const padding = 32;
  const max = Math.max(...data.map((d) => d.cumulativeReturn), 1);

  const points = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y =
        height - padding - (d.cumulativeReturn / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${
    width - padding
  },${height - padding}`;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1">
            Cumulative Return Curve
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            5월~6월 누적 수익률 추이
          </div>
        </div>
        <div className="mono text-2xl font-bold text-[var(--red)] tabular-nums">
          +{data[data.length - 1].cumulativeReturn.toFixed(1)}%
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="bt-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1={padding}
            y1={padding + r * (height - padding * 2)}
            x2={width - padding}
            y2={padding + r * (height - padding * 2)}
            stroke="var(--border)"
            strokeDasharray="2 4"
          />
        ))}
        <polyline
          points={areaPoints}
          fill="url(#bt-grad)"
          stroke="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke="var(--red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y =
            height - padding - (d.cumulativeReturn / max) * (height - padding * 2);
          return (
            <circle
              key={d.date}
              cx={x}
              cy={y}
              r={3}
              fill="var(--bg-elevated)"
              stroke="var(--red)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between text-[10px] mono text-[var(--text-caption)]">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
