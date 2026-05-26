import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_app/ibadah")({
  component: () => <ComingSoon title="Ibadah & Mutabaah" description="Al-Quran, jadwal sholat, tasbih, dan habit tracker harian." />,
});
