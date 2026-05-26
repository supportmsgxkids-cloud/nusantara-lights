import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ChevronRight,
  Flame,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { ProfileIllustration } from "@/components/illustrations/ProfileIllustration";
import { KEYS, setFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/_app/profil")({
  component: ProfilPage,
});

const stats = [
  { label: "XP", value: "1.240", icon: Star, color: "text-gold-700", bg: "bg-gold-50" },
  { label: "Streak", value: "7 hari", icon: Flame, color: "text-danger", bg: "bg-gold-50" },
  { label: "Level", value: "Lv 4", icon: Sparkles, color: "text-primary-900", bg: "bg-primary-50" },
];

const badges = [
  { label: "Mujahid Subuh", icon: "🌅", unlocked: true },
  { label: "Khatam Juz 1", icon: "📖", unlocked: true },
  { label: "Dermawan", icon: "🤲", unlocked: true },
  { label: "Istiqamah 30H", icon: "🔥", unlocked: false },
  { label: "Hafiz Juz 30", icon: "✨", unlocked: false },
  { label: "Ulama Muda", icon: "🎓", unlocked: false },
];

const menu = [
  { label: "Pengaturan Akun", icon: Settings },
  { label: "Riwayat Belajar", icon: BookOpen },
  { label: "Pencapaian Saya", icon: Award },
  { label: "Privasi & Keamanan", icon: Shield },
  { label: "Bantuan", icon: HelpCircle },
];

function ProfilPage() {
  const nav = useNavigate();
  return (
    <div className="pt-2">
      {/* Hero card */}
      <div className="px-5">
        <div
          className="relative overflow-hidden rounded-card border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary-50 to-gold-50"
            aria-hidden
          />
          <div className="relative flex flex-col items-center text-center">
            <div className="rounded-full bg-card p-1.5" style={{ boxShadow: "var(--shadow-float)" }}>
              <ProfileIllustration className="h-24 w-24" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-text-primary">Ahmad Fauzan</h2>
            <p className="text-xs text-text-secondary">[email protected]</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-900">
              <Sparkles className="h-3 w-3" /> Santri Aktif · Level 4
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-card border border-border bg-card p-3"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-soft ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </span>
              <div className="mt-1.5 text-sm font-bold text-text-primary">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-card border border-border bg-card p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-text-primary">
              Menuju Level 5
            </span>
            <span className="text-[11px] text-text-muted">1.240 / 1.500 XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-pill bg-primary-50">
            <div
              className="h-full rounded-pill bg-gradient-to-r from-primary-500 to-primary-900"
              style={{ width: "82%" }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-base font-semibold text-text-primary">Lencana</h3>
            <span className="text-xs text-text-muted">3 dari 6</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center rounded-card border border-border p-3 text-center ${
                  b.unlocked ? "bg-card" : "bg-card2 opacity-50"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {b.icon}
                </span>
                <span className="mt-1.5 text-[11px] font-medium leading-tight text-text-primary">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="mt-5 overflow-hidden rounded-card border border-border bg-card">
          {menu.map((m, i) => (
            <button
              key={m.label}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left press ${
                i !== menu.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-soft bg-primary-50 text-primary-900">
                <m.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-text-primary">
                {m.label}
              </span>
              <ChevronRight className="h-4 w-4 text-text-muted" />
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setFlag(KEYS.authed, false);
            nav({ to: "/login" });
          }}
          className="mx-auto mt-5 flex items-center gap-2 rounded-pill border border-border bg-card px-5 py-2.5 text-sm font-medium text-danger press"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>

        <p className="mt-4 text-center text-[11px] text-text-muted">
          Nusantara Edu · v1.0
        </p>
      </div>
    </div>
  );
}
