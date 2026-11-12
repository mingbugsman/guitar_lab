import { AT_60, chordLesson } from "./chord-lesson";
import type { Lesson } from "./types";

/**
 * LEVEL 1 — FIRST CHORDS (MVP 0.1 ships: reading diagrams + Am, E, A, D).
 * Em, the easiest chord, is taught at the end of Level 0 (lesson 10) so the first chord comes
 * early. This level opens by reading Em — a chord the learner can already play — on a diagram.
 */

export const LEVEL_1_LESSONS: Lesson[] = [
  {
    slug: "reading-chord-diagrams",
    levelId: "level-1",
    order: 1,
    title: "Đọc sơ đồ hợp âm",
    summary: "Sơ đồ hợp âm nhìn cây đàn từ góc nào, và cách chuyển nó sang tay bạn.",
    minutes: 12,
    objectives: [
      "Hiểu sơ đồ hợp âm (hình chỉ chỗ đặt từng ngón) vẽ đàn dựng đứng nhìn từ phía trước: dây 6 bên {fretSide}, đầu đàn ở trên.",
      "Đọc được chấm tròn có số, dấu O và dấu X.",
      "Tìm trên đàn thật đúng ô mà sơ đồ chỉ.",
    ],
    prerequisites: ["clean-sounds"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Hợp âm là nhiều nốt vang cùng lúc. Bạn đã bấm được Em ở cuối Level 0 bằng hình cần đàn. Sách và trang hợp âm lại vẽ hợp âm theo một kiểu khác: sơ đồ. Học đọc sơ đồ, bạn tự tra được mọi hợp âm mới.",
          "Sơ đồ cho biết đặt ngón nào, ở dây nào, phím nào.",
          "Dựng đàn đứng thẳng trước mặt, mặt đàn hướng về bạn, đầu đàn ở trên, giống hình Cấu tạo đàn. Sơ đồ hợp âm vẽ phần đầu cần đàn nhìn theo đúng góc này.",
          "Trên sơ đồ: 6 đường dọc là 6 dây, dây 6 bên {FRETSIDE}. Các đường ngang là thanh phím (thanh kim loại trên cần đàn). Vạch đậm trên cùng là lược đàn (thanh trắng có 6 rãnh).",
        ],
      },
      { type: "visual", visual: { kind: "anatomy", initialPart: "strings" }, caption: "Đàn dựng đứng: dây 6 bên {fretSide}, giống sơ đồ hợp âm." },
      {
        type: "steps",
        heading: "Ký hiệu trên sơ đồ",
        items: [
          "Chấm tròn có số: đặt ngón đó vào ô phím đó. 1 là ngón trỏ, 2 ngón giữa, 3 ngón áp út, 4 ngón út.",
          "Dấu O phía trên lược đàn: gảy dây đó buông, tức là không bấm.",
          "Dấu X phía trên lược đàn: không gảy dây đó.",
          "Hàng chữ dưới cùng: tên nốt của từng dây khi không bấm (E A D G B E) và số dây (6 đến 1).",
        ],
      },
      {
        type: "text",
        heading: "Em, nhìn bằng sơ đồ",
        paragraphs: ["Dưới đây là Em, hợp âm bạn đã bấm được, vẽ theo hai cách: sơ đồ và hình cần đàn quen thuộc. Tìm hai chấm của ngón 2 và ngón 3 trên cả hai hình."],
      },
      { type: "visual", visual: { kind: "chord", chord: "em" } },
      {
        type: "callout",
        tone: "compare",
        text: "Từ sơ đồ sang tay bạn: khi ôm đàn và nhìn xuống, cột bên {FRETSIDE} của sơ đồ (dây 6) trở thành dây gần mặt bạn nhất. Hàng phím trên cùng của sơ đồ (phím 1) trở thành ô sát lược đàn, phía đầu đàn. Hình cần đàn cạnh sơ đồ cho thấy đúng điều này.",
      },
    ],
    practice: {
      minutes: 6,
      steps: [
        "Dựng đàn đứng, đặt cạnh sơ đồ Em.",
        "Chỉ tay vào dây 5 phím 2 trên đàn thật, rồi chỉ ô đó trên sơ đồ.",
        "Ôm đàn lại và bấm Em như bạn đã học.",
        "Nhìn sơ đồ: chỉ ra chấm nào là ngón 2, chấm nào là ngón 3, và vì sao cả 6 dây đều có dấu O hoặc chấm.",
      ],
    },
    mistakes: [
      {
        mistake: "Đặt ngón vào dây 2 trong khi sơ đồ chỉ dây 5.",
        fix: "Bạn đang đọc sơ đồ như thể dây 1 nằm bên {fretSide}. Đọc hàng số dưới sơ đồ: dây 6 bên {fretSide}, dây 1 bên {pickSide}.",
      },
    ],
    checklist: [
      { id: "symbols", label: "Tôi chỉ vào chấm có số, dấu O và dấu X trên một sơ đồ và nói to mỗi ký hiệu bảo tôi làm gì." },
      { id: "orientation", label: "Tôi dựng đàn đứng cạnh sơ đồ và chỉ đúng dây 6 trên cả hai: cùng nằm bên {fretSide}." },
      { id: "transfer", label: "Tôi tìm đúng ô 'dây 5 phím 2' khi ôm đàn nhìn xuống." },
    ],
    assessment: ["Đọc to đúng một sơ đồ bất kỳ: dây nào, phím nào, ngón nào, dây nào không gảy."],
    mastery: ["Đặt tay theo một sơ đồ mới mà không cần hình cần đàn hỗ trợ."],
  },
  chordLesson("am", { levelId: "level-1", order: 2, prerequisites: ["reading-chord-diagrams"] }, {
    summary: "Ba ngón, bỏ dây 6. Chuyển từ Em sang Am rất tự nhiên.",
    drill: ["em", "am"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. Am (La thứ) dùng ba ngón và không gảy dây 6.",
      "Dây trầm nhất được gảy là dây 5 buông. Đó là nốt gốc (nốt mà hợp âm mang tên): A.",
      "Hình dạng Am giống Em, nhưng dời sang phía dây mảnh hơn một hàng và thêm ngón 1.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 (hàng trên cùng) có dấu X: không gảy. Ngón 1 ở dây 2 (hàng thứ hai từ dưới lên, phía sàn nhà), phím 1, sát lược đàn (thanh trắng có 6 rãnh ở đầu cần đàn) nhất.",
    sessions: "3 đến 5",
    practice: [
      "Đặt Am và gảy từng dây, từ dây 5 đến dây 1.",
      `Gảy xuống Am 4 lần ${AT_60}, bắt đầu cú gảy từ dây 5.`,
      "Đổi Em sang Am rồi về Em, mỗi hợp âm 4 tiếng tích.",
    ],
    mistakes: [
      {
        mistake: "Tiếng hợp âm bị đục, nghe trầm lạ.",
        fix: "Bạn lỡ gảy dây 6. Bắt đầu cú gảy từ dây 5, hoặc chạm nhẹ đầu ngón cái tay bấm lên dây 6 để chặn tiếng.",
      },
      {
        mistake: "Dây 1 bị tắt tiếng.",
        fix: "Ngón 1 đang chạm vào dây 1. Cong ngón 1, bấm bằng đầu ngón.",
      },
    ],
  }),
  chordLesson("e", { levelId: "level-1", order: 3, prerequisites: ["chord-am"] }, {
    summary: "Hợp âm trưởng đầu tiên: giống Am, dời lên một hàng dây.",
    drill: ["e", "am"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. E (Mi trưởng) có đúng hình dạng của Am, nhưng dời về phía dây to hơn một hàng, và gảy cả 6 dây.",
      "Nghe E rồi nghe Em: chỉ khác một nốt, G# (G thăng, cao hơn G nửa cung) thay cho G. Vậy mà tiếng đàn đổi từ sáng sang buồn. Đó là khác biệt giữa hợp âm trưởng và hợp âm thứ.",
    ],
    compare:
      "Trên hình cần đàn, ba chấm nằm ở hàng 2, 3, 4 tính từ trên (dây 5, 4, 3). Ngón 1 ở dây 3, phím 1. So với Am, cả hình dạng dịch về phía mặt bạn một dây.",
    tip: "Đặt E, rồi nhấc riêng ngón 1 lên: bạn đang bấm Em. Đặt lại ngón 1: lại là E. Nghe sự khác nhau giữa trưởng và thứ.",
    sessions: "3 đến 5",
    practice: [
      "Đặt E và gảy từng dây, từ dây 6 đến dây 1.",
      "Đổi từ E sang Am bằng cách giữ nguyên hình bàn tay, chỉ dời cả khối một dây.",
      "Nhấc rồi đặt ngón 1 để đổi giữa E và Em. Nghe sự khác nhau.",
    ],
    mistakes: [
      {
        mistake: "Dây 3 bị rè.",
        fix: "Ngón 1 nằm quá xa thanh kim loại. Đặt ngón 1 sát thanh kim loại thứ nhất, phía thùng đàn.",
      },
    ],
  }),
  chordLesson("a", { levelId: "level-1", order: 4, prerequisites: ["chord-e"] }, {
    summary: "Ba ngón chen nhau trong cùng ô phím 2.",
    drill: ["a", "e"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. A (La trưởng) đặt ba ngón cạnh nhau trong cùng ô phím 2, trên dây 4, 3, 2. Không gảy dây 6.",
      "Ô phím hẹp nên ba ngón không thể cùng sát thanh kim loại. Xếp hơi chéo: ngón 1 lùi về phía đầu đàn một chút, ngón 3 sát thanh kim loại nhất.",
    ],
    compare:
      "Trên hình cần đàn, ba chấm thẳng hàng dọc ở phím 2, trên hàng thứ 3, 4, 5 tính từ trên (dây 4, 3, 2). Dây 1 (hàng dưới cùng, phía sàn nhà) gảy buông: đừng để ngón 3 chạm vào nó.",
    sessions: "4 đến 6",
    practice: [
      "Đặt A và gảy từng dây, từ dây 5 đến dây 1. Nghe kỹ dây 1.",
      `Gảy xuống A 4 lần ${AT_60}, bắt đầu từ dây 5.`,
      "Đổi giữa A và E, mỗi hợp âm 4 tiếng tích.",
    ],
    mistakes: [
      {
        mistake: "Dây 1 bị tắt tiếng.",
        fix: "Ngón 3 đang chạm vào dây 1. Cong ngón 3 nhiều hơn để đầu ngón đứng thẳng trên dây 2.",
      },
      {
        mistake: "Ba ngón chen không vừa ô phím.",
        fix: "Xếp chéo: ngón 1 hơi lùi về phía đầu đàn, ngón 3 sát thanh kim loại.",
      },
    ],
  }),
  chordLesson("d", { levelId: "level-1", order: 5, prerequisites: ["chord-a"] }, {
    summary: "Hình tam giác trên ba dây mảnh nhất, chỉ gảy 4 dây.",
    drill: ["d", "a"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. D (Rê trưởng) chỉ gảy 4 dây: dây 4 không bấm, và dây 3, 2, 1 có bấm.",
      "Dây 4 không bấm cho nốt D. Đó là nốt gốc (nốt mà hợp âm mang tên) và là nốt trầm nhất của hợp âm này.",
      "Ba ngón bấm tạo thành hình tam giác.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 và dây 5 (hai hàng trên cùng, gần mặt bạn) có dấu X. Tam giác nằm trên ba hàng dưới cùng (dây 3, 2, 1, phía sàn nhà). Đỉnh tam giác là ngón 3 ở phím 3, dây 2.",
    sessions: "4 đến 6",
    practice: [
      "Đặt D và gảy từng dây, từ dây 4 đến dây 1.",
      `Gảy xuống D 4 lần ${AT_60}, chỉ gảy 4 dây, bắt đầu từ dây 4.`,
      "Đổi giữa D và A, mỗi hợp âm 4 tiếng tích.",
    ],
    mistakes: [
      {
        mistake: "Tiếng hợp âm bị đục.",
        fix: "Bạn đang gảy cả dây 5 và dây 6. Bắt đầu cú gảy từ dây 4: nốt D là nốt trầm nhất.",
      },
      {
        mistake: "Dây 1 bị tắt tiếng.",
        fix: "Phần thịt ngón 3 đang đè lên dây 1. Cong ngón 3 và hạ cổ tay nhẹ để các ngón đứng thẳng hơn.",
      },
    ],
  }),
];
