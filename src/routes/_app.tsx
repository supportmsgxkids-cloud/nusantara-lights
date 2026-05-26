import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BottomTabNav } from "@/components/layout/BottomTabNav";
import { FloatingAIButton } from "@/components/layout/FloatingAIButton";
import { KEYS, getFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const titles: Record<string, string> = {
  "/home": "Beranda",
  "/ilmu": "Ilmu",
  "/ibadah": "Ibadah",
  "/sosial": "Sosial",
  "/profil": "Profil",
  "/tasbih": "Tasbih Digital",
};

function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getFlag(KEYS.authed)) navigate({ to: "/login", replace: true });
  }, [navigate]);

  const title = titles[pathname] ?? "Nusantara Edu";

  return (
    <div className="min-h-screen bg-surface">
      <TopBar title={title} />
      <main className="pb-32">
        <Outlet />
      </main>
      <FloatingAIButton />
      <BottomTabNav />
    </div>
  );
}
