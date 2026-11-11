import { describe, expect, it } from "vitest";
import { LESSONS } from "@/content/curriculum";
import { buildLearningState, type ProgressRow } from "./learning-state";
import { earnedMilestones } from "./milestones";

const row = (slug: string, completedAt: string | null, updatedAt = "2026-11-01T00:00:00Z"): ProgressRow => ({
  lesson_slug: slug,
  status: completedAt ? "practicing" : "learning",
  checklist: [],
  self_rating: null,
  started_at: "2026-11-01T00:00:00Z",
  completed_at: completedAt,
  verified_at: null,
  updated_at: updatedAt,
});

describe("buildLearningState", () => {
  it("starts a new learner at Level 0, lesson 1", () => {
    const s = buildLearningState([]);
    expect(s.currentLevel.id).toBe("level-0");
    expect(s.nextLesson?.slug).toBe("introduction");
    expect(s.completedCount).toBe(0);
    expect(s.recentlyCompleted).toBeNull();
  });

  it("moves to Level 1 after all Level 0 lessons are complete", () => {
    const rows = LESSONS.filter((l) => l.levelId === "level-0").map((l, i) =>
      row(l.slug, `2026-11-01T00:${String(i).padStart(2, "0")}:00Z`),
    );
    const s = buildLearningState(rows);
    expect(s.currentLevel.id).toBe("level-1");
    expect(s.nextLesson?.slug).toBe("reading-chord-diagrams");
    expect(s.recentlyCompleted?.lesson.slug).toBe("clean-sounds");
    expect(s.completedByLevel["level-0"]).toEqual({ completed: 13, total: 13 });
  });

  it("tracks the most recent in-progress lesson", () => {
    const s = buildLearningState([
      row("introduction", "2026-11-01T00:00:00Z"),
      row("posture", null, "2026-11-02T00:00:00Z"),
      row("guitar-anatomy", null, "2026-11-03T00:00:00Z"),
    ]);
    expect(s.inProgressLesson?.slug).toBe("guitar-anatomy");
    expect(s.nextLesson?.slug).toBe("guitar-anatomy");
  });
});

describe("earnedMilestones", () => {
  it("awards nothing without evidence", () => {
    expect(earnedMilestones({ completedLessonSlugs: [], completedSessions: 0, totalPracticeSeconds: 0 })).toEqual([]);
  });

  it("awards practice and lesson milestones from real data", () => {
    const m = earnedMilestones({
      completedLessonSlugs: ["introduction", "chord-em"],
      completedSessions: 3,
      totalPracticeSeconds: 3700,
    });
    expect(m).toEqual(
      expect.arrayContaining(["first-lesson", "first-practice", "practice-3-sessions", "practice-60-minutes", "first-chord"]),
    );
    expect(m).not.toContain("level-0-complete");
    expect(m).not.toContain("first-chords-complete");
  });
});
