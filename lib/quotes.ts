export interface TraderQuote {
  text: string;
  attribution: string;
  context?: string;
  category: "discipline" | "risk" | "psychology" | "timing" | "humility";
}

export const TRADER_QUOTES: TraderQuote[] = [
  {
    text: "가장 좋은 매매는 가장 편안한 매매다.",
    attribution: "주식시장의 마법사들",
    category: "psychology",
  },
  {
    text: "매매할 자리가 없으면 매매하지 마라. 그게 가장 어려운 일이다.",
    attribution: "마이클 마커스",
    context: "30만 → 8천만 달러",
    category: "discipline",
  },
  {
    text:
      "단타는 큰 한 방을 노리는 게임이 아니다. 작은 우위를 매번 정확히 받아내는 게임이다.",
    attribution: "마티 슈워츠",
    context: "단기 모멘텀 매매",
    category: "discipline",
  },
  {
    text:
      "매매에는 네 가지 원칙뿐. 손절선 끊기, 손절선 끊기, 손절선 끊기, 손절선 끊기.",
    attribution: "에드 세이코타",
    context: "시스템 트레이더 원조",
    category: "risk",
  },
  {
    text:
      "가장 중요한 규칙은 공격이 아니라 방어다. 매일 그날 잃을 수 있는 금액부터 정한다.",
    attribution: "폴 튜더 존스",
    context: "자금관리의 대가",
    category: "risk",
  },
  {
    text:
      "내가 어디서 빠져나갈지 모르는 자리에는 절대 들어가지 않는다.",
    attribution: "브루스 코프너",
    context: "매크로 추세추종",
    category: "discipline",
  },
  {
    text: "나는 많이 쏘지 않는다. 모든 게 맞을 때만 한 발.",
    attribution: "마크 와인스타인",
    context: "적중률 90%대",
    category: "timing",
  },
  {
    text:
      "성공한 트레이더의 공통점은 시장에 자기 의견을 강요하지 않는다는 것.",
    attribution: "잭 슈웨거",
    context: "17명 인터뷰 결론",
    category: "humility",
  },
];

export const CORE_PRINCIPLES = [
  {
    n: "01",
    title: "손절선",
    description:
      "진입 전에 정한다. 깨지면 즉시 끊는다. 예외 X.",
    quote: "손절선 끊기 · 손절선 끊기 · 손절선 끊기 · 손절선 끊기",
    by: "에드 세이코타",
  },
  {
    n: "02",
    title: "자금관리",
    description:
      "한 매매당 자본의 1~2% 이상 손실 노출 X.",
    quote: "공격이 아니라 방어. 매일 그날 잃을 수 있는 금액부터 정한다.",
    by: "폴 튜더 존스",
  },
  {
    n: "03",
    title: "매매일지",
    description: "모든 매매 기록·복기. 같은 실수 반복 X.",
    quote: "내가 어디서 빠져나갈지 모르는 자리에는 들어가지 않는다.",
    by: "브루스 코프너",
  },
];

export function getRandomQuote(): TraderQuote {
  return TRADER_QUOTES[Math.floor(Math.random() * TRADER_QUOTES.length)];
}

export function getDailyQuote(): TraderQuote {
  const day = Math.floor(Date.now() / 86_400_000);
  return TRADER_QUOTES[day % TRADER_QUOTES.length];
}
