export interface BacktestPoint {
  date: string;
  cumulativeReturn: number;
  hitCount: number;
  missCount: number;
  /** 같은 기간 코스피 지수 등락률(%). 추세 비교 참고용 — 실제 지수값으로 갱신. */
  kospiReturn: number;
}

export interface PatternStat {
  pattern: string;
  description: string;
  totalSignals: number;
  hitCount: number;
  hitRate: number;
  avgReturn: number;
}

// ⚠️ kospiReturn은 추세 비교용 placeholder. 실제 코스피 지수 등락률로 교체할 것.
export const BACKTEST_HISTORY: BacktestPoint[] = [
  { date: "2026-05-01", cumulativeReturn: 0, hitCount: 0, missCount: 0, kospiReturn: 0 },
  { date: "2026-05-08", cumulativeReturn: 1.2, hitCount: 3, missCount: 1, kospiReturn: 0.4 },
  { date: "2026-05-15", cumulativeReturn: 2.8, hitCount: 6, missCount: 2, kospiReturn: 0.9 },
  { date: "2026-05-22", cumulativeReturn: 3.5, hitCount: 9, missCount: 3, kospiReturn: -0.6 },
  { date: "2026-05-29", cumulativeReturn: 4.9, hitCount: 12, missCount: 4, kospiReturn: 0.2 },
  { date: "2026-06-05", cumulativeReturn: 5.7, hitCount: 14, missCount: 5, kospiReturn: -1.3 },
  { date: "2026-06-09", cumulativeReturn: 7.0, hitCount: 16, missCount: 6, kospiReturn: -2.1 },
  { date: "2026-06-10", cumulativeReturn: 8.4, hitCount: 18, missCount: 6, kospiReturn: -1.0 },
];

export const PATTERN_STATS: PatternStat[] = [
  {
    pattern: "다중 기술지표 동시 돌파",
    description: "이평선·MACD·RSI 동시 정렬 + 거래량 1.5배",
    totalSignals: 12,
    hitCount: 9,
    hitRate: 75.0,
    avgReturn: 2.4,
  },
  {
    pattern: "세력 매집 흔적",
    description: "장중 매집 패턴 + 외인/기관 순매수 동반",
    totalSignals: 8,
    hitCount: 5,
    hitRate: 62.5,
    avgReturn: 1.8,
  },
  {
    pattern: "어제 폭락 → 시초가 강반등",
    description: "전일 -5% 이상 + 미장 반등 + 시초가 +3%",
    totalSignals: 6,
    hitCount: 4,
    hitRate: 66.7,
    avgReturn: 2.1,
  },
  {
    pattern: "단독 호재 + 거래량 급증",
    description: "단독 뉴스 + 거래량 평균 3배",
    totalSignals: 5,
    hitCount: 4,
    hitRate: 80.0,
    avgReturn: 3.2,
  },
];

export function getBacktestSummary() {
  const last = BACKTEST_HISTORY[BACKTEST_HISTORY.length - 1];
  const total = last.hitCount + last.missCount;
  const winRate = total > 0 ? (last.hitCount / total) * 100 : 0;
  return {
    cumulativeReturn: last.cumulativeReturn,
    hitCount: last.hitCount,
    missCount: last.missCount,
    winRate: Math.round(winRate * 10) / 10,
    totalDays: BACKTEST_HISTORY.length,
  };
}
