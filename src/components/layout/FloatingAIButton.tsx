import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FloatingAIButton() {
  return (
    <Link
      to="/ai-ustadz"
      className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-pill bg-gradient-to-br from-gold-400 to-gold-700 px-4 py-3 text-sm font-semibold text-white press"
      style={{ boxShadow: "var(--shadow-float)" }}
      aria-label="Tanya AI Ustadz"
    >
      <Sparkles className="h-4 w-4" />
      AI Ustadz
    </Link>
  );
}
