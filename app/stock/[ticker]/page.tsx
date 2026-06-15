import Link from "next/link";
import { notFound } from "next/navigation";
import { STOCKS, getStockByTicker } from "@/lib/stocks";
import { getNewsByKeywordUnified } from "@/lib/news-fetcher";
import { NewsCard } from "@/components/NewsCard";
import { SparklineChart } from "@/components/SparklineChart";
import { StockCard } from "@/components/StockCard";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const revalidate = 600;

export function generateStaticParams() {
  return STOCKS.map((s) => ({ ticker: s.ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const s = getStockByTicker(ticker);
  if (!s) return {};
  return {
    title: `${s.name} (${s.ticker}) — 시세·뉴스`,
    description: s.description,
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const stock = getStockByTicker(ticker);
  if (!stock) notFound();

  const news = await getNewsByKeywordUnified(stock.name);
  const positive = stock.change >= 0;
  const relatedStocks = STOCKS.filter(
    (s) =>
      s.ticker !== stock.ticker &&
      s.themes.some((t) => stock.themes.includes(t)),
  ).slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: `${stock.name}(${stock.ticker})`, path: `/stock/${stock.ticker}` },
        ])}
      />
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg)] to-[var(--bg)]">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <Link
            href="/"
            className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] hover:text-[var(--accent)] transition-colors mb-6 inline-block"
          >
            ← 홈
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3 mono text-[10px] uppercase tracking-[0.3em]">
                <span className="text-[var(--accent)]">{stock.exchange}</span>
                <span className="text-[var(--border-strong)]">/</span>
                <span className="text-[var(--text-caption)]">
                  Ticker {stock.ticker}
                </span>
                {stock.marketCap && (
                  <>
                    <span className="text-[var(--border-strong)]">/</span>
                    <span className="text-[var(--text-caption)]">
                      MktCap {stock.marketCap}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
                {stock.name}
              </h1>
              <p className="text-base md:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed">
                {stock.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {stock.themes.map((t) => (
                  <Link
                    key={t}
                    href={`/theme/${t}`}
                    className="text-xs mono px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 min-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                  Current
                </span>
                <SparklineChart
                  data={stock.sparkline}
                  positive={positive}
                  width={100}
                  height={32}
                />
              </div>
              <div className="mono text-3xl font-bold tabular-nums mb-1">
                ₩{stock.price.toLocaleString()}
              </div>
              <div
                className={`mono text-base font-semibold ${positive ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {positive ? "▲" : "▼"} {Math.abs(stock.change).toLocaleString()}
                <span className="ml-2">
                  ({Math.abs(stock.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-16">
        <section>
          <SectionHeader
            label="01 · News"
            title={`${stock.name} 관련 뉴스`}
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

        {relatedStocks.length > 0 && (
          <section>
            <SectionHeader
              label="02 · Related"
              title="같은 테마 종목"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedStocks.map((s) => (
                <StockCard key={s.ticker} stock={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
