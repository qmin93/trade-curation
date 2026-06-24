/**
 * 픽 → Threads 본문(페르소나별) 자동 생성.
 * 운영자가 /ops 화면에서 종목·포착가·목표가·근거를 입력하면 5계정 톤으로 복붙 본문을 만든다.
 * 규칙 기반(AI 비용 0).
 *
 * 🔄 회전: variant 값이 바뀌면 페르소나별 (1) 첫 줄, (2) 마무리, (3) 길이(짧게/보통/길게),
 *    (4) 개인 코멘트가 모두 다르게 조합된다 → 매번 손으로 쓴 듯 달라진다(봇 티 방지).
 */
import type { Persona } from "./threads-caption";
import { PERSONAS } from "./threads-caption";
import { OPTION_BANK } from "./persona-option-bank";

export { PERSONAS };
export type { Persona };

export interface PickInput {
  stockName: string;
  ticker: string;
  strategy: string;
  entry: string;
  stop: string;
  targets: string[];
  note: string;
}

const DISCLAIMER =
  "※ 시장 관찰용 정보 · 매수·매도 추천 아님 · 판단과 책임은 본인에게";
// 정본(threads-voice-canonical) — 은근한 CTA. 노골적 텔레그램·👇 금지.
const CTA = "실시간 기준은 채널에서 따로 이어갑니다.";

// 본문 5요소 — 열린 질문(댓글 유도) + 정체성(팔로우 유도)
const QUESTIONS = [
  "여러분은 이 자리, 관심 가시나요 아니면 패스인가요? 댓글로요.",
  "이거 들어가실 자리로 보세요, 지켜볼 자리로 보세요? 댓글로 의견 주세요.",
  "오늘 이 종목 보신 분, 어떻게 보셨어요? 댓글로 같이 봐요.",
  "지금 더 강하다고 보는 종목 있으면 댓글로 적어주세요.",
];
const IDENTITY: Record<string, string> = {
  단타시그널: "매일 자리만 짧게 짚어드려요. 놓치기 싫으면 팔로우.",
  단타이스트: "매일 시장 한 장면을 같이 곱씹습니다. 도움 되면 팔로우해 주세요.",
  단타데일리: "매일 장 흐름을 차분히 정리해드립니다. 놓치기 싫으면 팔로우.",
  단타Lab: "매일 '오늘 왜 이렇게 움직였나'를 한 편씩 쉽게 풀어드려요. 팔로우하면 같이 봐요.",
  스캘퍼: "장중 '지금 위험한 자리'만 빠르게 짚어드려요. 팔로우하면 실시간으로요.",
  단타Pick: "",
};

/* ───────── 픽 노트 붙여넣기 → 자동 파싱 ───────── */

export function parsePickNote(raw: string): PickInput {
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const out: PickInput = {
    stockName: "", ticker: "", strategy: "", entry: "", stop: "", targets: [], note: "",
  };
  if (lines.length === 0) return out;

  const nameIdx = lines.findIndex(
    (l) => /\b\d{6}\b/.test(l) && !/원|포착가|손절|목표/.test(l),
  );
  if (nameIdx >= 0) {
    const line = lines[nameIdx];
    const code = line.match(/\b(\d{6})\b/);
    out.ticker = code ? code[1] : "";
    out.stockName = line.replace(/\b\d{6}\b/, "").replace(/[^가-힣A-Za-z0-9·\s]/g, "").trim();
    for (let i = nameIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (/^[📌💰🎯⚠️📊•·\-]/.test(l) || /차트|포착가|목표가|손절/.test(l)) break;
      out.strategy = l.replace(/\s*포착\.?$/, "").trim();
      break;
    }
  }

  const entryLine = lines.find((l) => /포착가/.test(l));
  if (entryLine) {
    const m = entryLine.match(/포착가\D*([\d,]+)/);
    if (m) out.entry = m[1];
  }

  const stopLine = lines.find((l) => /손절/.test(l));
  if (stopLine) {
    const price = stopLine.match(/손절\D*([\d,]+)/);
    const paren = stopLine.match(/\(([^)]*%)\)/);
    if (price) out.stop = paren ? `${price[1]} (${paren[1]})` : price[1];
  }

  for (const l of lines) {
    if (/이상|자율/.test(l)) continue;
    const m = l.match(/(\d+)\s*차\s*([\d,]+)\s*원?\s*([+-]\d+(?:\.\d+)?%)?/);
    if (m && /원|\d,\d/.test(l)) {
      const [, n, price, pct] = m;
      out.targets.push(`${n}차 ${price}${pct ? ` (${pct})` : ""}`);
    }
  }
  if (out.targets.length === 0) out.targets = ["", "", "", ""];

  const noteParts: string[] = [];
  const ilbong = lines.find((l) => /일봉/.test(l));
  if (ilbong) {
    const pct = ilbong.match(/[+-]\d+(?:\.\d+)?%/);
    const ma =
      /5일선/.test(ilbong) && /20일선/.test(ilbong) ? "5·20일선 위"
      : /20일선/.test(ilbong) ? "20일선 위"
      : /5일선/.test(ilbong) ? "5일선 위" : "";
    const seg = `일봉 ${pct ? pct[0] + "로 " : ""}${ma}`.trim();
    if (seg !== "일봉") noteParts.push(seg);
  }
  const bunbong = lines.find((l) => /분봉/.test(l));
  if (bunbong) {
    const v = bunbong.match(/VWAP\s*위?\s*\(?\s*([\d,]+)\s*원?\)?/);
    noteParts.push(v ? `분봉 VWAP(${v[1]}원) 위` : "분봉 VWAP 위");
  }
  const haeksim = lines.find((l) => /핵심/.test(l));
  if (haeksim) {
    const after = haeksim.replace(/.*핵심\s*[:：]?\s*/, "").trim();
    if (after) noteParts.push(after.replace(/,\s*/g, "·"));
  }
  out.note = noteParts.join(", ");
  return out;
}

