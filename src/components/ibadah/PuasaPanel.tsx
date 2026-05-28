import { useMemo } from "react";
import { Flame, Check, Calendar } from "lucide-react";
import { addDays, startOfDay, sunnahFastsFor, FAST_LABEL, nextSunnahFast, ymd } from "@/lib/hijri";
import { getDay, toggleFast } from "@/lib/ibadah-storage";
import { useIbadahVersion } from "@/hooks/use-ibadah";

const FAST_INFO: Record<string, string> = {
  senin: "Puasa Sunnah Senin · diangkat amalan",
  kamis: "Puasa Sunnah Kamis · diangkat amalan",
  "ayyamul-bidh": "Ayyamul Bidh · 13, 14, 15 Hijriyah",
  arafah: "Puasa Arafah · menghapus dosa 2 tahun",
  asyura: "Puasa Asyura · menghapus dosa 1 tahun",
  tasua: "Puasa Tasu'a · sehari sebelum Asyura",
  dzulhijjah: "10 hari Dzulhijjah · amal paling dicintai",
  syawal: "6 hari Syawal · pahala puasa setahun",
  "syaban-nisfu": "Nisfu Sya'ban",
};

export function PuasaPanel() {
  useIbadahVersion();
  const today = startOfDay(new Date());
  const todayLog = getDay(today);
  const todayFasts = sunnahFastsFor(today);
  const next = useMemo(() => nextSunnahFast(today, 60), [today]);

  // upcoming list for 60 days
  const upcoming = useMemo(() => {
    const out: { date: Date; tags: string[] }[] = [];
    for (let i = 0; i < 60 && out.length < 8; i++) {
      const d = addDays(today, i);
      const t = sunnahFastsFor(d);
      if (t.length) out.push({ date: d, tags: t });
    }
    return out;
  }, [today]);

  // current week log
  const weekStart = addDays(today, -today.getDay());
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const fastedThisWeek = week.filter((d) => getDay(d).fast).length;

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Puasa</h3>
        <span className="text-xs text-text-muted">{fastedThisWeek} hari minggu ini</span>
      </div>

      {/* Hero next fast */}
      {next && (
        <div
          className="relative overflow-hidden rounded-card bg-primary-900 p-4 text-primary-foreground"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-400/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary-foreground/70">
              <Flame className="h-3 w-3" /> Puasa berikutnya
            </div>
            <div className="mt-1 text-lg font-bold">
              {FAST_LABEL[next.tags[0]]}
            </div>
            <div className="text-xs text-primary-foreground/80">
              {next.date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              {ymd(next.date) === ymd(today) ? " · hari ini" : ` · ${Math.round((next.date.getTime() - today.getTime()) / 86400000)} hari lagi`}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-soft bg-white/10 p-2.5 backdrop-blur">
                <div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">Sahur</div>
                <div className="font-bold text-gold-400">04:22</div>
              </div>
              <div className="rounded-soft bg-white/10 p-2.5 backdrop-blur">
                <div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">Buka</div>
                <div className="font-bold text-gold-400">18:08</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today toggle */}
      <button
        onClick={() => toggleFast(today, todayFasts[0])}
        className={`mt-3 flex w-full items-center gap-3 rounded-card border p-3.5 text-left press ${
          todayLog.fast ? "border-success/40 bg-success/5" : "border-border bg-card"
        }`}
      >
        <span className={`flex h-11 w-11 items-center justify-center rounded-soft ${todayLog.fast ? "bg-success/15 text-success" : "bg-card2 text-text-secondary"}`}>
          <Flame className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">
            {todayLog.fast ? "Saya berpuasa hari ini" : "Tandai puasa hari ini"}
          </div>
          <div className="text-xs text-text-muted">
            {todayFasts.length ? todayFasts.map((t) => FAST_LABEL[t]).join(" · ") : "Puasa biasa / qadha"}
          </div>
        </div>
        <span className={`flex h-6 w-6 items-center justify-center rounded-pill border-2 ${todayLog.fast ? "border-success bg-success" : "border-border"}`}>
          {todayLog.fast && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
      </button>

      {/* Week strip */}
      <div className="mt-3 rounded-card border border-border bg-card p-3">
        <div className="mb-2 text-xs font-semibold text-text-primary">Minggu ini</div>
        <div className="flex gap-1">
          {week.map((d) => {
            const fasted = !!getDay(d).fast;
            const isToday = ymd(d) === ymd(today);
            return (
              <div key={d.toISOString()} className="flex-1 text-center">
                <div className="text-[10px] text-text-muted">
                  {d.toLocaleDateString("id-ID", { weekday: "narrow" })}
                </div>
                <div className={`mt-1 mx-auto flex h-9 w-9 items-center justify-center rounded-pill text-xs font-semibold ${
                  fasted
                    ? "bg-primary-500 text-white"
                    : isToday
                      ? "border border-primary-900 text-primary-900"
                      : "bg-card2 text-text-secondary"
                }`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming sunnah list */}
      <div className="mt-3 overflow-hidden rounded-card border border-border bg-card">
        <div className="flex items-center gap-1.5 px-4 pt-3 text-xs font-semibold text-text-primary">
          <Calendar className="h-3.5 w-3.5" /> Jadwal puasa sunnah
        </div>
        <div className="mt-2">
          {upcoming.map(({ date, tags }, i) => (
            <div
              key={date.toISOString()}
              className={`flex items-center gap-3 px-4 py-3 ${i < upcoming.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex h-11 w-11 flex-col items-center justify-center rounded-soft bg-gold-50 text-gold-700">
                <div className="text-[9px] uppercase leading-none">{date.toLocaleDateString("id-ID", { month: "short" })}</div>
                <div className="text-base font-bold leading-none">{date.getDate()}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-text-primary">{FAST_LABEL[tags[0] as keyof typeof FAST_LABEL]}</div>
                <div className="text-[11px] text-text-muted">{FAST_INFO[tags[0]]}</div>
              </div>
              <div className="text-[10px] text-text-muted">
                {date.toLocaleDateString("id-ID", { weekday: "short" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
