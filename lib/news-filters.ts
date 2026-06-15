/**
 * 뉴스 필터링 — 단타 적합 뉴스만 통과.
 *
 * A. 단타 부적합 키워드 블락 (증여세·연예·생활·취미 등)
 * B. 최근 24h만 통과
 * C. 매체 우선순위 (통신·신문 > 블로그)
 * D. 광고성 헤드라인 필터
 */

import type { UnifiedNewsItem } from "./news-fetcher";

// A. 단타 부적합 차단 키워드 (제목·요약에 포함되면 제외)
const BLOCKED_KEYWORDS = [
  // 세무·법무
  "증여세", "상속세", "양도세", "세무조사", "세금 신고", "공제", "절세",
  // 생활·소비
  "쇼핑", "환급", "할인", "이벤트 진행", "감사 페스티벌", "프로모션",
  "쿠폰", "특가", "세일",
  // 정치·사회 (단타와 무관)
  "선관위", "부정 개표", "정치 후보", "선거구",
  // 연예·스포츠
  "연예", "아이돌", "드라마", "예능", "스포츠 경기",
  // 일반 생활·여행
  "맛집", "여행지", "레시피", "운세", "별자리", "띠별",
  // 사건사고·산재·사회 (증시 무관 — 연금/사회 키워드가 끌어옴)
  "진폐", "산재", "업무상 재해", "채석장", "학폭", "학교폭력", "왕따",
  "익사", "물에 빠", "저수지", "실종", "성폭행", "성추행", "성범죄",
  "음주운전", "마약", "살인", "강도", "절도", "흉기", "몰카", "불법촬영",
  "데이트폭력", "보이스피싱", "교통사고", "뺑소니", "폭행 혐의", "기소",
  "실탄", "교도소", "구치소", "총기",
  // 강력범죄·사망·변사 (절대 차단 — "신고가 접수" 류가 주식 키워드로 오인됨)
  "시신", "훼손 시신", "사체", "백골", "토막", "변사", "부검", "검안",
  "피살", "살해", "숨진 채", "숨졌", "숨진", "사망 추정", "신원 미상",
  "무연고 사망", "추락사", "투신", "자살", "일가족", "납치", "감금",
  "인질", "칼부림", "흉기 난동", "묻지마", "방화", "암매장", "시신 발견",
  // 스포츠 (야구팀명 = 회사명이라 종목 키워드에 걸림: LG·삼성·한화·키움·두산·롯데 등)
  "투수", "타자", "홈런", "투수전", "야구", "프로야구", "KBO", "이닝",
  "타석", "삼진", "완봉", "완투", "선발승", "3연전", "4연전", "승째",
  "골프", "축구", "농구", "배구", "올림픽", "감독 선임", "구단",
];

// D. 광고성 헤드라인 패턴
const AD_PATTERNS = [
  /\d+%\s*환급/i,
  /\d+%\s*할인/i,
  /감사\s*페스티벌/i,
  /이벤트\s*참여/i,
  /쿠폰\s*증정/i,
  /무료\s*증정/i,
  /구매\s*시\s*증정/i,
];

// C. 매체 우선순위 (점수 ↑ = 우선 노출)
const SOURCE_PRIORITY: Record<string, number> = {
  // 통신사·전국지 (최상위)
  yna: 100,
  "news.yna": 100,
  fnnews: 95,
  hankyung: 95,
  mk: 95,
  sedaily: 90,
  newspim: 90,
  edaily: 90,
  asiae: 88,
  // 경제 전문지
  etoday: 85,
  ddaily: 85,
  etnews: 85,
  thelec: 80,
  "biz.heraldcorp": 80,
  heraldcorp: 80,
  zdnet: 78,
  // 산업지
  ebn: 70,
  industrynews: 70,
  inthenews: 65,
  thepublic: 65,
  // mock·내부 (높은 우선순위)
  mock: 110,
  // 기타
  default: 50,
};

function getSourcePriority(source: string): number {
  const key = source.toLowerCase().replace(/^www\./, "").replace(/\..*$/, "");
  return SOURCE_PRIORITY[key] ?? SOURCE_PRIORITY.default;
}

// 단타 적합 키워드 (제목·요약 매칭 시 부스트)
const BOOST_KEYWORDS = [
  "상한가", "급등", "신고가", "단발", "시초가", "갭", "매수 사이드카",
  "서킷브레이커", "다중 신호", "세력 매집", "거래량 폭증", "외인 매수",
  "기관 매수", "+30%", "+29%", "+20%", "+15%", "수주", "단독 호재",
];

const BOOST_PATTERNS = [
  /\+\d{2}(\.\d+)?%/, // +29.93% 등
  /\d{1,2}\s*거래일\s*만/, // "5거래일 만에" 등
  /시초가\s*\+/,
  /상한가\s*달성/,
];

function calculateBoost(text: string): number {
  const lower = text.toLowerCase();
  let boost = 0;
  for (const kw of BOOST_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) boost += 10;
  }
  for (const re of BOOST_PATTERNS) {
    if (re.test(text)) boost += 15;
  }
  return boost;
}

// B. 최근 N 시간 필터
const MAX_AGE_HOURS = 48;

