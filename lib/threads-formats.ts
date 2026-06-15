/**
 * Threads 콘텐츠 포맷 생성기 — 운영자 콘솔(/ops)의 "복붙 스튜디오"용.
 * 뉴스 외 트래픽 포맷(질문형 떡밥·격언카드·타래 심화·일상/매매일지·결과 인증·뉴스)을
 * 페르소나 톤 유지 + 변주 + 면책 + (선택)텔레그램 CTA로 생성한다. 규칙 기반(AI 0).
 *
 * 근거(리서치): 답글>좋아요(질문형) · 저장 유발(격언·카드) · 체류시간(타래) · 휴먼화(일지)
 * · 결과 인증은 금감원 사기 프레임 회피 위해 "손실 공개+권유 아님" 강제.
 */
import type { Persona } from "./threads-caption";

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
    personas: ["단타이스트", "단타Lab", "단타데일리"],
  },
  {
    id: "thread",
    label: "타래 심화",
    desc: "체류시간·답글. '왜 터지나' 구조 분석(badakstock식).",
    fields: [
      { key: "subj", label: "테마·종목", placeholder: "예) 데이터센터 전력" },
      { key: "noteA", label: "연쇄 포인트(쉼표/줄바꿈으로 구분)", placeholder: "전력 수급 위기, ESS 수혜, 두산에너빌·효성중공업", area: true },
    ],
    personas: ["단타Lab", "단타데일리"],
  },
  {
    id: "journal",
    label: "일상·매매일지",
    desc: "휴먼화·캐릭터 빌딩. 정직 톤이 신뢰를 쌓는다.",
    fields: [
      { key: "noteA", label: "오늘 있었던 일·감정", placeholder: "예) 오전에 익절하고 오후엔 관망. 손이 근질거렸다", area: true },
    ],
    personas: ["단타이스트", "단타데일리", "단타시그널"],
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
    personas: ["단타시그널", "단타이스트", "단타데일리"],
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
    const ctx = a ? `${a}.` : "";
    switch (persona) {
      case "단타시그널":
        body = at([
          `${subj}, 지금 자리 어떻게들 보세요?\n${ctx ? `- ${ctx}\n` : ""}- 받쳐주면 가고, 깨지면 패스.\n댓글로 방향 한 번 찍어봅시다.`,
          `${subj} 보는 중.\n${ctx ? `- ${ctx}\n` : ""}- 여기서 더 갈지, 눌릴지.\n다들 어느 쪽 보세요?`,
        ], variant);
        break;
      case "단타이스트":
        body = at([
          `${subj}, 오늘 같은 자리 다들 어떻게 대응하세요?\n${ctx} 쫓을지 기다릴지, 결국 그 차이가 수익을 가른다고 봅니다.\n여러분은 어느 쪽이세요?`,
          `${subj} 두고 고민이 됩니다.\n${ctx} 무리하게 들어가는 게 맞는 자리인지.\n다들 어떻게 보세요?`,
        ], variant);
        break;
      case "단타데일리":
        body = `[${mmdd}] 오늘의 질문\n${subj}, 갭상 vs 갭하 — 어느 쪽 보세요?\n${ctx ? `${ctx} ` : ""}근거도 댓글로 같이 적어주시면 좋고요.`;
        break;
      case "단타Lab":
        body = at([
          `${subj}, 다들 좋게만 보는데 — 진짜 그럴까요?\n${ctx} 표면 말고 수급으로 보면 다른 그림이 나옵니다.\n여러분은 어디를 보고 계세요?`,
          `${subj}, 왜 지금 움직일까요?\n${ctx} 재료가 아니라 수급이 먼저라고 봅니다.\n어떻게들 보세요?`,
        ], variant);
        break;
      case "스캘퍼":
        body = `[${mmdd}] 시초 질문\n${subj} 시초가 어디서 잡힐까?\n${ctx ? `${ctx} ` : ""}댓글로 한 번 찍어봅시다.`;
        break;
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
      default:
        body = `${subj}: ${res}`;
    }
    body += `\n\n※ 손실도 함께 공개 · 수익 보장 아님 · 종목 추천 아님`;
  } else if (id === "news") {
    const fact = a || "오늘 나온 재료";
    switch (persona) {
      case "단타시그널":
        body = at([
          `${subj}, 이 재료 보고 어떻게들 보세요?\n- ${fact}.\n- 시초가·거래대금부터 확인할 자리.`,
          `${subj} — ${fact}.\n- 모멘텀 이어질지가 관건.\n다들 어느 쪽 보세요?`,
        ], variant);
        break;
      case "단타이스트":
        body = `${subj}, ${fact}.\n재료는 재료고, 결국 수급이 받쳐주는지가 먼저라고 봅니다.\n여러분은 어떻게 보세요?`;
        break;
      case "단타데일리":
        body = `[${mmdd}] 짚어볼 뉴스\n${subj} — ${fact}.\n1. 시초가 갭·거래대금 확인.\n2. 테마 확산 여부.\n추격보다 기준 확인. 결정은 본인의 몫.`;
        break;
      case "단타Lab":
        body = `${subj}, ${fact} — 호재로만 보면 놓칩니다.\n표면 재료 뒤 수급이 진짜인지가 핵심이고요.\n차트 뒤 흐름, 보고 계신가요?`;
        break;
      case "스캘퍼":
        body = `[${mmdd}] 시초 이슈\n🔻 ${subj} — ${fact}.\n📍 시초가 갭·거래대금만 보고 단발 대응.\n시초가 어디냐?`;
        break;
      default:
        body = `${subj}: ${fact}`;
    }
  }

  const cta = withCTA ? `\n${at(CTA_POOL, variant)}` : "";
  return `${body}${cta}\n\n${DISC}`;
}
