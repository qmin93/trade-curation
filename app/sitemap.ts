import type { MetadataRoute } from "next";
import { KEYWORDS } from "@/lib/keywords";
import { STOCKS } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export default function sitemap(): MetadataRoute.Sitemap {
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
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...keywordPages,
    ...stockPages,
    ...themePages,
  ];
}
