export interface Stock {
  ticker: string;
  name: string;
  exchange: "KOSPI" | "KOSDAQ";
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  themes: string[];
  description: string;
  marketCap?: string;
}

export const STOCKS: Stock[] = [
  {
    ticker: "005930",
    name: "삼성전자",
    exchange: "KOSPI",
    price: 313500,
    change: 18000,
    changePercent: 6.09,
    sparkline: [296, 298, 295, 290, 288, 285, 280, 295, 305, 313],
    themes: ["반도체", "AI-데이터센터", "HBM"],
    description: "글로벌 반도체 1위·HBM·AI 대전환 진행 중.",
    marketCap: "1,920조",
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    exchange: "KOSPI",
    price: 2065000,
    change: 154000,
    changePercent: 8.06,
    sparkline: [1980, 2010, 1995, 1970, 1955, 1940, 1911, 1985, 2030, 2065],
    themes: ["반도체", "HBM", "AI-데이터센터"],
    description: "HBM 글로벌 시장 1위·AI 데이터센터 메모리 수혜.",
    marketCap: "152조",
  },
  {
    ticker: "018260",
    name: "삼성에스디에스",
    exchange: "KOSPI",
    price: 203000,
    change: 6300,
    changePercent: 3.20,
    sparkline: [190, 192, 195, 193, 191, 188, 192, 198, 200, 203],
    themes: ["AI-데이터센터", "ChatGPT"],
    description: "OpenAI 협력 ChatGPT 리셀러·국가 AI 컴퓨팅센터 단독 입찰 통과.",
    marketCap: "16조",
  },
  {
    ticker: "034020",
    name: "두산에너빌리티",
    exchange: "KOSPI",
    price: 82500,
    change: 7300,
    changePercent: 9.71,
    sparkline: [73, 74, 75, 73, 72, 71, 75, 78, 80, 83],
    themes: ["원전-SMR", "방산"],
    description: "SMR 글로벌 협력·발전 인프라·국가전략기술 지정 전망.",
    marketCap: "12조",
  },
  {
    ticker: "267260",
    name: "HD현대일렉",
    exchange: "KOSPI",
    price: 857000,
    change: 37000,
    changePercent: 4.50,
    sparkline: [810, 820, 815, 805, 800, 795, 820, 840, 850, 857],
    themes: ["전력-인프라", "AI-데이터센터"],
    description: "북미 초고압 변압기 1위·AI 데이터센터 전력 수혜·교보 목표가 100만원.",
    marketCap: "11조",
  },
  {
    ticker: "010120",
    name: "LS일렉트릭",
    exchange: "KOSPI",
    price: 425000,
    change: 13500,
    changePercent: 3.28,
    sparkline: [400, 405, 402, 398, 395, 392, 410, 418, 420, 425],
    themes: ["전력-인프라", "AI-데이터센터"],
    description: "국내 데이터센터 배전 70% 점유·매출 6→10조 확대 계획.",
    marketCap: "8조",
  },
  {
    ticker: "454910",
    name: "두산로보틱스",
    exchange: "KOSPI",
    price: 78500,
    change: 9800,
    changePercent: 14.20,
    sparkline: [65, 67, 66, 64, 62, 60, 68, 73, 76, 79],
    themes: ["로봇", "AI-데이터센터"],
    description: "협동로봇 글로벌 매출 성장·휴머노이드 단계 도입.",
    marketCap: "5조",
  },
  {
    ticker: "090850",
    name: "로보스타",
    exchange: "KOSDAQ",
    price: 27300,
    change: 4900,
    changePercent: 21.90,
    sparkline: [21, 22, 21, 20, 19, 18, 22, 25, 26, 27],
    themes: ["로봇"],
    description: "산업 로봇 전문·Jensen Huang 방한 후 급등.",
    marketCap: "0.6조",
  },
  {
    ticker: "006400",
    name: "삼성SDI",
    exchange: "KOSPI",
    price: 348000,
    change: 6800,
    changePercent: 2.0,
    sparkline: [340, 342, 341, 338, 335, 332, 343, 346, 347, 348],
    themes: ["2차전지", "배터리"],
    description: "전기차 배터리·ESS·반도체 소재.",
    marketCap: "24조",
  },
  {
    ticker: "373220",
    name: "LG에너지솔루션",
    exchange: "KOSPI",
    price: 348000,
    change: 5500,
    changePercent: 1.61,
    sparkline: [340, 342, 343, 341, 340, 338, 344, 346, 347, 348],
    themes: ["2차전지", "배터리"],
    description: "글로벌 전기차 배터리 점유율 2위·LG화학 분사.",
    marketCap: "81조",
  },
];

export function getStockByTicker(ticker: string): Stock | undefined {
  return STOCKS.find((s) => s.ticker === ticker);
}

export function getStocksByTheme(themeSlug: string): Stock[] {
  return STOCKS.filter((s) => s.themes.includes(themeSlug));
}

export function getTopMovers(limit = 5): Stock[] {
  return [...STOCKS]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, limit);
}
