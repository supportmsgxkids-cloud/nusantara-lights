import { useEffect, useState } from "react";
import { MapPin, Bell } from "lucide-react";

const PRAYERS = [
  { key: "subuh", label: "Subuh", time: "04:42" },
  { key: "dhuhr", label: "Dhuhur", time: "12:05" },
  { key: "asr", label: "Ashar", time: "15:22" },
  { key: "maghrib", label: "Maghrib", time: "18:08" },
  { key: "isya", label: "Isya", time: "19:18" },
] as const;

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function pickNext(nowMin: number) {
  const upcoming = PRAYERS.find((p) => toMinutes(p.time) > nowMin);
  return upcoming ?? PRAYERS[0];
}

function formatCountdown(minutesUntil: number) {
  if (minutesUntil < 0) minutesUntil += 24 * 60;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;
  if (h <= 0) return `${m} menit lagi`;
  return `${h} jam ${m} menit lagi`;
}

export function NextPrayerCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const next = now ? pickNext(nowMin) : PRAYERS[1];
  const countdown = now ? formatCountdown(toMinutes(next.time) - nowMin) : "—";

  return (
    <section className="mt-4 px-5">
      <div
        className="relative overflow-hidden rounded-lg bg-primary-900 p-5 text-primary-foreground"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-500/25 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-gold-400/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between text-[11px] text-primary-foreground/75">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              Jakarta, Indonesia
            </span>
            <span className="font-arabic text-sm" suppressHydrationWarning>
              ١٧ ذو القعدة
            </span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-widest text-primary-foreground/70">
            Sholat berikutnya
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <h2 className="text-3xl font-bold">{next.label}</h2>
            <span className="text-xl font-semibold text-gold-400">{next.time}</span>
          </div>
          <p className="mt-1 text-sm text-primary-foreground/80" suppressHydrationWarning>
            {countdown}
          </p>

          <button className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur press">
            <Bell className="h-3.5 w-3.5" />
            Aktifkan pengingat
          </button>
        </div>
      </div>
    </section>
  );
}
