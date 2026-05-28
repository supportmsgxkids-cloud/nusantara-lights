// Hijri date helpers using Intl Islamic Umm al-Qura calendar.

export const HIJRI_MONTHS_ID = [
  "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah",
];

export type HijriDate = { day: number; month: number; year: number; weekday: number };

const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  weekday: "short",
});

export function toHijri(date: Date): HijriDate {
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: parseInt(get("day"), 10),
    month: parseInt(get("month"), 10),
    year: parseInt(get("year"), 10),
    weekday: date.getDay(),
  };
}

export function hijriLabel(date: Date): string {
  const h = toHijri(date);
  return `${h.day} ${HIJRI_MONTHS_ID[h.month - 1]} ${h.year} H`;
}

// Sunnah fast types we can highlight on calendar
export type SunnahFastTag =
  | "senin" | "kamis" | "ayyamul-bidh" | "arafah" | "asyura"
  | "tasua" | "dzulhijjah" | "syawal" | "syaban-nisfu";

export function sunnahFastsFor(date: Date): SunnahFastTag[] {
  const tags: SunnahFastTag[] = [];
  const w = date.getDay();
  if (w === 1) tags.push("senin");
  if (w === 4) tags.push("kamis");
  const h = toHijri(date);
  if (h.day >= 13 && h.day <= 15) tags.push("ayyamul-bidh");
  if (h.month === 1 && h.day === 9) tags.push("tasua");
  if (h.month === 1 && h.day === 10) tags.push("asyura");
  if (h.month === 12 && h.day === 9) tags.push("arafah");
  if (h.month === 12 && h.day >= 1 && h.day <= 8) tags.push("dzulhijjah");
  if (h.month === 10 && h.day >= 2 && h.day <= 8) tags.push("syawal");
  if (h.month === 8 && h.day === 15) tags.push("syaban-nisfu");
  return tags;
}

export const FAST_LABEL: Record<SunnahFastTag, string> = {
  senin: "Puasa Senin",
  kamis: "Puasa Kamis",
  "ayyamul-bidh": "Ayyamul Bidh",
  arafah: "Puasa Arafah",
  asyura: "Puasa Asyura",
  tasua: "Puasa Tasu'a",
  dzulhijjah: "Puasa Dzulhijjah",
  syawal: "Puasa Syawal",
  "syaban-nisfu": "Nisfu Sya'ban",
};

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function nextSunnahFast(from = new Date(), within = 60): { date: Date; tags: SunnahFastTag[] } | null {
  for (let i = 0; i < within; i++) {
    const d = addDays(startOfDay(from), i);
    const t = sunnahFastsFor(d);
    if (t.length) return { date: d, tags: t };
  }
  return null;
}
