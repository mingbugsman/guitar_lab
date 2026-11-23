import { AT_60, chordLesson } from "./chord-lesson";
import type { Lesson } from "./types";

/**
 * LEVEL 1 — FIRST CHORDS: reading diagrams, Am, E, A, D (MVP 0.1), then C, G, Dm, hearing
 * major vs minor, and the three seventh chords A7, D7, E7 (MVP 0.2).
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
    stuck: {
      smaller: "Chỉ tìm một cột: dây 6 trên sơ đồ. Chỉ nó trên đàn dựng đứng, rồi trên đàn khi ôm. Xong cột đó mới đọc chấm và ký hiệu.",
      back: [{ slug: "chord-em", why: "so sơ đồ Em với hình cần đàn bạn đã quen" }],
    },
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
    stuck: {
      smaller: "Bỏ ngón 1 ra trước. Đặt ngón 2 và 3 (hình Em dịch một dây về phía sàn nhà), gảy cho sạch, rồi mới thêm ngón 1 ở dây 2 phím 1.",
      back: [{ slug: "chord-em", why: "Am dùng lại hình hai ngón của Em" }],
    },
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
    stuck: {
      smaller: "Đặt Em trước và giữ nguyên. Thêm ngón 1 ở dây 3 phím 1: E chính là Em thêm một ngón.",
      back: [{ slug: "chord-em", why: "đặt Em sạch tiếng trước khi thêm ngón 1" }],
    },
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
    stuck: {
      smaller: "Đặt từng ngón một, bắt đầu từ ngón 1. Đặt xong ngón nào gảy dây đó, sạch rồi mới thêm ngón kế tiếp.",
      back: [{ slug: "clean-sounds", why: "ôn cách sửa tiếng rè, tiếng tắt theo triệu chứng" }],
    },
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
    stuck: {
      smaller: "Chỉ gảy dây 3 và dây 2 với ngón 1 và ngón 3 trước. Khi hai dây sạch, thêm ngón 2 ở dây 1 phím 2.",
      back: [{ slug: "reading-chord-diagrams", why: "ôn dấu X: dây 6 và dây 5 không gảy" }],
    },
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
  chordLesson("c", { levelId: "level-1", order: 6, prerequisites: ["chord-d"] }, {
    summary: "Giữ nguyên hai ngón của Am, chỉ dời ngón 3.",
    drill: ["c", "am"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. C (Đô trưởng) dùng ba ngón và không gảy dây 6.",
      "Ngón 3 ở dây 5 phím 3 cho nốt C. Đó là nốt gốc (nốt mà hợp âm mang tên) và là nốt trầm nhất của hợp âm này.",
      "C rất gần Am: ngón 1 và ngón 2 nằm y như khi bấm Am. Chỉ có ngón 3 rời dây 3 để sang dây 5, phím 3.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 (hàng trên cùng, gần mặt bạn) có dấu X: không gảy. Ba chấm xếp thành đường chéo: ngón 3 ở hàng thứ hai từ trên (dây 5) phím 3, ngón 2 ở dây 4 phím 2, ngón 1 ở dây 2 (hàng thứ hai từ dưới lên, phía sàn nhà) phím 1.",
    tip: "Đặt Am, giữ yên ngón 1 và ngón 2, rồi nhấc ngón 3 sang dây 5 phím 3: bạn đang bấm C. Hai ngón đứng yên làm điểm tựa cho bàn tay khi đổi qua lại.",
    sessions: "4 đến 6",
    stuck: {
      smaller: "Đặt Am và giữ nguyên ngón 1, ngón 2. Chỉ tập nhấc ngón 3 từ dây 3 sang dây 5 phím 3 rồi về lại, 10 lần, chưa cần gảy.",
      back: [{ slug: "chord-am", why: "C dùng lại ngón 1 và ngón 2 của Am" }],
    },
    practice: [
      "Đặt C và gảy từng dây, từ dây 5 đến dây 1. Nghe kỹ dây 3 và dây 1.",
      `Gảy xuống C 4 lần ${AT_60}, bắt đầu cú gảy từ dây 5.`,
      "Đổi giữa Am và C, mỗi hợp âm 4 tiếng tích. Ngón 1 và ngón 2 không rời dây.",
    ],
    mistakes: [
      {
        mistake: "Dây 3 bị tắt tiếng.",
        fix: "Phần thịt ngón 2 đang chạm dây 3. Cong ngón 2 để đầu ngón đứng thẳng trên dây 4.",
      },
      {
        mistake: "Dây 1 bị tắt tiếng.",
        fix: "Ngón 1 đang nằm rạp và chạm dây 1. Cong ngón 1, bấm bằng đầu ngón.",
      },
      {
        mistake: "Dây 5 bị rè.",
        fix: "Ngón 3 phải vươn xa nhất. Hạ ngón cái sau cần đàn thấp hơn một chút để ngón 3 tới được sát thanh kim loại của phím 3.",
      },
    ],
  }),
  chordLesson("g", { levelId: "level-1", order: 7, prerequisites: ["chord-c"] }, {
    summary: "Gảy cả 6 dây: hai ngón ở dây to, một ngón ở tận dây 1.",
    drill: ["g", "c"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. G (Son trưởng) gảy cả 6 dây. Ba dây ở giữa (dây 4, 3, 2) không bấm.",
      "Ngón 2 ở dây 6 phím 3 cho nốt G. Đó là nốt gốc (nốt mà hợp âm mang tên) và là nốt trầm nhất của hợp âm này.",
      "Bàn tay bấm cần mở rộng: hai ngón ở phía dây to, một ngón ở tận dây 1. Đây là lần đầu bàn tay trải ngang cả cần đàn, nên đặt G chậm hơn các hợp âm trước là bình thường.",
    ],
    compare:
      "Trên hình cần đàn, hai chấm nằm ở hai hàng trên cùng (dây 6 và dây 5, gần mặt bạn): ngón 2 ở phím 3, ngón 1 ở phím 2. Chấm thứ ba ở hàng dưới cùng (dây 1, phía sàn nhà), phím 3, là ngón 3. Ba hàng ở giữa không có chấm.",
    tip: "Đặt ngón 2 ở dây 6 trước: đó là nốt trầm nhất, cũng là ngón khó vào chỗ nhất. Rồi mới thả ngón 1 và ngón 3 xuống.",
    sessions: "5 đến 8",
    stuck: {
      smaller: "Tập G nhỏ trước: chỉ đặt ngón 3 ở dây 1 phím 3 và gảy 4 dây, từ dây 4 đến dây 1. Khi dây 1 sạch tiếng, thêm ngón 1 ở dây 5 và ngón 2 ở dây 6.",
      back: [{ slug: "hand-position", why: "ôn chỗ đặt ngón cái sau cần đàn để bàn tay mở rộng được" }],
    },
    practice: [
      "Đặt G và gảy từng dây, từ dây 6 đến dây 1. Nghe kỹ dây 5 và dây 2.",
      `Gảy xuống G 4 lần ${AT_60}, gảy cả 6 dây.`,
      "Đổi giữa C và G, mỗi hợp âm 4 tiếng tích.",
    ],
    mistakes: [
      {
        mistake: "Dây 5 bị tắt tiếng.",
        fix: "Ngón 2 ở dây 6 đang nằm rạp lên dây 5. Cong ngón 2 để đầu ngón đứng trên dây 6.",
      },
      {
        mistake: "Dây 2 bị tắt tiếng.",
        fix: "Ngón 3 ở dây 1 đang chạm dây 2. Dựng đầu ngón 3 thẳng hơn, chỉ chạm dây 1.",
      },
    ],
  }),
  chordLesson("dm", { levelId: "level-1", order: 8, prerequisites: ["chord-g"] }, {
    summary: "Như D nhưng buồn hơn: ngón 3 đứng yên, hai ngón kia đổi chỗ.",
    drill: ["dm", "d"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. Dm (Rê thứ) chỉ gảy 4 dây, giống D: dây 4 không bấm, dây 3, 2, 1 có bấm.",
      "Dây 4 không bấm cho nốt D. Đó là nốt gốc (nốt mà hợp âm mang tên) và là nốt trầm nhất của hợp âm này.",
      "Nghe D rồi nghe Dm: chỉ khác nốt trên dây 1. D bấm phím 2 (nốt F#, F thăng), Dm bấm phím 1 (nốt F), thấp hơn nửa cung (khoảng cách giữa hai phím liền nhau). Giống E với Em, một nốt thấp xuống nửa cung là tiếng đàn đổi từ sáng sang buồn.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 và dây 5 (hai hàng trên cùng, gần mặt bạn) có dấu X. Ba chấm nằm ở ba hàng dưới cùng: ngón 2 ở dây 3 phím 2, ngón 3 ở dây 2 phím 3, ngón 1 ở dây 1 (hàng dưới cùng, phía sàn nhà) phím 1.",
    tip: "Từ D sang Dm, ngón 3 giữ nguyên ở dây 2 phím 3. Chỉ ngón 1 và ngón 2 đổi chỗ: ngón 2 sang dây 3 phím 2, ngón 1 sang dây 1 phím 1.",
    sessions: "4 đến 6",
    stuck: {
      smaller: "Đặt ngón 3 ở dây 2 phím 3 và ngón 1 ở dây 1 phím 1, gảy hai dây đó cho sạch. Rồi mới thêm ngón 2 ở dây 3 phím 2.",
      back: [{ slug: "chord-d", why: "Dm giữ nguyên ngón 3 của D" }],
    },
    practice: [
      "Đặt Dm và gảy từng dây, từ dây 4 đến dây 1. Nghe kỹ dây 1.",
      `Gảy xuống Dm 4 lần ${AT_60}, chỉ gảy 4 dây, bắt đầu từ dây 4.`,
      "Đổi giữa D và Dm, mỗi hợp âm 4 tiếng tích. Ngón 3 không rời dây 2.",
    ],
    mistakes: [
      {
        mistake: "Dây 1 bị rè.",
        fix: "Ngón 1 nằm xa thanh kim loại. Đặt đầu ngón 1 sát thanh kim loại thứ nhất, phía thùng đàn, và bấm chặt hơn.",
      },
      {
        mistake: "Tiếng hợp âm bị đục.",
        fix: "Bạn đang gảy cả dây 5 và dây 6. Bắt đầu cú gảy từ dây 4: nốt D là nốt trầm nhất.",
      },
    ],
  }),
  {
    slug: "major-minor",
    levelId: "level-1",
    order: 9,
    title: "Trưởng và thứ: nghe ra sự khác nhau",
    summary: "Ba cặp E–Em, A–Am, D–Dm chỉ khác một nốt, mà tiếng đàn đổi từ sáng sang buồn.",
    minutes: 10,
    objectives: [
      "Nghe một hợp âm (nhiều nốt vang cùng lúc) và nói được nó là trưởng hay thứ, đúng 8 trên 10 lần.",
      "Nhận ra hợp âm thứ qua chữ m sau tên: Am, Em, Dm.",
      "Bấm một cặp trưởng và thứ trên đàn thật và nghe ra chỗ khác nhau.",
    ],
    prerequisites: ["chord-dm"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Bạn đã bấm ba cặp hợp âm cùng tên: E và Em, A và Am, D và Dm. Tên không có chữ m là hợp âm trưởng, nghe sáng và mở. Có chữ m (viết tắt của minor, nghĩa là thứ) là hợp âm thứ, nghe buồn và khép hơn.",
          "Mỗi cặp chỉ khác đúng một nốt. Trong hợp âm thứ, nốt đó thấp hơn nửa cung (khoảng cách giữa hai phím liền nhau). Trên đàn, đó là một ngón lùi một phím về phía đầu đàn, hoặc nhấc hẳn ra.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "majorMinor" },
        caption: "Nghe các cặp trước. Sau đó làm 10 câu: nghe xong mới chọn Trưởng hoặc Thứ, đáp án hiện ngay sau mỗi câu.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trên đàn thật: bấm E và gảy xuống. Nhấc ngón 1 ở dây 3 ra rồi gảy lại: đó là Em. Đặt ngón 1 vào lại: lại là E. Tai bạn nghe đúng sự khác nhau như nút nghe ở trên.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Nghe ba cặp ở trên, mỗi cặp 2 lần: trưởng trước, thứ sau.",
        "Làm 10 câu 'Trưởng hay thứ?'. Chọn xong mới nghe lại để kiểm tra.",
        "Trên đàn thật, đổi qua lại E và Em 4 lần, mỗi lần gảy xuống một cái và nói to 'trưởng' hoặc 'thứ'.",
      ],
    },
    mistakes: [
      {
        mistake: "Đoán theo tiếng trầm hay tiếng cao.",
        fix: "Câu đố trộn hợp âm trầm và hợp âm cao. Bỏ qua độ trầm, chỉ nghe cảm giác: sáng và mở là trưởng, buồn và khép là thứ.",
      },
      {
        mistake: "Nghe mãi vẫn thấy hai tiếng giống nhau.",
        fix: "Nghe cặp E và Em liền nhau 3 lần, rồi ngân nhỏ theo nốt cao nhất. Tai cần vài ngày: ngày đầu đúng 6 trên 10 câu là bình thường.",
      },
    ],
    stuck: {
      smaller: "Chỉ dùng cặp E và Em trên đàn thật. Bấm E, nhấc ngón 1 ra, đặt lại, mỗi lần gảy một cái. Khi nghe ra khác biệt trên đàn rồi mới làm câu đố.",
      back: [{ slug: "chord-e", why: "E và Em chỉ khác ngón 1 ở dây 3" }],
    },
    checklist: [
      { id: "pairs", label: "Tôi nghe 3 cặp E–Em, A–Am, D–Dm và nói đúng cái nào trưởng, cái nào thứ." },
      { id: "quiz", label: "Tôi trả lời đúng ít nhất 8 trên 10 câu 'Trưởng hay thứ?'." },
      { id: "guitar", label: "Tôi đổi E sang Em trên đàn thật và nói đúng tên mỗi lần gảy." },
    ],
    assessment: ["Trả lời đúng 8 trên 10 câu 'Trưởng hay thứ?' hai lượt liền."],
    mastery: ["Nghe một hợp âm vừa gảy trên đàn và nói đúng trưởng hay thứ ngay lần đầu."],
  },
  chordLesson("a7", { levelId: "level-1", order: 10, prerequisites: ["major-minor"] }, {
    summary: "Hai ngón, dây 3 để trống: tiếng nghe còn lửng, muốn đi tiếp sang D.",
    drill: ["a7", "d"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. A7 (La bảy) là hợp âm A có thêm nốt G. Số 7 nghĩa là nốt thêm vào cách nốt gốc (nốt mà hợp âm mang tên) 7 bậc: A, B, C, D, E, F, G.",
      "Nốt G nằm sẵn ở dây 3 không bấm. Vì thế A7 chỉ cần hai ngón: ngón 2 ở dây 4 phím 2, ngón 3 ở dây 2 phím 2. Không gảy dây 6.",
      "Nghe A rồi nghe A7: A7 nghe như câu nói còn lửng, muốn đi tiếp. Trong bài hát, A7 thường đứng ngay trước D.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 (hàng trên cùng, gần mặt bạn) có dấu X. Hai chấm cùng ở phím 2: ngón 2 ở dây 4 (hàng thứ ba từ trên), ngón 3 ở dây 2 (hàng thứ hai từ dưới lên). Hàng nằm giữa hai chấm là dây 3, để trống: dây đó gảy không bấm.",
    tip: "Từ A7 sang D, ngón 3 không rời dây 2: chỉ trượt dọc dây từ phím 2 sang phím 3. Ngón 3 làm đường ray cho cả bàn tay.",
    sessions: "2 đến 4",
    stuck: {
      smaller: "Đặt A như đã học, nhấc ngón đang bấm dây 3 ra rồi gảy từ dây 5: đó là các nốt của A7. Quen tiếng rồi mới đổi sang cách bấm bằng ngón 2 và ngón 3.",
      back: [{ slug: "chord-a", why: "A7 là A bớt nốt bấm ở dây 3" }],
    },
    practice: [
      "Đặt A7 và gảy từng dây, từ dây 5 đến dây 1. Nghe kỹ dây 3.",
      "Gảy A, rồi A7, rồi D, mỗi hợp âm một cái. Nghe A7 muốn đi tiếp sang D thế nào.",
      `Đổi giữa A7 và D ${AT_60}, mỗi hợp âm 4 tiếng tích.`,
    ],
    mistakes: [
      {
        mistake: "Dây 3 bị tắt tiếng.",
        fix: "Ngón 2 hoặc ngón 3 đang chạm dây 3. Cong cả hai ngón để dây 3 ở giữa rung tự do.",
      },
      {
        mistake: "Tiếng hợp âm bị đục.",
        fix: "Bạn đang gảy cả dây 6. Bắt đầu cú gảy từ dây 5.",
      },
    ],
  }),
  chordLesson("d7", { levelId: "level-1", order: 11, prerequisites: ["chord-a7"] }, {
    summary: "Tam giác của D lật ngược: tiếng còn lửng, muốn đi tiếp sang G.",
    drill: ["d7", "g"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. D7 (Rê bảy) là D có thêm nốt C, cách nốt gốc (nốt mà hợp âm mang tên) 7 bậc: D, E, F, G, A, B, C.",
      "Chỉ gảy 4 dây, như D: dây 4 không bấm cho nốt D. Ba ngón trên dây 3, 2, 1 xếp thành tam giác lật ngược so với D: ngón 1 ở dây 2 phím 1, hai ngón kia ở phím 2.",
      "D7 thường đứng ngay trước G. Gảy D7 rồi G: tiếng đàn như được trả lời.",
    ],
    compare:
      "Trên hình cần đàn, dây 6 và dây 5 (hai hàng trên cùng, gần mặt bạn) có dấu X. Ngón 2 ở dây 3 phím 2, ngón 1 ở dây 2 phím 1, ngón 3 ở dây 1 (hàng dưới cùng, phía sàn nhà) phím 2.",
    tip: "So với D: nốt ở dây 2 rời phím 3 về phím 1. Đó là nốt C, nốt làm nên số 7.",
    sessions: "3 đến 5",
    stuck: {
      smaller: "Đặt ngón 1 ở dây 2 phím 1 và ngón 3 ở dây 1 phím 2, gảy hai dây đó cho sạch. Rồi mới thêm ngón 2 ở dây 3 phím 2.",
      back: [{ slug: "chord-d", why: "D7 dùng lại bốn dây và nốt gốc của D" }],
    },
    practice: [
      "Đặt D7 và gảy từng dây, từ dây 4 đến dây 1.",
      "Gảy D, rồi D7, rồi G, mỗi hợp âm một cái. Nghe D7 dẫn sang G.",
      `Đổi giữa D7 và G ${AT_60}, mỗi hợp âm 4 tiếng tích.`,
    ],
    mistakes: [
      {
        mistake: "Dây 1 bị tắt tiếng.",
        fix: "Ngón 1 ở dây 2 đang nằm rạp lên dây 1. Cong ngón 1, bấm bằng đầu ngón.",
      },
      {
        mistake: "Tiếng hợp âm bị đục.",
        fix: "Bạn đang gảy cả dây 5 và dây 6. Bắt đầu cú gảy từ dây 4.",
      },
    ],
  }),
  chordLesson("e7", { levelId: "level-1", order: 12, prerequisites: ["chord-d7"] }, {
    summary: "E bớt một ngón: gảy cả 6 dây, muốn đi tiếp sang Am.",
    drill: ["e7", "am"],
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. E7 (Mi bảy) là E có thêm nốt D, cách nốt gốc (nốt mà hợp âm mang tên) 7 bậc: E, F, G, A, B, C, D.",
      "Nốt D nằm sẵn ở dây 4 không bấm. Vì thế E7 chính là E nhấc ngón 3 ra: còn ngón 2 ở dây 5 phím 2 và ngón 1 ở dây 3 phím 1. Gảy cả 6 dây.",
      "E7 thường đứng ngay trước Am. Gảy E7 rồi Am: tiếng đàn như về đến nhà.",
    ],
    compare:
      "Trên hình cần đàn, ngón 2 ở hàng thứ hai từ trên (dây 5) phím 2, ngón 1 ở dây 3 phím 1. Hàng nằm giữa hai chấm là dây 4, để trống: dây đó gảy không bấm.",
    tip: "Đặt E, rồi nhấc riêng ngón 3 ở dây 4: bạn đang bấm E7. Đặt lại ngón 3: lại là E.",
    sessions: "2 đến 4",
    stuck: {
      smaller: "Đặt E như đã học, nhấc ngón 3 ra và gảy cả 6 dây. Chưa cần đổi sang Am, chỉ nghe E và E7 khác nhau.",
      back: [{ slug: "chord-e", why: "E7 là E nhấc ngón 3" }],
    },
    practice: [
      "Đặt E7 và gảy từng dây, từ dây 6 đến dây 1. Nghe kỹ dây 4.",
      "Gảy E7 rồi Am, mỗi hợp âm một cái. Nghe E7 dẫn về Am.",
      `Đổi giữa E7 và Am ${AT_60}, mỗi hợp âm 4 tiếng tích.`,
    ],
    mistakes: [
      {
        mistake: "Dây 4 bị tắt tiếng.",
        fix: "Ngón 2 ở dây 5 đang chạm dây 4. Cong ngón 2 để đầu ngón đứng thẳng trên dây 5.",
      },
      {
        mistake: "Dây 2 bị tắt tiếng.",
        fix: "Ngón 1 ở dây 3 đang chạm dây 2. Dựng đầu ngón 1 thẳng hơn.",
      },
    ],
  }),
];
