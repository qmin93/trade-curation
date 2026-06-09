import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "단타 트레이드 — 키워드 큐레이션 터미널";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(62, 106, 225, 0.3), transparent 60%), radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.15), transparent 50%), #0a0e1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#f1f5f9",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#ef4444",
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: "#94a3b8",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Live · Keyword Curation Terminal
          </div>
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#f1f5f9",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          하이닉스·삼성전자·연금
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #3e6ae1 0%, #60a5fa 50%, #93c5fd 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginTop: 8,
            letterSpacing: "-0.04em",
          }}
        >
          한 화면에.
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 40,
            lineHeight: 1.5,
          }}
        >
          매경·연합·한경에서 흩어진 단타 뉴스를 시초가 직전 한 화면에
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            display: "flex",
            gap: 16,
          }}
        >
          {["HBM", "코스피", "사이드카", "FOMC", "MSCI"].map((k) => (
            <div
              key={k}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 18,
                color: "#94a3b8",
                fontFamily: "monospace",
              }}
            >
              #{k}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
