/**
 * 카드 옆에 붙일 Threads 본문 초안 생성기 (클라이언트에서 사용).
 * 3가지 톤 — 담백/감성/분석. 뉴스·차트·성과는 의문형, 픽은 CTA로 마무리.
 * ⚠️ 초안일 뿐 — 그대로 박지 말고 본인 손으로 다듬어 게시.
 */
export type CaptionTone = "담백" | "감성" | "분석";
export const CAPTION_TONES: CaptionTone[] = ["담백", "감성", "분석"];

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
    return `${name} 차트, 솔직히 손이 근질근질하죠.\n근데 이미 달려간 건 아닐까요?\n여기서 더 갈 자리인지부터 봅니다.`;
  if (tone === "분석")
    return `${name} ${p}. 먼저 거래량을 봅니다.\n급등 뒤 위 매물대가 얇으면 탄력, 두터우면 눌림.\n어느 쪽으로 보이세요?`;
  return `${name}, 오늘 ${p} 움직였습니다.\n수급이 들어온 자리인지, 늦은 추격 자리인지.\n지금도 들어갈 만한 자리일까요?`;
}

export function newsCaption(
  headline: string,
  source: string,
  tone: CaptionTone,
): string {
  if (tone === "감성")
    return `이 뉴스 보고 바로 따라붙으면 늦습니다.\n${headline}\n진짜 수혜는 어디일까요?`;
  if (tone === "분석")
    return `${headline}\n(${source}) 재료의 강도와 지속성부터 따집니다.\n하루짜리일까요, 며칠 갈까요?`;
  return `${headline}\n(${source})\n단타 관점에서는 어떤 자리일까요?`;
}

export function pickCaption(name: string, tone: CaptionTone): string {
  if (tone === "감성")
    return `${name}, 오늘 이 자리 잘 잡혔으면 좋겠습니다.\n무리한 추격 말고 기준대로.\n관심 있으면 텔레그램에서 같이 봐요.`;
  if (tone === "분석")
    return `${name} 포착가·목표가·손절가 명확히 잡았습니다.\n잃지 않는 게 먼저입니다.\n자세한 근거는 채널에서.`;
  return `${name} 자리 잡혔습니다.\n진입·목표·손절은 카드 그대로.\n본인 기준에 맞으면 관심 가져보세요.`;
}

/** 테마 카드용 — 멘토(reload.kospi)식: 짧은 본문 + 사이트 유도. */
export function themeCaption(tone: CaptionTone): string {
  if (tone === "감성")
    return `오늘 어디로 돈이 몰렸을까요.\n테마 주도주, 제가 다 정리해 뒀습니다.\n전체는 사이트에서 → dantatrade.vercel.app/live`;
  if (tone === "분석")
    return `오늘 강한 테마와 그 안의 주도주만 추렸습니다.\n등락률 순으로 한눈에.\n실시간 전체 → dantatrade.vercel.app/live`;
  return `오늘의 테마 주도주, 한 장에 모았습니다.\n뭐가 가장 셌는지 보이시죠?\n전체 종목은 → dantatrade.vercel.app/live`;
}

/** 급등·신고가 카드용 — 멘토식 짧은 본문 + 사이트 유도. */
export function screenerCaption(tone: CaptionTone): string {
  if (tone === "감성")
    return `오늘 누가 신고가를 뚫었을까요.\n급등주·신고가 한 장에 모았습니다.\n실시간 전체 → dantatrade.vercel.app/live`;
  if (tone === "분석")
    return `오늘 급등 종목과 52주 신고가만 추렸습니다.\n추세 따라가는 종목, 여기서.\n실시간 전체 → dantatrade.vercel.app/live`;
  return `오늘 가장 강했던 종목들입니다.\n급등·신고가, 다 보여드립니다.\n실시간 전체 → dantatrade.vercel.app/live`;
}

export function perfCaption(tone: CaptionTone): string {
  if (tone === "감성")
    return `수익만 자랑하는 방, 많죠.\n저흰 손절도 똑같이 남깁니다.\n그게 신뢰 아닐까요?`;
  if (tone === "분석")
    return `누적·승률·적중·손절 전부 공개합니다.\n좋은 것만 골라 보여드리지 않습니다.\n한 건씩 검증해 보시겠어요?`;
  return `손절까지 전부 공개합니다.\n잘된 신호만 고르지 않습니다.\n기록으로 직접 판단해 보시겠어요?`;
}
