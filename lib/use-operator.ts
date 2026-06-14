"use client";

import { useEffect, useState } from "react";

/**
 * 운영자 모드 — 운영 전용 UI(Threads 본문 생성기)를 방문자에게 숨긴다.
 * **해시 `#op=<SECRET>`** 권장: 해시는 서버·CDN에 안 보내져서 plain과 같은 캐시 = 같은 뉴스.
 *   → `dantatrade.vercel.app/#op=qmin-ops-2026` 북마크.
 * (구버전 `?op=`도 인식하지만 쿼리는 Vercel이 따로 캐싱해 뉴스가 다를 수 있음 → 해시 권장.)
 * 저장 안 함 → 해시/쿼리 없는 plain URL은 항상 깨끗.
 *
 * ⚠️ 클라이언트 게이트라 강력한 보안은 아님. 일반 방문자 차단 용도로는 충분.
 */
const SECRET = "qmin-ops-2026";
const KEY = "op";

export function useOperator(): boolean {
  const [op, setOp] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem(KEY); // 과거 저장 플래그 정리
      const url = new URL(window.location.href);
      const fromQuery = url.searchParams.get("op");
      const fromHash = new URLSearchParams(url.hash.replace(/^#/, "")).get("op");
      setOp(fromQuery === SECRET || fromHash === SECRET);
    } catch {
      /* noop */
    }
  }, []);

  return op;
}
