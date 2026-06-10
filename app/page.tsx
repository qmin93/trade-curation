import { KEYWORDS } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { HeroNews } from "@/components/HeroNews";
import { NewsListItem } from "@/components/NewsListItem";
import { KeywordChip } from "@/components/KeywordChip";

export const revalidate = 1800;

export default async function Home() {
  const news = await getRecentNewsUnified(20);
  const [hero, ...rest] = news;
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Headline strip */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)]">
            Live · {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KEYWORDS.map((k) => (
            <KeywordChip key={k.slug} keyword={k} />
          ))}
        </div>
      </div>

      {/* Hero news */}
      {hero && <HeroNews news={hero} />}

      {/* 2-column body */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10">
        {/* News list */}
        <section>
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
              Latest
            </h2>
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
              {rest.length} stories
            </span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {rest.map((n) => (
              <NewsListItem key={n.id} news={n} />
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
