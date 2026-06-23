import Link from "next/link";
import { KEYWORDS } from "@/lib/keywords";
import { STOCKS } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";
import { getNewsByKeywordUnified } from "@/lib/news-fetcher";
import { NewsCard } from "@/components/NewsCard";
import { StockCard } from "@/components/StockCard";
import { SectionHeader } from "@/components/SectionHeader";

export const revalidate = 600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" 검색 결과` : "검색",
    description: "키워드·종목·테마·뉴스 통합 검색",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">검색</h1>
        <p className="text-[var(--text-muted)]">
          상단 검색창에 키워드·종목명을 입력하세요.
        </p>
      </div>
    );
  }

  const lower = query.toLowerCase();
  const matchedKeywords = KEYWORDS.filter(
    (k) =>
      k.label.toLowerCase().includes(lower) ||
      k.description.toLowerCase().includes(lower),
  );
  const matchedStocks = STOCKS.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.ticker.includes(query) ||
      s.themes.some((t) => t.toLowerCase().includes(lower)),
  );
  const matchedThemes = THEMES.filter(
    (t) =>
      t.label.toLowerCase().includes(lower) ||
      t.slug.toLowerCase().includes(lower),
  );
  const news = await getNewsByKeywordUnified(query);

  const totalResults =
    matchedKeywords.length +
    matchedStocks.length +
    matchedThemes.length +
    news.length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12">
      <header>
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
          Search Results
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-[var(--accent)]">&quot;{query}&quot;</span>
        </h1>
        <div className="mt-2 mono text-sm text-[var(--text-muted)]">
          {totalResults} matches found
        </div>
      </header>

      {matchedKeywords.length > 0 && (
        <section>
          <SectionHeader
            label="Keywords"
            title={`키워드 (${matchedKeywords.length})`}
          />
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((k) => (
              <Link
                key={k.slug}
                href={`/keyword/${k.slug}`}
                className="px-4 py-2 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                {k.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchedStocks.length > 0 && (
        <section>
          <SectionHeader
            label="Stocks"
            title={`종목 (${matchedStocks.length})`}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchedStocks.map((s) => (
              <StockCard key={s.ticker} stock={s} />
            ))}
          </div>
        </section>
      )}

      {matchedThemes.length > 0 && (
        <section>
          <SectionHeader
            label="Themes"
            title={`테마 (${matchedThemes.length})`}
          />
          <div className="flex flex-wrap gap-2">
            {matchedThemes.map((t) => (
              <Link
                key={t.slug}
                href={`/theme/${t.slug}`}
                className="px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] hover:border-[var(--accent)]/50 transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section>
          <SectionHeader label="News" title={`뉴스 (${news.length})`} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n) => (
              <NewsCard
                key={n.id}
                news={{
                  id: n.id,
                  date: n.date,
                  headline: n.headline,
                  summary: n.summary,
                  source: n.source,
                  sourceUrl: n.sourceUrl,
                  keywords: n.keywords,
                  stocks: n.stocks,
                  imageUrl: n.imageUrl ?? undefined,
                  personaComments: {},
                }}
              />
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center">
          <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">
            no results
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            다른 키워드를 시도해보세요.
          </div>
        </div>
      )}
    </div>
  );
}
