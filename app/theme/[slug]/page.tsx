import Link from "next/link";
import { notFound } from "next/navigation";
import { THEMES, getThemeBySlug } from "@/lib/themes";
import { getStocksByTheme } from "@/lib/stocks";
import { getNewsByKeywordUnified } from "@/lib/news-fetcher";
import { NewsCard } from "@/components/NewsCard";
import { StockCard } from "@/components/StockCard";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const revalidate = 600;

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getThemeBySlug(decodeURIComponent(slug));
  if (!theme) return {};
  return {
    title: `${theme.label} 테마 — 종목·뉴스`,
    description: theme.description,
  };
}

const tierColor = {
  1: "text-[var(--red)]",
  2: "text-[var(--amber)]",
  3: "text-[var(--accent)]",
} as const;

const tierGradient = {
  1: "from-[var(--red)]/20 via-transparent to-transparent",
  2: "from-[var(--amber)]/20 via-transparent to-transparent",
  3: "from-[var(--accent)]/20 via-transparent to-transparent",
} as const;

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const theme = getThemeBySlug(decoded);
  if (!theme) notFound();

  const stocks = getStocksByTheme(theme.slug);
  const news = await getNewsByKeywordUnified(theme.label);
  const otherThemes = THEMES.filter((t) => t.slug !== theme.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: `${theme.label} 테마`, path: `/theme/${theme.slug}` },
        ])}
      />
      <section
        className={`relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br ${tierGradient[theme.tier]}`}
      >
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <Link
            href="/"
            className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] hover:text-[var(--accent)] transition-colors mb-6 inline-block"
          >
            ← 홈
          </Link>
          <div className="flex items-center gap-3 mb-4 mono text-[10px] uppercase tracking-[0.3em]">
            <span className={tierColor[theme.tier]}>
              Tier {theme.tier} Theme
            </span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-caption)]">
              {stocks.length} stocks · {news.length} news
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {theme.label}
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {theme.description}
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-16">
        {stocks.length > 0 && (
          <section>
            <SectionHeader
              label="01 · Stocks"
              title={`${theme.label} 라인업`}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stocks.map((s) => (
                <StockCard key={s.ticker} stock={s} />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader
            label="02 · News"
            title={`${theme.label} 뉴스`}
          />
          {news.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center">
              <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">
                no news yet
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                네이버 API 키 설정 후 실시간 흡수됩니다.
              </div>
            </div>
          ) : (
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
                    personaComments: {},
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            label="03 · Other Themes"
            title="다른 테마"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherThemes.map((t) => (
              <Link
                key={t.slug}
                href={`/theme/${t.slug}`}
                className="group rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)]/50 hover:-translate-y-0.5"
              >
                <div className={`mono text-[9px] uppercase tracking-widest mb-2 ${tierColor[t.tier]}`}>
                  Tier {t.tier}
                </div>
                <div className="font-semibold text-[var(--text)] group-hover:text-white transition-colors mb-1">
                  {t.label}
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
