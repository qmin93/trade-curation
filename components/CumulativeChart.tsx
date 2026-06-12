import { BACKTEST_HISTORY } from "@/lib/backtest";

/**
 * 누적 성과 vs 코스피 — 멘토(세력아카데미)의 핵심 신뢰 장치.
 * 단타 트레이드 누적 수익률(단리 합산) 선 + 같은 기간 코스피 지수 선.
 * 음수 구간까지 그리도록 0 기준선 포함.
 */
export function CumulativeChart() {
  const data = BACKTEST_HISTORY;
  if (data.length < 2) return null;

  const width = 720;
  const height = 260;
  const padX = 40;
  const padY = 28;

  const all = data.flatMap((d) => [d.cumulativeReturn, d.kospiReturn]);
  const rawMin = Math.min(...all, 0);
  const rawMax = Math.max(...all, 0);
  const span = rawMax - rawMin || 1;
  const pad = span * 0.12;
  const min = rawMin - pad;
  const max = rawMax + pad;

  const xAt = (i: number) =>
    padX + (i / (data.length - 1)) * (width - padX * 2);
  const yAt = (v: number) =>
    height - padY - ((v - min) / (max - min)) * (height - padY * 2);

  const line = (key: "cumulativeReturn" | "kospiReturn") =>
    data.map((d, i) => `${xAt(i)},${yAt(d[key])}`).join(" ");

  const stratPoints = line("cumulativeReturn");
  const kospiPoints = line("kospiReturn");
  const areaPoints = `${xAt(0)},${yAt(min)} ${stratPoints} ${xAt(
    data.length - 1,
  )},${yAt(min)}`;

  const last = data[data.length - 1];
  const delta = last.cumulativeReturn - last.kospiReturn;
  const zeroY = yAt(0);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1">
            누적 성과 vs 코스피
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            {data[0].date} ~ {last.date} · 실제 신호 기준
          </div>
        </div>
        <div className="flex items-end gap-5">
          <div className="text-right">
            <div className="mono text-2xl font-bold text-[var(--red)] tabular-nums">
              +{last.cumulativeReturn.toFixed(1)}%
            </div>
            <div className="text-[10px] text-[var(--text-caption)]">단타 트레이드</div>
          </div>
          <div className="text-right">
            <div className="mono text-2xl font-bold text-[var(--text-muted)] tabular-nums">
              {last.kospiReturn >= 0 ? "+" : ""}
              {last.kospiReturn.toFixed(1)}%
            </div>
            <div className="text-[10px] text-[var(--text-caption)]">코스피</div>
          </div>
          <div className="text-right">
            <div className="mono text-2xl font-bold text-[var(--accent)] tabular-nums">
              +{delta.toFixed(1)}p
            </div>
            <div className="text-[10px] text-[var(--text-caption)]">지수 대비</div>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cum-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.28)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </linearGradient>
        </defs>

        {/* 0 기준선 */}
        <line
          x1={padX}
          y1={zeroY}
          x2={width - padX}
          y2={zeroY}
          stroke="var(--border)"
          strokeWidth="1"
        />
        <text
          x={padX}
          y={zeroY - 5}
          className="mono"
          fontSize="9"
          fill="var(--text-caption)"
        >
          0%
        </text>

        {/* 전략 영역 + 라인 */}
        <polyline points={areaPoints} fill="url(#cum-grad)" stroke="none" />
        <polyline
          points={kospiPoints}
          fill="none"
          stroke="var(--text-caption)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={stratPoints}
          fill="none"
          stroke="var(--red)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={d.date}
            cx={xAt(i)}
            cy={yAt(d.cumulativeReturn)}
            r={3}
            fill="var(--bg-elevated)"
            stroke="var(--red)"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="mt-3 flex items-center gap-4 text-[10px] mono text-[var(--text-caption)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-[2px] bg-[var(--red)]" /> 단타 트레이드
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-[2px] bg-[var(--text-caption)]" style={{ borderTop: "1px dashed" }} /> 코스피
        </span>
      </div>

      <p className="mono text-[10px] text-[var(--text-caption)] leading-relaxed mt-4 pt-4 border-t border-[var(--border)]">
        누적 수익률은 영업일별 신호 수익률의 단리 합산이며 단일 계좌의 운용
        수익률이 아닙니다. 코스피 선은 같은 기간 지수 등락률로, 산출 기준이 달라
        추세 비교 참고용입니다.
      </p>
    </div>
  );
}
