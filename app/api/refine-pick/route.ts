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
    "딜러처럼 짧게. 헤드라인 1줄 + 대시(-) 불릿(한 불릿=한 사실). 포착·손절만, 1~4차 목표 나열 X. 군더더기·이모지·격언 X. 마무리 '본인 기준에 맞다면 관심' 류.",
  단타이스트:
    "밑바닥서 올라온 형이 못 박듯. 사실 → 빈 줄 → 격언 1줄 → 빈 줄 → 의문형. 묵직·결의. 가끔 '도망치면 답이 없습니다' 류(매번 X). 이모지 떡칠 X.",
  단타데일리:
    "앵커처럼 브리핑. [MM/DD] 헤더 + 1./2./3. 번호 + '결정은 본인의 몫.' 평서 마무리. 중립. 의문형 마무리 X. 이모지 X.",
  단타Lab:
    "통념을 따옴표로 던지고 뒤집기. '단순 반등일까요? 진짜 이유는 따로' → 번호 근거 → '차트 뒤 진짜 판은 어디?' 의문형. 도발·통찰. 단순 나열만 X.",
  스캘퍼:
    "시초가 단발 스캘퍼. [MM/DD] + 🔻이슈 / 📍자리 단발. 직설·속도·반말. 길게·격언 X. '시초가 어디냐?' 류 짧게.",
};

const SYSTEM = `너는 한국 단타 주식 Threads 계정 운영자다. 주어진 '초안'을 해당 페르소나 말투로 자연스럽게 다듬는다.

절대 규칙:
- ★전문가 느낌(최우선): 짧게 써도 시장 다 꿰뚫은 고수처럼. 수급 주체·거래대금·매물대·이평/VWAP·섹터 순환 같은 핵심을 정확한 용어로 한두 개 자연스럽게 짚어 "다 알고 있다" 인상. 두루뭉술·초보 설명조 X. (관찰 톤 유지, 단정·추천 X)
- 사람이 직접 손으로 쓴 것처럼 자연스럽게. 기계적·AI 양산체 X("주목할 만", "기대감이 높아지고" 등 금지).
- ★리듬 변주: 짧은 문장·긴 문장 섞기. 같은 길이 반복 X. ★구체 우선(추상·미사여구 X).
- ★금지: A·B·C 3개 나열, 슬로건식 마무리, "결국/진짜 중요한 건/핵심은" 권위 포장, "~뿐 아니라 ~" 부정 병렬, 모든 문장이 명언처럼 끝나는 것.
- ★존댓말: 모든 페르소나 존댓말. 반말 금지(스캘퍼도 존댓말 의문형). 단 시그널 대시 불릿 명사형·데일리 격식 평서체는 허용.
- 종목명·티커·가격(포착/목표/손절)·수치는 그대로 보존. 새 숫자 지어내기 X.
- 매수·매도 '지시'·수익 '보장'·세력/리딩 어투 X. 관찰·해설 톤.
- 초안에 면책 문구("※ …")가 있으면 그대로 유지. 없으면 새로 추가하지 마라.
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