/* ───────── 유틸 ───────── */

function at<T>(arr: T[], v: number): T {
  return arr[((v % arr.length) + arr.length) % arr.length];
}
function bareStop(stop: string): string {
  return stop.replace(/\s*\(.*?\)\s*/g, "").trim() || stop.trim();
}
function targetsLine(t: string[]): string {
  return t.map((x) => x.trim()).filter(Boolean).join(" · ");
}
function targetsPriceOnly(t: string[]): string {
  return t.map((x) => (x.match(/[\d,]+/) || [""])[0]).filter(Boolean).join(" · ");
}
/** variant 정수를 (첫줄, 마무리, 길이모드) 세 선택으로 분해 */
function decode(variant: number, nOpen: number, nClose: number) {
  const v = Math.abs(variant);
  return {
    o: v % nOpen,
    c: Math.floor(v / nOpen) % nClose,
    lm: Math.floor(v / (nOpen * nClose)) % 3, // 0 짧게 · 1 보통 · 2 길게
  };
}
function join(lines: string[]): string {
  return lines.filter((l, i, a) => l !== null && l !== undefined && !(l === "" && a[i - 1] === "")).join("\n");
}

/* ───────── 페르소나별 풀 ───────── */

const SIGNAL_OPEN = (s: string, st: string) => [
  `${s}, ${st} 강하게 움직이는 자리입니다.`,
  `${s}, 장중 ${st} 기준부터 봅니다.`,
  `${s} 봅니다. ${st} 자리.`,
  `${s} — ${st} 자리 잡혔습니다.`,
  `${s}, 오늘 ${st} 흐름.`,
];
const SIGNAL_CLOSE = [
  `- 본인 기준에 맞다면 관심.`, // s_trader91 시그니처
  `- 기준 지켜지는지가 관건. 본인 자리면 관심.`,
  `- 깨지면 흐름 종료. 맞으면 관심.`,
  `- 추격보다 기준 유지부터. 본인 판단으로.`,
  `- 자리 지키는지가 전부. 본인 기준대로.`,
  ...OPTION_BANK.단타시그널.closes.map((c) => `- ${c}`), // 옵션 뱅크 연결
];
const SIGNAL_EXTRA = [
  `- 거래대금 한 번 더 확인하고.`,
  `- 과열이면 한 박자 쉬어도 되고.`,
  `- 시초 흐름만 체크.`,
];

