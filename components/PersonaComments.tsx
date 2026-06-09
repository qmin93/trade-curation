import { PERSONAS, type PersonaSlug } from "@/lib/personas";

export function PersonaComments({
  comments,
}: {
  comments: Partial<Record<PersonaSlug, string>>;
}) {
  const filled = PERSONAS.filter((p) => comments[p.slug]);
  if (filled.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-[var(--border)]">
      <div className="text-xs font-semibold text-[var(--caption)] uppercase tracking-widest mb-3">
        6 페르소나 톤 코멘트
      </div>
      <div className="space-y-3">
        {filled.map((p) => (
          <div
            key={p.slug}
            className="rounded-lg bg-[var(--subtle)] p-4 border-l-4"
            style={{ borderLeftColor: p.color }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
              <span className="text-[10px] text-[var(--caption)]">
                ← {p.benchmark}
              </span>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-[var(--body)]">
              {comments[p.slug]}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
