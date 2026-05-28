import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NextPrayerCard } from "@/components/ibadah/NextPrayerCard";
import { IbadahTools } from "@/components/ibadah/IbadahTools";
import { PrayerSchedule } from "@/components/ibadah/PrayerSchedule";
import { QuranContinue } from "@/components/ibadah/QuranContinue";
import { MutabaahHarian } from "@/components/ibadah/MutabaahHarian";
import { DoaHariIni } from "@/components/ibadah/DoaHariIni";
import { SholatTracker } from "@/components/ibadah/SholatTracker";
import { SholatStats } from "@/components/ibadah/SholatStats";
import { PuasaPanel } from "@/components/ibadah/PuasaPanel";
import { SahurIftarCard } from "@/components/ibadah/SahurIftarCard";
import { HijriCalendar } from "@/components/ibadah/HijriCalendar";

export const Route = createFileRoute("/_app/ibadah")({
  component: IbadahPage,
});

const TABS = [
  { k: "hari", l: "Hari Ini" },
  { k: "sholat", l: "Sholat" },
  { k: "puasa", l: "Puasa" },
  { k: "kalender", l: "Kalender" },
] as const;
type TabKey = (typeof TABS)[number]["k"];

function IbadahPage() {
  const [tab, setTab] = useState<TabKey>("hari");

  return (
    <>
      <div className="sticky top-16 z-20 glass border-b border-border">
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-5 py-2.5">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`whitespace-nowrap rounded-pill px-4 py-1.5 text-xs font-semibold transition-colors press ${
                tab === t.k
                  ? "bg-primary-900 text-primary-foreground"
                  : "bg-card2 text-text-secondary"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {tab === "hari" && (
        <>
          <NextPrayerCard />
          <IbadahTools />
          <PrayerSchedule />
          <QuranContinue />
          <MutabaahHarian />
          <DoaHariIni />
        </>
      )}

      {tab === "sholat" && (
        <>
          <NextPrayerCard />
          <SholatTracker />
          <SholatStats />
          <PrayerSchedule />
        </>
      )}

      {tab === "puasa" && (
        <>
          <PuasaPanel />
          <SahurIftarCard />
        </>
      )}

      {tab === "kalender" && (
        <>
          <HijriCalendar />
          <PuasaPanel />
        </>
      )}
    </>
  );
}
