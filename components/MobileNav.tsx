"use client";

import Link from "next/link";
import { useState } from "react";
import type { Keyword } from "@/lib/keywords";

interface ExtraLink {
  href: string;
  label: string;
}

export function MobileNav({
  keywords,
  extras = [],
}: {
  keywords: Keyword[];
  extras?: ExtraLink[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden flex flex-col gap-1 p-1.5"
        aria-label="메뉴 토글"
      >
        <span
          className={`block w-5 h-0.5 bg-[var(--text)] transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
        />
        <span
          className={`block w-5 h-0.5 bg-[var(--text)] transition-opacity ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-5 h-0.5 bg-[var(--text)] transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 top-[88px] bg-[var(--bg)]/95 backdrop-blur-sm z-40 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col p-4 gap-2">
            {extras.length > 0 && (
              <>
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mt-2 mb-1">
                  Pages
                </div>
                {extras.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="px-4 py-3 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-base font-medium hover:border-[var(--accent)]/50 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </Link>
                ))}
              </>
            )}
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mt-4 mb-1">
              Keywords
            </div>
            {keywords.map((k) => (
              <Link
                key={k.slug}
                href={`/keyword/${k.slug}`}
                className="px-4 py-3 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-base font-medium hover:border-[var(--accent)]/50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {k.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
