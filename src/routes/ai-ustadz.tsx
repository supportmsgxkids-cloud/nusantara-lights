import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai-ustadz")({
  component: AIUstadz,
});

function AIUstadz() {
  return (
    <div className="min-h-screen bg-surface px-6 pb-8 pt-6">
      <Link to="/home" className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-card border border-border press" aria-label="Kembali">
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="mt-12 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 text-white">
          <Sparkles className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-text-primary">AI Ustadz</h1>
        <p className="mt-2 max-w-xs text-sm text-text-secondary">
          Asisten cerdas untuk bertanya seputar dalil, fiqh, dan adab. Akan tersedia di fase berikutnya.
        </p>
        <span className="mt-5 inline-flex rounded-pill bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700">
          Segera Hadir
        </span>
      </div>
    </div>
  );
}
