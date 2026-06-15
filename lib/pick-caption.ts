/**
 * 픽 → Threads 본문(페르소나별) 자동 생성.
 * 운영자가 /ops 화면에서 종목·포착가·목표가·근거를 입력하면 5계정 톤으로 복붙 본문을 만든다.
 * 규칙 기반(AI 비용 0). 뉴스 캡션(threads-caption.ts)과 달리 "오늘의 픽"용 — 가격(포착/목표/손절) 포함.
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

/** "5,070 (-3.1%)" → "5,070" (괄호 % 떼고 순수 가격만) */
function bareStop(stop: string): string {
  return stop.replace(/\s*\(.*?\)\s*/g, "").trim() || stop.trim();
}

/** 목표 줄들 → "1차 5,280(+1.0%) · 2차 5,360(+2.5%)" 한 줄 */
function targetsLine(targets: string[]): string {
  return targets
    .map((t) => t.trim())
    .filter(Boolean)
    .join(" · ");
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

export function pickCaptionByPersona(
  pick: PickInput,
  persona: Persona,
  mmdd: string,
): string {
  const name = pick.stockName.trim() || "해당 종목";
  const code = pick.ticker.trim();
  const subj = code ? `${name} ${code}` : name;
  const strategy = pick.strategy.trim() || "단타";
  const entry = pick.entry.trim();
  const stop = pick.stop.trim();
  const note = pick.note.trim();
  const tline = targetsLine(pick.targets);

  // 가격 조각 (값 있을 때만)
  const entryStop = [
    entry ? `포착 ${entry}` : "",
    stop ? `손절 ${stop}` : "",
  ]
    .filter(Boolean)
    .join(" / ");
  const fullPrice = [
    entry ? `포착 ${entry}` : "",
    tline,
    stop ? `손절 ${stop}` : "",
  ]
    .filter(Boolean)
    .join(" / ");

  let body: string;
  switch (persona) {
    case "단타시그널":
      // s_trader91 미니멀 — 포착·손절만, 목표 줄줄이 나열 X
      body = [
        `${subj}, ${strategy} 자리 포착.`,
        note ? `- ${note}.` : "",
        entryStop ? `- ${entryStop}.` : "",
        `- 거래대금·기준 지켜지는지가 관건. 본인 기준 맞으면 관심.`,
      ]
        .filter(Boolean)
        .join("\n");
      break;

    case "단타이스트":
      body = [
        `${subj}, ${strategy} 자리가 눈에 들어옵니다.`,
        note ? `${note}.` : "",
        "",
        fullPrice ? `${fullPrice}.` : "",
        "",
        stop
          ? `급하게 쫓기보다 ${bareStop(stop)} 안 깨지는지 먼저 보는 게 순서라고 봅니다.`
          : `급하게 쫓기보다 자리가 지켜지는지 먼저 보는 게 순서라고 봅니다.`,
        "",
        `오후까지 거래대금 받쳐줄까요?`,
      ]
        .filter((l, i, a) => !(l === "" && a[i - 1] === "")) // 빈 줄 중복 방지
        .join("\n");
      break;

    case "단타데일리":
      body = [
        `[${mmdd}] 오늘 짚어볼 자리`,
        note ? `${note}.` : "오늘 짚어볼 단타 자리입니다.",
        `1. ${subj}, ${strategy} 포착.`,
        `2. ${entryStop || "기준가 확인"}.`,
        tline ? `3. 목표 ${tline}.` : "",
        `추격보다 기준 유지 여부 확인. 결정은 본인의 몫.`,
      ]
        .filter(Boolean)
        .join("\n");
      break;

    case "단타Lab":
      body = [
        `${subj}, 단순 반등일까요? 안을 보면 다릅니다.`,
        `1. 표면: 그냥 오른 자리로 보이는 흐름.`,
        note ? `2. 진짜: ${note}.` : `2. 진짜: 수급·테마가 받치는 자리.`,
        `3. ${strategy} 기준이 지켜지는 게 핵심.`,
        "",
        fullPrice ? `${fullPrice}.` : "",
        "",
        `흐름으로만 넘겨도 될까요?`,
      ]
        .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
        .join("\n");
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
        `오후까지 받쳐줄까?`,
      ]
        .filter(Boolean)
        .join("\n");
      break;
    }

    // 단타Pick은 정지(PERSONAS에서 제외)지만 타입상 분기 필요
    case "단타Pick":
      body = `${subj} 봤습니다.\n${note}.\n${fullPrice}.\n오늘 자리 잘 잡혔으면 좋겠습니다.`;
      break;
  }

  return `${body}\n\n${DISCLAIMER}`;
}
