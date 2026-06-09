export interface PickResult {
  rank: number;
  stockName: string;
  ticker: string;
  entryPrice?: number;
  targetReached: 0 | 1 | 2 | 3 | 4;
  resultPercent: number;
  status: "hit" | "stop" | "pending";
  note?: string;
}

export interface DailyResult {
  date: string;
  totalReturn: number;
  picks: PickResult[];
  summary: string;
}

export interface MonthlyStats {
  month: string;
  hitCount: number;
  missCount: number;
  winRate: number;
  cumulativeReturn: number;
}

export const DAILY_RESULTS: DailyResult[] = [
  {
    date: "2026-06-09",
    totalReturn: 1.4,
    summary: "어제 검은 월요일 폭락 후 반등 자리·1차 도달 단발 정직 정리.",
    picks: [
      {
        rank: 1,
        stockName: "대원강업",
        ticker: "000430",
        targetReached: 1,
        resultPercent: 1.4,
        status: "hit",
        note: "1차 목표가 도달·시초 단발 자리",
      },
    ],
  },
];

export const MONTHLY_STATS: MonthlyStats = {
  month: "2026-06",
  hitCount: 2,
  missCount: 1,
  winRate: 66.7,
  cumulativeReturn: 2.27,
};

export function getResultByDate(date: string): DailyResult | undefined {
  return DAILY_RESULTS.find((r) => r.date === date);
}

export function getRecentResults(limit = 30): DailyResult[] {
  return [...DAILY_RESULTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
