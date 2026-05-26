import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  back?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, back = "/login", children, footer }: Props) {
  return (
    <div className="min-h-screen bg-surface px-6 pb-8 pt-6">
      <Link
        to={back}
        className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-card border border-border text-text-primary press"
        aria-label="Kembali"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
      </div>

      <div className="mt-8 space-y-4">{children}</div>

      {footer && <div className="mt-8 text-center text-sm text-text-secondary">{footer}</div>}
    </div>
  );
}

export function Field({
  label, type = "text", placeholder, value, onChange, autoComplete,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-sm border border-border bg-card px-4 py-3.5 text-base text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    </label>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled }: {
  children: ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-pill bg-primary-900 py-4 text-sm font-semibold text-primary-foreground shadow-soft press disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-pill border border-border bg-card py-3.5 text-sm font-semibold text-text-primary press"
    >
      <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.4-.4-3.5z"/>
      </svg>
      Lanjut dengan Google
    </button>
  );
}
