// LocalStorage-backed Ibadah tracker. Replace with Cloud later.
import { addDays, startOfDay, ymd } from "./hijri";

const KEY = "nu_ibadah_log_v1";

export const FARDHU = ["subuh", "dhuhr", "asr", "maghrib", "isya"] as const;
export type FardhuKey = (typeof FARDHU)[number];

export const SUNNAH = ["dhuha", "tahajud", "witir", "rawatib"] as const;
export type SunnahKey = (typeof SUNNAH)[number];

export type DayLog = {
  fardhu: Partial<Record<FardhuKey, boolean>>;
  sunnah: Partial<Record<SunnahKey, boolean>>;
  fast?: boolean; // puasa hari ini
  fastType?: string;
  tilawah?: number; // lembar
};

export type LogMap = Record<string, DayLog>;

function read(): LogMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}
function write(m: LogMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(m));
  window.dispatchEvent(new Event("nu-ibadah-changed"));
}

export function getDay(d: Date): DayLog {
  return read()[ymd(d)] ?? { fardhu: {}, sunnah: {} };
}

export function updateDay(d: Date, patch: (prev: DayLog) => DayLog) {
  const m = read();
  const k = ymd(d);
  m[k] = patch(m[k] ?? { fardhu: {}, sunnah: {} });
  write(m);
}

export function toggleFardhu(d: Date, key: FardhuKey) {
  updateDay(d, (prev) => ({ ...prev, fardhu: { ...prev.fardhu, [key]: !prev.fardhu?.[key] } }));
}
export function toggleSunnah(d: Date, key: SunnahKey) {
  updateDay(d, (prev) => ({ ...prev, sunnah: { ...prev.sunnah, [key]: !prev.sunnah?.[key] } }));
}
export function toggleFast(d: Date, type?: string) {
  updateDay(d, (prev) => ({ ...prev, fast: !prev.fast, fastType: !prev.fast ? type : undefined }));
}

export type Stats = {
  totalFardhu: number;
  doneFardhu: number;
  missed: number; // qadha
  byPrayer: Record<FardhuKey, { done: number; missed: number }>;
  perDay: { date: Date; done: number; total: number }[];
  sunnah: Record<SunnahKey, number>;
  fastDays: number;
};

export function computeStats(from: Date, to: Date): Stats {
  const m = read();
  const today = startOfDay(new Date());
  const by: Stats["byPrayer"] = {
    subuh: { done: 0, missed: 0 }, dhuhr: { done: 0, missed: 0 },
    asr: { done: 0, missed: 0 }, maghrib: { done: 0, missed: 0 }, isya: { done: 0, missed: 0 },
  };
  const sun: Stats["sunnah"] = { dhuha: 0, tahajud: 0, witir: 0, rawatib: 0 };
  const perDay: Stats["perDay"] = [];
  let totalFardhu = 0, doneFardhu = 0, missed = 0, fastDays = 0;

  for (let d = startOfDay(from); d <= startOfDay(to); d = addDays(d, 1)) {
    const log = m[ymd(d)] ?? { fardhu: {}, sunnah: {} };
    const isPast = d <= today;
    let dayDone = 0;
    for (const p of FARDHU) {
      if (isPast) {
        totalFardhu++;
        if (log.fardhu?.[p]) { doneFardhu++; by[p].done++; dayDone++; }
        else if (d < today) { missed++; by[p].missed++; }
      }
    }
    for (const s of SUNNAH) if (log.sunnah?.[s]) sun[s]++;
    if (log.fast) fastDays++;
    perDay.push({ date: new Date(d), done: dayDone, total: 5 });
  }
  return { totalFardhu, doneFardhu, missed, byPrayer: by, perDay, sunnah: sun, fastDays };
}

// Manual qadha counter (independent of historical log)
const QADHA_KEY = "nu_qadha_v1";
export type QadhaMap = Record<FardhuKey, number>;
export function getQadha(): QadhaMap {
  if (typeof window === "undefined") return { subuh: 0, dhuhr: 0, asr: 0, maghrib: 0, isya: 0 };
  try { return { subuh: 0, dhuhr: 0, asr: 0, maghrib: 0, isya: 0, ...JSON.parse(localStorage.getItem(QADHA_KEY) ?? "{}") }; }
  catch { return { subuh: 0, dhuhr: 0, asr: 0, maghrib: 0, isya: 0 }; }
}
export function setQadha(q: QadhaMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QADHA_KEY, JSON.stringify(q));
  window.dispatchEvent(new Event("nu-ibadah-changed"));
}
export function adjQadha(k: FardhuKey, delta: number) {
  const q = getQadha();
  q[k] = Math.max(0, q[k] + delta);
  setQadha(q);
}
