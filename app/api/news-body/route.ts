/**
 * 뉴스 기사 → 페르소나별 Threads 본문 (claude가 기사 읽고 작성).
 * NewsStudio의 ✨AI 버튼이 호출. 헤드라인 복붙이 아니라 "읽고 요약해 페르소나 톤으로 새로 쓴다".
 * ANTHROPIC_API_KEY 필요. 실패 시 ok:false + (호출 측은 규칙 기반 초안 유지).
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DISC = "※ 시장 관찰용 정보 · 매수·매도 추천 아님 · 판단과 책임은 본인에게";

/** 페르소나별 톤·포맷(벤치 검증 기준) */
const TONE: Record<string, string> = {
  단타시그널:
    "딜러처럼 짧게 던지고 입 닫는다. 헤드라인 1줄 + 대시(-) 불릿 2~3개(한 불릿=한 사실). 군더더기·이모지·격언·감성 전부 X. 마무리는 '본인 기준에 맞다면 관심' 류 짧게. 1~4차 목표 줄줄이 나열 X.",
  단타이스트:
    "밑바닥서 올라온 형이 못 박듯. 사실 1~2줄 → 빈 줄 → 격언 1줄 → 빈 줄 → 의문형 마무리. 묵직·결의·확신. 가끔 '이런 자리는 도망치면 답이 없습니다' 류 격언(매번 X, 변주). 이모지 떡칠 X.",
  단타데일리:
    "앵커처럼 차분히 브리핑. '[MM/DD]' 헤더 → 1./2./3. 번호(각 한 줄) → 고정 마무리 '결정은 본인의 몫.' 중립·정돈. 의문형 마무리 X(평서 고정). 통념 반박·격언·이모지 X.",
  단타Lab:
    "통념을 따옴표로 던지고 뒤집는다. \"{통념}\" 1줄 → '근데 진짜는…' 반전 → 번호 근거 → '차트 뒤 진짜 판은 어디?' 류 의문형. 도발·통찰. 단순 시황 나열만 하면 실패(반드시 통념→반전 구조). 이모지 X.",
  스캘퍼:
    "시초가 단발 스캘퍼. '[MM/DD]' + '🔻 이슈' / '📍 자리' 단발 포맷. 직설·속도감·반말. ★반드시 3줄 이내(헤더 제외 본문 짧게). 길게 설명·격언·여운 X. 마무리 '시초가 어디냐?' 류 짧게. 추격 X·단발 강조.",
};

const ANGLES = ["실시간 발견", "혼잣말 관찰", "차트 보다가", "한 박자 늦게", "회고조", "담담한 정리"];

/** 페르소나별 마무리 시그니처(강제) — 벤치 매치 100% 위해 본문 끝(면책·CTA 위)을 이걸로. */
const CLOSE: Record<string, string> = {
  단타시그널: "마지막 줄(불릿)을 '본인 기준에 맞다면 관심' 류로 짧게.",
  단타이스트: "반드시 수급·방향을 묻는 의문형 한 줄로 끝낸다(평서 X).",
  단타데일리: "반드시 마지막 줄을 정확히 '결정은 본인의 몫.' 으로 끝낸다.",
  단타Lab: "반드시 '차트 뒤 진짜 판은 어디?' 류 의문형으로 끝낸다.",
  스캘퍼: "반드시 '시초가 어디냐?' 류 짧은 의문으로 끝낸다.",
};

