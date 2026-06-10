export interface AlertItem {
  id: string;
  time: string;
  ticker?: string;
  stockName?: string;
  type: "단독 호재" | "거래량 급증" | "다중 신호" | "세력 매집" | "급등" | "급락" | "테마";
  message: string;
  source: string;
  sourceUrl: string;
  severity: 1 | 2 | 3;
}

export const RECENT_ALERTS: AlertItem[] = [
  {
    id: "20260610-001",
    time: "09:05",
    ticker: "093370",
    stockName: "후성",
    type: "다중 신호",
    message:
      "다중 기술지표 동시 돌파·세력 매집 흔적·16,020 자리",
    source: "내부 시그널",
    sourceUrl: "/results/2026-06-10",
    severity: 3,
  },
  {
    id: "20260610-002",
    time: "09:23",
    type: "테마",
    message:
      "삼성전자 美 엘리먼트 바이오사이언스 1대 주주 등극 — 2,500억 (1.75억$) 투자·메디테크 신사업",
    source: "fnnews",
    sourceUrl: "https://www.fnnews.com/news/202606100614525490",
    severity: 2,
  },
  {
    id: "20260610-003",
    time: "08:32",
    type: "단독 호재",
    message:
      "RISE 네트워크인프라 ETF 순자산 1조 돌파 — SK하닉 21.63%·삼전 18.16% 핵심",
    source: "etoday",
    sourceUrl: "https://www.etoday.co.kr/news/view/2592117",
    severity: 2,
  },
  {
    id: "20260610-004",
    time: "07:45",
    type: "테마",
    message: "앤트로픽 페이블5·미토스5 공개 — 삼전·SK하닉 접속권·30일 보존 안전장치",
    source: "ddaily",
    sourceUrl: "https://www.ddaily.co.kr/page/view/2026061009265367818",
    severity: 2,
  },
  {
    id: "20260610-005",
    time: "07:20",
    type: "단독 호재",
    message: "삼성 90조 설비·R&D 투자 — 글로벌 반도체 1위·SK하닉 35조 4위",
    source: "worktoday",
    sourceUrl: "http://www.worktoday.co.kr/news/articleView.html?idxno=85447",
    severity: 1,
  },
];

export function getRecentAlerts(limit = 10): AlertItem[] {
  return [...RECENT_ALERTS]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, limit);
}
