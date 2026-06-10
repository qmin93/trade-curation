/**
 * 오늘의 픽 — 터미널에서 픽을 주면 ACTIVE_PICK을 갱신해 메인 상단 스포트라이트에 노출한다.
 * 픽이 없으면 null (스포트라이트 숨김).
 *
 * 갱신 흐름: 사용자가 터미널에 픽 전달 → Claude가 ACTIVE_PICK 수정 → git push → 메인 반영.
 */

export interface SitePick {
  date: string;
  stockName: string;
  ticker: string;
  /** 진입 자리 (예: "16,020") */
  entry?: string;
  /** 목표 (예: ["1차 +1.4%", "2차 +3.4%"]) */
  targets?: string[];
  /** 픽 근거 한두 줄 */
  thesis: string;
  /** live = 진행 중, done = 마감(결과 확정) */
  status: "live" | "done";
  /** 마감 시 결과 수익률 (%) */
  resultPercent?: number;
}

export const ACTIVE_PICK: SitePick | null = {
  date: "2026-06-10",
  stockName: "후성",
  ticker: "093370",
  entry: "16,020",
  targets: ["1차 +1.4%", "2차 +3.4%"],
  thesis:
    "다중 기술지표 동시 돌파 + 세력 매집 자리. KOSPI -4.52% 약세 속에서도 단발 정통 흐름으로 1·2차 목표 모두 도달.",
  status: "done",
  resultPercent: 3.4,
};