const EAST_OPEN = (s: string, st: string) => [
  `${s}, ${st} 자리가 눈에 들어옵니다.`,
  `${s} 보고 있습니다. ${st} 자리네요.`,
  `${s}, 오늘 ${st}로 잡힌 자리입니다.`,
  `${s} — ${st}, 흐름 한번 볼만합니다.`,
];
const EAST_MID = (bs: string) => [
  `이런 자리, 기준 없이 들어가면 도망칠 곳이 없습니다. ${bs} 먼저 보는 이유고요.`, // insights_trader86 격언 톤
  `급하게 쫓기보다 ${bs} 안 깨지는지 먼저 보는 게 순서라고 봅니다.`,
  `자리는 기다리는 사람에게 옵니다. ${bs} 지켜지는지부터요.`,
  `남들 달려갈 때 ${bs} 라인부터 확인하는 게 먼저죠.`,
  `욕심보다 기준입니다. ${bs} 깨지면 미련 없이요.`,
];
const EAST_CLOSE = [
  `오후까지 거래대금 받쳐줄까요?`,
  `이 자리, 끝까지 끌고 갈 수 있을까요?`,
  `수급이 진짜 받쳐주는 자리일까요?`,
  `결국 기준 지키는 쪽이 남지 않을까요?`,
  ...OPTION_BANK.단타이스트.closes, // 옵션 뱅크 연결
];
const EAST_ASIDE = [
  `개인적으로는 무리하게 쫓진 않으려 합니다.`,
  `저는 기준 깨지면 미련 없이 정리하는 편이고요.`,
  `오늘 같은 장은 자리 안 주면 패스해도 되고요.`,
];

const DAILY_HEAD = (mmdd: string) => [
  `[${mmdd}] 오늘 짚어볼 자리`,
  `[${mmdd}] 장중 관전 포인트`,
  `[${mmdd}] 오늘의 단타 메모`,
  `[${mmdd}] 짚고 가는 자리`,
];
const DAILY_CLOSE = [
  `추격보다 기준 유지 여부 확인. 결정은 본인의 몫.`,
  `자리 지켜지는지 보고. 결정은 본인의 몫.`,
  `무리한 진입은 피하고. 결정은 본인의 몫.`,
  `기준선 깨지면 비우고. 결정은 본인의 몫.`,
  ...OPTION_BANK.단타데일리.closes, // 옵션 뱅크 연결
];
const DAILY_ASIDE = [
  `참고로 거래대금·테마 집중도도 같이 봅니다.`,
  `외인·기관 수급 방향도 체크 포인트입니다.`,
  `변동성 큰 구간이라 분할 대응이 편합니다.`,
];

const LAB_OPEN = (s: string) => [
  `${s}, 단순 반등일까요? 진짜 이유는 따로 있습니다.`, // badakstock 시그니처
  `${s}, 그냥 오른 거라 짐작이나 가십니까? 들여다보면 다릅니다.`,
  `${s}, 표면만 보면 놓치는 자리입니다.`,
  `${s}, 왜 하필 지금 움직일까요?`,
];
const LAB_CLOSE = [
  `차트 뒤 진짜 판은 어디일까요?`, // badakstock 시그니처
  `흐름으로만 넘겨도 될까요?`,
  `표면만 보고 지나쳐도 될까요?`,
  `진짜 자리는 어디일까요?`,
  ...OPTION_BANK.단타Lab.closes, // 옵션 뱅크 연결
];
const LAB_ASIDE = [
  `표면 재료보다 수급이 먼저라고 봅니다.`,
  `남들 다 아는 재료는 이미 늦은 경우가 많고요.`,
  `결국 차트가 답을 말해주겠죠.`,
];

const SCALP_HEAD = (mmdd: string, st: string) => [
  `[${mmdd}] ${st} 자리 체크`,
  `[${mmdd}] 시초 이후 ${st} 자리`,
  `[${mmdd}] 장중 ${st} 포착`,
];
const SCALP_CLOSE = [
  `시초가 어디서 잡힐까요?`, // 스캘퍼 시그니처(존댓말)
  `오후까지 받쳐줄까요?`,
  `시초 이어서 끌고 갈 수 있을까요?`,
  `이 자리, 단발로 끝일까요?`,
  `장중 어디서 받쳐줄까요?`,
  ...OPTION_BANK.스캘퍼.closes, // 옵션 뱅크 연결
];
const SCALP_ASIDE = [
  `단발이면 욕심 없이.`,
  `시초 못 받치면 바로 손 뗍니다.`,
  `거래대금 빠지면 끝.`,
];

/**
 * 트래픽 후킹형 픽 본문 — 첫 줄 호기심 갭("신호 떴는데 왜 안 사?") + 댓글 유발.
 * 가격은 항상 게이팅(Threads 트래픽용). 벤치 페르소나 톤 유지.
 */
