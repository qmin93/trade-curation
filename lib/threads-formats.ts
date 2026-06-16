/**
 * Threads 콘텐츠 포맷 생성기 — 운영자 콘솔(/ops)의 "복붙 스튜디오"용.
 * 뉴스 외 트래픽 포맷(질문형 떡밥·격언카드·타래 심화·일상/매매일지·결과 인증·뉴스)을
 * 페르소나 톤 유지 + 변주 + 면책 + (선택)텔레그램 CTA로 생성한다. 규칙 기반(AI 0).
 *
 * 근거(리서치): 답글>좋아요(질문형) · 저장 유발(격언·카드) · 체류시간(타래) · 휴먼화(일지)
 * · 결과 인증은 금감원 사기 프레임 회피 위해 "손실 공개+권유 아님" 강제.
 */
import type { Persona } from "./threads-caption";
import { NEWS_TEMPLATES } from "./persona-templates";

const DISC = "※ 시장 관찰용 정보 · 매수·매도 추천 아님 · 판단과 책임은 본인에게";
const CTA_POOL = [
  "실시간 자리는 텔레그램에 먼저 올립니다 👇",
  "빠른 알림은 텔레그램 무료 채널에서 →",
  "오늘 같은 자리, 텔레그램에 먼저 공유합니다 👇",
  "장중 급변동은 텔레그램이 빠릅니다 →",
];

export type FormatId = "question" | "quote" | "thread" | "journal" | "proof" | "news";

export interface FormatMeta {
  id: FormatId;
  label: string;
  desc: string;
  fields: { key: "subj" | "noteA" | "noteB"; label: string; placeholder: string; area?: boolean }[];
  personas: Persona[];
}

