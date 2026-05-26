import { Play } from "lucide-react";

export function HeroBanner() {
  const progress = 62;
  return (
    <section className="mt-5 px-5">
      <div
        className="relative overflow-hidden rounded-lg bg-primary-900 p-5 text-primary-foreground"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-500/30 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />

        <div className="relative">
          <span className="inline-flex rounded-pill bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
            Lanjutkan belajar
          </span>
          <h3 className="mt-3 text-xl font-bold leading-snug">Fiqh Sholat — Rukun & Syarat</h3>
          <p className="mt-1 text-sm text-primary-foreground/70">Modul 3 dari 8 · Ust. Hanif</p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-primary-foreground/80">
              <span>Progres</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-white/15">
              <div className="h-full rounded-pill bg-gold-400" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button className="mt-5 inline-flex items-center gap-2 rounded-pill bg-card px-4 py-2.5 text-sm font-semibold text-primary-900 press">
            <Play className="h-4 w-4" fill="currentColor" />
            Lanjut menonton
          </button>
        </div>
      </div>
    </section>
  );
}
