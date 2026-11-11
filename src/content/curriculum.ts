import { LEVEL_0_LESSONS } from "./level-0";
import { LEVEL_1_LESSONS } from "./level-1";
import type { Lesson, Level, LevelId } from "./types";

export const LEVELS: Level[] = [
  {
    id: "level-0",
    number: 0,
    title: "Absolute Beginner",
    subtitle: "Làm quen cây đàn",
    outcome: "Nhận biết cây đàn, tự lên dây, gảy từng dây sạch tiếng và bấm được hợp âm đầu tiên (Em).",
  },
  {
    id: "level-1",
    number: 1,
    title: "First Chords",
    subtitle: "Những hợp âm đầu tiên",
    outcome: "Bấm hợp âm mở và chuyển đổi giữa các hợp âm cơ bản.",
    note: "Bản MVP 0.1 gồm: đọc sơ đồ hợp âm, Am, E, A, D (Em đã học ở cuối Level 0). Dm, C, G, A7, D7, E7 sẽ có ở bản 0.2.",
  },
];

/** Every lesson in learning order. */
export const LESSONS: Lesson[] = [...LEVEL_0_LESSONS, ...LEVEL_1_LESSONS];

const bySlug = new Map(LESSONS.map((l) => [l.slug, l]));

export function getLesson(slug: string): Lesson | undefined {
  return bySlug.get(slug);
}

export function isLessonSlug(slug: string): boolean {
  return bySlug.has(slug);
}

export function lessonsForLevel(levelId: LevelId): Lesson[] {
  return LESSONS.filter((l) => l.levelId === levelId);
}

export function getLevel(levelId: LevelId): Level {
  return LEVELS.find((l) => l.id === levelId)!;
}

export function nextLesson(slug: string): Lesson | undefined {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  return i >= 0 ? LESSONS[i + 1] : undefined;
}

export function previousLesson(slug: string): Lesson | undefined {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  return i > 0 ? LESSONS[i - 1] : undefined;
}
