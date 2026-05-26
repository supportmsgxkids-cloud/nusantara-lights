import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { EightStar, Dome, Lantern } from "@/components/illustrations/IslamicGeometry";
import { KEYS, setFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  {
    Illu: Dome,
    title: "Belajar Islam, di mana saja",
    body: "Akses kelas terstruktur dari ustadz terpilih, kapan pun kamu siap.",
  },
  {
    Illu: EightStar,
    title: "Jaga ibadah harianmu",
    body: "Jadwal sholat, Al-Quran, tasbih, dan mutabaah dalam satu genggaman.",
  },
  {
    Illu: Lantern,
    title: "Tumbuh bersama komunitas",
    body: "Raih XP, naik level, dan saling menguatkan dalam kebaikan.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const last = idx === slides.length - 1;
  const { Illu, title, body } = slides[idx];

  const finish = () => {
    setFlag(KEYS.onboarded, true);
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface px-6 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-primary-900">NUSANTARA EDU</span>
        {!last && (
          <button onClick={finish} className="text-sm font-medium text-text-muted press">
            Lewati
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Illu className="mb-8 h-56 w-56" />
        <h1 className="text-3xl font-bold leading-tight text-text-primary">{title}</h1>
        <p className="mt-3 max-w-xs text-base text-text-secondary">{body}</p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-pill transition-all ${
              i === idx ? "w-8 bg-primary-900" : "w-2 bg-primary-900/20"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {idx > 0 && (
          <button
            onClick={() => setIdx(idx - 1)}
            className="flex-1 rounded-pill border border-border bg-card py-4 text-sm font-semibold text-text-primary press"
          >
            Kembali
          </button>
        )}
        <button
          onClick={() => (last ? finish() : setIdx(idx + 1))}
          className="flex-[2] rounded-pill bg-primary-900 py-4 text-sm font-semibold text-primary-foreground shadow-soft press"
        >
          {last ? "Mulai" : "Lanjut"}
        </button>
      </div>
    </div>
  );
}