function isRecent(dateStr: string): boolean {
  const articleDate = new Date(dateStr);
  if (isNaN(articleDate.getTime())) return true;
  const ageMs = Date.now() - articleDate.getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  return ageHours <= MAX_AGE_HOURS;
}

function containsBlockedKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * ★ 화이트리스트(allow-list) — 시장/주식 신호가 "있어야만" 통과.
 * 블록리스트는 보조일 뿐, 진짜 게이트는 이것. 모호한 단독어("신고가") 대신 명확한 시장어만.
 */
const ALLOW_KEYWORDS = [
  // 지수·시황
  "코스피", "코스닥", "코스피200", "증시", "주식시장", "주가", "시황", "지수",
  // 가격 행동
  "상한가", "하한가", "급등", "급락", "강세", "약세", "점상", "갭상승", "갭하락",
  "52주 신고가", "신고가 경신", "신고가 돌파", "신고가 갱신", "시초가",
  // 수급
  "거래량", "거래대금", "외국인", "외인", "기관", "연기금", "순매수", "순매도",
  "수급", "공매도", "사이드카", "서킷브레이커", "쌍끌이",
  // 밸류·실적
  "시가총액", "시총", "목표주가", "컨센서스", "실적", "영업이익", "순이익", "매출",
  "어닝", "잠정실적", "흑자전환", "적자",
  // 이벤트
  "수주", "공급계약", "단일판매", "납품", "계약 체결", "유상증자", "무상증자",
  "전환사채", "자사주", "배당", "인수", "합병", "인수합병", "지분", "IPO",
  "상장", "공모", "청약", "임상", "신약", "기술수출", "품목허가",
  // 테마·섹터
  "반도체", "HBM", "D램", "낸드", "파운드리", "데이터센터", "2차전지", "배터리",
  "양극재", "바이오", "원전", "SMR", "방산", "조선", "로봇", "휴머노이드", "우주항공",
  "전력", "전기차", "엔터", "게임주", "플랫폼", "핀테크",
  // 매크로
  "환율", "원/달러", "원달러", "금리", "기준금리", "FOMC", "연준", "파월", "CPI",
  "나스닥", "S&P", "다우", "필라델피아", "반도체지수", "선물", "옵션 만기", "쿼드러플",
  // 코인
  "비트코인", "이더리움", "가상자산", "암호화폐", "김치프리미엄", "업비트", "빗썸",
  // 일반 주식
  "종목", "주식", "증권", "상장사", "테마주", "대장주", "주도주", "관련주", "수혜주",
  "급등주", "특징주", "우량주", "코스닥시장", "유가증권시장", "ETF", "ETN",
];

const TICKER_RE = /\b\d{6}\b/;

/** 시장 관련성 — 종목이 잡혔거나, 6자리 코드, 또는 명확한 시장어가 있으면 통과 */
function isMarketRelevant(item: UnifiedNewsItem): boolean {
  if (item.stocks && item.stocks.length > 0) return true;
  const text = `${item.headline} ${item.summary}`;
  if (TICKER_RE.test(text)) return true;
  const lower = text.toLowerCase();
  return ALLOW_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function matchesAdPattern(text: string): boolean {
  return AD_PATTERNS.some((re) => re.test(text));
}

export function shouldKeep(item: UnifiedNewsItem): boolean {
  // mock(운영자 큐레이션)·dart(공시)는 항상 통과
  if (item.origin === "mock" || item.origin === "dart") return true;

  const text = `${item.headline} ${item.summary}`;

  // ★ 화이트리스트 — 시장/주식 신호가 없으면 무조건 제외 (진짜 게이트)
  if (!isMarketRelevant(item)) return false;

  // A. 단타 부적합 차단 (보조 안전망)
  if (containsBlockedKeyword(text)) return false;

  // D. 광고성 헤드라인 차단
  if (matchesAdPattern(text)) return false;

  // B. 최근 48시간만
  if (!isRecent(item.date)) return false;

  return true;
}

export function applyFilters(items: UnifiedNewsItem[]): UnifiedNewsItem[] {
  const filtered = items.filter(shouldKeep);

  // 점수 계산 — 단타 적합 부스트 + 매체 우선순위
  const scored = filtered.map((item) => {
    const text = `${item.headline} ${item.summary}`;
    // mock(운영자 큐레이션) 최상위. DART 공시는 기사보다 빠른 하드 재료라 라이브 위에 가점.
    const boost =
      item.origin === "mock"
        ? 200
        : item.origin === "dart"
          ? 120
          : calculateBoost(text);
    const sourcePriority = getSourcePriority(item.source);
    return { item, score: boost + sourcePriority };
  });

  // 정렬: 날짜 desc → 점수 desc (같은 날짜면 부스트 + 매체 점수 높은 것 먼저)
  return scored
    .sort((a, b) => {
      const dateCompare = b.item.date.localeCompare(a.item.date);
      if (dateCompare !== 0) return dateCompare;
      return b.score - a.score;
    })
    .map((s) => s.item);
}

export const FILTER_INFO = {
  blockedKeywordCount: BLOCKED_KEYWORDS.length,
  adPatternCount: AD_PATTERNS.length,
  maxAgeHours: MAX_AGE_HOURS,
  sourcePriorityCount: Object.keys(SOURCE_PRIORITY).length,
};
