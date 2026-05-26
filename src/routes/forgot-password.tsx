import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuthCard, Field, PrimaryButton } from "@/components/auth/AuthCard";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthCard
      title="Lupa password?"
      subtitle="Kami akan mengirim tautan pemulihan ke emailmu."
      back="/login"
    >
      {sent ? (
        <div className="rounded-card bg-primary-50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary-500" />
          <h2 className="mt-3 text-lg font-semibold text-text-primary">Tautan terkirim</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Periksa kotak masuk <span className="font-medium">{email}</span> untuk melanjutkan.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-4"
        >
          <Field label="Email" type="email" placeholder="nama@email.com" value={email} onChange={setEmail} autoComplete="email" />
          <PrimaryButton type="submit">Kirim tautan pemulihan</PrimaryButton>
        </form>
      )}
    </AuthCard>
  );
}
