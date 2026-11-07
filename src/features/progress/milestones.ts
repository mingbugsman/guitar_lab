import { LESSONS } from "@/content/curriculum";

export type MilestoneInput = {
  completedLessonSlugs: string[];
  completedSessions: number;
  totalPracticeSeconds: number;
};

export const MILESTONES = [
  { key: "first-lesson", title: "Bài học đầu tiên", description: "Hoàn thành bài học đầu tiên." },
  { key: "first-practice", title: "Buổi tập đầu tiên", description: "Lưu buổi luyện tập đầu tiên." },
  { key: "practice-3-sessions", title: "Ba buổi tập", description: "Hoàn thành 3 buổi luyện tập." },
  { key: "practice-60-minutes", title: "60 phút luyện tập", description: "Tổng thời gian luyện tập đạt 60 phút." },
  { key: "level-0-complete", title: "Hoàn thành Level 0", description: "Hoàn thành toàn bộ 12 bài Level 0." },
  { key: "first-chord", title: "Hợp âm đầu tiên", description: "Hoàn thành bài hợp âm đầu tiên." },
  { key: "first-chords-complete", title: "5 hợp âm đầu tiên", description: "Hoàn thành Em, Am, E, A và D." },
] as const;

export type MilestoneKey = (typeof MILESTONES)[number]["key"];

const CHORD_LESSONS = ["chord-em", "chord-am", "chord-e", "chord-a", "chord-d"];

/** Pure rule set: which milestones the evidence supports. */
export function earnedMilestones(input: MilestoneInput): MilestoneKey[] {
  const done = new Set(input.completedLessonSlugs);
  const level0 = LESSONS.filter((l) => l.levelId === "level-0");
  const earned: MilestoneKey[] = [];
  if (done.size > 0) earned.push("first-lesson");
  if (input.completedSessions >= 1) earned.push("first-practice");
  if (input.completedSessions >= 3) earned.push("practice-3-sessions");
  if (input.totalPracticeSeconds >= 3600) earned.push("practice-60-minutes");
  if (level0.every((l) => done.has(l.slug))) earned.push("level-0-complete");
  if (CHORD_LESSONS.some((c) => done.has(c))) earned.push("first-chord");
  if (CHORD_LESSONS.every((c) => done.has(c))) earned.push("first-chords-complete");
  return earned;
}
