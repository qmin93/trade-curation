/**
 * 구조화데이터(JSON-LD) 헬퍼 — 검색 리치결과 + AI검색(GEO) 인용용.
 * seo-schema·ai-seo 스킬 원칙 적용: Organization·WebSite 사이트 전역, 페이지별 BreadcrumbList.
 */
import { TELEGRAM_INVITE_URL } from "./site";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dantatrade.vercel.app"
).replace(/\/$/, "");

const SITE_NAME = "단타 트레이드";
const SITE_DESC =
  "하이닉스·삼성전자·HBM·코스피 — 단타 트레이더가 직접 큐레이션하는 키워드 뉴스와 검증된 픽. 검증된 성과 전부 공개.";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    sameAs: [TELEGRAM_INVITE_URL],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    inLanguage: "ko-KR",
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** 결과(성과) 페이지용 — 일자별 픽 결과를 ItemList로. 검증된 성과가 검색에 풍부하게. */
export function resultItemListLd(
  date: string,
  picks: { stockName: string; resultPercent: number }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${date} 단타 추천 결과`,
    itemListElement: picks.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.stockName} ${p.resultPercent >= 0 ? "+" : ""}${p.resultPercent}%`,
    })),
  };
}
