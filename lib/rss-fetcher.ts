/**
 * 매체 RSS 통합 fetch — 매경·연합·한경·이코노미스트.
 *
 * 단순 XML 파싱 (fast-xml-parser 없이 정규식). Next.js 서버 컴포넌트에서 사용.
 */

export interface RssFeed {
  source: string;
  url: string;
  category?: string;
}

export const KOREAN_FINANCE_RSS: RssFeed[] = [
  {
    source: "매경",
    url: "https://www.mk.co.kr/rss/30000023/",
    category: "증권",
  },
  {
    source: "연합",
    url: "https://www.yna.co.kr/rss/economy.xml",
    category: "경제",
  },
  {
    source: "한경",
    url: "https://www.hankyung.com/feed/economy",
    category: "경제",
  },
];

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  return m ? decodeXmlEntities(m[1]) : "";
}

function parseRssXml(xml: string, source: string): RssItem[] {
  const itemRegex = /<item[\s\S]*?>([\s\S]*?)<\/item>/gi;
  const items: RssItem[] = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: extractTag(block, "title"),
      link: extractTag(block, "link"),
      description: extractTag(block, "description"),
      pubDate: extractTag(block, "pubDate") || extractTag(block, "dc:date"),
      source,
    });
  }
  return items;
}

export async function fetchRssFeed(feed: RssFeed): Promise<RssItem[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; managerkim-trade-curation/1.0)",
      },
    });
    if (!res.ok) {
      console.warn(`[rss] ${feed.source} HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    return parseRssXml(xml, feed.source);
  } catch (err) {
    console.warn(`[rss] ${feed.source} failed`, err);
    return [];
  }
}

export async function fetchAllRss(): Promise<RssItem[]> {
  const results = await Promise.all(
    KOREAN_FINANCE_RSS.map((feed) => fetchRssFeed(feed)),
  );
  return results.flat();
}

export function filterByKeyword(
  items: RssItem[],
  keyword: string,
): RssItem[] {
  const lower = keyword.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower),
  );
}
