import { useEffect, useMemo, useState } from "react";
import { Target, Plus, Trash2, Minus, Trophy, Flame, X, Check } from "lucide-react";
import {
  listGoals, addGoal, removeGoal, bumpCustom, progressFor,
  seedDefaultsIfEmpty, METRIC_LABEL, PERIOD_LABEL,
  type Goal, type GoalMetric, type GoalPeriod,
} from "@/lib/goals-storage";
import { useIbadahVersion } from "@/hooks/use-ibadah";

const METRICS: GoalMetric[] = ["fardhu", "sunnah", "dhuha", "tahajud", "tilawah", "fast", "custom"];
const PERIODS: GoalPeriod[] = ["daily", "weekly", "monthly"];

export function GoalsPanel() {
  const v = useIbadahVersion();
  const [open, setOpen] = useState(false);

  useEffect(() => { seedDefaultsIfEmpty(); }, []);

  const goals = useMemo(() => listGoals(), [v]);
  const items = goals.map((g) => ({ goal: g, ...progressFor(g) }));

  const totalDone = items.filter((i) => i.current >= i.goal.target).length;
  const overallPct = items.length
    ? Math.round((items.reduce((a, i) => a + Math.min(1, i.current / i.goal.target), 0) / items.length) * 100)
    : 0;

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">Goal Ibadah</h3>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-pill bg-primary-900 px-3 py-1 text-[11px] font-semibold text-primary-foreground press"
        >
          <Plus className="h-3 w-3" /> Tambah
        </button>
      </div>

      {/* Overview */}
      <div
        className="relative overflow-hidden rounded-card bg-primary-900 p-4 text-primary-foreground"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/25 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-soft bg-white/10 backdrop-blur">
            <Trophy className="h-6 w-6 text-gold-400" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-primary-foreground/70">Progress keseluruhan</div>
            <div className="text-2xl font-bold">{overallPct}%</div>
            <div className="text-xs text-primary-foreground/80">
              {totalDone}/{items.length} goal tercapai periode ini
            </div>
          </div>
        </div>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-pill bg-white/15">
          <div className="h-full rounded-pill bg-gold-400 transition-all duration-500" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Goal list */}
      <div className="mt-3 space-y-2.5">
        {items.length === 0 && (
          <div className="rounded-card border border-dashed border-border bg-card p-6 text-center">
            <Target className="mx-auto h-8 w-8 text-text-muted" strokeWidth={1.5} />
            <div className="mt-2 text-sm font-semibold text-text-primary">Belum ada goal</div>
            <div className="text-xs text-text-muted">Tambah goal pertama Anda untuk mulai memantau.</div>
          </div>
        )}

        {items.map(({ goal, current }) => {
          const pct = Math.min(100, Math.round((current / goal.target) * 100));
          const done = current >= goal.target;
          return (
            <div key={goal.id} className="rounded-card border border-border bg-card p-3.5">
              <div className="flex items-start gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-soft ${done ? "bg-success/15 text-success" : "bg-primary-50 text-primary-900"}`}>
                  {done ? <Check className="h-5 w-5" strokeWidth={2.2} /> : <Target className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold text-text-primary">{goal.title}</div>
                    {done && <Flame className="h-3.5 w-3.5 text-gold-500" />}
                  </div>
                  <div className="mt-0.5 text-[11px] text-text-muted">
                    {METRIC_LABEL[goal.metric]} · {PERIOD_LABEL[goal.period]}
                  </div>
                </div>
                {goal.metric === "custom" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => bumpCustom(goal.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-pill bg-card2 press">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => bumpCustom(goal.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-pill bg-primary-900 text-primary-foreground press">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <button onClick={() => removeGoal(goal.id)} className="flex h-7 w-7 items-center justify-center rounded-pill text-text-muted press">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-3 flex items-baseline justify-between text-[11px]">
                <span className="font-semibold tabular-nums text-text-primary">{current} / {goal.target}</span>
                <span className="text-text-muted">{pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-pill bg-card2">
                <div
                  className={`h-full rounded-pill transition-all duration-500 ${done ? "bg-success" : "bg-primary-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {open && <AddGoalSheet onClose={() => setOpen(false)} />}
    </section>
  );
}

function AddGoalSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState<GoalMetric>("fardhu");
  const [period, setPeriod] = useState<GoalPeriod>("weekly");
  const [target, setTarget] = useState(5);

  const submit = () => {
    if (!title.trim()) return;
    addGoal({ title: title.trim(), metric, period, target });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-pill bg-card2" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">Tambah Goal Ibadah</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-pill bg-card2">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="block text-xs font-semibold text-text-secondary">Judul</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Misal: Tahajud 3x seminggu"
          className="mt-1 w-full rounded-soft border border-border bg-card2 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />

        <label className="mt-4 block text-xs font-semibold text-text-secondary">Jenis Ibadah</label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-pill px-3 py-1 text-[11px] font-semibold press ${
                metric === m ? "bg-primary-900 text-primary-foreground" : "bg-card2 text-text-secondary"
              }`}
            >
              {METRIC_LABEL[m]}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-semibold text-text-secondary">Periode</label>
        <div className="mt-1 flex gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 rounded-pill px-3 py-1.5 text-xs font-semibold press ${
                period === p ? "bg-primary-900 text-primary-foreground" : "bg-card2 text-text-secondary"
              }`}
            >
              {PERIOD_LABEL[p]}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-semibold text-text-secondary">Target ({target})</label>
        <input
          type="range"
          min={1}
          max={50}
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value, 10))}
          className="mt-2 w-full accent-primary-900"
        />

        <button
          onClick={submit}
          className="mt-5 w-full rounded-pill bg-primary-900 py-3 text-sm font-semibold text-primary-foreground press"
        >
          Simpan Goal
        </button>
      </div>
    </div>
  );
}
