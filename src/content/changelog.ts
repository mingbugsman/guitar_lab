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
    id: "2026-11-23-level-1-complete",
    publishedAt: "2026-11-23T14:27:00+07:00",
    title: "Level 1 đủ 12 bài: A7, D7, E7 và bài nghe trưởng, thứ",
    items: [
      "Bài mới 'Trưởng và thứ': nghe ba cặp E–Em, A–Am, D–Dm rồi làm 10 câu 'Trưởng hay thứ?', đáp án hiện ngay sau mỗi câu.",
      "Ba hợp âm bảy A7, D7, E7: mỗi cái chỉ cần thêm hoặc bớt một ngón từ hợp âm bạn đã biết, và tập đổi sang hợp âm nó hay dẫn tới (A7 → D, D7 → G, E7 → Am).",
      "Học xong 12 bài là có mốc 'Hoàn thành Level 1'.",
    ],
    href: "/academy/major-minor",
  },
  {
    id: "2026-11-20-chords-c-g-dm",
    publishedAt: "2026-11-20T05:20:00+07:00",
    title: "3 hợp âm mới: C, G, Dm",
    items: [
      "Level 1 có thêm bài C (Đô trưởng), G (Son trưởng) và Dm (Rê thứ), mỗi bài có hình chuyển tay và đo 1 phút đổi hợp âm.",
      "Mỗi bài dựa vào hợp âm bạn đã biết: C giữ hai ngón của Am, Dm giữ ngón 3 của D.",
      "Học xong cả 8 bài Level 1 sẽ nhận mốc 'Hoàn thành Level 1'.",
      "Chuyển giữa các trang nhanh hơn, và có vạch mảnh chạy trên đầu trang khi đang tải.",
    ],
    href: "/academy/chord-c",
  },
  {
    id: "2026-11-13-acoustic-voice",
    publishedAt: "2026-11-13T23:45:00+07:00",
    title: "Tiếng đàn giống đàn thật hơn",
    items: [
      "Tiếng đàn trong app được làm lại theo số đo trên đàn guitar thật: ấm hơn, có tiếng thùng đàn, bớt chói như tiếng điện tử.",
      "Mọi nốt giờ đúng cao độ. Trước đây nhiều nốt bị thấp hơn chuẩn một chút, nhất là trên dây mảnh.",
      "Dây mảnh ngân lâu như đàn thật, không còn tắt sau nửa giây.",
      "Bài Tiếng sạch: mẫu tiếng rè có tiếng lạo xạo rõ ràng, mẫu tiếng tắt là tiếng 'bụp' rồi im.",
    ],
    href: "/academy/clean-sounds",
  },
  {
    id: "2026-11-12-lesson-clarity",
    publishedAt: "2026-11-12T13:25:00+07:00",
    title: "Bài học dễ theo hơn",
    items: [
      "Hình động hướng gảy: phím gảy quét qua dây theo tiếng đàn, kèm đếm '1 và 2 và' (bài Gảy dây buông, Cao độ và nhịp).",
      "Hình động chuyển hợp âm: chấm ngón trượt từ hợp âm cũ sang mới, mỗi ngón một câu nói đi đâu (bài Am, E, A, D).",
      "Nghe mẫu tiếng sạch, tiếng rè, tiếng tắt và tiếng chạm dây bên cạnh để so với tiếng đàn của bạn.",
      "Mỗi bài có mục 'Thử nhiều lần vẫn chưa được?': một bước nhỏ hơn, bài cũ nên quay lại, và lúc nên nghỉ.",
    ],
    href: "/academy/chord-am",
  },
  {
    id: "2026-11-11-chord-challenge",
    publishedAt: "2026-11-11T22:30:00+07:00",
    title: "Thử thách hợp âm",
    items: [
      "Chọn hợp âm theo nhóm (Cho người mới, Trưởng, Thứ, Bảy, Sus, Chặn, Power) hoặc bấm một mẫu có sẵn.",
      "Hợp âm hiện ngẫu nhiên và trôi từ phải sang trái; thẻ chạm vạch cam thì gảy. Tốc độ nhanh dần theo từng chặng.",
      "Để máy đề xuất thời gian và tốc độ, hoặc tự chỉnh số phút, tốc độ và số phách mỗi hợp âm.",
      "Thư viện có thêm hơn 30 hợp âm, kể cả hợp âm chặn như F, Bm (sơ đồ có vẽ thanh chặn).",
    ],
    href: "/practice/challenge",
  },
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
  { seenAt, accountCreatedAt, now = Date.now() }: { seenAt: string | null; accountCreatedAt: string | null; now?: number },
): UpdateEntry[] {
  const after = Math.max(seenAt ? Date.parse(seenAt) : 0, accountCreatedAt ? Date.parse(accountCreatedAt) : 0);
  // entries dated in the future are scheduled: they appear once their time comes
  return entries.filter((e) => Date.parse(e.publishedAt) > after && Date.parse(e.publishedAt) <= now);
}
