import { Moon, Sun } from "lucide-react";

export function SahurIftarCard() {
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Sahur & Buka</h3>
        <span className="text-xs text-text-muted">Berdasarkan jadwal Subuh & Maghrib</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="overflow-hidden rounded-card border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted">
            <Moon className="h-3 w-3" /> Imsak / Sahur
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-text-primary">04:22</div>
          <div className="mt-0.5 text-[11px] text-text-secondary">10 menit sebelum Subuh</div>
        </div>
        <div className="overflow-hidden rounded-card border border-border bg-primary-900 p-4 text-primary-foreground">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary-foreground/70">
            <Sun className="h-3 w-3" /> Berbuka
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-gold-400">18:08</div>
          <div className="mt-0.5 text-[11px] text-primary-foreground/80">Waktu Maghrib · Jakarta</div>
        </div>
      </div>
    </section>
  );
}
