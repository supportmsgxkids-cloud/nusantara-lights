import { useState } from "react";
import { Sunrise, Sun, CloudSun, Sunset, Moon, Sparkles, MoonStar, Stars, BookHeart, Plus, Minus } from "lucide-react";
import {
  FARDHU, SUNNAH, FardhuKey, SunnahKey,
  getDay, toggleFardhu, toggleSunnah, getQadha, adjQadha,
} from "@/lib/ibadah-storage";
import { useIbadahVersion } from "@/hooks/use-ibadah";

const FARDHU_META: Record<FardhuKey, { label: string; icon: any; time: string }> = {
  subuh:   { label: "Subuh",   icon: Sunrise, time: "04:42" },
  dhuhr:   { label: "Dhuhur",  icon: Sun,     time: "12:05" },
  asr:     { label: "Ashar",   icon: CloudSun, time: "15:22" },
  maghrib: { label: "Maghrib", icon: Sunset,  time: "18:08" },
  isya:    { label: "Isya",    icon: Moon,    time: "19:18" },
};

const SUNNAH_META: Record<SunnahKey, { label: string; icon: any; sub: string }> = {
  dhuha:   { label: "Dhuha",   icon: Sparkles, sub: "Pagi · 2-8 rakaat" },
  tahajud: { label: "Tahajud", icon: MoonStar, sub: "Sepertiga malam" },
  witir:   { label: "Witir",   icon: Stars,    sub: "Sebelum Subuh" },
  rawatib: { label: "Rawatib", icon: BookHeart, sub: "Sunnah qabliyah/ba'diyah" },
};

export function SholatTracker() {
  useIbadahVersion();
  const today = new Date();
  const log = getDay(today);
  const q = getQadha();
  const [tab, setTab] = useState<"fardhu" | "sunnah" | "qadha">("fardhu");

  const doneFardhu = FARDHU.filter((k) => log.fardhu?.[k]).length;
  const doneSunnah = SUNNAH.filter((k) => log.sunnah?.[k]).length;
  const totalQadha = Object.values(q).reduce((a, b) => a + b, 0);

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Tracker Sholat</h3>
        <span className="text-xs text-text-muted">Hari ini</span>
      </div>

      <div className="mb-3 flex gap-2 rounded-pill bg-card2 p-1">
        {[
          { k: "fardhu", l: `Fardhu ${doneFardhu}/5` },
          { k: "sunnah", l: `Sunnah ${doneSunnah}/4` },
          { k: "qadha",  l: `Qadha ${totalQadha}` },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as any)}
            className={`flex-1 rounded-pill py-2 text-xs font-semibold transition-colors ${
              tab === t.k ? "bg-primary-900 text-primary-foreground" : "text-text-secondary"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === "fardhu" && (
        <div className="space-y-2">
          {FARDHU.map((k) => {
            const m = FARDHU_META[k]; const Icon = m.icon;
            const done = !!log.fardhu?.[k];
            return (
              <button
                key={k}
                onClick={() => toggleFardhu(today, k)}
                className={`flex w-full items-center gap-3 rounded-card border p-3.5 text-left press ${
                  done ? "border-success/40 bg-success/5" : "border-border bg-card"
                }`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-soft ${done ? "bg-success/15 text-success" : "bg-card2 text-text-secondary"}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${done ? "text-success" : "text-text-primary"}`}>{m.label}</div>
                  <div className="text-xs text-text-muted">{m.time}</div>
                </div>
                <span className={`flex h-6 w-6 items-center justify-center rounded-pill border-2 ${done ? "border-success bg-success" : "border-border"}`}>
                  {done && <svg viewBox="0 0 16 16" className="h-3 w-3 text-white"><path fill="currentColor" d="M6.5 11.5l-3-3 1-1 2 2 5-5 1 1z" /></svg>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {tab === "sunnah" && (
        <div className="space-y-2">
          {SUNNAH.map((k) => {
            const m = SUNNAH_META[k]; const Icon = m.icon;
            const done = !!log.sunnah?.[k];
            return (
              <button
                key={k}
                onClick={() => toggleSunnah(today, k)}
                className={`flex w-full items-center gap-3 rounded-card border p-3.5 text-left press ${
                  done ? "border-gold-400/50 bg-gold-50" : "border-border bg-card"
                }`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-soft ${done ? "bg-gold-400/20 text-gold-700" : "bg-card2 text-text-secondary"}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text-primary">{m.label}</div>
                  <div className="text-xs text-text-muted">{m.sub}</div>
                </div>
                <span className={`flex h-6 w-6 items-center justify-center rounded-pill border-2 ${done ? "border-gold-700 bg-gold-700" : "border-border"}`}>
                  {done && <svg viewBox="0 0 16 16" className="h-3 w-3 text-white"><path fill="currentColor" d="M6.5 11.5l-3-3 1-1 2 2 5-5 1 1z" /></svg>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {tab === "qadha" && (
        <div>
          <div className="mb-3 rounded-card border border-border bg-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Total qadha</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-primary tabular-nums">{totalQadha}</span>
              <span className="text-xs text-text-secondary">sholat belum dibayar</span>
            </div>
            <p className="mt-2 text-xs text-text-muted">Catat jumlah sholat fardhu yang harus diqadha. Kurangi setiap kali kamu menggantinya.</p>
          </div>
          <div className="space-y-2">
            {FARDHU.map((k) => {
              const m = FARDHU_META[k]; const Icon = m.icon;
              return (
                <div key={k} className="flex items-center gap-3 rounded-card border border-border bg-card p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-soft bg-card2 text-text-secondary">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1 text-sm font-semibold text-text-primary">{m.label}</div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => adjQadha(k, -1)} className="flex h-8 w-8 items-center justify-center rounded-pill border border-border press" aria-label="Kurangi">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">{q[k]}</span>
                    <button onClick={() => adjQadha(k, 1)} className="flex h-8 w-8 items-center justify-center rounded-pill bg-primary-900 text-primary-foreground press" aria-label="Tambah">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
