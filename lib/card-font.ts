/**
 * Threads 공유카드용 한글 폰트 로더 — @vercel/og(Satori)는 CJK를 기본 미포함하므로
 * Pretendard OTF를 1회 받아 모듈 캐시. (없으면 한글이 네모로 깨짐)
 */
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-SemiBold.otf";

let cache: ArrayBuffer | null = null;

export async function loadKoreanFont(): Promise<ArrayBuffer> {
  if (cache) return cache;
  const res = await fetch(FONT_URL, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`font load failed: ${res.status}`);
  cache = await res.arrayBuffer();
  return cache;
}
