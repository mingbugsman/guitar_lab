import { describe, expect, it } from "vitest";
import { FINGER_DRILLS } from "@/content/drills";
import { LESSONS } from "@/content/curriculum";
import { pickDailyDrills } from "./daily";
import type { DrillRow } from "./stats";

const all = new Set(LESSONS.map((l) => l.slug));
const now = new Date("2026-11-12T03:00:00Z"); // 10:00 in Vietnam

describe("daily hand drills", () => {
  it("always gives three different drills, from different groups when possible", () => {
    const picks = pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: all, rows: [], seed: "u1", now });
    expect(picks).toHaveLength(3);
    expect(new Set(picks.map((p) => p.drill.id)).size).toBe(3);
    expect(new Set(picks.map((p) => p.drill.group)).size).toBe(3);
    expect(picks.every((p) => p.reason === "Bài mới với bạn" && !p.locked && !p.doneToday)).toBe(true);
  });

  it("stays the same all day, even after doing one of them", () => {
    const first = pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: all, rows: [], seed: "u1", now });
    const doneOne: DrillRow[] = [{ drill_id: first[0].drill.id, bpm_reached: 50, rating: "clean", created_at: "2026-11-12T05:00:00Z" }];
    const later = pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: all, rows: doneOne, seed: "u1", now: new Date("2026-11-12T15:00:00Z") });
    expect(later.map((p) => p.drill.id)).toEqual(first.map((p) => p.drill.id));
    expect(later[0].doneToday).toBe(true);
    expect(later.slice(1).some((p) => p.doneToday)).toBe(false);
  });

  it("brings back a drill the learner could not keep up with", () => {
    const rows: DrillRow[] = FINGER_DRILLS.map((d) => ({
      drill_id: d.id,
      bpm_reached: d.tempo.target,
      rating: d.id === "perm-1423" ? ("lost" as const) : ("clean" as const),
      created_at: "2026-11-11T05:00:00Z",
    }));
    const picks = pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: all, rows, seed: "u1", now });
    const lost = picks.find((p) => p.drill.id === "perm-1423");
    expect(lost?.reason).toContain("chưa theo kịp");
  });

  it("gives a brand-new learner the drills that open soonest, marked as not yet open", () => {
    const picks = pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: new Set(), rows: [], seed: "u1", now });
    expect(picks).toHaveLength(3);
    expect(picks.every((p) => p.locked)).toBe(true);
    // string-skip opens after "open-strings", spider drills after "hand-position": the earliest lessons
    for (const p of picks) expect(["hand-position", "open-strings"]).toContain(p.drill.unlockAfter);
  });

  it("changes from one day to the next", () => {
    const days = ["2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15"].map((d) =>
      pickDailyDrills({ drills: FINGER_DRILLS, completedLessons: all, rows: [], seed: "u1", now: new Date(`${d}T03:00:00Z`) })
        .map((p) => p.drill.id)
        .join(","),
    );
    expect(new Set(days).size).toBeGreaterThan(1);
  });
});
