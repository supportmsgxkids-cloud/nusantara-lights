import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  HIJRI_MONTHS_ID, toHijri, sunnahFastsFor, addDays, startOfDay, ymd,
} from "@/lib/hijri";
import { getDay } from "@/lib/ibadah-storage";
import { useIbadahVersion } from "@/hooks/use-ibadah";

const DOW = ["M", "S", "S", "R", "K", "J", "S"];

export function HijriCalendar() {
  useIbadahVersion();
  const [cursor, setCursor] = useState(() => startOfDay(new Date()));
  const today = startOfDay(new Date());

  const monthInfo = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const startPad = first.getDay();
    const days: Date[] = [];
    for (let i = 0; i < startPad; i++) days.push(addDays(first, i - startPad));
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    while (days.length % 7 !== 0) days.push(addDays(days[days.length - 1], 1));
    return { days, first };
  }, [cursor]);

  const hijriFirst = toHijri(monthInfo.first);
  const hijriLast = toHijri(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
  const hijriRange =
    hijriFirst.month === hijriLast.month
      ? `${HIJRI_MONTHS_ID[hijriFirst.month - 1]} ${hijriFirst.year}`
      : `${HIJRI_MONTHS_ID[hijriFirst.month - 1]}–${HIJRI_MONTHS_ID[hijriLast.month - 1]} ${hijriLast.year}`;

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Kalender Hijriyah</h3>
        <span className="text-xs text-text-muted">{hijriRange} H</span>
      </div>

      <div className="rounded-card border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-pill bg-card2 press"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-semibold text-text-primary">
            {cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </div>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-pill bg-card2 press"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-text-muted">
          {DOW.map((d, i) => <div key={i}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthInfo.days.map((d) => {
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = ymd(d) === ymd(today);
            const h = toHijri(d);
            const fasts = sunnahFastsFor(d);
            const log = getDay(d);
            const isPast = d <= today;
            const doneAll = (Object.values(log.fardhu || {}).filter(Boolean).length) === 5;
            const someMissed = isPast && d < today && (Object.values(log.fardhu || {}).filter(Boolean).length) < 5;
            const fasted = log.fast;

            return (
              <div
                key={d.toISOString()}
                className={`relative aspect-square rounded-soft border p-1 text-left ${
                  isToday
                    ? "border-primary-900 bg-primary-50"
                    : inMonth
                      ? "border-transparent bg-card2/40"
                      : "border-transparent bg-transparent opacity-40"
                }`}
              >
                <div className={`text-[11px] font-semibold leading-none ${isToday ? "text-primary-900" : "text-text-primary"}`}>
                  {d.getDate()}
                </div>
                <div className="mt-0.5 font-arabic text-[10px] leading-none text-text-muted" suppressHydrationWarning>
                  {h.day}
                </div>
                <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-0.5">
                  <div className="flex gap-0.5">
                    {fasts.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" title="Puasa sunnah" />
                    )}
                    {fasted && <span className="h-1.5 w-1.5 rounded-full bg-primary-500" title="Puasa" />}
                  </div>
                  {doneAll && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
                  {someMissed && !doneAll && (
                    <span className="h-1.5 w-1.5 rounded-full bg-danger/60" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-muted">
          <Legend color="bg-gold-400" label="Puasa sunnah" />
          <Legend color="bg-success" label="Sholat lengkap" />
          <Legend color="bg-danger/60" label="Ada yang bolong" />
          <Legend color="bg-primary-500" label="Berpuasa" />
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
