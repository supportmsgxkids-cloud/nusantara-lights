import { useEffect, useState } from "react";
import { Sunrise, Sun, CloudSun, Sunset, Moon } from "lucide-react";

const PRAYERS = [
  { key: "subuh", label: "Subuh", time: "04:42", icon: Sunrise },
  { key: "dhuhr", label: "Dhuhur", time: "12:05", icon: Sun },
  { key: "asr", label: "Ashar", time: "15:22", icon: CloudSun },
  { key: "maghrib", label: "Maghrib", time: "18:08", icon: Sunset },
  { key: "isya", label: "Isya", time: "19:18", icon: Moon },
];

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function PrayerSchedule() {
  const [nowMin, setNowMin] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNowMin(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const nextIdx =
    nowMin === null ? -1 : PRAYERS.findIndex((p) => toMinutes(p.time) > nowMin);

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Jadwal Sholat</h3>
        <button className="text-xs font-medium text-primary-900">Bulan ini</button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-card">
        {PRAYERS.map(({ key, label, time, icon: Icon }, i) => {
          const isNext = i === nextIdx;
          const isPast = nextIdx !== -1 && i < nextIdx;
          return (
            <div
              key={key}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i < PRAYERS.length - 1 ? "border-b border-border" : ""
              } ${isNext ? "bg-primary-50/60" : ""}`}
              suppressHydrationWarning
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-soft ${
                  isNext ? "bg-primary-900 text-primary-foreground" : "bg-card2 text-text-secondary"
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <div className="flex-1">
                <div
                  className={`text-sm font-semibold ${
                    isPast ? "text-text-muted" : "text-text-primary"
                  }`}
                >
                  {label}
                </div>
                {isNext && (
                  <div className="text-[11px] font-medium text-primary-900">Segera</div>
                )}
              </div>
              <div
                className={`text-base font-semibold tabular-nums ${
                  isPast ? "text-text-muted" : "text-text-primary"
                }`}
              >
                {time}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
