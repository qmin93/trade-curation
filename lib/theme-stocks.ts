/**
 * 테마별 종목 매핑 — 테마 주도주 카드/화면의 풀(라이브 등락률은 네이버에서).
 * 종목코드는 네이버 polling으로 종목명 검증 완료(2026-06-12).
 * 새 종목은 여기에 ticker만 추가하면 카드가 바로 풍성해진다.
 */
export interface ThemeGroup {
  slug: string;
  label: string;
  emoji: string;
  tickers: string[];
}

export const THEME_GROUPS: ThemeGroup[] = [
  {
    slug: "semi-back",
    label: "반도체 소부장·후공정",
    emoji: "🔧",
    tickers: ["042700", "039030", "067310", "089030", "058470", "403870", "036930", "240810", "003160", "281820"],
  },
  {
    slug: "hbm",
    label: "HBM·메모리",
    emoji: "🧠",
    tickers: ["000660", "005930", "042700", "007660", "000990"],
  },
  {
    slug: "ai-power",
    label: "AI 데이터센터·전력",
    emoji: "⚡",
    tickers: ["267260", "010120", "298040", "033100"],
  },
  {
    slug: "nuclear",
    label: "원전·SMR",
    emoji: "☢️",
    tickers: ["034020", "052690", "083650", "051600"],
  },
  {
    slug: "battery",
    label: "2차전지",
    emoji: "🔋",
    tickers: ["373220", "006400", "003670", "247540", "066970"],
  },
  {
    slug: "defense",
    label: "방산",
    emoji: "🛡️",
    tickers: ["012450", "047810", "079550", "064350"],
  },
  {
    slug: "ship",
    label: "조선",
    emoji: "🚢",
    tickers: ["009540", "010140", "042660", "329180"],
  },
  {
    slug: "robot",
    label: "로봇·휴머노이드",
    emoji: "🤖",
    tickers: ["454910", "277810"],
  },
  {
    slug: "space",
    label: "우주항공",
    emoji: "🛰️",
    tickers: ["272210", "189300"],
  },
  {
    slug: "bio",
    label: "바이오",
    emoji: "💊",
    tickers: ["196170", "207940", "028300"],
  },
  {
    slug: "ai-sw",
    label: "AI 소프트웨어",
    emoji: "💬",
    tickers: ["108860", "402030"],
  },
];
