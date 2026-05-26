import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import { fetchSurahList } from "@/lib/quran-api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/quran/")({
  component: QuranIndex,
});

function QuranIndex() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["surah-list"],
    queryFn: fetchSurahList,
    staleTime: 1000 * 60 * 60,
  });

  const filtered = (data ?? []).filter((s) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(t) ||
      s.englishNameTranslation.toLowerCase().includes(t) ||
      String(s.number) === t
    );
  });

  return (
    <div className="px-5 pt-4">
      <div className="rounded-card bg-gradient-to-br from-primary-900 to-primary-500 p-5 text-primary-foreground">
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          Al-Quran Al-Karim
        </p>
        <h2 className="mt-1 text-xl font-bold">114 Surah · Tajwid Berwarna</h2>
        <p className="mt-1 text-xs opacity-85">Murottal Syaikh Mishary Al-Afasy</p>
      </div>

      <div
        className="mt-4 flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-2.5"
      >
        <Search className="h-4 w-4 text-text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari surah…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
        />
      </div>

      <div className="mt-4 space-y-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-card" />
            ))
          : filtered.map((s) => (
              <Link
                key={s.number}
                to="/quran/$surahId"
                params={{ surahId: String(s.number) }}
                className="flex items-center gap-3 rounded-card border border-border bg-card p-3 press"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-soft bg-primary-50 text-sm font-bold text-primary-900">
                  {s.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold text-text-primary">
                      {s.englishName}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {s.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {s.englishNameTranslation} · {s.numberOfAyahs} ayat
                  </div>
                </div>
                <span
                  className="font-arabic text-xl text-primary-900"
                  suppressHydrationWarning
                >
                  {s.name}
                </span>
                <ChevronRight className="h-4 w-4 text-text-muted" />
              </Link>
            ))}
      </div>
    </div>
  );
}
