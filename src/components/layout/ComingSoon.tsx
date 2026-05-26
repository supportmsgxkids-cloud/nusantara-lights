import { Sparkles } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary-50">
        <Sparkles className="h-9 w-9 text-primary-900" strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-xl font-bold text-text-primary">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-text-secondary">{description}</p>
      <span className="mt-5 inline-flex rounded-pill bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700">
        Segera Hadir
      </span>
    </div>
  );
}
