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
  "※ 매수·매도 추천 아님 · 시장 관찰용 정보 · 투자 판단과 책임은 본인에게";

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
  `${s}, ${st} 자리 포착.`,
  `${s}, 장중 ${st} 신호.`,
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
  `시초가 어디냐?`, // 스캘퍼 시그니처
  `오후까지 받쳐줄까?`,
  `시초 이어서 끌고 갈까?`,
  `이 자리 단발로 끝일까?`,
  `장중 어디서 받쳐주나?`,
];
const SCALP_ASIDE = [
  `단발이면 욕심 없이.`,
  `시초 못 받치면 바로 손 뗍니다.`,
  `거래대금 빠지면 끝.`,
];

export function pickCaptionByPersona(
  pick: PickInput,
  persona: Persona,
  mmdd: string,
  variant = 0,
  withDisc = false,
): string {
  const name = pick.stockName.trim() || "해당 종목";
  const code = pick.ticker.trim();
  const subj = code ? `${name} ${code}` : name;
  const strategy = pick.strategy.trim() || "단타";
  const entry = pick.entry.trim();
  const stop = pick.stop.trim();
  const note = pick.note.trim();
  const tline = targetsLine(pick.targets);

  const entryStop = [entry ? `포착 ${entry}` : "", stop ? `손절 ${stop}` : ""].filter(Boolean).join(" / ");
  const fullPrice = [entry ? `포착 ${entry}` : "", tline, stop ? `손절 ${stop}` : ""].filter(Boolean).join(" / ");

  let body: string;
  switch (persona) {
    case "단타시그널": {
      const opens = SIGNAL_OPEN(subj, strategy);
      const { o, c, lm } = decode(variant, opens.length, SIGNAL_CLOSE.length);
      body = join([
        opens[o],
        lm >= 1 && note ? `- ${note}.` : "",
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
        `2. ${entryStop || "기준가 확인"}.`,
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
        [entryStop, lm >= 1 && tpo ? `목표 ${tpo}` : ""].filter(Boolean).join(" / ") + ".",
        lm >= 2 ? at(SCALP_ASIDE, variant) : `기준 유지 여부가 단발 포인트.`,
        SCALP_CLOSE[c],
      ]);
      break;
    }
    case "단타Pick":
      body = `${subj} 봤습니다.\n${note}.\n${fullPrice}.\n오늘 자리 잘 잡혔으면 좋겠습니다.`;
      break;
  }

  return withDisc ? `${body}\n\n${DISCLAIMER}` : body;
}
