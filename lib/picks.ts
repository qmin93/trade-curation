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
  date: "2026-06-15",
  stockName: "예스티",
  ticker: "122640",
  entry: "32,100",
  targets: ["1차 +1.4%", "2차 +3.4%", "3차 +5.5%", "4차 +7.4%"],
  thesis:
    "세력감지 전략 12:00 포착 — 일봉 +8.4%로 5·20일선 위, 분봉 VWAP 위. 1차 목표가(+1.4%) 달성으로 마감. (당일 한온시스템은 1~4차 전부 달성·최고 +12.62%)",
  status: "done",
  resultPercent: 1.4,
};
