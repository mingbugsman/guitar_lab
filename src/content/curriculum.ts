import { LEVEL_0_LESSONS } from "./level-0";
import { LEVEL_1_LESSONS } from "./level-1";
import { LEVEL_2_LESSONS } from "./level-2";
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
    outcome: "Bấm 11 hợp âm mở, chuyển đổi giữa chúng và nghe ra hợp âm trưởng hay thứ.",
  },
  {
    id: "level-2",
    number: 2,
    title: "Rhythm & Strumming",
    subtitle: "Nhịp và gảy",
    outcome: "Gảy xuống, lên đều tay theo máy đếm nhịp, chơi mẫu gảy ↓ ↓↑ ↑↓↑ và đổi hợp âm mỗi ô nhịp.",
    note: "Đã có nhịp 4/4, mẫu gảy đầu tiên và nhịp 3/4. Nhịp 6/8, rải hợp âm và capo sẽ có ở các bản sau.",
  },
];

/** Permission to stop (writing guide §6) for lessons that do not say something more specific. */
export const REST_DEFAULT =
  "Nếu tay đã mỏi hoặc đầu ngón rát, dừng ở đây. Ngủ một giấc rồi mai tập lại, tay sẽ làm dễ hơn hôm nay.";

/** Every lesson in learning order. */
export const LESSONS: Lesson[] = [...LEVEL_0_LESSONS, ...LEVEL_1_LESSONS, ...LEVEL_2_LESSONS];

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
