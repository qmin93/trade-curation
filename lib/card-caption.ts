/**
 * 카드 옆에 붙일 Threads 본문 초안 생성기 (클라이언트에서 사용).
 * 3가지 톤 — 담백/감성/분석.
 * ⚠️ Meta 정책 준수: 매수·매도 지시/수익 보장/세력·신호 어투 금지. 시장 관찰·해설 + 면책.
 *    초안일 뿐 — 그대로 박지 말고 본인 손으로 다듬어 게시.
 */
export type CaptionTone = "담백" | "감성" | "분석";
export const CAPTION_TONES: CaptionTone[] = ["담백", "감성", "분석"];

const DISCLAIMER = "※ 매수·매도 추천 아님 · 시장 관찰용 · 투자 판단과 책임은 본인에게";

function withDisclaimer(s: string): string {
  return `${s}\n\n${DISCLAIMER}`;
}

function pct(change: number): string {
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

export function chartCaption(
  name: string,
  change: number,
  tone: CaptionTone,
): string {
  const p = pct(change);
  if (tone === "감성")
    return withDisclaimer(
      `${name} 차트, 눈길 가죠.\n다만 이미 많이 움직인 구간인지부터 봅니다.\n흐름, 어떻게 보세요?`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `${name} ${p}. 먼저 거래량을 봅니다.\n위 매물대 두께와 테마 연동성까지 함께.\n지속성은 어느 쪽으로 보세요?`,
    );
  return withDisclaimer(
    `${name}, 오늘 ${p} 움직였습니다.\n거래대금·수급이 어떻게 따라왔는지 함께 봅니다.\n참고용으로 어떻게 보세요?`,
  );
}

export function newsCaption(
  headline: string,
  source: string,
  tone: CaptionTone,
): string {
  if (tone === "감성")
    return withDisclaimer(
      `${headline}\n바로 따라붙기보다 흐름부터 봅니다.\n진짜 수혜 테마는 어디일까요?`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `${headline}\n(${source}) 재료의 강도와 지속성을 봅니다.\n하루짜리일까요, 며칠 갈까요?`,
    );
  return withDisclaimer(
    `${headline}\n(${source})\n시장 관찰 관점에서 어떻게 보세요?`,
  );
}

export function pickCaption(name: string, tone: CaptionTone): string {
  if (tone === "감성")
    return withDisclaimer(
      `${name}, 오늘 흐름이 눈에 들어왔습니다.\n무리해서 쫓기보다 차분히 관찰합니다.\n자세한 시장 정리는 프로필 링크에서.`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `${name}, 관찰 기준은 거래대금·테마 연동·차트 위치입니다.\n참고용 관심 후보로 정리했습니다.`,
    );
  return withDisclaimer(
    `${name}, 오늘 관심 있게 본 종목입니다.\n거래대금·수급 흐름을 관찰 포인트로 정리했습니다.`,
  );
}

/** 테마 카드용 — 짧은 본문 + 프로필/사이트 유도(부드러운 CTA). */
export function themeCaption(tone: CaptionTone): string {
  if (tone === "감성")
    return withDisclaimer(
      `오늘 어디로 거래대금이 몰렸을까요.\n강했던 테마와 주도주를 정리했습니다.\n전체 정리는 → dantatrade.vercel.app/live`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `오늘 강했던 테마와 그 안의 종목을 등락률·거래대금으로 정리했습니다.\n시장 관찰용 데이터 → dantatrade.vercel.app/live`,
    );
  return withDisclaimer(
    `오늘의 테마 흐름, 한 장에 정리했습니다.\n어디가 강했는지 참고해 보세요.\n전체 → dantatrade.vercel.app/live`,
  );
}

/** 급등·신고가 카드용 — 거래대금/신고가 관찰 데이터. */
export function screenerCaption(tone: CaptionTone): string {
  if (tone === "감성")
    return withDisclaimer(
      `오늘 거래대금·신고가가 강했던 종목들을 모았습니다.\n관찰용 데이터로 봐주세요.\n전체 → dantatrade.vercel.app/live`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `오늘 등락률 상위와 52주 신고가를 정리했습니다.\n시장 관찰 지표로 참고하세요.\n전체 → dantatrade.vercel.app/live`,
    );
  return withDisclaimer(
    `오늘 거래대금·상승률이 강했던 종목들을 정리했습니다.\n관찰용입니다.\n전체 → dantatrade.vercel.app/live`,
  );
}

/** 예상 시초가 카드용 — 미국 야간장 기준 다음 시초가 추정. */
export function premarketCaption(date: string, tone: CaptionTone): string {
  if (tone === "감성")
    return withDisclaimer(
      `${date} 미국 야간장 기준 예상 시초가입니다.\n내일 어디서 열릴지 미리 봐두면 마음이 편하죠.\n참고용 정보입니다.`,
    );
  if (tone === "분석")
    return withDisclaimer(
      `${date} 예상 시초가 — 미국 야간장 움직임을 원화로 환산한 추정치입니다.\n시초가 갭 방향 참고용으로 보세요.`,
    );
  return withDisclaimer(
    `${date} 내일 예상 시초가 정리했습니다.\n미국 야간장 기준 추정 · 참고용.`,
  );
}

export function perfCaption(tone: CaptionTone): string {
  const dis = "※ 과거 사례이며 향후 수익을 보장하지 않습니다 · 손실 가능성 있음";
  if (tone === "감성")
    return `결과만 좋은 것을 고르지 않습니다.\n손절 사례까지 기록으로 남깁니다.\n${dis}`;
  if (tone === "분석")
    return `누적·승률·적중·손절을 한 건씩 기록으로 공개합니다.\n좋은 것만 골라 보여드리지 않습니다.\n${dis}`;
  return `손절 사례까지 전부 기록으로 남깁니다.\n잘된 것만 고르지 않습니다.\n${dis}`;
}
