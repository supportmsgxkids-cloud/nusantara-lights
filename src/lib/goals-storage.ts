// LocalStorage-backed Ibadah Goals
import { addDays, startOfDay, ymd } from "./hijri";
import { computeStats, getDay } from "./ibadah-storage";

const KEY = "nu_ibadah_goals_v1";

export type GoalPeriod = "daily" | "weekly" | "monthly";
export type GoalMetric =
  | "fardhu"      // jumlah sholat fardhu tepat waktu
  | "sunnah"      // total sholat sunnah (dhuha/tahajud/witir/rawatib)
  | "tilawah"     // lembar Al-Qur'an
  | "fast"        // hari puasa
  | "dhuha"
  | "tahajud"
  | "custom";

export type Goal = {
  id: string;
  title: string;
  metric: GoalMetric;
  target: number;
  period: GoalPeriod;
  createdAt: number;
  // for custom: manual progress counter
  customProgress?: number;
};

export const METRIC_LABEL: Record<GoalMetric, string> = {
  fardhu: "Sholat Fardhu",
  sunnah: "Sholat Sunnah",
  tilawah: "Tilawah (lembar)",
  fast: "Puasa",
  dhuha: "Sholat Dhuha",
  tahajud: "Tahajud",
  custom: "Custom",
};

export const PERIOD_LABEL: Record<GoalPeriod, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
};

function read(): Goal[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function write(g: Goal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(g));
  window.dispatchEvent(new Event("nu-ibadah-changed"));
}

export function listGoals(): Goal[] { return read(); }

export function addGoal(g: Omit<Goal, "id" | "createdAt">): Goal {
  const goal: Goal = { ...g, id: crypto.randomUUID(), createdAt: Date.now() };
  write([goal, ...read()]);
  return goal;
}
export function removeGoal(id: string) {
  write(read().filter((x) => x.id !== id));
}
export function bumpCustom(id: string, delta: number) {
  const list = read().map((g) =>
    g.id === id ? { ...g, customProgress: Math.max(0, (g.customProgress ?? 0) + delta) } : g
  );
  write(list);
}

function periodRange(period: GoalPeriod, now = new Date()): { from: Date; to: Date } {
  const today = startOfDay(now);
  if (period === "daily") return { from: today, to: today };
  if (period === "weekly") {
    const from = addDays(today, -today.getDay()); // minggu = 0
    return { from, to: addDays(from, 6) };
  }
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { from, to };
}

export function progressFor(goal: Goal): { current: number; from: Date; to: Date } {
  const { from, to } = periodRange(goal.period);
  if (goal.metric === "custom") {
    return { current: goal.customProgress ?? 0, from, to };
  }
  const today = startOfDay(new Date());
  const end = to > today ? today : to;
  const stats = computeStats(from, end);
  let current = 0;
  switch (goal.metric) {
    case "fardhu":  current = stats.doneFardhu; break;
    case "sunnah":  current = Object.values(stats.sunnah).reduce((a, b) => a + b, 0); break;
    case "dhuha":   current = stats.sunnah.dhuha; break;
    case "tahajud": current = stats.sunnah.tahajud; break;
    case "fast":    current = stats.fastDays; break;
    case "tilawah": {
      // sum tilawah lembar across range
      let t = 0;
      for (let d = new Date(from); d <= end; d = addDays(d, 1)) {
        t += getDay(d).tilawah ?? 0;
      }
      current = t;
      break;
    }
  }
  return { current, from, to };
}

// Default starter goals (seeded on first open if empty)
export function seedDefaultsIfEmpty() {
  if (read().length > 0) return;
  const defaults: Omit<Goal, "id" | "createdAt">[] = [
    { title: "Sholat Fardhu 5 waktu", metric: "fardhu", target: 5, period: "daily" },
    { title: "Dhuha 5x seminggu", metric: "dhuha", target: 5, period: "weekly" },
    { title: "Tilawah 1 juz / minggu", metric: "tilawah", target: 20, period: "weekly" },
    { title: "Puasa Sunnah 4x / bulan", metric: "fast", target: 4, period: "monthly" },
  ];
  write(defaults.map((g) => ({ ...g, id: crypto.randomUUID(), createdAt: Date.now() })));
}
