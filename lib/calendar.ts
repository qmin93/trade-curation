export interface MarketEvent {
  time: string;
  label: string;
  type: "open" | "close" | "lunch" | "macro" | "futures" | "us" | "premarket";
  priority: 1 | 2 | 3;
  note?: string;
}

export function getTodayEvents(date: Date = new Date()): MarketEvent[] {
  const dow = date.getDay();
  const isWeekend = dow === 0 || dow === 6;
  if (isWeekend) return [];

  return [
    {
      time: "08:00",
      label: "예상 시초가 발표",
      type: "premarket",
      priority: 2,
      note: "KRX 시간외 단일가",
    },
    {
      time: "08:30",
      label: "장 시작 전 매매 (시간외)",
      type: "premarket",
      priority: 1,
    },
    {
      time: "09:00",
      label: "코스피·코스닥 정규장 시작",
      type: "open",
      priority: 3,
      note: "시초가 갭 대응 30분 핵심",
    },
    {
      time: "11:30",
      label: "오전장 마무리",
      type: "lunch",
      priority: 2,
    },
    {
      time: "12:00",
      label: "오후장 시작",
      type: "lunch",
      priority: 2,
    },
    {
      time: "15:20",
      label: "동시호가 진입",
      type: "close",
      priority: 2,
      note: "10분 단일가",
    },
    {
      time: "15:30",
      label: "정규장 마감",
      type: "close",
      priority: 3,
    },
    {
      time: "18:00",
      label: "시간외 단일가 마감",
      type: "close",
      priority: 1,
    },
    {
      time: "22:30",
      label: "美 정규장 시작 (서머타임)",
      type: "us",
      priority: 2,
      note: "야간선물 영향",
    },
  ];
}

export interface WeekEvent {
  date: string;
  label: string;
  importance: 1 | 2 | 3;
  category: "fomc" | "msci" | "earnings" | "cpi" | "options" | "ipo" | "other";
}

export const WEEK_AHEAD: WeekEvent[] = [
  {
    date: "06/10",
    label: "美 5월 CPI 발표 (22:30 KST)",
    importance: 3,
    category: "cpi",
  },
  {
    date: "06/11",
    label: "美 5월 PPI 발표·옵션 만기 D-2",
    importance: 2,
    category: "options",
  },
  {
    date: "06/12",
    label: "FOMC 정례회의 종료·점도표 발표",
    importance: 3,
    category: "fomc",
  },
  {
    date: "06/13",
    label: "쿼드러플 위칭 (옵션 만기일)",
    importance: 3,
    category: "options",
  },
  {
    date: "06/15",
    label: "G7 정상회의 시작",
    importance: 2,
    category: "other",
  },
  {
    date: "06월 중",
    label: "MSCI 한국 시장 재분류 결정",
    importance: 3,
    category: "msci",
  },
];
