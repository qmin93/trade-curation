/**
 * "단타 관점" 한 줄 — 뉴스가 왜 단타에 중요한지 규칙 기반으로 자동 코멘트.
 * AI 호출 없이 헤드라인·요약·키워드 매칭. (각 뉴스 카드/모달에 표시)
 */
import type { UnifiedNewsItem } from "./news-fetcher";

const RULES: { test: RegExp; angle: string }[] = [
  { test: /상한가|급등|신고가|점상|따상|급반등/, angle: "단기 과열 — 추격보다 눌림목 확인" },
  { test: /수주|공급계약|단일판매|납품|계약\s?체결|양수/, angle: "실적 모멘텀 — 시초가 갭·거래량 체크" },
  { test: /유상증자|전환사채|\bCB\b|\bBW\b|오버행/, angle: "수급 부담 — 물량 출회 주의" },
  { test: /자기주식|자사주|소각|배당 확대/, angle: "주주환원 — 수급 우호 재료" },
  { test: /흑자전환|어닝 서프라이즈|영업이익.*(증가|급증)|실적 호조/, angle: "실적 재료 — 컨센 대비 서프라이즈 여부" },
  { test: /HBM|반도체|D램|파운드리|\bTPU\b|온디바이스/, angle: "반도체 사이클 — 대장주 연동 주목" },
  { test: /FOMC|기준금리|\bCPI\b|연준|파월|금리 인하|금리 인상/, angle: "매크로 — 지수·외인 수급에 영향" },
  { test: /나스닥|S&P|미국 증시|다우|필라델피아|\bSOX\b/, angle: "미국장 연동 — 내일 시초가 방향" },
  { test: /인수|합병|\bM&A\b|지분 인수|경영권/, angle: "이벤트 드리븐 — 변동성 확대" },
  { test: /임상|\bFDA\b|품목허가|신약|기술수출/, angle: "바이오 모멘텀 — 변동성 큼·분할 대응" },
  { test: /수출|관세|무역|규제|정책 지원|국책/, angle: "정책 재료 — 관련주 동반 주목" },
  { test: /외국인.*(순매수|매수)|기관.*순매수|수급 개선/, angle: "수급 개선 — 추세 전환 신호 여부" },
  { test: /원전|SMR|방산|조선|로봇|우주|전력|2차전지/, angle: "테마 순환 — 주도주 따라 단기 탄력" },
];

export function dantaAngle(news: UnifiedNewsItem): string | null {
  const text = `${news.headline} ${news.summary} ${news.keywords.join(" ")}`;
  for (const r of RULES) if (r.test.test(text)) return r.angle;
  return null;
}
