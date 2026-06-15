/**
 * 픽 → Threads 본문(페르소나별) 자동 생성.
 * 운영자가 /ops 화면에서 종목·포착가·목표가·근거를 입력하면 5계정 톤으로 복붙 본문을 만든다.
 * 규칙 기반(AI 비용 0). 뉴스 캡션(threads-caption.ts)과 달리 "오늘의 픽"용 — 가격(포착/목표/손절) 포함.
 *
 * 🔄 회전: variant 값을 바꾸면 페르소나별 첫 줄·마무리가 변형 풀에서 다르게 뽑힌다(봇 티 방지).
 */
import type { Persona } from "./threads-caption";
import { PERSONAS } from "./threads-caption";

export { PERSONAS };
export type { Persona };

export interface PickInput {
  /** 종목명 (예: 한온시스템) */
  stockName: string;
  /** 6자리 코드 (예: 018880) */
  ticker: string;
  /** 전략·포착 메모 (예: "종일용 · 09:08 포착") */
  strategy: string;
  /** 포착가 (예: "5,230") */
  entry: string;
  /** 손절 (예: "5,070 (-3.1%)") */
  stop: string;
  /** 목표 줄들 (예: ["1차 5,280 (+1.0%)", "2차 5,360 (+2.5%)"]) */
  targets: string[];
  /** 근거 한두 줄 (예: "일봉 +11.7%로 5·20일선 위, 분봉 VWAP(5,217) 위 유지") */
  note: string;
}

const DISCLAIMER =
  "※ 매수·매도 추천 아님 · 시장 관찰용 정보 · 투자 판단과 책임은 본인에게";

/** variant 인덱스로 풀에서 하나 뽑기(순환·음수 안전) */
function at<T>(arr: T[], v: number): T {
  return arr[((v % arr.length) + arr.length) % arr.length];
}

/** "5,070 (-3.1%)" → "5,070" (괄호 % 떼고 순수 가격만) */
function bareStop(stop: string): string {
  return stop.replace(/\s*\(.*?\)\s*/g, "").trim() || stop.trim();
}

/** 목표 줄들 → "1차 5,280(+1.0%) · 2차 5,360(+2.5%)" 한 줄 */
function targetsLine(targets: string[]): string {
  return targets.map((t) => t.trim()).filter(Boolean).join(" · ");
}

/** 목표 줄들 → 가격만 "5,280 · 5,360 · 5,460" (스캘퍼 단발용) */
function targetsPriceOnly(targets: string[]): string {
  return targets
    .map((t) => {
      const m = t.match(/[\d,]+/);
      return m ? m[0] : "";
    })
    .filter(Boolean)
    .join(" · ");
}

/* ───────── 페르소나별 변형 풀 (회전) ───────── */

const SIGNAL_OPEN = (subj: string, strategy: string) => [
  `${subj}, ${strategy} 자리 포착.`,
  `${subj}, 장중 ${strategy} 신호 들어왔습니다.`,
  `${subj} 봅니다. ${strategy} 자리.`,
  `${subj} — ${strategy} 자리 잡혔습니다.`,
  `${subj}, 오늘 ${strategy} 흐름 체크.`,
];
const SIGNAL_CLOSE = [
  `- 거래대금·기준 지켜지는지가 관건. 본인 기준 맞으면 관심.`,
  `- 기준 깨지면 흐름 종료. 본인 자리에 맞으면 관심.`,
  `- 무리한 추격보다 기준 유지부터. 본인 판단으로.`,
  `- 거래대금 실리는지 보고. 맞는 분만 관심.`,
  `- 자리 지키는지가 전부. 본인 기준대로.`,
];

