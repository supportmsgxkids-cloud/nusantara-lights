import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { KEYS, setFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/_app/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const nav = useNavigate();
  return (
    <div>
      <ComingSoon title="Profil & Pencapaian" description="Statistik XP, level, dan koleksi badge-mu akan tampil di sini." />
      <div className="px-8">
        <button
          onClick={() => { setFlag(KEYS.authed, false); nav({ to: "/login" }); }}
          className="mx-auto mt-2 flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-2.5 text-sm font-medium text-danger press"
        >
          <LogOut className="h-4 w-4" />
          Keluar (demo)
        </button>
      </div>
    </div>
  );
}
