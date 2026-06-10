"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTodayEvents, WEEK_AHEAD, type MarketEvent } from "@/lib/calendar";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function eventMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function CompactCalendar() {
  const [current, setCurrent] = useState<number | null>(null);
  const [events, setEvents] = useState<MarketEvent[]>([]);

  useEffect(() => {
    setEvents(getTodayEvents());
    setCurrent(nowMinutes());
    const id = setInterval(() => setCurrent(nowMinutes()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (current === null) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)]">
          Calendar
        </div>
      </div>
    );
  }

  const upcoming = events.filter((e) => eventMinutes(e.time) >= current).slice(0, 4);
  const display = upcoming.length > 0 ? upcoming : events.slice(-4);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
        <Link href="/calendar" className="hover:text-[var(--accent)]">
          Calendar ↗
        </Link>
        <span className="mono tabular-nums text-[var(--accent)] font-bold">
          {pad(Math.floor(current / 60))}:{pad(current % 60)}
        </span>
      </div>
      <div className="space-y-1">
        {display.map((e) => {
          const past = current >= eventMinutes(e.time);
          return (
            <div
              key={`${e.time}-${e.label}`}
              className={`flex items-center gap-2 text-[11px] ${past ? "opacity-40" : ""}`}
            >
              <span className="mono text-[var(--accent)] font-bold w-10 shrink-0">
                {e.time}
              </span>
              <span className="text-[var(--text)] truncate flex-1">
                {e.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-[var(--border)] mt-2 pt-2 space-y-1">
        {WEEK_AHEAD.slice(0, 3).map((e) => (
          <div key={`${e.date}-${e.label}`} className="text-[11px]">
            <span className="mono font-bold text-[var(--text-caption)] mr-2">
              {e.date}
            </span>
            <span className="text-[var(--text-muted)]">{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
