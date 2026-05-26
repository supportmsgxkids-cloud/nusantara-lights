import { Link } from "@tanstack/react-router";
import { BookMarked, Compass, CircleDot, Sparkles } from "lucide-react";

const tools = [
  { to: "/ibadah", label: "Al-Quran", icon: BookMarked, bg: "bg-primary-50", color: "text-primary-900" },
  { to: "/tasbih", label: "Tasbih", icon: CircleDot, bg: "bg-gold-50", color: "text-gold-700" },
  { to: "/ibadah", label: "Arah Kiblat", icon: Compass, bg: "bg-primary-50", color: "text-primary-900" },
  { to: "/ibadah", label: "Dzikir", icon: Sparkles, bg: "bg-gold-50", color: "text-gold-700" },
] as const;

export function IbadahTools() {
  return (
    <section className="mt-6 px-5">
      <div className="grid grid-cols-4 gap-3">
        {tools.map(({ to, label, icon: Icon, bg, color }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-2 rounded-card border border-border bg-card p-3 press"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-soft ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.8} />
            </span>
            <span className="text-center text-[11px] font-medium leading-tight text-text-primary">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
