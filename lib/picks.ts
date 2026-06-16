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
  date: "2026-06-16",
  stockName: "DL이앤씨",
  ticker: "375500",
  entry: "88,300",
  targets: ["1차 +1.0%", "2차 +2.5%", "3차 +4.5%", "4차 +7.0%"],
  thesis:
    "세력 포착 09:22 — 일봉 +12.2%로 강세, 다만 시가 대비 이미 +9.9% 움직인 자리(20일 고점 대비 -2.2%)라 차익 매물 확인이 관건. 추격보다 포착가 근처에서 거래대금이 계속 붙는지 기준 확인이 먼저.",
  status: "done",
  resultPercent: 7.13,
};
