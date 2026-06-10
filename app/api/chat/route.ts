import { NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `당신은 단타 트레이드 사이트의 어시스턴트입니다.

규칙:
- 한국어 단답형 (3~5문장 이내)
- 단타·시초가·자리·키워드·종목·테마 질문에 답변
- 시그널 톤 X (Meta 정책 회피)·정보 공유 톤 ⭐
- 매매 판단은 본인 책임이라는 면책 자연스럽게 1회
- 모르는 정보는 솔직히 모른다고 답변
- 매크로 (FOMC·MSCI·CPI)·반도체·HBM·소부장·연금 등 단타 컨텍스트에 친숙

말투: 짧고 명확하게·진중하게.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "[챗봇 미설정] 사이트 운영자가 Claude API 키를 설정하면 활성됩니다. .env.local에 ANTHROPIC_API_KEY를 추가하세요.",
    });
  }

  try {
    const { messages } = (await request.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

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
        system: SYSTEM_PROMPT,
        messages: messages.slice(-8),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Anthropic ${res.status}`, detail: text.slice(0, 200) },
        { status: 500 },
      );
    }

    const data = await res.json();
    const reply =
      data?.content?.[0]?.text ??
      "답변을 가져오지 못했습니다. 다시 시도해주세요.";
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
