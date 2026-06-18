/**
 * 검색 트렌드 소스 — "지금 사람들이 뭘 검색하나" = 트래픽 신호.
 * (1) 네이버 인기검색 종목은 lib/naver-trending.ts(콘솔에 이미 연결).
 * (2) 네이버 데이터랩 — 테마 키워드 검색 모멘텀(상승/하락). 사이트 NAVER 자격증명 재사용.
 * (3) 구글 트렌드 — 한국 일일 트렌딩 검색어(베스트에포트).
 */

const DATALAB = "https://openapi.naver.com/v1/datalab/search";

// 단타 핵심 테마 5개(데이터랩 1회 요청 = 5그룹 한도, 상호 비교 가능).
const THEME_GROUPS = ["반도체", "AI", "2차전지", "원전", "방산"];

export interface ThemeTrend {
  theme: string;
  latest: number; // 최근일 상대 검색량(0~100, 요청 내 최대=100)
  change: number; // 최근일 - 직전기간 평균 (양수=검색 상승)
}

export async function fetchDataLabThemes(): Promise<ThemeTrend[]> {
  const id = process.env.NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) return [];
  const end = new Date();
  const start = new Date(Date.now() - 14 * 86400000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  try {
    const res = await fetch(DATALAB, {
      method: "POST",
      headers: {
        "X-Naver-Client-Id": id,
        "X-Naver-Client-Secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: fmt(start),
        endDate: fmt(end),
        timeUnit: "date",
        keywordGroups: THEME_GROUPS.map((g) => ({ groupName: g, keywords: [g] })),
      }),
    });
    if (!res.ok) return [];
    const j = (await res.json()) as {
      results?: { title: string; data: { period: string; ratio: number }[] }[];
    };
    const out: ThemeTrend[] = [];
    for (const r of j.results ?? []) {
      const data = r.data ?? [];
      if (!data.length) continue;
      const latest = data[data.length - 1].ratio;
      const prior = data.slice(0, -1);
      const prevAvg = prior.length
        ? prior.reduce((a, b) => a + b.ratio, 0) / prior.length
        : latest;
      out.push({
        theme: r.title,
        latest: Math.round(latest),
        change: Math.round(latest - prevAvg),
      });
    }
    return out.sort((a, b) => b.change - a.change); // 검색 상승 큰 순
  } catch {
    return [];
  }
}

export interface GoogleTrend {
  query: string;
  traffic: string;
}

export async function fetchGoogleTrending(limit = 12): Promise<GoogleTrend[]> {
  try {
    const res = await fetch(
      "https://trends.google.com/trends/api/dailytrends?hl=ko&tz=-540&geo=KR",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return [];
    let txt = await res.text();
    txt = txt.replace(/^\)\]\}',?\s*/, ""); // 구글 안티-JSON 프리픽스 제거
    const j = JSON.parse(txt) as {
      default?: {
        trendingSearchesDays?: {
          trendingSearches?: { title?: { query?: string }; formattedTraffic?: string }[];
        }[];
      };
    };
    const out: GoogleTrend[] = [];
    for (const d of j.default?.trendingSearchesDays ?? []) {
      for (const t of d.trendingSearches ?? []) {
        if (t.title?.query) out.push({ query: t.title.query, traffic: t.formattedTraffic ?? "" });
        if (out.length >= limit) return out;
      }
    }
    return out;
  } catch {
    return [];
  }
}
