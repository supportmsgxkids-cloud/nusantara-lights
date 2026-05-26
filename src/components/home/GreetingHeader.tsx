import { Flame, Star } from "lucide-react";

export function GreetingHeader({ name = "Ahmad", streak = 7, xp = 1240 }: { name?: string; streak?: number; xp?: number }) {
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <section className="px-5 pt-2">
      <p className="text-sm text-text-secondary">Assalamu'alaikum,</p>
      <h2 className="mt-0.5 text-2xl font-bold text-text-primary">{greet}, {name}</h2>

      <div className="mt-4 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700">
          <Flame className="h-3.5 w-3.5" />
          {streak} hari beruntun
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-900">
          <Star className="h-3.5 w-3.5" fill="currentColor" />
          {xp.toLocaleString("id-ID")} XP
        </span>
      </div>
    </section>
  );
}
