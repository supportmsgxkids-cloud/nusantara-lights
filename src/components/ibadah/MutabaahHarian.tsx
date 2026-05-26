import { useState } from "react";
import { Check, Book, Sunrise, Sparkles, Heart, Moon } from "lucide-react";

const initial = [
  { id: "subuh", label: "Sholat Subuh berjamaah", sub: "Wajib", icon: Sunrise, done: true },
  { id: "tilawah", label: "Tilawah 1 lembar", sub: "Sunnah", icon: Book, done: true },
  { id: "dhuha", label: "Sholat Dhuha", sub: "2 rakaat", icon: Sparkles, done: false },
  { id: "sedekah", label: "Sedekah harian", sub: "Apapun jumlahnya", icon: Heart, done: false },
  { id: "witir", label: "Sholat Witir", sub: "Sebelum tidur", icon: Moon, done: false },
];

export function MutabaahHarian() {
  const [items, setItems] = useState(initial);
  const toggle = (id: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Mutabaah Harian</h3>
        <span className="text-xs text-text-muted">
          {doneCount}/{items.length} · {pct}%
        </span>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-pill bg-card2">
        <div
          className="h-full rounded-pill bg-primary-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2.5">
        {items.map(({ id, label, sub, icon: Icon, done }) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className="flex w-full items-center gap-3 rounded-card border border-border bg-card p-3.5 text-left press"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-soft ${
                done ? "bg-primary-50" : "bg-card2"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${done ? "text-primary-900" : "text-text-secondary"}`}
                strokeWidth={1.8}
              />
            </span>
            <div className="flex-1">
              <div
                className={`text-sm font-semibold ${
                  done ? "text-text-muted line-through" : "text-text-primary"
                }`}
              >
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
