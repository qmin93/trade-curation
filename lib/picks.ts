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
  date: "2026-06-17",
  stockName: "동진쎄미켐",
  ticker: "005290",
  entry: "64,800",
  targets: ["1차 +1.0%", "2차 +2.5%", "3차 +4.5%", "4차 +7.0%"],
  thesis:
    "세력 포착 09:13 — 시가 대비 +6.2% 자리지만 20일 고점 대비 -10.2% 아래로 위쪽 공간이 남은 편. 추격보다 포착가 근처 거래대금이 받쳐주는지 확인 후 접근, 1·2차 목표 달성(+2.5%).",
  status: "done",
  resultPercent: 2.5,
};
