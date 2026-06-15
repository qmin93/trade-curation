/**
 * 운영자 픽 작성기 — "AI 다듬기" 라우트.
 * 규칙 기반 초안을 받아 페르소나 톤으로 자연스럽게 변주(봇 티 제거). 가격·면책은 보존.
 * ANTHROPIC_API_KEY 필요. 키 없거나 호출 실패 시 원문(draft) 그대로 반환 + ok:false.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** 페르소나별 톤 가이드(실제 게시 포맷 기준) */
const PERSONA_TONE: Record<string, string> = {
  단타시그널:
    "헤드라인 한 줄 + 대시(-) 불릿 팩트. 짧고 건조. 포착·손절만, 목표 줄줄이 나열 X. 의문형 없어도 됨. 외침·자음(ㅋㅋ) X.",
  단타이스트:
    "사실 1~2줄 → 차분한 시장 관찰 한 줄 → 의문형으로 마무리. 격언조 가끔. 진중하고 정직한 톤.",
  단타데일리:
    "[MM/DD] 헤더 + 1./2./3. 번호 정리 + '결정은 본인의 몫.'로 마무리. 격식체.",
  단타Lab:
    "통념 반박('단순 반등일까요? 안을 보면 다릅니다') + 1./2./3. + 차트 뒤 흐름 묻는 의문형. 통찰형.",
  스캘퍼:
    "[MM/DD] + 🔻이슈 / 📍자리 단발 포맷. 시초가·단발 대응 강조. 짧은 의문형 마무리.",
};

const SYSTEM = `너는 한국 단타 주식 Threads 계정 운영자다. 주어진 '초안'을 해당 페르소나 말투로 자연스럽게 다듬는다.

절대 규칙:
- 사람이 직접 손으로 쓴 것처럼 자연스럽게. 기계적·AI 양산체 X("주목할 만", "기대감이 높아지고" 등 금지).
- 종목명·티커·가격(포착/목표/손절)·수치는 그대로 보존. 새 숫자 지어내기 X.
- 매수·매도 '지시'·수익 '보장'·세력/리딩 어투 X. 관찰·해설 톤.
- 마지막의 면책 문구("※ 매수·매도 추천 아님 …")는 반드시 그대로 유지.
- 길이는 초안과 비슷하게(3~7줄). 해시태그·설명·따옴표 감싸기 추가 X.
- 출력은 다듬은 본문만. 다른 말 붙이지 마라.`;

export async function POST(req: Request) {
  let body: { persona?: string; draft?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const persona = (body.persona ?? "").trim();
  const draft = (body.draft ?? "").trim();
  if (!draft) {
    return NextResponse.json({ ok: false, error: "empty draft" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, refined: draft, error: "ANTHROPIC_API_KEY 미설정" },
      { status: 200 },
    );
  }

  const tone = PERSONA_TONE[persona] ?? "단타 트레이더의 자연스러운 톤.";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `페르소나: ${persona}\n페르소나 톤: ${tone}\n\n초안:\n${draft}\n\n위 초안을 이 페르소나 말투로 자연스럽게 다듬어줘. 가격·면책은 보존.`,
          },
        ],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, refined: draft, error: `Claude HTTP ${res.status}`, detail: detail.slice(0, 200) },
        { status: 200 },
      );
    }
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    const refined = typeof text === "string" && text.trim().length > 10 ? text.trim() : draft;
    return NextResponse.json({ ok: refined !== draft, refined });
  } catch (err) {
    return NextResponse.json(
      { ok: false, refined: draft, error: String(err).slice(0, 200) },
      { status: 200 },
    );
  }
}
