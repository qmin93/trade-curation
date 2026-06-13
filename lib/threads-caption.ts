/**
 * 기사 → Threads 본문(캡션) 자동 생성. 카드 이미지에 맞춰 바로 복붙할 훅+국내연결+의문형.
 * 규칙 기반(AI 비용 0). 카드 요약을 반복하지 않고 '단타 훅'을 더한다.
 */
import type { UnifiedNewsItem } from "./news-fetcher";
import { dantaAngle } from "./danta-angle";

// 종목이 아닌 일반 키워드(지수·테마·수급어)는 '주어'로 쓰지 않는다.
const NOT_STOCK = new Set([
  "기관 매수", "매수 사이드카", "코스피", "코스닥", "상한가", "급등주", "시초가",
  "서킷브레이커", "공시", "연금", "FOMC", "외인", "수급", "환율", "금리", "HBM",
  "반도체", "하이닉스",
]);

function pickStocks(news: UnifiedNewsItem): string {
  const pool = news.stocks.length ? news.stocks : news.keywords;
  const filtered = pool.filter(
    (s) => s && s.length >= 2 && !NOT_STOCK.has(s.trim()),
  );
  return filtered.slice(0, 2).join("·");
}

const TEMPLATES: { test: RegExp; build: (s: string) => string }[] = [
  {
    test: /상한가|급등|신고가|점상|급반등/,
    build: (s) =>
      `오늘 가장 강했던 자리 중 하나입니다.\n다만 이미 달려간 종목은 추격보다 눌림 한 번 기다리는 게 편하죠.\n${s || "이 종목"}, 다음 거래일에도 자리 지킬까요?`,
  },
  {
    test: /수주|공급계약|단일판매|납품|계약\s?체결/,
    build: (s) =>
      `실적으로 이어질 수 있는 재료가 나왔습니다.\n시초가 갭과 거래량부터 확인할 자리고요.\n${s || "관련주"}, 이 모멘텀 이어질까요?`,
  },
  {
    test: /HBM|반도체|D램|파운드리|\bTPU\b|메모리|낸드/,
    build: (s) =>
      `반도체 사이클이 다시 움직이고 있습니다.\n그 수요의 끝엔 결국 HBM 대장주 SK하이닉스·삼성전자가 있죠.\n미국이 당길 때 국내 대장주도 따라오던 패턴, 이번에도 이어질까요?`,
  },
  {
    test: /FOMC|기준금리|\bCPI\b|연준|파월|환율/,
    build: () =>
      `매크로가 지수와 외인 수급을 흔드는 국면입니다.\n방향 잡히기 전엔 무리한 진입보다 기준 확인이 먼저고요.\n다음 장, 어느 쪽으로 보세요?`,
  },
  {
    test: /나스닥|미국 증시|S&P|다우|필라델피아|\bSOX\b/,
    build: (s) =>
      `미국장이 당기면 국내 대장주도 따라 움직이던 패턴이었습니다.\n${s || "관련주"}, 다음 거래일에도 이어질까요?`,
  },
  {
    test: /유상증자|전환사채|\bCB\b|오버행/,
    build: (s) =>
      `수급에 부담이 될 수 있는 공시입니다.\n물량 출회 여부부터 체크할 자리고요.\n${s || "해당 종목"}, 받아낼 수 있을까요?`,
  },
  {
    test: /자기주식|자사주|소각|배당/,
    build: (s) =>
      `주주환원 재료는 수급에 우호적입니다.\n${s || "해당 종목"}, 단기 반응 이어질까요?`,
  },
  {
    test: /임상|\bFDA\b|신약|기술수출|품목허가/,
    build: (s) =>
      `바이오는 재료 하나에 변동성이 큽니다.\n분할로 대응할 자리고요.\n${s || "관련주"}, 추세로 이어질까요?`,
  },
  {
    test: /외국인.*(순매수|매수)|기관.*순매수|수급 개선|쌍끌이/,
    build: (s) =>
      `수급이 돌아서는 신호가 보입니다.\n하루짜리인지 추세 전환인지가 관건이고요.\n${s || "주도주"}, 다음 거래일에도 이어질까요?`,
  },
  {
    test: /원전|SMR|방산|조선|로봇|휴머노이드|우주|2차전지|전력/,
    build: (s) =>
      `테마로 돈이 도는 국면입니다.\n주도주를 따라가되 늦게 들어가 꼭지 잡는 건 피해야죠.\n${s || "주도주"}, 다음 거래일 시초 받쳐줄까요?`,
  },
];

