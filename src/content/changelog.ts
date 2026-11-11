/**
 * "Có gì mới": user-facing release notes, newest first. Add an entry whenever a change is worth
 * telling learners about. `publishedAt` decides who sees it: everyone who has not dismissed the
 * notice since then, except accounts created after it.
 */
export type UpdateEntry = {
  id: string;
  /** ISO time with offset. */
  publishedAt: string;
  title: string;
  items: string[];
  /** Where to try it. */
  href?: string;
};

export const UPDATES: UpdateEntry[] = [
  {
    id: "2026-11-11-hand-drills",
    publishedAt: "2026-11-11T21:00:00+07:00",
    title: "Bài tập ngón và 3 bài tập tay mỗi ngày",
    items: [
      "12 bài tập ngón (spider, tách ngón, giữ ngón, dời thế tay, nhảy dây…): xem mẫu thật chậm, rồi chơi theo ô sáng và nhanh dần.",
      "Mỗi ngày trang Hôm nay chọn sẵn 3 bài tập tay cho bạn, ưu tiên bài mới hoặc bài lần trước chưa theo kịp.",
      "Hình cần đàn giờ bấm được từng ô: chạm ô nào nghe đúng nốt đó.",
      "Máy nhớ tốc độ sạch nhanh nhất của bạn ở từng bài.",
    ],
    href: "/practice/drills",
  },
  {
    id: "2026-11-11-chord-changes",
    publishedAt: "2026-11-11T15:00:00+07:00",
    title: "Đổi hợp âm 1 phút",
    items: [
      "Đổi qua lại hai hợp âm trong 1 phút, máy nghe tiếng gảy qua micro và tự đếm giúp bạn.",
      "Kết quả được lưu theo từng cặp hợp âm để bạn thấy mình nhanh lên mỗi ngày.",
      "Có trong mọi bài hợp âm, trang Công cụ và buổi tập.",
    ],
    href: "/tools",
  },
  {
    id: "2026-11-11-clearer-lessons",
    publishedAt: "2026-11-11T10:00:00+07:00",
    title: "Bài học dễ hiểu hơn",
    items: [
      "Viết lại 18 bài: thuật ngữ được giải thích ngay lần đầu xuất hiện.",
      "Khung \"Cảm giác khi tập\": đau ngón bao lâu là bình thường, khi nào phải dừng.",
      "Hợp âm đầu tiên (Em) đến sớm hơn: giờ là bài 10.",
      "Hình cần đàn vừa màn hình điện thoại, không phải cuộn ngang.",
    ],
    href: "/academy",
  },
];

export const LATEST_UPDATE_AT = UPDATES[0].publishedAt;

/** Entries the learner has not seen: newer than both their last dismissal and their account. */
export function unseenUpdates(
  entries: UpdateEntry[],
  { seenAt, accountCreatedAt }: { seenAt: string | null; accountCreatedAt: string | null },
): UpdateEntry[] {
  const after = Math.max(seenAt ? Date.parse(seenAt) : 0, accountCreatedAt ? Date.parse(accountCreatedAt) : 0);
  return entries.filter((e) => Date.parse(e.publishedAt) > after);
}
