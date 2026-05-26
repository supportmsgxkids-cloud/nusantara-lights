import { useState } from "react";
import { Check, Book, Sunrise, Sparkles } from "lucide-react";

const initial = [
  { id: "tilawah", label: "Tilawah Al-Quran", sub: "Target 1 lembar", icon: Book, done: true },
  { id: "dhuha", label: "Sholat Dhuha", sub: "2 rakaat", icon: Sunrise, done: false },
  { id: "dzikir", label: "Dzikir Pagi", sub: "Setelah Subuh", icon: Sparkles, done: false },
];

export function MutabaahMini() {
  const [items, setItems] = useState(initial);
  const toggle = (id: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Progres Hari Ini</h3>
        <span className="text-xs text-text-muted">{doneCount}/{items.length} selesai</span>
      </div>

      <div className="space-y-2.5">
        {items.map(({ id, label, sub, icon: Icon, done }) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className="flex w-full items-center gap-3 rounded-card bg-card p-3.5 text-left border border-border press"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-soft ${done ? "bg-primary-50" : "bg-card2"}`}>
              <Icon className={`h-5 w-5 ${done ? "text-primary-900" : "text-text-secondary"}`} strokeWidth={1.8} />
            </span>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${done ? "text-text-muted line-through" : "text-text-primary"}`}>
                {label}
              </div>
              <div className="text-xs text-text-muted">{sub}</div>
            </div>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-pill border-2 transition-colors ${
                done ? "border-success bg-success" : "border-border bg-transparent"
              }`}
            >
              {done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
