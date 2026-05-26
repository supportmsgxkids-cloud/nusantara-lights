import { Calendar, ChevronRight } from "lucide-react";

const events = [
  { title: "Kajian Tafsir Surat Al-Kahfi", host: "Ust. Adi Hidayat", when: "Jumat · 19.30", live: true },
  { title: "Workshop Hafalan Cepat", host: "Ust. Yusuf Mansur", when: "Sabtu · 09.00", live: false },
];

export function UpcomingEvents() {
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Acara Mendatang</h3>
        <button className="text-xs font-medium text-primary-900">Lihat semua</button>
      </div>

      <div className="space-y-2.5">
        {events.map((e) => (
          <button key={e.title} className="flex w-full items-center gap-3 rounded-card bg-card p-3.5 text-left border border-border press">
            <span className="flex h-11 w-11 items-center justify-center rounded-soft bg-gold-50">
              <Calendar className="h-5 w-5 text-gold-700" strokeWidth={1.8} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold text-text-primary">{e.title}</h4>
                {e.live && (
                  <span className="rounded-pill bg-danger/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-danger">Live</span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-text-muted">{e.host} · {e.when}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-text-muted" />
          </button>
        ))}
      </div>
    </section>
  );
}
