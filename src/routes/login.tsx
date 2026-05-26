import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, GoogleButton, PrimaryButton } from "@/components/auth/AuthCard";
import { KEYS, setFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlag(KEYS.authed, true);
    nav({ to: "/home" });
  };

  return (
    <AuthCard
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan perjalanan ilmumu."
      back="/onboarding"
      footer={
        <span>
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-primary-900">Daftar</Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" placeholder="nama@email.com" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-900">Lupa password?</Link>
        </div>
        <PrimaryButton type="submit">Masuk</PrimaryButton>
      </form>

      <div className="flex items-center gap-3 py-2 text-xs text-text-muted">
        <div className="h-px flex-1 bg-border" />
        atau
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton onClick={() => { setFlag(KEYS.authed, true); nav({ to: "/home" }); }} />
    </AuthCard>
  );
}
