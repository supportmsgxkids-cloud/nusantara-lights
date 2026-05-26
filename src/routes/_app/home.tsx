import { createFileRoute } from "@tanstack/react-router";
import { GreetingHeader } from "@/components/home/GreetingHeader";
import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickActions } from "@/components/home/QuickActions";
import { MutabaahMini } from "@/components/home/MutabaahMini";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";

export const Route = createFileRoute("/_app/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <GreetingHeader />
      <HeroBanner />
      <QuickActions />
      <MutabaahMini />
      <UpcomingEvents />
    </>
  );
}
