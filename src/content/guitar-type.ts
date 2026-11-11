/**
 * Guitar Lab lessons are written for the steel-string ACOUSTIC guitar (docx/WRITING_GUIDE.md §7).
 * Learners with another instrument get a short, honest note about what differs instead of
 * pretending the text was written for them.
 */
export type GuitarType = "acoustic" | "classical" | "electric";

export const GUITAR_TYPE_NOTES: Record<Exclude<GuitarType, "acoustic">, { title: string; points: string[] }> = {
  classical: {
    title: "Bạn đang dùng đàn classic. Bài này viết cho đàn acoustic, có vài chỗ khác:",
    points: [
      "Dây nylon mềm hơn dây sắt nên đỡ đau ngón, nhưng tiếng nhỏ và ấm hơn âm thanh mẫu trong bài.",
      "Cần đàn rộng hơn, các dây cách xa nhau hơn. Hợp âm vẫn bấm đúng như sơ đồ, chỉ là các ngón cần vươn xa hơn một chút.",
      "Đàn classic thường gảy bằng ngón tay. Chỗ nào bài nhắc tới phím gảy, bạn dùng ngón cái thay cũng được.",
    ],
  },
  electric: {
    title: "Bạn đang dùng đàn điện. Bài này viết cho đàn acoustic, có vài chỗ khác:",
    points: [
      "Đàn điện không có lỗ thoát âm. Chỗ nào bài nói gảy trước lỗ thoát âm, bạn gảy ở vùng giữa cần đàn và ngựa đàn, phía trên các pickup.",
      "Chưa cắm amply thì tiếng rất nhỏ. Khi dùng Tuner, hãy để micro sát đàn hoặc cắm amply ở âm lượng vừa phải.",
      "Dây đàn điện mảnh và nằm sát cần đàn hơn nên bấm nhẹ tay hơn. Tên dây, số phím và sơ đồ hợp âm vẫn y như trong bài.",
    ],
  },
};
