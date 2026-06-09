export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-2/3 bg-[var(--bg-elevated)] rounded" />
        <div className="h-4 w-1/2 bg-[var(--bg-elevated)] rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