function pickHookBody(persona: Persona, subj: string, strategy: string, note: string, mmdd: string, variant: number): string {
  const n = note ? ` ${note}.` : "";
  switch (persona) {
    case "단타시그널": {
      const O = [
        `세력 신호 떴는데 저는 아직 안 들어갔습니다.`,
        `${subj}, 신호는 떴는데 추격은 안 합니다.`,
        `다들 ${subj} 달려들 때, 저는 자리부터 봅니다.`,
        `${subj} 세력 포착 — 지금 추격은 위험합니다.`,
      ];
      const C = [`자리 확인하고도 안 늦습니다. 다들 어떻게 보세요?`, `지금 들어가실 건가요, 확인하고 가실 건가요?`, `여기서 추격, 하실 건가요?`];
      const { o, c } = decode(variant, O.length, C.length);
      return join([O[o], `- ${subj}, ${strategy} 포착.${n}`, `- 신호만 보고 추격? 그게 계좌 녹이는 길입니다.`, `- ${C[c]}`]);
    }
    case "단타이스트": {
      const O = [
        `오늘 가장 비싼 교훈 하나 — 신호와 자리는 다릅니다.`,
        `${subj}, 신호 떴다고 바로 들어가면 십중팔구 물립니다.`,
        `밑바닥서 배운 것 하나 — 신호는 시작일 뿐, 자리가 답입니다.`,
      ];
      const C = [`신호에 손이 나가셨나요, 참으셨나요?`, `여기서 추격이 맞을까요, 기다림이 맞을까요?`, `다들 이럴 때 어떻게 버티세요?`];
      const { o, c } = decode(variant, O.length, C.length);
      return join([O[o], `${subj}, ${strategy} 포착됐습니다.${n}`, `추격하는 사람과 기다리는 사람, 6개월 뒤 계좌가 갈리더라고요.`, "", C[c]]);
    }
    case "단타데일리": {
      const Q = [`"세력 신호 = 매수 신호"라고 생각하시나요?`, `신호가 뜨면 바로 들어가시는 편인가요?`, `세력 포착, 어디까지 믿고 가시나요?`];
      const { o } = decode(variant, Q.length, 1);
      return join([`[${mmdd}] 오늘의 질문 하나`, Q[o], `${subj} ${strategy} 포착.${n} 저는 자리 확인 전 추격은 보류합니다.`, `신호와 진입은 다릅니다. 여러분 기준은 어디까지인가요?`]);
    }
    case "단타Lab": {
      const O = [
        `세력 신호 떴다고 다들 달려들 때, 진짜는 멈춥니다.`,
        `${subj}, 신호 떴으니 사야 한다? 그게 함정일 수 있습니다.`,
        `다들 ${subj} 신호에 환호할 때, 저는 거래대금을 봅니다.`,
      ];
      const C = [`차트 뒤 진짜 판은 거래대금이 말해줍니다. 보고 계신가요?`, `진짜 자리는 신호가 아니라 수급이죠. 어디로 보세요?`, `이 신호, 진짜일까요 미끼일까요?`];
      const { o, c } = decode(variant, O.length, C.length);
      return join([O[o], `${subj} ${strategy} 포착.${n}`, `신호는 "여기 뭔가 있다"일 뿐, "지금 사라"가 아닙니다. 이 차이를 모르면 평생 꼭지만 잡죠.`, "", C[c]]);
    }
    case "스캘퍼": {
      const H = [`[${mmdd}] 신호 떴는데 손 멈춤`, `[${mmdd}] 세력 신호 — 근데 추격 X`, `[${mmdd}] 시초 신호 체크`];
      const C = [`다들 들어가셨나요?`, `시초가 어디서 잡힐까요?`, `여기서 추격하실 건가요?`];
      const { o, c } = decode(variant, H.length, C.length);
      return join([H[o], `🔻 ${subj} — ${strategy} 포착.${n}`, `📍 신호만 보고 추격? 안 합니다. 자리 확인이 먼저.`, C[c]]);
    }
    default:
      return `${subj}, ${strategy} 포착. 신호와 자리는 다릅니다.`;
  }
}

