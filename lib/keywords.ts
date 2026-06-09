export type KeywordTier = 1 | 2 | 3 | 4;

export interface Keyword {
  slug: string;
  label: string;
  tier: KeywordTier;
  category: string;
  description: string;
  relatedStocks?: string[];
}

export const KEYWORDS: Keyword[] = [
  {
    slug: "hynix",
    label: "하이닉스",
    tier: 1,
    category: "대형주",
    description: "SK하이닉스 — HBM·D램·반도체 메모리 대장주. 단타 트래픽 1순위.",
    relatedStocks: ["SK하이닉스", "삼성전자", "삼성SDS"],
  },
  {
    slug: "samsung-electronics",
    label: "삼성전자",
    tier: 1,
    category: "대형주",
    description: "삼성전자 — 코스피 시총 1위. AI 대전환·HBM·반도체 인프라.",
    relatedStocks: ["삼성전자", "삼성SDS", "SK하이닉스"],
  },
  {
    slug: "pension",
    label: "연금",
    tier: 2,
    category: "수급",
    description: "국민연금 국내 주식 비중 14.9 → 20.8% 상향. 매도 폭탄 우려 해소·매수 라인.",
    relatedStocks: ["삼성전자", "SK하이닉스", "LG에너지솔루션"],
  },
  {
    slug: "hbm",
    label: "HBM",
    tier: 1,
    category: "메모리",
    description: "고대역폭 메모리 — AI 데이터센터 수요 폭증. SK하이닉스·삼성전자 핵심.",
    relatedStocks: ["SK하이닉스", "삼성전자"],
  },
  {
    slug: "kospi",
    label: "코스피",
    tier: 1,
    category: "지수",
    description: "코스피 지수 — 8천피·9천피 도달 추적. 사이드카·서킷·반등 자극.",
    relatedStocks: ["삼성전자", "SK하이닉스", "코스피"],
  },
];

export const KEYWORD_MATRIX = {
  tier1: {
    대형주: ["하이닉스", "삼성전자", "SK하이닉스", "삼성"],
    메모리: ["HBM", "D램", "NAND", "메모리"],
    지수: ["코스피", "8천피", "9천피", "7천피"],
    시장자극: ["매수 사이드카", "서킷브레이커", "급등", "폭락", "검은 월요일"],
  },
  tier2: {
    수급: ["외인", "외국인", "기관", "연금", "국민연금"],
    매크로6월: ["FOMC", "MSCI", "점도표", "금리", "트럼프", "관세"],
    AI테마: [
      "AI",
      "AI 데이터센터",
      "반도체",
      "휴머노이드",
      "로봇",
      "ChatGPT",
      "제미나이",
      "클로드",
    ],
    "2차전지": ["이차전지", "배터리", "삼성SDI", "엘앤에프"],
  },
  tier3: {
    반도체: ["삼성전자", "SK하이닉스", "삼성SDS"],
    "원전·SMR": ["두산에너빌리티", "비에이치아이", "한전기술", "현대건설"],
    전력인프라: ["HD현대일렉", "LS일렉트릭", "효성중공업"],
    로봇: ["로보스타", "두산로보틱스", "레인보우로보틱스"],
    "2차전지": ["삼성SDI", "LG에너지솔루션", "엘앤에프"],
    바이오: ["셀트리온"],
    플랫폼: ["네이버", "카카오"],
  },
  tier4: {
    시점: ["시초가", "갭", "야간선물", "프리마켓", "마감", "장마감", "종가", "옵션 만기일", "쿼드러플 위칭"],
    행위: ["강반등", "강세", "매수", "체결", "거래량 폭발", "손절", "추격", "단발", "자리", "청산"],
  },
};

export const JUNE_EVENT_CALENDAR = [
  { date: "6/11~12", event: "FOMC + 점도표 발표", keywords: ["FOMC", "점도표", "금리", "연준"] },
  { date: "6/13", event: "쿼드러플 위칭 (옵션 만기일)", keywords: ["옵션 만기일", "외인 청산"] },
  { date: "6/15", event: "G7 정상회의", keywords: ["G7", "관세", "트럼프"] },
  { date: "6월 중", event: "MSCI 한국 재분류 결정", keywords: ["MSCI", "선진지수", "외인 매수"] },
  { date: "6/30", event: "분기 말 윈도우 드레싱", keywords: ["기관 매수", "연금"] },
];

export function getKeywordBySlug(slug: string): Keyword | undefined {
  return KEYWORDS.find((k) => k.slug === slug);
}

export function getHotKeywords(): Keyword[] {
  return KEYWORDS.filter((k) => k.tier === 1);
}
