import { useState } from "react";
import { addDays, startOfDay } from "@/lib/hijri";
import { computeStats, FARDHU } from "@/lib/ibadah-storage";
import { useIbadahVersion } from "@/hooks/use-ibadah";
import { TrendingUp, AlertTriangle, Flame } from "lucide-react";

type Range = "week" | "month" | "year";

const PRAYER_LABEL: Record<string, string> = {
  subuh: "Subuh", dhuhr: "Dhuhur", asr: "Ashar", maghrib: "Maghrib", isya: "Isya",
};

export function SholatStats() {
  useIbadahVersion();
  const [range, setRange] = useState<Range>("week");
  const today = startOfDay(new Date());
  const days = range === "week" ? 7 : range === "month" ? 30 : 365;
  const from = addDays(today, -(days - 1));
  const stats = computeStats(from, today);
  const pct = stats.totalFardhu ? Math.round((stats.doneFardhu / stats.totalFardhu) * 100) : 0;

  // streak
  let streak = 0;
  for (let i = stats.perDay.length - 1; i >= 0; i--) {
    if (stats.perDay[i].done === 5) streak++; else break;
  }

  const maxBar = Math.max(...stats.perDay.map((d) => d.done), 5);

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Statistik Sholat</h3>
        <div className="flex gap-1 rounded-pill bg-card2 p-0.5">
          {(["week", "month", "year"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-pill px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                range === r ? "bg-primary-900 text-primary-foreground" : "text-text-secondary"
              }`}
            >
              {r === "week" ? "Mingguan" : r === "month" ? "Bulanan" : "Tahunan"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={TrendingUp} tone="primary" label="Konsistensi" value={`${pct}%`} sub={`${stats.doneFardhu}/${stats.totalFardhu}`} />
        <StatCard icon={Flame} tone="gold" label="Streak penuh" value={`${streak}`} sub="hari" />
        <StatCard icon={AlertTriangle} tone="danger" label="Bolong" value={`${stats.missed}`} sub="rakaat" />
      </div>

      {/* Per-day bars */}
      <div className="mt-4 rounded-card border border-border bg-card p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="text-xs font-semibold text-text-primary">Aktivitas {days} hari terakhir</div>
          <div className="text-[10px] text-text-muted">5 = lengkap</div>
        </div>
        <div className="flex h-24 items-end gap-[2px]">
          {stats.perDay.map((d, i) => {
            const h = (d.done / maxBar) * 100;
            const full = d.done === 5;
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                title={`${d.date.toLocaleDateString("id-ID")} · ${d.done}/5`}
                style={{
                  height: `${Math.max(h, 4)}%`,
                  background: full
                    ? "var(--primary-500)"
                    : d.done === 0
                      ? "var(--card2)"
                      : "color-mix(in oklab, var(--primary-500) 55%, var(--card2))",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Per-prayer breakdown */}
      <div className="mt-3 rounded-card border border-border bg-card p-4">
        <div className="mb-3 text-xs font-semibold text-text-primary">Per waktu sholat</div>
        <div className="space-y-2.5">
          {FARDHU.map((k) => {
            const row = stats.byPrayer[k];
            const total = row.done + row.missed;
            const donePct = total ? (row.done / total) * 100 : 0;
            return (
              <div key={k}>
                <div className="mb-1 flex items-baseline justify-between text-[11px]">
                  <span className="font-medium text-text-primary">{PRAYER_LABEL[k]}</span>
                  <span className="tabular-nums text-text-muted">
                    {row.done}<span className="text-success">●</span> / {row.missed}<span className="text-danger">●</span>
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-pill bg-card2">
                  <div className="bg-success" style={{ width: `${donePct}%` }} />
                  <div className="bg-danger/70" style={{ width: `${100 - donePct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunnah counters */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {(["dhuha", "tahajud", "witir", "rawatib"] as const).map((k) => (
          <div key={k} className="rounded-card border border-border bg-card p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-text-muted">{k}</div>
            <div className="mt-1 text-lg font-bold tabular-nums text-primary-900">{stats.sunnah[k]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: {
  icon: any; label: string; value: string; sub: string;
  tone: "primary" | "gold" | "danger";
}) {
  const colors = {
    primary: { bg: "bg-primary-50", text: "text-primary-900" },
    gold:    { bg: "bg-gold-50", text: "text-gold-700" },
    danger:  { bg: "bg-destructive/10", text: "text-danger" },
  }[tone];
  return (
    <div className="rounded-card border border-border bg-card p-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-soft ${colors.bg}`}>
        <Icon className={`h-4 w-4 ${colors.text}`} strokeWidth={2} />
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`text-xl font-bold tabular-nums ${colors.text}`}>{value}</div>
      <div className="text-[10px] text-text-muted">{sub}</div>
    </div>
  );
}
