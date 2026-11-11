export type ActivityKind = "recall" | "theory" | "technical" | "application" | "free_play" | "reflection";

export type RoutineActivity = {
  kind: ActivityKind;
  title: string;
  minutes: number;
  guidance: string[];
};

/** MVP 0.1 daily routine (30 minutes) from the roadmap. */
export const DAILY_30: RoutineActivity[] = [
  {
    kind: "recall",
    title: "Ôn lại",
    minutes: 4,
    guidance: [
      "Lên dây bằng Tuner (nếu chưa).",
      "Ôn lại bài vừa hoàn thành: làm lại bài tập chính một lần mà không nhìn hướng dẫn.",
    ],
  },
  {
    kind: "theory",
    title: "Nhạc lý",
    minutes: 5,
    guidance: [
      "Đọc to tên 6 dây từ dây 6 (to nhất, gần mặt bạn) đến dây 1.",
      "Tìm các nốt tự nhiên trên dây 6 và dây 5, nói to tên nốt.",
    ],
  },
  {
    kind: "technical",
    title: "Kỹ thuật",
    minutes: 8,
    guidance: [
      "Làm 3 bài tập tay hôm nay (danh sách ngay bên dưới). Mỗi bài tự chạy chậm rồi nhanh dần.",
      "Còn thời gian thì làm phần Luyện tập của bài học hiện tại.",
    ],
  },
  {
    kind: "application",
    title: "Ứng dụng",
    minutes: 8,
    guidance: [
      "Ghép kỹ năng vào âm nhạc: chuyển giữa các hợp âm đã học, mỗi hợp âm 4 phách theo metronome.",
      "Nếu chưa học hợp âm: chơi chuỗi nốt của bài Tạo âm thanh sạch.",
    ],
  },
  {
    kind: "free_play",
    title: "Chơi tự do",
    minutes: 3,
    guidance: ["Chơi bất cứ gì bạn thích với những gì đã biết. Không có đúng sai — chỉ để vui."],
  },
  {
    kind: "reflection",
    title: "Tự nhìn lại",
    minutes: 2,
    guidance: ["Hôm nay phần nào tốt nhất? Phần nào cần sửa? Ghi lại một câu ở ô ghi chú cuối buổi."],
  },
];

/** Scale the routine to the learner's daily goal, keeping proportions (min 1 minute each). */
export function routineForGoal(goalMinutes: number): RoutineActivity[] {
  if (goalMinutes === 30) return DAILY_30;
  const factor = goalMinutes / 30;
  const scaled = DAILY_30.map((a) => ({ ...a, minutes: Math.max(1, Math.round(a.minutes * factor)) }));
  // Fix rounding drift on the longest activity so the total equals the goal.
  const drift = goalMinutes - scaled.reduce((s, a) => s + a.minutes, 0);
  const longest = scaled.reduce((iMax, a, i, arr) => (a.minutes > arr[iMax].minutes ? i : iMax), 0);
  scaled[longest] = { ...scaled[longest], minutes: Math.max(1, scaled[longest].minutes + drift) };
  return scaled;
}

export function guidanceFor(kind: ActivityKind): string[] {
  return DAILY_30.find((a) => a.kind === kind)?.guidance ?? [];
}
