import { fetchRecentDartDisclosures, dartViewerUrl } from "@/lib/dart-fetcher";

/**
 * 실시간 공시(DART) — 기사화 전 가장 빠른 단타 하드 재료.
 * 수주·공급계약·유증·자사주 공시를 거래소 접수 즉시 노출. 키 없으면 렌더 안 함.
 */

/** 보고서명을 짧은 라벨로. */
function shortLabel(reportNm: string): string {
  const nm = reportNm.replace(/^\[[^\]]*\]/, "").trim();
  if (nm.includes("공급계약") || nm.includes("단일판매")) return "공급계약";
  if (nm.includes("유상증자")) return "유상증자";
  if (nm.includes("무상증자")) return "무상증자";
  if (nm.includes("자기주식취득")) return "자사주취득";
  if (nm.includes("자기주식소각")) return "자사주소각";
  if (nm.includes("전환사채")) return "전환사채";
  if (nm.includes("수주")) return "수주";
  if (nm.includes("투자판단")) return "투자판단";
  if (nm.includes("특허")) return "특허";
  if (nm.includes("임상")) return "임상";
  return nm.slice(0, 8);
}

export async function DartDisclosures({ limit = 8 }: { limit?: number }) {
  const all = await fetchRecentDartDisclosures();
  const items = all.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)]">
          📢 실시간 공시
        </div>
        <span className="mono text-[8px] text-[var(--text-caption)]">DART</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((d) => (
          <li key={d.rceptNo}>
            <a
              href={dartViewerUrl(d.rceptNo)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] hover:bg-[var(--bg-subtle)] rounded px-1 py-0.5 -mx-1 transition-colors"
            >
              <span className="flex-1 truncate text-[var(--text)] font-medium">
                {d.corpName}
              </span>
              <span className="mono text-[9px] shrink-0 rounded bg-[var(--accent)]/10 px-1.5 py-0.5 text-[var(--accent)]">
                {shortLabel(d.reportNm)}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mono text-[8px] text-[var(--text-caption)] mt-2 text-right">
        출처 금융감독원 DART
      </p>
    </div>
  );
}
