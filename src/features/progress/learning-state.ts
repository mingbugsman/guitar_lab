import { LESSONS, LEVELS, getLevel } from "@/content/curriculum";
import type { Lesson, Level } from "@/content/types";

export type ProgressRow = {
  lesson_slug: string;
  status: "learning" | "practicing" | "mastered";
  checklist: string[];
  self_rating: number | null;
  started_at: string;
  completed_at: string | null;
  verified_at: string | null;
  updated_at: string;
};

export type LearningState = {
  currentLevel: Level;
  /** First lesson in order that is not completed yet (null when everything shipped is done). */
  nextLesson: Lesson | null;
  /** Most recently touched lesson that is started but not completed. */
  inProgressLesson: Lesson | null;
  recentlyCompleted: { lesson: Lesson; completedAt: string } | null;
  completedCount: number;
  totalCount: number;
  percent: number;
  completedByLevel: Record<string, { completed: number; total: number }>;
};

export function buildLearningState(rows: ProgressRow[]): LearningState {
  const bySlug = new Map(rows.map((r) => [r.lesson_slug, r]));
  const isDone = (l: Lesson) => Boolean(bySlug.get(l.slug)?.completed_at);
  const nextLesson = LESSONS.find((l) => !isDone(l)) ?? null;

  const inProgress =
    rows
      .filter((r) => !r.completed_at)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map((r) => LESSONS.find((l) => l.slug === r.lesson_slug))
      .find((l): l is Lesson => Boolean(l)) ?? null;

  const lastDone = rows
    .filter((r) => r.completed_at && LESSONS.some((l) => l.slug === r.lesson_slug))
    .sort((a, b) => b.completed_at!.localeCompare(a.completed_at!))[0];

  const completedByLevel = Object.fromEntries(
    LEVELS.map((lv) => {
      const lessons = LESSONS.filter((l) => l.levelId === lv.id);
      return [lv.id, { completed: lessons.filter(isDone).length, total: lessons.length }];
    }),
  );

  const completedCount = LESSONS.filter(isDone).length;
  return {
    currentLevel: nextLesson ? getLevel(nextLesson.levelId) : LEVELS[LEVELS.length - 1],
    nextLesson,
    inProgressLesson: inProgress,
    recentlyCompleted: lastDone
      ? { lesson: LESSONS.find((l) => l.slug === lastDone.lesson_slug)!, completedAt: lastDone.completed_at! }
      : null,
    completedCount,
    totalCount: LESSONS.length,
    percent: LESSONS.length ? Math.round((completedCount / LESSONS.length) * 100) : 0,
    completedByLevel,
  };
}
