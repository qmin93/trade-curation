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

function matchesAdPattern(text: string): boolean {
  return AD_PATTERNS.some((re) => re.test(text));
}

export function shouldKeep(item: UnifiedNewsItem): boolean {
  // mock 데이터는 항상 통과 (운영자 큐레이션)
  if (item.origin === "mock") return true;

  const text = `${item.headline} ${item.summary}`;

  // A. 단타 부적합 차단
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
    const boost = item.origin === "mock" ? 200 : calculateBoost(text);
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
