import { KEYWORDS } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { getDailyQuote } from "@/lib/quotes";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { NewsCard } from "@/components/NewsCard";
import { KeywordChip } from "@/components/KeywordChip";

export const revalidate = 1800;

export default async function Home() {
  const recentNews = await getRecentNewsUnified(20);
  const quote = getDailyQuote();
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Slim headline */}
      <div className="mb-6 pb-4 border-b border-[var(--border)]">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text)] mb-1">
          근거 분명한 자리만.
        </h1>
        <p className="text-xs text-[var(--text-caption)] italic">
          "{quote.text}" — {quote.attribution}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {KEYWORDS.map((k) => (
            <KeywordChip key={k.slug} keyword={k} />
          ))}
        </div>
      </div>

      {/* News-first 2 column */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* News feed — main */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-1">
                News Feed
              </div>
              <h2 className="text-xl font-bold text-[var(--text)]">
                최신 뉴스
              </h2>
            </div>
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
              live
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentNews.map((n) => (
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
        </section>

        {/* Sidebar */}
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <IndexBoard />
          <CompactAlerts limit={5} />
          <CompactCalendar />
        </aside>
      </div>
    </div>
  );
}
