/**
 * Claude API로 뉴스 헤드라인·요약을 단타 트레이더 톤으로 재요약.
 * Supabase에 캐시 (같은 URL은 1회만 호출).
 */

import { getServerSupabase } from "./supabase";

/** off-topic 뉴스를 표시하는 센티널. fetcher가 이 값을 받으면 해당 뉴스를 목록에서 제외한다. */
export const OFF_TOPIC = "__OFF_TOPIC__";

/**
 * 센티널 도입 이전에 캐시된 "거부 문장"이나, 모델이 센티널 대신 거부로 응답한 경우까지
 * off-topic으로 잡아내는 방어 휴리스틱.
 */
const REFUSAL_PATTERNS = [
  "죄송하지만",
  "큐레이션 대상이 아닙니다",
  "요약하지 않",
  "요약할 수 없",
  "제공해주시면",
  "관련된 뉴스가 아닙니다",
  "트레이딩 의사결정과 무관",
];

function looksOffTopic(text: string): boolean {
  if (text === OFF_TOPIC) return true;
  return REFUSAL_PATTERNS.some((p) => text.includes(p));
}

const SYSTEM_PROMPT = `당신은 단타 트레이더 사이트의 뉴스 큐레이터입니다.

규칙:
- 받은 헤드라인+description을 한국어 2~3문장으로 요약
- 단타·시초가·자리·종목 컨텍스트가 자연스럽게 들어가야 함
- 진중한 톤·과장 X·광고 톤 X
- 종목명·구체 수치(%·원·억) 보존
- "주목할 만하다"·"기대감이 높아지고 있다" 같은 AI 양산 어구 금지
- 단정형보다 자연스러운 정보 전달

중요 — off-topic 판별:
- 증시·코인·선물·개별 종목·거시경제·기업 공시 등 트레이딩 의사결정과 관련된 뉴스가 아니면 (예: 사회·사건사고·연예·스포츠) 요약하지 말 것
- 이 경우 거부 문장이나 설명을 절대 쓰지 말고, 정확히 ${OFF_TOPIC} 한 줄만 출력

출력: 요약 텍스트만. 따옴표나 설명 X. off-topic이면 ${OFF_TOPIC} 만.`;

interface SummaryResult {
  summary: string;
  cached: boolean;
  offTopic: boolean;
}

async function callClaude(headline: string, description: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return description;

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
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `헤드라인: ${headline}\n원문 요약: ${description}\n\n위 정보를 단타 트레이더 톤으로 2~3문장 한국어 요약해주세요.`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.warn("[claude-summarize] HTTP", res.status);
      return description;
    }
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" && text.length > 10 ? text.trim() : description;
  } catch (err) {
    console.warn("[claude-summarize] failed", err);
    return description;
  }
}

export async function summarizeWithCache(
  sourceUrl: string,
  headline: string,
  description: string,
): Promise<SummaryResult> {
  const sb = getServerSupabase();

  // 1. 캐시 확인
  if (sb) {
    const { data } = await sb
      .from("news_summary_cache")
      .select("summary")
      .eq("source_url", sourceUrl)
      .maybeSingle();
    if (data?.summary) {
      return {
        summary: data.summary,
        cached: true,
        offTopic: looksOffTopic(data.summary),
      };
    }
  }

  // 2. Claude 호출
  const summary = await callClaude(headline, description);
  const offTopic = looksOffTopic(summary);

  // 3. 캐시 저장 (성공·실패 무관·다음 같은 URL 호출 시 재시도 방지)
  if (sb && summary !== description) {
    await sb
      .from("news_summary_cache")
      .upsert(
        {
          source_url: sourceUrl,
          headline,
          summary,
          created_at: new Date().toISOString(),
        },
        { onConflict: "source_url" },
      )
      .then(({ error }) => {
        if (error) console.warn("[claude-summarize] cache failed", error.message);
      });
  }

  return { summary, cached: false, offTopic };
}

/**
 * 배치 요약. 값이 `null`이면 off-topic 뉴스이므로 호출 측에서 목록에서 제외해야 한다.
 */
export async function summarizeBatch(
  items: { sourceUrl: string; headline: string; description: string }[],
  maxConcurrency = 3,
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const queue = [...items];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      try {
        const { summary, offTopic } = await summarizeWithCache(
          item.sourceUrl,
          item.headline,
          item.description,
        );
        results.set(item.sourceUrl, offTopic ? null : summary);
      } catch {
        results.set(item.sourceUrl, item.description);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(maxConcurrency, items.length) }, () => worker()),
  );
  return results;
}
