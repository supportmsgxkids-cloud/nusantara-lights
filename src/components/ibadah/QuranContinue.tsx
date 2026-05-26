import { ChevronRight, BookOpen } from "lucide-react";

export function QuranContinue() {
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Al-Quran</h3>
        <button className="text-xs font-medium text-primary-900">Lihat semua</button>
      </div>

      <button
        className="flex w-full items-center gap-3 rounded-card border border-border bg-card p-4 text-left press"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-soft bg-primary-50 text-primary-900">
          <BookOpen className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Terakhir dibaca
          </div>
          <div className="mt-0.5 text-sm font-semibold text-text-primary">
            Al-Baqarah · Ayat 183
          </div>
          <div className="text-xs text-text-secondary">Juz 2 · Halaman 28</div>
        </div>
        <ChevronRight className="h-5 w-5 text-text-muted" />
      </button>

      <div className="mt-3 rounded-card border border-border bg-card p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Ayat Hari Ini · Al-Insyirah 5–6
        </div>
        <p
          className="mt-3 text-right font-arabic text-2xl leading-loose text-text-primary"
          suppressHydrationWarning
        >
          فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada
          kemudahan."
        </p>
      </div>
    </section>
  );
}
