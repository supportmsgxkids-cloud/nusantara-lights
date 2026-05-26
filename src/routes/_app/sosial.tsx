import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_app/sosial")({
  component: () => <ComingSoon title="Komunitas Santri" description="Feed komunitas dan papan peringkat akan hadir di fase berikutnya." />,
});
