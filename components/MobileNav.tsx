"use client";

import Link from "next/link";
import { useState } from "react";
import type { Keyword } from "@/lib/keywords";

export function MobileNav({ keywords }: { keywords: Keyword[] }) {
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
          className="md:hidden fixed inset-0 top-[88px] bg-[var(--bg)]/95 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col p-4 gap-2">
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
