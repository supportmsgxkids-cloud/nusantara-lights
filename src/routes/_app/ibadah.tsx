import { createFileRoute } from "@tanstack/react-router";
import { NextPrayerCard } from "@/components/ibadah/NextPrayerCard";
import { IbadahTools } from "@/components/ibadah/IbadahTools";
import { PrayerSchedule } from "@/components/ibadah/PrayerSchedule";
import { QuranContinue } from "@/components/ibadah/QuranContinue";
import { MutabaahHarian } from "@/components/ibadah/MutabaahHarian";
import { DoaHariIni } from "@/components/ibadah/DoaHariIni";

export const Route = createFileRoute("/_app/ibadah")({
  component: IbadahPage,
});

function IbadahPage() {
  return (
    <>
      <NextPrayerCard />
      <IbadahTools />
      <PrayerSchedule />
      <QuranContinue />
      <MutabaahHarian />
      <DoaHariIni />
    </>
  );
}
