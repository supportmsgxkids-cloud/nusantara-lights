export function DoaHariIni() {
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Doa Hari Ini</h3>
        <button className="text-xs font-medium text-primary-900">Koleksi doa</button>
      </div>

      <div
        className="relative overflow-hidden rounded-card border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-50 blur-2xl" />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
            Doa memohon ketenangan hati
          </div>
          <p
            className="mt-3 text-right font-arabic text-2xl leading-loose text-text-primary"
            suppressHydrationWarning
          >
            اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ
          </p>
          <p className="mt-3 text-xs italic text-text-secondary">
            Allahumma inni a'udzubika minal hammi wal hazan
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kegelisahan dan kesedihan."
          </p>
        </div>
      </div>
    </section>
  );
}
