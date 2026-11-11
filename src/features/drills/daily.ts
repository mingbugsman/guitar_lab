import { LESSONS } from "@/content/curriculum";
import type { Drill } from "@/content/drills";
import { dayKey } from "@/lib/format";
import { summarizeDrills, type DrillRow, type DrillStats } from "./stats";

export const DAILY_COUNT = 3;

export type DailyPick = {
  drill: Drill;
  /** Why this drill today, in one short phrase. */
  reason: string;
  doneToday: boolean;
  /** The lesson it builds on is not completed yet (only used when too few drills are open). */
  locked: boolean;
};

/** Small stable hash so the same learner gets the same picks all day, and different ones tomorrow. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

function need(drill: Drill, stats: DrillStats | undefined, today: string): { score: number; reason: string } {
  if (!stats?.last) return { score: 3, reason: "Bài mới với bạn" };
  const { start, target } = drill.tempo;
  const best = stats.bestClean;
  const gap = Math.max(0, Math.min(1.2, (target - (best ?? start - 5)) / (target - start)));
  const lost = stats.last.rating === "lost";
  const idle = Math.min(daysBetween(dayKey(stats.last.at), today), 7) / 7;
  const score = gap * 2 + (lost ? 1 : 0) + idle;
  const reason = lost
    ? "Lần trước chưa theo kịp, tập lại cho chắc tay"
    : best == null
      ? "Chưa có lượt nào sạch hết"
      : best >= target
        ? "Đã đạt tốc độ mục tiêu, tập để giữ tay"
        : `Đang sạch ở ${best}/${target} BPM`;
  return { score, reason };
}

/**
 * Three hand drills for today. Favours drills never tried, lost last time, far from their target
 * tempo, or not touched for days; spreads them over different groups. Picks only depend on runs
 * from before today, so finishing one does not reshuffle the list.
 */
export function pickDailyDrills({
  drills,
  completedLessons,
  rows,
  seed,
  now = new Date(),
}: {
  drills: Drill[];
  completedLessons: Set<string>;
  rows: DrillRow[];
  seed: string;
  now?: Date;
}): DailyPick[] {
  const today = dayKey(now);
  const before = rows.filter((r) => dayKey(r.created_at) < today);
  const doneToday = new Set(rows.filter((r) => dayKey(r.created_at) === today).map((r) => r.drill_id));
  const stats = summarizeDrills(before);

  const lessonIndex = (slug: string) => LESSONS.findIndex((l) => l.slug === slug);
  const open = drills.filter((d) => completedLessons.has(d.unlockAfter));
  // a brand-new learner has few open drills: add the ones that open soonest
  const soon = drills
    .filter((d) => !completedLessons.has(d.unlockAfter))
    .sort((a, b) => lessonIndex(a.unlockAfter) - lessonIndex(b.unlockAfter));
  const pool = open.length >= DAILY_COUNT ? open : [...open, ...soon.slice(0, DAILY_COUNT - open.length)];

  const ranked = pool
    .map((drill) => {
      const n = need(drill, stats[drill.id], today);
      return { drill, ...n, score: n.score + hash(`${seed}:${today}:${drill.id}`) * 0.6 };
    })
    .sort((a, b) => b.score - a.score);

  const picked: typeof ranked = [];
  for (const r of ranked) if (picked.length < DAILY_COUNT && !picked.some((p) => p.drill.group === r.drill.group)) picked.push(r);
  for (const r of ranked) if (picked.length < DAILY_COUNT && !picked.includes(r)) picked.push(r);

  return picked.map((p) => ({
    drill: p.drill,
    reason: p.reason,
    doneToday: doneToday.has(p.drill.id),
    locked: !completedLessons.has(p.drill.unlockAfter),
  }));
}
