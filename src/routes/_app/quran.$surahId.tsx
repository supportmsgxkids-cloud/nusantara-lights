import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play, Volume2 } from "lucide-react";
import { fetchSurahBundle } from "@/lib/quran-api";
import { TajweedText, TajweedLegend } from "@/components/quran/TajweedText";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/quran/$surahId")({
  component: SurahPage,
});

function SurahPage() {
  const { surahId } = Route.useParams();
  const id = Number(surahId);

  const { data, isLoading } = useQuery({
    queryKey: ["surah", id],
    queryFn: () => fetchSurahBundle(id),
    staleTime: 1000 * 60 * 60,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function playAyah(url: string, num: number) {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    if (playingAyah === num) {
      a.pause();
      setPlayingAyah(null);
      return;
    }
    a.src = url;
    a.play();
    setPlayingFull(false);
    setPlayingAyah(num);
    a.onended = () => setPlayingAyah(null);
  }

  function toggleFull(url: string) {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    if (playingFull) {
      a.pause();
      setPlayingFull(false);
      return;
    }
    a.src = url;
    a.play();
    setPlayingAyah(null);
    setPlayingFull(true);
    a.onended = () => setPlayingFull(false);
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3 px-5 pt-4">
        <Skeleton className="h-28 w-full rounded-card" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="px-5">
        <Link
          to="/quran"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary press"
        >
          <ArrowLeft className="h-4 w-4" />
          Daftar Surah
        </Link>

        <div className="rounded-card bg-gradient-to-br from-primary-900 to-primary-500 p-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">
                Surah ke-{data.meta.number}
              </p>
              <h2 className="mt-1 text-xl font-bold">{data.meta.englishName}</h2>
              <p className="text-xs opacity-85">
                {data.meta.englishNameTranslation} · {data.meta.numberOfAyahs} ayat
              </p>
            </div>
            <span
              className="font-arabic text-3xl"
              suppressHydrationWarning
            >
              {data.meta.name}
            </span>
          </div>

          <button
            onClick={() => toggleFull(data.fullAudio)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-pill bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur press"
          >
            {playingFull ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playingFull ? "Hentikan Murottal" : "Putar Murottal Lengkap"}
          </button>
        </div>

        <div className="mt-3 rounded-card border border-border bg-card p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Panduan Warna Tajwid
          </p>
          <TajweedLegend />
        </div>
      </div>

      <div className="mt-4 space-y-3 px-5">
        {data.tajweed.map((ayah, idx) => {
          const translation = data.translation[idx]?.text ?? "";
          const audioUrl = data.audio[idx]?.audio ?? "";
          const num = ayah.numberInSurah;
          const isPlaying = playingAyah === num;
          return (
            <div
              key={ayah.number}
              className="rounded-card border border-border bg-card p-4"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-900">
                  {num}
                </span>
                <button
                  onClick={() => playAyah(audioUrl, num)}
                  className="flex items-center gap-1.5 rounded-pill border border-border px-3 py-1.5 text-xs font-medium text-primary-900 press"
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                  {isPlaying ? "Berhenti" : "Murottal"}
                </button>
              </div>
              <TajweedText
                text={ayah.text}
                className="text-right font-arabic text-2xl leading-loose text-text-primary"
              />
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {translation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
