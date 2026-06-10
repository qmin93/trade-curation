export interface MarketIndex {
  label: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface FxRate {
  pair: string;
  value: number;
  changePercent: number;
}

export interface InvestorFlow {
  label: "외국인" | "기관" | "개인";
  amount: number;
  direction: "buy" | "sell";
}

export const MARKET_INDICES: MarketIndex[] = [
  { label: "KOSPI", value: 7799.52, change: 315.11, changePercent: 4.21 },
  { label: "KOSDAQ", value: 937.69, change: 26.30, changePercent: 2.89 },
  { label: "KOSPI200", value: 1239.05, change: 60.95, changePercent: 5.16 },
  { label: "코스닥150", value: 1676.30, change: 104.10, changePercent: 6.62 },
];

export const FX_RATES: FxRate[] = [
  { pair: "USD/KRW", value: 1374.20, changePercent: -0.18 },
  { pair: "JPY/KRW", value: 8.72, changePercent: -0.12 },
  { pair: "EUR/KRW", value: 1483.30, changePercent: 0.05 },
  { pair: "CNY/KRW", value: 189.55, changePercent: -0.08 },
];

export const INVESTOR_FLOWS: InvestorFlow[] = [
  { label: "외국인", amount: 8420, direction: "buy" },
  { label: "기관", amount: 5210, direction: "buy" },
  { label: "개인", amount: 13630, direction: "sell" },
];

export interface SectorMove {
  name: string;
  changePercent: number;
}

export const SECTOR_MOVES: SectorMove[] = [
  { name: "반도체", changePercent: 5.8 },
  { name: "AI 데이터센터", changePercent: 4.2 },
  { name: "HBM", changePercent: 4.0 },
  { name: "원전·SMR", changePercent: 3.5 },
  { name: "전력 인프라", changePercent: 2.8 },
  { name: "로봇", changePercent: 2.1 },
  { name: "2차전지", changePercent: 1.4 },
  { name: "바이오", changePercent: 0.8 },
  { name: "운수창고", changePercent: -1.3 },
  { name: "건설", changePercent: -2.4 },
];

export interface RankingItem {
  rank: number;
  name: string;
  ticker: string;
  changePercent: number;
  volume?: string;
}

export const TOP_VOLUME: RankingItem[] = [
  { rank: 1, name: "삼성전자", ticker: "005930", changePercent: 6.09, volume: "8.4M" },
  { rank: 2, name: "SK하이닉스", ticker: "000660", changePercent: 8.06, volume: "5.2M" },
  { rank: 3, name: "두산에너빌리티", ticker: "034020", changePercent: 9.71, volume: "3.8M" },
  { rank: 4, name: "삼성SDS", ticker: "018260", changePercent: 3.20, volume: "2.6M" },
  { rank: 5, name: "두산로보틱스", ticker: "454910", changePercent: 14.20, volume: "2.1M" },
  { rank: 6, name: "HD현대일렉", ticker: "267260", changePercent: 4.50, volume: "1.9M" },
];

export const TOP_GAINERS: RankingItem[] = [
  { rank: 1, name: "로보스타", ticker: "090850", changePercent: 21.90 },
  { rank: 2, name: "두산로보틱스", ticker: "454910", changePercent: 14.20 },
  { rank: 3, name: "두산에너빌리티", ticker: "034020", changePercent: 9.71 },
  { rank: 4, name: "SK하이닉스", ticker: "000660", changePercent: 8.06 },
  { rank: 5, name: "삼성전자", ticker: "005930", changePercent: 6.09 },
];

export const NEW_HIGHS = [
  { name: "후성", ticker: "093370", note: "16,020 자리·다중 신호" },
  { name: "SK하이닉스", ticker: "000660", note: "2,065,000 신고가 경신" },
  { name: "두산에너빌리티", ticker: "034020", note: "SMR 강세" },
];

export const NEW_LOWS = [
  { name: "건설업종 평균", note: "-2.4% 약세 지속" },
];

export interface PremarketEstimate {
  name: string;
  ticker: string;
  estimate: number;
  changePercent: number;
}

export const PREMARKET_ESTIMATES: PremarketEstimate[] = [
  { name: "삼성전자", ticker: "005930", estimate: 313500, changePercent: 6.09 },
  { name: "SK하이닉스", ticker: "000660", estimate: 2065000, changePercent: 8.06 },
  { name: "두산에너빌리티", ticker: "034020", estimate: 82500, changePercent: 9.71 },
  { name: "삼성SDS", ticker: "018260", estimate: 203000, changePercent: 3.20 },
];
