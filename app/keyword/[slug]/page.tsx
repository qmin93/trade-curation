import Link from "next/link";
import { notFound } from "next/navigation";
import { KEYWORDS, getKeywordBySlug } from "@/lib/keywords";
import { getNewsByKeywordUnified } from "@/lib/news-fetcher";
import { NewsCard } from "@/components/NewsCard";
import { KeywordGrid } from "@/components/KeywordGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const revalidate = 1800;

// 빌드때 미리 생성 X → 방문 시 on-demand ISR. 네이버 API burst·쿼터 절약.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const k = getKeywordBySlug(slug);
  if (!k) return {};
  return {
    title: `${k.label} 뉴스 큐레이션`,
    description: k.description,
    openGraph: {
      title: `${k.label} 뉴스 큐레이션 · 단타 트레이드`,
      description: k.description,
    },
  };
}

const tierAccent = {
  1: "from-[var(--red)]/20 via-transparent to-transparent",
  2: "from-[var(--amber)]/20 via-transparent to-transparent",
  3: "from-[var(--accent)]/20 via-transparent to-transparent",
  4: "from-[var(--text-muted)]/10 via-transparent to-transparent",
} as const;

const tierColor = {
  1: "text-[var(--red)]",
  2: "text-[var(--amber)]",
  3: "text-[var(--accent)]",
  4: "text-[var(--text-muted)]",
} as const;

export default async function KeywordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const keyword = getKeywordBySlug(slug);
  if (!keyword) notFound();

  const news = await getNewsByKeywordUnified(keyword.label);
  const otherKeywords = KEYWORDS.filter((k) => k.slug !== slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: `${keyword.label} 뉴스`, path: `/keyword/${keyword.slug}` },
        ])}
      />
      <section
        className={`relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br ${tierAccent[keyword.tier]}`}
      >
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <Link
            href="/"
            className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] hover:text-[var(--accent)] transition-colors mb-6 inline-block"
          >
            ← 전체 키워드
          </Link>

          <div className="flex items-center gap-3 mb-4 mono text-[10px] uppercase tracking-[0.3em]">
            <span className={tierColor[keyword.tier]}>
              Tier {keyword.tier}
            </span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-caption)]">{keyword.category}</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-caption)]">
              {news.length} articles
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {keyword.label}
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {keyword.description}
          </p>
          {keyword.relatedStocks && keyword.relatedStocks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                Related
              </span>
              {keyword.relatedStocks.map((s) => (
                <span
                  key={s}
                  className="text-xs mono px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-16">
        <section>
          <SectionHeader
            label="01 · Live News"
            title={`${keyword.label} 관련 뉴스`}
          />
          {news.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center">
              <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">
                no news yet
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                아직 수집된 뉴스가 없습니다. 매일 자동 갱신됩니다.
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
            label="02 · Other Keywords"
            title="다른 키워드 둘러보기"
          />
          <KeywordGrid keywords={otherKeywords} />
        </section>
      </div>
    </>
  );
}
