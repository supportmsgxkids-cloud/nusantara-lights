import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_app/ilmu")({
  component: () => <ComingSoon title="Katalog Kelas" description="Kelas terstruktur dari ustadz pilihan akan segera tersedia di sini." />,
});
