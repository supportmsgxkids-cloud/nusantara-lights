import { BookMarked, Clock, Compass, CircleDot } from "lucide-react";

const actions = [
  { icon: BookMarked, label: "Al-Quran", color: "text-primary-900", bg: "bg-primary-50" },
  { icon: Clock, label: "Jadwal Sholat", color: "text-gold-700", bg: "bg-gold-50" },
  { icon: Compass, label: "Arah Kiblat", color: "text-primary-900", bg: "bg-primary-50" },
  { icon: CircleDot, label: "Tasbih", color: "text-gold-700", bg: "bg-gold-50" },
];

export function QuickActions() {
  return (
    <section className="mt-6 px-5">
      <div className="grid grid-cols-4 gap-3">
        {actions.map(({ icon: Icon, label, color, bg }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 rounded-card bg-card p-3 press border border-border"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-soft ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.8} />
            </span>
            <span className="text-[11px] font-medium leading-tight text-text-primary text-center">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
