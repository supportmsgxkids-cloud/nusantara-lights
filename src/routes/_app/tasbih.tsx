import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, ChevronLeft, Check } from "lucide-react";

export const Route = createFileRoute("/_app/tasbih")({
  component: TasbihPage,
});

const DZIKIR = [
  { ar: "سُبْحَانَ اللَّهِ", lat: "Subhanallah", target: 33 },
  { ar: "الْحَمْدُ لِلَّهِ", lat: "Alhamdulillah", target: 33 },
  { ar: "اللَّهُ أَكْبَرُ", lat: "Allahu Akbar", target: 34 },
];

function TasbihPage() {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const current = DZIKIR[step];
  const pct = Math.min(100, (count / current.target) * 100);
  const done = count >= current.target;

  const tap = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        /* ignore */
      }
    }
    setCount((c) => c + 1);
  };

  const next = () => {
    if (step < DZIKIR.length - 1) {
      setStep(step + 1);
      setCount(0);
    }
  };

  const reset = () => setCount(0);

  return (
    <div className="px-5 pb-10">
      <div className="flex items-center justify-between pt-2">
        <Link
          to="/ibadah"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-card press"
          aria-label="Kembali"
        >
          <ChevronLeft className="h-5 w-5 text-text-primary" />
        </Link>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-pill border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary press"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {DZIKIR.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-8 rounded-pill transition-colors ${
              i === step ? "bg-primary-900" : i < step ? "bg-primary-500" : "bg-card2"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="font-arabic text-4xl leading-loose text-text-primary" suppressHydrationWarning>
          {current.ar}
        </p>
        <p className="mt-2 text-sm font-medium text-text-secondary">{current.lat}</p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={tap}
          className="relative flex h-64 w-64 items-center justify-center rounded-full press"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--primary-500) 0%, var(--primary-900) 80%)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--gold-400)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 289.03} 289.03`}
              style={{ transition: "stroke-dasharray 200ms ease-out" }}
            />
          </svg>
          <div className="text-center text-primary-foreground">
            <div className="text-[11px] uppercase tracking-widest text-primary-foreground/70">
              Hitungan
            </div>
            <div className="mt-1 text-6xl font-bold tabular-nums">{count}</div>
            <div className="mt-1 text-sm text-primary-foreground/80">dari {current.target}</div>
          </div>
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">Ketuk lingkaran untuk menghitung</p>

      {done && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-card border border-success/30 bg-success/10 p-3 text-sm font-semibold text-success">
          <Check className="h-4 w-4" />
          Target tercapai · Mashaa Allah
        </div>
      )}

      {step < DZIKIR.length - 1 && done && (
        <button
          onClick={next}
          className="mt-4 w-full rounded-pill bg-primary-900 py-3.5 text-sm font-semibold text-primary-foreground press"
        >
          Lanjut: {DZIKIR[step + 1].lat}
        </button>
      )}
    </div>
  );
}