function systemPrompt(persona: string, fmt: string, withCTA: boolean): string {
  const tone = TONE[persona] ?? "단타 트레이더의 자연스러운 톤.";
  const close = CLOSE[persona] ?? "";
  const formatLine =
    fmt === "question"
      ? "포맷: 질문형 — 첫 줄부터 답글을 부르는 질문으로 시작(사실은 보조). 댓글 유도."
      : "포맷: 뉴스 본문 — 기사 사실(재료)부터, 단타 관찰·체크포인트 중심.";
  return `너는 한국 단타 주식 Threads 계정 '${persona}' 운영자다. 주어진 기사를 읽고 이 계정 톤으로 본문을 쓴다.

페르소나 톤: ${tone}
${formatLine}
${close ? `마무리 시그니처(필수): ${close} (면책·CTA는 그 아래)` : ""}

절대 규칙:
- ★전문가 느낌(최우선): 짧게 써도 시장 전체를 꿰뚫은 10년차 고수처럼. 수급 주체(외인·기관·연기금)·거래대금 강도·매물대·추세 위치(이평/VWAP)·섹터 순환·시초가 갭 같은 핵심을 정확한 용어로 자연스럽게 한두 개 짚어, "이 사람 상황 다 알고 있다"는 인상을 줘라. 두루뭉술·초보 설명조 절대 X. (단 관찰·해설 톤 유지, 단정·추천 X)
- 기사를 읽고 핵심만 추려 '새로 쓴다'. 헤드라인·요약 문장 복붙 금지.
- 사람이 직접 손으로 쓴 것처럼 자연스럽게, 매번 다른 첫 줄·마무리. 기계적 반복·AI 양산체 금지("주목할 만", "기대감이 높아지고" 등 금지).
- ★리듬 변주: 짧은 문장과 긴 문장을 섞어라. 한 줄에 '/'로 줄줄이 잇지 말고 마침표로 끊어라. 모든 문장이 같은 길이면 AI 티.
- ★구체 우선: 두루뭉술 대신 기사의 구체 수치·종목·사실로. 추상 표현·미사여구 빼라.
- ★금지 패턴: A·B·C 3개 나열 습관, 슬로건식 마무리, "결국/진짜 중요한 건/핵심은" 권위 포장, "~할 뿐 아니라 ~이다" 부정 병렬, "자, 이제~" 신호등 안내, 모든 문장이 명언처럼 끝나는 것.
- ★진짜 사람처럼: 확신보다 관찰. 살짝 의견 한 줄 OK("개인적으론~", "솔직히~") — 단 매번 박지 말고 가끔.
- 관찰·해설 톤. 매수·매도 '지시'·수익 '보장'·세력/리딩 어투 금지.
- 종목명·수치(%·원·억)는 기사에 있는 것만 정확히. 새 숫자 지어내기 금지.
- 길이 3~6줄. 해시태그·따옴표 감싸기·설명 추가 금지.
- 마지막 줄에 면책 "${DISC}" 을 반드시 그대로 넣는다.${
    withCTA ? "\n- 면책 바로 위 줄에 '실시간 자리는 텔레그램에 먼저 올립니다 👇' 같은 한 줄 CTA를 자연스럽게 넣는다." : ""
  }
- 출력은 본문만. 다른 말 붙이지 마라.`;
}

export async function POST(req: Request) {
  let b: {
    persona?: string; fmt?: string; headline?: string; summary?: string;
    stocks?: string[]; mmdd?: string; withCTA?: boolean; variant?: number;
  };
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const persona = (b.persona ?? "").trim();
  const headline = (b.headline ?? "").trim();
  const summary = (b.summary ?? "").trim();
  if (!persona || (!headline && !summary)) {
    return NextResponse.json({ ok: false, error: "persona·기사 필요" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "ANTHROPIC_API_KEY 미설정" });
  }

  const angle = ANGLES[Math.abs(b.variant ?? 0) % ANGLES.length];
  const stocks = (b.stocks ?? []).filter(Boolean).join(", ");
  const userMsg = [
    `[기사]`,
    `헤드라인: ${headline}`,
    summary ? `요약: ${summary}` : "",
    stocks ? `관련 종목: ${stocks}` : "",
    b.mmdd ? `오늘 날짜(MM/DD): ${b.mmdd}` : "",
    "",
    `이 기사를 '${persona}' 톤으로, '${angle}' 각도로 한 번 써줘. 헤드라인 복붙 말고 읽고 새로.`,
  ]
    .filter(Boolean)
    .join("\n");

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
        max_tokens: 420,
        system: systemPrompt(persona, b.fmt ?? "news", b.withCTA ?? true),
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json({
        ok: false,
        error: `Claude HTTP ${res.status}`,
        detail: detail.slice(0, 160),
      });
    }
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json({ ok: false, error: "빈 응답" });
    }
    let body = text.trim();
    if (!body.includes("매수·매도 추천 아님")) body += `\n\n${DISC}`;
    return NextResponse.json({ ok: true, body });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err).slice(0, 160) });
  }
}
