"use client";

import { useEffect, useRef, memo } from "react";

/**
 * TradingView Advanced Chart 임베드 위젯.
 * KRX 종목(코스피·코스닥) 실시간(지연) 차트. 테마·인터벌·스타일을 바꿔 5계정용 다른 캡처 생성.
 */
function TradingViewWidget({
  symbol,
  theme = "dark",
  interval = "D",
  style = "1",
  height = 520,
}: {
  symbol: string; // 예: "KRX:122640"
  theme?: "dark" | "light";
  interval?: string; // "1","5","15","60","D","W"
  style?: string; // "1"=캔들 "2"=바 "3"=라인 "8"=영역
  height?: number;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      interval,
      theme,
      style,
      locale: "kr",
      timezone: "Asia/Seoul",
      width: "100%",
      height,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);
    return () => {
      el.innerHTML = "";
    };
  }, [symbol, theme, interval, style, height]);

  return (
    <div
      className="tradingview-widget-container rounded-xl overflow-hidden border border-[var(--border)]"
      ref={container}
      style={{ height }}
    />
  );
}

export default memo(TradingViewWidget);
