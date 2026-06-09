import type { MetadataRoute } from "next";
import { KEYWORDS } from "@/lib/keywords";
import { STOCKS } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";
import { DAILY_RESULTS } from "@/lib/results";

export const dynamic = "force-dynamic";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3001";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = resolveSiteUrl();
  const now = new Date();
  const keywordPages = KEYWORDS.map((k) => ({
    url: `${SITE_URL}/keyword/${k.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: k.tier === 1 ? 0.9 : 0.7,
  }));
  const stockPages = STOCKS.map((s) => ({
    url: `${SITE_URL}/stock/${s.ticker}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));
  const themePages = THEMES.map((t) => ({
    url: `${SITE_URL}/theme/${encodeURIComponent(t.slug)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: t.tier === 1 ? 0.85 : 0.65,
  }));
  const resultPages = DAILY_RESULTS.map((r) => ({
    url: `${SITE_URL}/results/${r.date}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/results`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...keywordPages,
    ...stockPages,
    ...themePages,
    ...resultPages,
  ];
}
