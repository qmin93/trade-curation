import { StudioClient } from "@/components/StudioClient";

/**
 * 이미지 공방 — Threads 올릴 카드를 입력폼으로 즉석 생성·다운로드.
 * 종목·뉴스·픽을 직접 타이핑 → 실시간 미리보기 + 톤별 본문 초안.
 */
export const metadata = {
  title: "이미지 공방 · 카드 생성",
  description: "Threads용 종목·뉴스·픽·성과 카드를 사이트에서 바로 생성·다운로드.",
};

export default function StudioPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
        Image Studio
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">이미지 공방</h1>
      <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed mb-10">
        Threads에 올릴 카드를 여기서 바로 만듭니다. 차트·뉴스를 직접 캡처할 필요
        없이 — 내용을 입력하면 1080 카드가 실시간으로 생성되고, 본문 초안까지
        같이 나옵니다.
      </p>
      <StudioClient />
    </div>
  );
}
