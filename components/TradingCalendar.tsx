"use client";

import { useEffect, useState } from "react";
import { getTodayEvents, WEEK_AHEAD, type MarketEvent } from "@/lib/calendar";

const priorityColor = {
  1: "border-[var(--border)] text-[var(--text-caption)]",
  2: "border-[var(--accent)]/40 text-[var(--accent)]",
  3: "border-[var(--red)]/50 text-[var(--red)]",
};

const importanceColor = {
  1: "text-[var(--text-caption)]",
  2: "text-[var(--accent)]",
  3: "text-[var(--red)]",
};

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

function EventRow({ event, current }: { event: MarketEvent; current: number }) {
  const evMin = eventMinutes(event.time);
  const isPast = current >= evMin;
  const isNext = !isPast && current < evMin;

  return (
    <div
      className={`flex items-start gap-3 py-2.5 border-l-2 pl-3 transition-opacity ${
        priorityColor[event.priority]
      } ${isPast ? "opacity-40" : ""}`}
    >
      <div className="mono text-xs font-bold w-12 shrink-0">
        {event.time}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[var(--text)] leading-tight">
          {event.label}
        </div>
        {event.note && (
          <div className="text-[11px] text-[var(--text-caption)] mt-0.5">
            {event.note}
          </div>
        )}
      </div>
      {isNext && (
        <div className="text-[9px] mono uppercase tracking-widest text-[var(--accent)]">
          next
        </div>
      )}
    </div>
  );
}

export function TradingCalendar() {
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        <div className="text-sm text-[var(--text-caption)]">Loading…</div>
      </div>
    );
  }

  const hour = pad(Math.floor(current / 60));
  const min = pad(current % 60);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1">
            Trading Calendar · Today
          </div>
          <div className="text-sm text-[var(--text-muted)]">한국 시간 KST</div>
        </div>
        <div className="mono text-xl font-bold tabular-nums text-[var(--accent)]">
          {hour}:{min}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-sm text-[var(--text-caption)]">
          주말·휴장일
        </div>
      ) : (
        <div className="space-y-0">
          {events.map((e) => (
            <EventRow key={`${e.time}-${e.label}`} event={e} current={current} />
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-3">
          This Week
        </div>
        <div className="space-y-1.5">
          {WEEK_AHEAD.map((e, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span
                className={`mono w-14 shrink-0 font-bold ${importanceColor[e.importance]}`}
              >
                {e.date}
              </span>
              <span className="text-[var(--text-muted)] flex-1">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
