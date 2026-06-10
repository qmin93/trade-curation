/**
 * OpenGraph 이미지 fetch — 각 기사 URL에서 og:image meta tag 추출.
 * Supabase 캐시.
 */

import { getServerSupabase } from "./supabase";

const TIMEOUT_MS = 4000;

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; managerkim-trade-curation/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 86400 },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    const ogMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
      html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    if (!ogMatch) return null;
    const raw = ogMatch[1];
    if (!raw) return null;
    try {
      return new URL(raw, url).toString();
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}

export async function getOgImageWithCache(
  sourceUrl: string,
): Promise<string | null> {
  const sb = getServerSupabase();
  if (sb) {
    const { data } = await sb
      .from("og_image_cache")
      .select("image_url, fetched_null")
      .eq("source_url", sourceUrl)
      .maybeSingle();
    if (data) {
      if (data.fetched_null) return null;
      if (data.image_url) return data.image_url;
    }
  }

  const image = await fetchOgImage(sourceUrl);

  if (sb) {
    await sb
      .from("og_image_cache")
      .upsert(
        {
          source_url: sourceUrl,
          image_url: image,
          fetched_null: image === null,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "source_url" },
      )
      .then(({ error }) => {
        if (error) console.warn("[og-image] cache failed", error.message);
      });
  }

  return image;
}

export async function getOgImagesBatch(
  urls: string[],
  maxConcurrency = 5,
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) break;
      const img = await getOgImageWithCache(url);
      results.set(url, img);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(maxConcurrency, urls.length) }, () => worker()),
  );
  return results;
}
