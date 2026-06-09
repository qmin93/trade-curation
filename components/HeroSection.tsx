export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(62, 106, 225, 0.25), transparent 50%), radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.15), transparent 50%)`,
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)]">
            Live · Keyword Curation Terminal
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
          하이닉스·삼성전자·연금
          <br />
          <span className="gradient-text">한 화면에.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          단타 트레이더가 직접 큐레이션하는 키워드 뉴스. 매경·연합·한경에서
          흩어진 단타 뉴스를 시초가 직전 한 화면에.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 mono text-[11px] uppercase tracking-widest">
          <div className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            5 핫 키워드
          </div>
          <div className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            6월 이벤트 캘린더
          </div>
          <div className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            매경·연합·한경 통합
          </div>
        </div>
      </div>
    </section>
  );
}
