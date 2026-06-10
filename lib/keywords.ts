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
  // ── Tier 1: 상시 대형주·지수 (검색량 큰 앵커 키워드) ──
  {
    slug: "samsung-electronics",
    label: "삼성전자",
    tier: 1,
    category: "대형주",
    description:
      "코스피 시총 1위 삼성전자. AI 대전환·HBM·파운드리 흐름과 외인·연금 수급까지, 오늘 삼성전자를 움직인 이슈만 골라 정리합니다.",
    relatedStocks: ["삼성전자", "삼성SDS", "SK하이닉스"],
  },
  {
    slug: "hynix",
    label: "하이닉스",
    tier: 1,
    category: "대형주",
    description:
      "SK하이닉스 — HBM·D램 대장주. HBM4 본더 수주, 엔비디아 납품, 미국 ADR 같은 재료를 단타 관점에서 짚습니다.",
    relatedStocks: ["SK하이닉스", "삼성전자", "한화세미텍"],
  },
  {
    slug: "kospi",
    label: "코스피",
    tier: 1,
    category: "지수",
    description:
      "코스피 지수 — 사이드카·서킷브레이커·반등 자극을 실시간으로. 시초가 갭이 어디서 잡히는지 추적합니다.",
    relatedStocks: ["삼성전자", "SK하이닉스", "코스피"],
  },
  {
    slug: "hbm",
    label: "HBM",
    tier: 1,
    category: "메모리",
    description:
      "고대역폭 메모리(HBM) — AI 데이터센터 수요 폭증의 핵심. SK하이닉스·삼성전자와 본더·소재 장비 수혜주까지.",
    relatedStocks: ["SK하이닉스", "삼성전자", "한화세미텍"],
  },

  // ── Tier 2: 오늘의 테마 (트래픽 폭발·회전) ──
  {
    slug: "humanoid",
    label: "휴머노이드",
    tier: 2,
    category: "테마",
    description:
      "휴머노이드 로봇 테마 — 보스턴다이나믹스 아틀라스 공급망, 부품주 상한가 행진. 오늘 누가 공급망에 엮였는지 정리합니다.",
    relatedStocks: ["화신정공", "레인보우로보틱스", "두산로보틱스"],
  },
  {
    slug: "robot",
    label: "로봇",
    tier: 2,
    category: "테마",
    description:
      "로봇·피지컬 AI 테마 — 국책과제, 데이터·부품·구동계 수혜주. 휴머노이드 모멘텀과 함께 도는 단타 라인.",
    relatedStocks: ["알체라", "레인보우로보틱스", "로보스타"],
  },
  {
    slug: "space",
    label: "우주항공",
    tier: 2,
    category: "테마",
    description:
      "우주항공·스페이스X 테마 — 상장 임박 모멘텀과 특수합금·발사체 부품 공급계약. 단타 수급이 몰리는 자리.",
    relatedStocks: ["스피어", "한화에어로스페이스", "켄코아에어로스페이스"],
  },
  {
    slug: "claude",
    label: "클로드",
    tier: 2,
    category: "테마",
    description:
      "앤트로픽·클로드 테마 — 국내 클로드 리셀러 선정주, AI 도입 수혜주. 챗GPT·제미나이 관련주와 함께 도는 AI 라인.",
    relatedStocks: ["솔트웨어", "삼성SDS", "엔디에스"],
  },
  {
    slug: "foundry",
    label: "파운드리",
    tier: 2,
    category: "테마",
    description:
      "파운드리 테마 — TSMC 캐파 병목의 반사수혜. 삼성 파운드리 흑자전환 기대와 인텔·구글 위탁 흐름을 짚습니다.",
    relatedStocks: ["삼성전자", "DB하이텍"],
  },
  {
    slug: "nuclear",
    label: "원전",
    tier: 2,
    category: "테마",
    description:
      "원전·SMR 테마 — 신한울 납품, 소형모듈원전 사업 참여, 신재생 빅딜. 정책·수주 모멘텀으로 도는 단타 섹터.",
    relatedStocks: ["두산에너빌리티", "한전기술", "비에이치아이"],
  },

  // ── Tier 3: 수급·이벤트 ──
  {
    slug: "pension",
    label: "연금",
    tier: 3,
    category: "수급",
    description:
      "국민연금 국내주식 비중 14.9 → 20.8% 상향. 대형주 매수 여력과 수급 방향을 가르는 키워드.",
    relatedStocks: ["삼성전자", "SK하이닉스", "LG에너지솔루션"],
  },
  {
    slug: "fomc",
    label: "FOMC",
    tier: 3,
    category: "이벤트",
    description:
      "FOMC·점도표·쿼드러플위칭 같은 6월 매크로 이벤트. 외인 수급과 시초가 변동성을 좌우하는 일정.",
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

/**
 * 메인 페이지 fetch 전용 키워드 — 페이지 생성 X·검색 결과 흡수만.
 * 단타·급등주·국내주식 위주 뉴스 강화용.
 */
export const FETCH_KEYWORDS_EXTRA: string[] = [
  "급등주",
  "상한가",
  "신고가",
  "단타",
  "시초가",
  "매수 사이드카",
  "서킷브레이커",
  "외국인 순매수",
  "기관 매수",
  "거래량 폭증",
];
