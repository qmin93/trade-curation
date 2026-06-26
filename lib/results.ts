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
    date: "2026-06-26",
    totalReturn: 7.0,
    summary:
      "코스피 -7%대 급락(서킷브레이커) 속에서도 키스트론이 1~4차 목표를 모두 달성(장중 고점 +11.71%). 추격 없이 기다린 자리에서 나온 결과로, 시장 방향과 별개의 개별 흐름. 급락장일수록 살아있는 소수 종목으로 수급이 집중됨을 보여준 하루.",
    picks: [
      {
        rank: 1,
        stockName: "키스트론",
        ticker: "475430",
        targetReached: 4,
        resultPercent: 7.0,
        status: "hit",
        note: "1차(+1.0%)·2차(+2.5%)·3차(+4.5%)·4차(+7.0%) 전부 달성, 장중 고점 +11.71%. 코스피 -7%대 급락장에서 나온 자리.",
      },
    ],
  },
  {
    date: "2026-06-23",
    totalReturn: 3.4,
    summary:
      "제이앤티씨 1차(+1.4%)·2차(+3.4%) 목표 구간 도달. 다만 2차 이후 되돌림이 커, 목표 달성 후 구간별 대응이 중요했던 하루. 적중·되돌림 모두 공개.",
    picks: [
      {
        rank: 1,
        stockName: "제이앤티씨",
        ticker: "204270",
        entryPrice: 24300,
        targetReached: 2,
        resultPercent: 3.4,
        status: "hit",
        note: "1차(+1.4%)·2차(+3.4%) 달성. 2차 이후 되돌림 큼.",
      },
    ],
  },
  {
    date: "2026-06-22",
    totalReturn: 4.5,
    summary:
      "하나마이크론 세력 포착 09:11 — 1차(+1.0%)·2차(+2.5%)·3차(+4.5%) 목표가 차례로 달성. 밤사이 SOX +6.42% 반도체 강세 흐름 속, 시초 추격 없이 기준 자리에서 기다린 결과. 거래대금 받쳐주며 단계적으로 상승.",
    picks: [
      {
        rank: 1,
        stockName: "하나마이크론",
        ticker: "067310",
        entryPrice: 54200,
        targetReached: 3,
        resultPercent: 4.5,
        status: "hit",
        note: "1차(+1.0%)·2차(+2.5%)·3차(+4.5%) 달성. 추격 없이 기다린 자리.",
      },
    ],
  },
  {
    date: "2026-06-17",
    totalReturn: -0.48,
    summary:
      "동진쎄미켐 1~2차(+2.5%) 달성, 한화생명은 -2.98% 손절. 예스티는 키움 차트 조회 지연으로 자리 확인 전 추격 보류(미진입) — 이후 +5.5% 흘렀지만 기준 못 본 자리는 들어가지 않음. 적중·손절·미진입 모두 공개.",
    picks: [
      {
        rank: 1,
        stockName: "동진쎄미켐",
        ticker: "005290",
        entryPrice: 64800,
        targetReached: 2,
        resultPercent: 2.5,
        status: "hit",
        note: "1차(+1.0%)·2차(+2.5%) 달성",
      },
      {
        rank: 2,
        stockName: "한화생명",
        ticker: "088350",
        entryPrice: 6160,
        targetReached: 0,
        resultPercent: -2.98,
        status: "stop",
        note: "기준 이탈 -2.98% 손절. 손실도 그대로 공개.",
      },
    ],
  },
  {
    date: "2026-06-16",
    totalReturn: 7.00,
    summary:
      "DL이앤씨 세력 포착 09:22 — 1~4차 목표가 전부 달성(최고 +7.13%). 추격 자리였지만 거래대금 받쳐준 단발 정통.",
    picks: [
      {
        rank: 1,
        stockName: "DL이앤씨",
        ticker: "375500",
        entryPrice: 88300,
        targetReached: 4,
        resultPercent: 7.13,
        status: "hit",
        note: "1차(+1.0%)·2차(+2.5%)·3차(+4.5%)·4차(+7.0%) 전부 달성, 최고 +7.13%",
      },
    ],
  },
  {
    date: "2026-06-15",
    totalReturn: 8.40,
    summary:
      "한온시스템 종일용 1~4차 목표가 전부 달성(최고 +12.62%)·예스티 세력감지 1차 도달. 강한 하루.",
    picks: [
      {
        rank: 1,
        stockName: "한온시스템",
        ticker: "018880",
        entryPrice: 5230,
        targetReached: 4,
        resultPercent: 12.62,
        status: "hit",
        note: "1차(+1.0%)·2차(+2.5%)·3차(+4.5%)·4차(+7.0%) 전부 달성, 최고 +12.62%",
      },
      {
        rank: 2,
        stockName: "예스티",
        ticker: "122640",
        entryPrice: 32100,
        targetReached: 1,
        resultPercent: 1.4,
        status: "hit",
        note: "1차 목표가 (+1.4%) 달성",
      },
    ],
  },
  {
    date: "2026-06-10",
    totalReturn: 3.40,
    summary:
      "다중 기술지표 동시 돌파·세력 매집 자리. 1차·2차 목표가 모두 달성·시장 V자 데드캣 속 단발 정통.",
    picks: [
      {
        rank: 1,
        stockName: "후성",
        ticker: "093370",
        entryPrice: 16020,
        targetReached: 2,
        resultPercent: 3.40,
        status: "hit",
        note: "1차 (+1.4%)·2차 (+3.4%) 모두 달성. KOSPI -4.52% 약세 속 후성 마감 +20.12%",
      },
    ],
  },
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
  hitCount: 12,
  missCount: 3,
  winRate: 80.0,
  cumulativeReturn: 40.44,
};

export function getResultByDate(date: string): DailyResult | undefined {
  return DAILY_RESULTS.find((r) => r.date === date);
}

export function getRecentResults(limit = 30): DailyResult[] {
  return [...DAILY_RESULTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
