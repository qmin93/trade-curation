"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 자체 페이지뷰 비콘 — 경로 바뀔 때마다 /api/track에 1건 기록.
 * 실패해도 사이트엔 영향 없음(조용히 무시). PII 저장 안 함(path + referrer만).
 */
export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const body = JSON.stringify({
        path: pathname || "/",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      });
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* noop */
    }
  }, [pathname]);
  return null;
}