export const FORMATS: FormatMeta[] = [
  {
    id: "question",
    label: "질문형 떡밥",
    desc: "답글 유도 = 알고리즘 최강 지렛대. 첫 줄로 댓글을 부른다.",
    fields: [
      { key: "subj", label: "종목·주제", placeholder: "예) 한미반도체 / HBM" },
      { key: "noteA", label: "관찰 포인트(선택)", placeholder: "예) VWAP 위 유지 중" },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
  {
    id: "quote",
    label: "격언·원칙 카드",
    desc: "저장 유발·장기 도달. 뉴스 신선도 약점 보완.",
    fields: [
      { key: "noteA", label: "원칙·격언(비우면 자동)", placeholder: "예) 손절은 다음 매매의 입장료" },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
  {
    id: "thread",
    label: "타래 심화",
    desc: "체류시간·답글. '왜 터지나' 구조 분석(badakstock식).",
    fields: [
      { key: "subj", label: "테마·종목", placeholder: "예) 데이터센터 전력" },
      { key: "noteA", label: "연쇄 포인트(쉼표/줄바꿈으로 구분)", placeholder: "전력 수급 위기, ESS 수혜, 두산에너빌·효성중공업", area: true },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
  {
    id: "journal",
    label: "일상·매매일지",
    desc: "휴먼화·캐릭터 빌딩. 정직 톤이 신뢰를 쌓는다.",
    fields: [
      { key: "noteA", label: "오늘 있었던 일·감정", placeholder: "예) 오전에 익절하고 오후엔 관망. 손이 근질거렸다", area: true },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
  {
    id: "proof",
    label: "결과 인증",
    desc: "신뢰·팔로우 최강. ⚠️ 손실 공개+권유 아님 강제(사기 프레임 회피).",
    fields: [
      { key: "subj", label: "종목", placeholder: "예) 예스티" },
      { key: "noteA", label: "어제 짚은 자리", placeholder: "예) 종일용 5·20일선 위 포착" },
      { key: "noteB", label: "결과", placeholder: "예) 1차 +1.4% 도달 / 또는 손절 이탈" },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
  {
    id: "news",
    label: "뉴스 본문",
    desc: "기존 뉴스 → 페르소나 본문. 첫 줄 질문형으로 답글까지.",
    fields: [
      { key: "subj", label: "종목", placeholder: "예) 삼성전자" },
      { key: "noteA", label: "헤드라인·핵심 사실", placeholder: "예) 구글 차세대 TPU 2나노 위탁", area: true },
    ],
    personas: ["단타시그널", "단타이스트", "단타데일리", "단타Lab", "스캘퍼"],
  },
];

/* 자동 격언 풀(입력 비울 때) */
const PRINCIPLES = [
  "손절은 손해가 아니라 다음 매매의 입장료입니다.",
  "자리는 기다리는 사람에게 옵니다. 쫓는 사람에겐 안 오고요.",
  "오를 종목을 맞히는 것보다, 틀렸을 때 빨리 인정하는 게 실력입니다.",
  "거래대금이 빠지는 자리는, 아무리 좋아 보여도 일단 보류입니다.",
  "확신이 들 때가 가장 위험합니다. 기준은 그때도 그대로여야 하고요.",
  "큰 수익은 자주 오지 않습니다. 큰 손실은 한 번에 옵니다.",
];

function at<T>(a: T[], v: number): T {
  return a[((v % a.length) + a.length) % a.length];
}
/** variant 정수를 (첫줄·마무리·길이모드) 독립 선택으로 분해 → 매번 다른 조합 */
function dec(v: number, no: number, nc: number) {
  const x = Math.abs(v);
  return { o: x % no, c: Math.floor(x / no) % nc, lm: Math.floor(x / (no * nc)) % 2 };
}
function joinLines(lines: string[]): string {
  return lines.filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== "")).join("\n");
}
function points(raw: string): string[] {
  return raw.split(/[,\n·]/).map((s) => s.trim()).filter(Boolean);
}
function mmddOf(s: string) {
  return s;
}

export function generateFormatPost(
  id: FormatId,
  input: { subj?: string; noteA?: string; noteB?: string },
  persona: Persona,
  mmdd: string,
  variant: number,
  withCTA: boolean,
): string {
  const subj = (input.subj || "이 종목").trim();
  const a = (input.noteA || "").trim();
  const b = (input.noteB || "").trim();
  mmddOf(mmdd);

  let body = "";

  if (id === "question") {
    // 질문형 = 첫 줄부터 질문(답글 유도). 사실은 보조.
    const ctx = a;
    switch (persona) {
      case "단타시그널": {
        const O = [`${subj}, 지금 들어간 사람 있어요?`, `${subj}, 이 자리 어떻게 보세요?`, `${subj}, 자리일까요 꼭지일까요?`, `${subj} 보는 중 — 갈까요 빠질까요?`, `${subj}, 지금 담아도 될 자리일까요?`];
        const C = [`댓글로 방향 한 번 찍어봅시다.`, `다들 어느 쪽 보세요?`, `솔직한 의견 궁금합니다.`, `각자 기준 댓글로 ㄱ.`];
        const { o, c, lm } = dec(variant, O.length, C.length);
        body = joinLines([O[o], lm && ctx ? `- ${ctx}.` : "", C[c]]);
        break;
      }
      case "단타이스트": {
        const O = [`${subj}, 이런 자리 다들 어떻게 대응하세요?`, `${subj}, 지금 들어가는 건 용기일까요 욕심일까요?`, `${subj} 보면서 드는 생각인데요.`, `${subj}, 쫓는 게 맞을까요 기다리는 게 맞을까요?`];
        const M = [`${ctx ? ctx + " " : ""}쫓을지 기다릴지, 결국 그 차이가 수익을 가르더라고요.`, `${ctx ? ctx + " " : ""}자리를 기다리는 게 더 어려운 일이죠.`, `${ctx ? ctx + " " : ""}조급함이 결국 손실로 돌아오더라고요.`];
        const C = [`여러분은 어느 쪽이세요?`, `결국 그 한 끗 차이 아닐까요?`, `오늘은 어떻게 보고 계세요?`, `이럴 때 다들 어떻게 버티세요?`];
        const { o, c, lm } = dec(variant, O.length, C.length);
        body = joinLines([O[o], lm ? at(M, variant) : (ctx ? `${ctx}.` : ""), "", C[c]]);
        break;
      }
      case "단타데일리": {
        const H = [`[${mmdd}] 오늘의 질문`, `[${mmdd}] 같이 생각해볼 거리`, `[${mmdd}] 댓글로 의견 모아요`];
        const Q = [`${subj}, 갭상 vs 갭하 — 어느 쪽 보세요?`, `${subj}, 오늘 더 갈까요 쉬어갈까요?`, `${subj}, 주도주로 남을까요 하루짜리일까요?`];
        const C = [`근거도 댓글로 같이 적어주시면 좋고요.`, `여러분 생각이 궁금합니다.`, `판단은 각자, 의견은 댓글로.`];
        const { o, c } = dec(variant, H.length, C.length);
        body = joinLines([H[o], at(Q, variant), ctx ? `${ctx}.` : "", C[c]]);
        break;
      }
      case "단타Lab": {
        const O = [`${subj}, 다들 좋게만 보는데 — 진짜 그럴까요?`, `${subj}, 왜 하필 지금 움직일까요?`, `${subj}, 재료 때문일까요 수급 때문일까요?`, `${subj}, 표면만 보고 판단해도 될까요?`];
        const M = [`${ctx ? ctx + " " : ""}표면 말고 수급으로 보면 다른 그림이 보입니다.`, `${ctx ? ctx + " " : ""}진짜 이유는 차트 뒤에 있고요.`, `${ctx ? ctx + " " : ""}남들 다 아는 재료는 이미 늦은 경우가 많죠.`];
        const C = [`여러분은 어디를 보고 계세요?`, `차트 뒤 흐름, 같이 보실래요?`, `진짜 자리는 어디일까요?`];
        const { o, c, lm } = dec(variant, O.length, C.length);
        body = joinLines([O[o], lm ? at(M, variant) : "", "", C[c]]);
        break;
      }
      case "스캘퍼": {
        const O = [`[${mmdd}] 시초 질문`, `[${mmdd}] 단발 체크`, `[${mmdd}] 시초가 베팅`];
        const Q = [`${subj} 시초가 어디서 잡힐까?`, `${subj}, 시초 받쳐줄까?`, `${subj} 갭 띄울까 눌릴까?`];
        const C = [`댓글로 한 번 찍어봅시다.`, `시초가 어디냐?`, `각자 시초 예상 ㄱ.`];
        const { o, c } = dec(variant, O.length, C.length);
        body = joinLines([O[o], at(Q, variant), ctx ? `${ctx}.` : "", C[c]]);
        break;
      }
      default:
        body = `${subj}, 어떻게 보세요?`;
    }
  } else if (id === "quote") {
    const p = a || at(PRINCIPLES, variant);
    switch (persona) {
      case "단타이스트":
        body = `"${p}"\n\n오늘 같은 변동장일수록 더 와닿는 말이고요.\n여러분은 어떻게 생각하세요?`;
        break;
      case "단타Lab":
        body = `"${p}"\n\n다들 아는 말 같지만, 막상 장중엔 제일 먼저 잊는 원칙이죠.\n진짜 지키고 계신가요?`;
        break;
      case "단타데일리":
        body = `[${mmdd}] 오늘 새길 원칙\n"${p}"\n급할수록 기준으로 돌아가는 게 답이라고 봅니다.`;
        break;
      case "단타시그널":
        body = `"${p}"\n- 장중엔 이거 하나 지키는 게 전부.\n다들 지키고 계세요?`;
        break;
      case "스캘퍼":
        body = `[${mmdd}] 한 줄 원칙\n"${p}"\n시초부터 이거 안 지키면 다 무너집니다.`;
        break;
      default:
        body = `"${p}"`;
    }
  } else if (id === "thread") {
    const pts = points(a);
    const numbered = pts.length
      ? pts.map((pt, i) => `${i + 1}. ${pt}`).join("\n")
      : "1. 표면: 단순 테마로 보이는 흐름.\n2. 진짜: 수급·구조가 받치는 자리.\n3. 핵심: 기준이 지켜지는지.";
    if (persona === "단타Lab") {
      body = at([
        `${subj}, 단순 테마일까요? 구조를 보면 다릅니다.\n${numbered}\n결국 돈은 구조를 따라 흐릅니다.\n진짜 자리는 어디일까요?`,
        `${subj}, 왜 여기서 터질까요? 안을 풀어보면 —\n${numbered}\n표면 재료보다 이 연쇄가 핵심이고요.\n차트 뒤 진짜 판은 어디일까요?`,
      ], variant);
    } else if (persona === "단타이스트") {
      body = `${subj}, 단순 테마로 보이세요? 한 겹 더 들어가 보면 —\n${numbered}\n결국 돈은 구조를 따라갑니다. 어떻게 보세요?`;
    } else if (persona === "단타시그널") {
      body = `${subj}, 왜 강한지 짧게.\n${numbered}\n- 결국 이 흐름 유지되는지가 전부.`;
    } else if (persona === "스캘퍼") {
      body = `[${mmdd}] ${subj} 단발 구조\n${numbered}\n시초가 어디서 받쳐주나?`;
    } else {
      body = `[${mmdd}] ${subj} 구조 정리\n${numbered}\n추격보다 이 흐름이 유지되는지 확인. 결정은 본인의 몫.`;
    }
  } else if (id === "journal") {
    const note = a || "오늘은 자리 안 줘서 거의 관망만 했네요.";
    switch (persona) {
      case "단타이스트":
        body = at([
          `${note}\n\n돌아보면 안 들어간 날이 수익 지킨 날일 때가 많더라고요.\n다들 오늘 어떠셨어요?`,
          `${note}\n\n매매보다 기다림이 더 어려운 하루였습니다.\n여러분은 오늘 어땠나요?`,
        ], variant);
        break;
      case "단타데일리":
        body = `[${mmdd}] 오늘의 기록\n${note}\n내일은 좀 더 차분하게 가보려 합니다. 다들 고생하셨어요.`;
        break;
      case "단타시그널":
        body = `${note}\n- 무리한 날은 쉬는 것도 매매.\n다들 오늘 어땠어요?`;
        break;
      case "단타Lab":
        body = `${note}\n\n복기해보면 결국 수급 보는 눈이 매매를 가르더라고요.\n다들 오늘 복기 하셨어요?`;
        break;
      case "스캘퍼":
        body = `[${mmdd}] 장중 기록\n🔻 ${note}\n📍 무리한 단발은 줄이고. 내일 시초 다시.`;
        break;
      default:
        body = note;
    }
  } else if (id === "proof") {
    const res = b || "기준대로 대응";
    const isLoss = /손절|이탈|실패|마이너스|-/.test(b);
    switch (persona) {
      case "단타시그널":
        body = `어제 짚은 ${subj} 자리(${a || "관찰 포인트"}), 오늘 ${res}.\n- ${isLoss ? "기준 이탈해서 정리. 손실도 그대로 공개합니다." : "기준 지켜져서 흐름 이어짐."}\n- 맞을 때도 틀릴 때도 있고, 기준만 지킵니다.`;
        break;
      case "단타이스트":
        body = `어제 ${subj}, ${a || "자리"} 짚었었죠.\n오늘 ${res}.\n${isLoss ? "틀린 날은 틀렸다고 적는 게 맞다고 봅니다." : "맞은 날도 자만은 금물이고요."} 결국 기준 지키는 사람이 남습니다.`;
        break;
      case "단타데일리":
        body = `[${mmdd}] 결과 기록\n${subj} — 어제 ${a || "자리"} → 오늘 ${res}.\n적중도 손절도 전부 남깁니다. 숨길 이유가 없으니까요.`;
        break;
      case "단타Lab":
        body = `${subj}, 어제 단순 반등 아니라고 했었죠(${a || "자리"}). 오늘 ${res}.\n${isLoss ? "틀렸으면 틀렸다고 인정합니다." : "표면 재료가 아니라 수급이 받친 자리였고요."}\n적중도 손절도 다 남깁니다.`;
        break;
      case "스캘퍼":
        body = `[${mmdd}] 결과\n🔻 ${subj} — 어제 ${a || "자리"}.\n📍 오늘 ${res}.\n적중도 손절도 다 남깁니다.`;
        break;
      default:
        body = `${subj}: ${res}`;
    }
    body += `\n\n※ 손실도 함께 공개 · 수익 보장 아님 · 종목 추천 아님`;
  } else if (id === "news") {
    // 뉴스 본문 = 사실(재료)부터. voice-builder 프로필 기반 대량 템플릿 풀(계정당 18개)을 variant로 회전.
    const fact = a || "오늘 나온 재료";
    const tpl = NEWS_TEMPLATES[persona];
    if (tpl && tpl.length) {
      body = at(tpl, variant)
        .split("{subj}").join(subj)
        .split("{fact}").join(fact)
        .split("{mmdd}").join(mmdd);
    } else
    switch (persona) {
      case "단타시그널": {
        const O = [`${subj}, ${fact}.`, `${subj} — ${fact}.`, `${subj}, ${fact} 나왔습니다.`];
        const B = [`- 시초가·거래대금부터 확인할 자리.`, `- 모멘텀 이어질지가 관건.`, `- 추격보다 눌림 한 번 보고.`, `- 갭 띄우면 일단 거래대금 체크.`];
        const C = [`다음 거래일 이어질까요?`, `흐름 어떻게 보세요?`, `자리 지킬지가 관건이고요.`];
        const { o, c, lm } = dec(variant, O.length, C.length);
        body = joinLines([O[o], at(B, variant), lm ? at(B, variant + 1) : "", C[c]]);
        break;
      }
      case "단타이스트": {
        const M = [`재료는 재료고, 결국 수급이 받쳐주는지가 먼저라고 봅니다.`, `호재 하나에 들뜨기보다 자리부터 보는 게 순서고요.`, `좋은 뉴스일수록 이미 반영됐는지 의심해봐야죠.`];
        const C = [`이 흐름 이어질까요?`, `여러분은 어떻게 보세요?`, `결국 수급이 답 아닐까요?`];
        const { c, lm } = dec(variant, M.length, C.length);
        body = joinLines([`${subj}, ${fact}.`, at(M, variant), lm ? `한 박자 늦더라도 자리 확인하고 가려 합니다.` : "", "", C[c]]);
        break;
      }
      case "단타데일리": {
        const H = [`[${mmdd}] 짚어볼 뉴스`, `[${mmdd}] 오늘의 재료`, `[${mmdd}] 체크할 뉴스`];
        const P2 = [`2. 테마 확산 여부.`, `2. 관련주 동반 강세 여부.`, `2. 외인·기관 수급 방향.`];
        const { o, lm } = dec(variant, H.length, 1);
        body = joinLines([
          H[o],
          `${subj} — ${fact}.`,
          `1. 시초가 갭·거래대금 확인.`,
          at(P2, variant),
          lm ? `3. 단타 관점: 추격보다 기준 유지 여부.` : "",
          `결정은 본인의 몫.`,
        ]);
        break;
      }
      case "단타Lab": {
        const O = [`${subj}, ${fact} — 호재로만 보면 놓칩니다.`, `${subj}, ${fact}. 표면만 보면 함정일 수 있고요.`, `${subj}, ${fact} 떴는데 — 진짜 이유는 따로입니다.`];
        const M = [`표면 재료 뒤 수급이 진짜인지가 핵심이고요.`, `이미 아는 재료는 늦은 자리인 경우가 많죠.`, `돈은 뉴스가 아니라 수급을 따라 움직입니다.`];
        const C = [`차트 뒤 흐름, 보고 계신가요?`, `진짜 자리는 어디일까요?`, `이 재료, 진짜일까요?`];
        const { o, c } = dec(variant, O.length, C.length);
        body = joinLines([O[o], at(M, variant), C[c]]);
        break;
      }
      case "스캘퍼": {
        const H = [`[${mmdd}] 시초 이슈`, `[${mmdd}] 단발 재료`, `[${mmdd}] 시초 체크`];
        const P = [`📍 시초가 갭·거래대금만 보고 단발 대응.`, `📍 갭 크면 추격 X, 눌림 단발.`, `📍 거래대금 실리는지만 보고.`];
        const C = [`시초가 어디냐?`, `시초 받쳐줄까?`, `갭 띄울까?`];
        const { o, c } = dec(variant, H.length, C.length);
        body = joinLines([H[o], `🔻 ${subj} — ${fact}.`, at(P, variant), C[c]]);
        break;
      }
      default:
        body = `${subj}: ${fact}`;
    }
  }

  const cta = withCTA ? `\n${at(CTA_POOL, variant)}` : "";
  return `${body}${cta}\n\n${DISC}`;
}