export function pickCaptionByPersona(
  pick: PickInput,
  persona: Persona,
  mmdd: string,
  variant = 0,
  withDisc = false,
  withPrices = false, // ★ 기본 게이팅 — Threads엔 정확한 가(포착·목표·손절) 안 넣음. 유료 텔레그램용일 때만 true.
  hookMode = false, // ★ 트래픽 후킹형(첫 줄 호기심+댓글 유발). 가격은 항상 게이팅.
): string {
  const name = pick.stockName.trim() || "해당 종목";
  const code = pick.ticker.trim();
  const subj = code ? `${name} ${code}` : name;
  const strategy = pick.strategy.trim() || "단타";
  const entry = pick.entry.trim();
  const stop = pick.stop.trim();
  const note = pick.note.trim();

  // ★ 트래픽 후킹형 — 첫 줄 호기심 갭 + 댓글 유발(가격 항상 게이팅).
  if (hookMode && persona !== "단타Pick") {
    const hb = pickHookBody(persona, subj, strategy, note, mmdd, variant);
    return [hb, at(QUESTIONS, variant), IDENTITY[persona] || CTA, DISCLAIMER]
      .filter(Boolean)
      .join("\n");
  }

  // 가격 라인은 withPrices일 때만. 게이팅(기본) 땐 빈 문자열 → 가격 줄이 자동으로 빠진다.
  const tline = withPrices ? targetsLine(pick.targets) : "";
  const entryStop = withPrices ? [entry ? `포착 ${entry}` : "", stop ? `손절 ${stop}` : ""].filter(Boolean).join(" / ") : "";
  const fullPrice = withPrices ? [entry ? `포착 ${entry}` : "", tline, stop ? `손절 ${stop}` : ""].filter(Boolean).join(" / ") : "";

  let body: string;
  switch (persona) {
    case "단타시그널": {
      const opens = SIGNAL_OPEN(subj, strategy);
      const { o, c, lm } = decode(variant, opens.length, SIGNAL_CLOSE.length);
      body = join([
        opens[o],
        note ? `- ${note}.` : "", // 차트 근거(게이팅 본문의 핵심 substance)
        entryStop ? `- ${entryStop}.` : "",
        lm >= 2 ? at(SIGNAL_EXTRA, variant) : "",
        SIGNAL_CLOSE[c],
      ]);
      break;
    }
    case "단타이스트": {
      const opens = EAST_OPEN(subj, strategy);
      const { o, c, lm } = decode(variant, opens.length, EAST_CLOSE.length);
      body = join([
        opens[o],
        note ? `${note}.` : "",
        "",
        fullPrice ? `${fullPrice}.` : "",
        "",
        at(EAST_MID(stop ? bareStop(stop) : "자리"), variant),
        lm >= 2 ? at(EAST_ASIDE, variant) : "",
        "",
        EAST_CLOSE[c],
      ]);
      break;
    }
    case "단타데일리": {
      const heads = DAILY_HEAD(mmdd);
      const { o, c, lm } = decode(variant, heads.length, DAILY_CLOSE.length);
      body = join([
        heads[o],
        note ? `${note}.` : "오늘 짚어볼 단타 자리입니다.",
        `1. ${subj}, ${strategy} 포착.`,
        `2. ${entryStop || (withPrices ? "기준가 확인" : "포착가 근처 거래 유지 여부 확인")}.`,
        lm >= 1 && tline ? `3. 목표 ${tline}.` : "",
        lm >= 2 ? at(DAILY_ASIDE, variant) : "",
        DAILY_CLOSE[c],
      ]);
      break;
    }
    case "단타Lab": {
      const opens = LAB_OPEN(subj);
      const { o, c, lm } = decode(variant, opens.length, LAB_CLOSE.length);
      body = join([
        opens[o],
        `1. 표면: 그냥 오른 자리로 보이는 흐름.`,
        note ? `2. 진짜: ${note}.` : `2. 진짜: 수급·테마가 받치는 자리.`,
        lm >= 1 ? `3. ${strategy} 기준이 지켜지는 게 핵심.` : "",
        "",
        fullPrice ? `${fullPrice}.` : "",
        lm >= 2 ? at(LAB_ASIDE, variant) : "",
        "",
        LAB_CLOSE[c],
      ]);
      break;
    }
    case "스캘퍼": {
      const heads = SCALP_HEAD(mmdd, strategy);
      const { o, c, lm } = decode(variant, heads.length, SCALP_CLOSE.length);
      const tpo = targetsPriceOnly(pick.targets);
      body = join([
        heads[o],
        `🔻 이슈`,
        note ? `${subj} — ${note}.` : `${subj} 자리 포착.`,
        `📍 자리`,
        (withPrices
          ? [entryStop, lm >= 1 && tpo ? `목표 ${tpo}` : ""].filter(Boolean).join(" / ")
          : "추격 X, 포착가 근처 거래 붙는지만 단발") + ".",
        lm >= 2 ? at(SCALP_ASIDE, variant) : `기준 유지 여부가 단발 포인트.`,
        SCALP_CLOSE[c],
      ]);
      break;
    }
    case "단타Pick":
      body = join([
        `${subj} 봤습니다.`,
        note ? `${note}.` : "",
        fullPrice ? `${fullPrice}.` : "추격보다 포착가 근처 거래 붙는지부터 봅니다.",
        `오늘 자리 잘 잡혔으면 좋겠습니다.`,
      ]);
      break;
  }

  return [body, at(QUESTIONS, variant), IDENTITY[persona] || CTA, DISCLAIMER]
    .filter(Boolean)
    .join("\n");
}
