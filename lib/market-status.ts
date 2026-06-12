/**
 * 장 상태(장전/장중/마감/휴장) — KST 기준. 시간대별로 다른 화면을 보여주기 위한 토대.
 * (멘토 reloadkospi: "시간에 따라 보여주는 화면이 다릅니다")
 * ※ 공휴일은 미반영(주말+시간만). 추후 KRX 영업일 API로 보강.
 */
export type MarketPhase = "open" | "premarket" | "after" | "weekend";

export interface MarketStatus {
  phase: MarketPhase;
  isLive: boolean; // 장중일 때만 true
  badge: string; // "🟢 장중"
  short: string; // "장중"
  detail: string; // 보조 설명
  /** 지금 시간대에 띄울 메인 데이터 화면 */
  primary: { href: string; label: string };
}

function kst(now: Date): { dow: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dowMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dow = dowMap[get("weekday")] ?? 1;
  let h = parseInt(get("hour"), 10);
  if (h === 24) h = 0;
  const minutes = h * 60 + parseInt(get("minute"), 10);
  return { dow, minutes };
}

const OPEN = 9 * 60; // 09:00
const CLOSE = 15 * 60 + 30; // 15:30

const PREMARKET = { href: "/premarket", label: "장전 체크" };
const LIVE = { href: "/live", label: "장중 발굴" };

export function getMarketStatus(now: Date): MarketStatus {
  const { dow, minutes } = kst(now);

  if (dow === 0 || dow === 6) {
    return {
      phase: "weekend",
      isLive: false,
      badge: "💤 휴장",
      short: "휴장",
      detail: "주말 · 다음 거래일 준비",
      primary: PREMARKET,
    };
  }
  if (minutes >= OPEN && minutes < CLOSE) {
    return {
      phase: "open",
      isLive: true,
      badge: "🟢 장중",
      short: "장중",
      detail: "09:00~15:30 실시간",
      primary: LIVE,
    };
  }
  if (minutes < OPEN) {
    return {
      phase: "premarket",
      isLive: false,
      badge: "🌅 장 시작 전",
      short: "장전",
      detail: "개장 전 · 미국 마감·예상 시초가",
      primary: PREMARKET,
    };
  }
  return {
    phase: "after",
    isLive: false,
    badge: "🌙 장 마감",
    short: "마감",
    detail: "장 마감 · 미국장·내일 시초가 준비",
    primary: PREMARKET,
  };
}