const EAST_MID = (bs: string) => [
  `급하게 쫓기보다 ${bs} 안 깨지는지 먼저 보는 게 순서라고 봅니다.`,
  `자리는 기다리는 사람에게 옵니다. ${bs} 지켜지는지부터요.`,
  `남들 달려갈 때 ${bs} 라인부터 확인하는 게 먼저죠.`,
  `욕심보다 기준입니다. ${bs} 깨지면 미련 없이요.`,
  `한 박자 늦더라도 ${bs} 지켜지는 걸 보고 가려 합니다.`,
];
const EAST_CLOSE = [
  `오후까지 거래대금 받쳐줄까요?`,
  `이 자리, 끝까지 끌고 갈 수 있을까요?`,
  `수급이 진짜 받쳐주는 자리일까요?`,
  `결국 기준 지키는 쪽이 남지 않을까요?`,
  `장 막판까지 흐름 이어질까요?`,
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

const LAB_OPEN = (subj: string) => [
  `${subj}, 단순 반등일까요? 안을 보면 다릅니다.`,
  `${subj}, 그냥 오른 걸까요? 들여다보면 다릅니다.`,
  `${subj}, 표면만 보면 놓치는 자리입니다.`,
  `${subj}, 왜 하필 지금 움직일까요?`,
];
const LAB_CLOSE = [
  `흐름으로만 넘겨도 될까요?`,
  `표면만 보고 지나쳐도 될까요?`,
  `진짜 자리는 어디일까요?`,
  `차트 뒤 흐름, 보고 계신가요?`,
];

const SCALP_CLOSE = [
  `오후까지 받쳐줄까?`,
  `시초 이어서 끌고 갈까?`,
  `이 자리 단발로 끝일까?`,
  `장중 어디서 받쳐주나?`,
];

export function pickCaptionByPersona(
  pick: PickInput,
  persona: Persona,
  mmdd: string,
  variant = 0,
): string {
  const name = pick.stockName.trim() || "해당 종목";
  const code = pick.ticker.trim();
  const subj = code ? `${name} ${code}` : name;
  const strategy = pick.strategy.trim() || "단타";
  const entry = pick.entry.trim();
  const stop = pick.stop.trim();
  const note = pick.note.trim();
  const tline = targetsLine(pick.targets);

  const entryStop = [entry ? `포착 ${entry}` : "", stop ? `손절 ${stop}` : ""]
    .filter(Boolean)
    .join(" / ");
  const fullPrice = [entry ? `포착 ${entry}` : "", tline, stop ? `손절 ${stop}` : ""]
    .filter(Boolean)
    .join(" / ");

  const dropDoubleBlank = (lines: string[]) =>
    lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

  let body: string;
  switch (persona) {
    case "단타시그널":
      body = [
        at(SIGNAL_OPEN(subj, strategy), variant),
        note ? `- ${note}.` : "",
        entryStop ? `- ${entryStop}.` : "",
        at(SIGNAL_CLOSE, variant),
      ]
        .filter(Boolean)
        .join("\n");
      break;

    case "단타이스트":
      body = dropDoubleBlank([
        `${subj}, ${strategy} 자리가 눈에 들어옵니다.`,
        note ? `${note}.` : "",
        "",
        fullPrice ? `${fullPrice}.` : "",
        "",
        at(EAST_MID(stop ? bareStop(stop) : "자리"), variant),
        "",
        at(EAST_CLOSE, variant),
      ]);
      break;

    case "단타데일리":
      body = [
        at(DAILY_HEAD(mmdd), variant),
        note ? `${note}.` : "오늘 짚어볼 단타 자리입니다.",
        `1. ${subj}, ${strategy} 포착.`,
        `2. ${entryStop || "기준가 확인"}.`,
        tline ? `3. 목표 ${tline}.` : "",
        at(DAILY_CLOSE, variant),
      ]
        .filter(Boolean)
        .join("\n");
      break;

    case "단타Lab":
      body = dropDoubleBlank([
        at(LAB_OPEN(subj), variant),
        `1. 표면: 그냥 오른 자리로 보이는 흐름.`,
        note ? `2. 진짜: ${note}.` : `2. 진짜: 수급·테마가 받치는 자리.`,
        `3. ${strategy} 기준이 지켜지는 게 핵심.`,
        "",
        fullPrice ? `${fullPrice}.` : "",
        "",
        at(LAB_CLOSE, variant),
      ]);
      break;

    case "스캘퍼": {
      const tpo = targetsPriceOnly(pick.targets);
      body = [
        `[${mmdd}] ${strategy} 자리 체크`,
        `🔻 이슈`,
        note ? `${subj} — ${note}.` : `${subj} 자리 포착.`,
        `📍 자리`,
        [entryStop, tpo ? `목표 ${tpo}` : ""].filter(Boolean).join(" / ") + ".",
        `기준 유지 여부가 단발 포인트. 깨지면 흐름 종료.`,
        at(SCALP_CLOSE, variant),
      ]
        .filter(Boolean)
        .join("\n");
      break;
    }

    case "단타Pick":
      body = `${subj} 봤습니다.\n${note}.\n${fullPrice}.\n오늘 자리 잘 잡혔으면 좋겠습니다.`;
      break;
  }

  return `${body}\n\n${DISCLAIMER}`;
}
