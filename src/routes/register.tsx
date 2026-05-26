import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/auth/AuthCard";
import { KEYS, setFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlag(KEYS.authed, true);
    nav({ to: "/home" });
  };

  return (
    <AuthCard
      title="Buat akun baru"
      subtitle="Mulai langkah pertama menuntut ilmu."
      back="/login"
      footer={
        <span>
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-primary-900">Masuk</Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama" placeholder="Nama lengkap" value={name} onChange={setName} autoComplete="name" />
        <Field label="Email" type="email" placeholder="nama@email.com" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={setPassword} autoComplete="new-password" />
        <PrimaryButton type="submit">Daftar</PrimaryButton>
      </form>
      <p className="text-center text-xs text-text-muted">
        Dengan mendaftar, kamu menyetujui Syarat & Ketentuan kami.
      </p>
    </AuthCard>
  );
}
