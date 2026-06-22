import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { TickerBar } from "@/components/TickerBar";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";
import { TELEGRAM_INVITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { Tracker } from "@/components/Tracker";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "단타 트레이드 — 오늘 시장을 쉽게 읽는 단타 큐레이션",
    template: "%s · 단타 트레이드",
  },
  description:
    "삼성전자·하이닉스·오늘의 급등주까지, 왜 오르는지 어려운 용어 없이 쉽게 풀어주는 단타 뉴스. 초보를 막 뗀 분도 오늘 시장이 한눈에. 매경·연합·한경 뉴스를 시초가 직전 한 화면에.",
  keywords: [
    "하이닉스",
    "삼성전자",
    "연금",
    "HBM",
    "코스피",
    "단타",
    "주식 뉴스",
    "키워드 큐레이션",
    "단타 트레이더",
  ],
  authors: [{ name: "단타 트레이드" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    title: "단타 트레이드 — 오늘 시장을 쉽게 읽는 단타 큐레이션",
    description:
      "삼성전자·하이닉스·오늘의 급등주까지, 왜 오르는지 쉽게 풀어주는 단타 뉴스. 초보 막 뗀 분도 한 화면에.",
    siteName: "단타 트레이드",
  },
  twitter: {
    card: "summary_large_image",
    title: "단타 트레이드 — 오늘 시장을 쉽게 읽는 단타 큐레이션",
    description: "오늘 뭐가 왜 올랐는지 쉽게·시초가 직전 단타 큐레이션",
  },
  robots: { index: true, follow: true },
};

const themeInitScript = `
(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="min-h-full flex flex-col">
        <TickerBar />
        <Header />
        <main className="flex-1 max-w-full">{children}</main>
        <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                ▲
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                단타 트레이드 · 키워드 큐레이션 터미널
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href={TELEGRAM_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity"
              >
                텔레그램 무료 알림 →
              </a>
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                정보 공유 목적 · 종목 추천 아님 · 매매 본인 책임
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
        <Tracker />
      </body>
    </html>
  );
}