function defaultBuild(s: string): string {
  return `오늘 눈여겨볼 자리입니다.\n${s || "관련주"} 흐름, 다음 거래일에도 이어질지 보려 합니다.\n어떻게 보세요?`;
}

function hashtags(news: UnifiedNewsItem): string {
  const raw = [...new Set([...news.keywords, ...news.stocks])];
  return raw
    .map((k) => `#${k.replace(/[^\p{L}\p{N}]/gu, "")}`)
    .filter((t) => t.length > 2)
    .slice(0, 4)
    .join(" ");
}

export function threadsCaption(news: UnifiedNewsItem): string {
  const stocks = pickStocks(news);
  const text = `${news.headline} ${news.summary} ${news.keywords.join(" ")}`;
  const body = (TEMPLATES.find((t) => t.test.test(text))?.build ?? defaultBuild)(stocks);
  const tags = hashtags(news);
  return tags ? `${body}\n\n${tags}` : body;
}

/* ───────── 페르소나별 본문 (6계정 포맷에 맞춰) ───────── */

export type Persona =
  | "단타시그널"
  | "단타이스트"
  | "단타데일리"
  | "단타Lab"
  | "단타Pick"
  | "스캘퍼";

export const PERSONAS: Persona[] = [
  "단타시그널",
  "단타이스트",
  "단타데일리",
  "단타Lab",
  "단타Pick",
  "스캘퍼",
];

/** 본문 첫 줄용 — 요약 첫 문장(없으면 헤드라인), 길면 자른다. */
function leadLine(news: UnifiedNewsItem): string {
  const src = (news.summary || news.headline).trim();
  const m = src.match(/^[^.。!?\n]+[.。!?]?/u);
  let lead = (m ? m[0] : src).trim();
  if (lead.length > 80) lead = lead.slice(0, 78).trim() + "…";
  return lead;
}

export function threadsCaptionByPersona(
  news: UnifiedNewsItem,
  persona: Persona,
): string {
  const subj = pickStocks(news) || "관련주";
  const lead = leadLine(news);
  const angle = dantaAngle(news) ?? "단기 변동성이 큰 자리입니다";
  const mmdd = news.date.slice(5).replace("-", "/");
  const tags = hashtags(news);

  let body: string;
  switch (persona) {
    case "단타시그널":
      body = `${lead}\n- ${angle}.\n- 추격보다 눌림 한 번 기다리는 게 편해 보입니다.`;
      break;
    case "단타이스트":
      body = `${lead}\n\n${angle}.\n이런 자리, 기준 없이 들어가도 괜찮을까요?`;
      break;
    case "단타데일리":
      body = `[${mmdd}] 오늘 짚어볼 포인트\n${lead}\n1. ${angle}.\n2. 갭이 큰 날일수록 추격보다 기준 확인이 먼저입니다.\n결정은 본인의 몫.`;
      break;
    case "단타Lab":
      body = `"${lead}"\n단순한 뉴스로 넘기면 손해입니다.\n${angle}.\n표면 말고 그 뒤, 보고 계신가요?`;
      break;
    case "단타Pick":
      body = `${subj} 소식 봤습니다.\n${lead}\n${angle}.\n오늘 자리, 어디까지 갈까요?`;
      break;
    case "스캘퍼":
      body = `[${mmdd}] 단발 이슈\n🔻 ${lead}\n📍 ${angle}. 추격보다 시초가 확인.\n시초가 어디냐?`;
      break;
  }
  return tags ? `${body}\n\n${tags}` : body;
}
