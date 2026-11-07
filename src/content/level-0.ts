import type { Lesson } from "./types";

/**
 * LEVEL 0 — ABSOLUTE BEGINNER
 * Writing rule (docx/GUITAR_VISUAL.md): always name strings by NUMBER + NOTE, and describe
 * positions with physical anchors that are true on the learner's real guitar
 * ("gần mặt bạn", "phía sàn nhà", "phía đầu đàn", "phía thùng đàn") — never just "trên/dưới".
 */
export const LEVEL_0_LESSONS: Lesson[] = [
  {
    slug: "introduction",
    levelId: "level-0",
    order: 1,
    title: "Làm quen với Guitar Lab và cây đàn",
    summary: "Bạn sẽ học thế nào, cần chuẩn bị gì và cách dùng hình minh họa để đối chiếu với đàn thật.",
    minutes: 10,
    objectives: [
      "Biết lộ trình học Level 0 và cách mỗi bài được tổ chức.",
      "Chuẩn bị đủ dụng cụ: đàn, ghế không tay vịn, điện thoại/máy tính có micro.",
      "Hiểu hai góc nhìn cần đàn trong Guitar Lab và biết đổi góc nhìn.",
    ],
    prerequisites: [],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Guitar Lab không dùng video. Mỗi bài có giải thích ngắn, hình minh họa chính xác, âm thanh mẫu và bài tập trên cây đàn thật của bạn. Bạn chỉ chuyển bài khi đã làm được, không phải khi đã đọc xong.",
          "Mỗi bài theo 5 bước: Hiểu → Nhìn & Nghe → Luyện → Áp dụng → Tự đánh giá.",
        ],
      },
      {
        type: "text",
        heading: "Hai cách nhìn cây đàn",
        paragraphs: [
          "Khi bạn ôm đàn và cúi nhìn xuống cần đàn, dây to nhất (dây 6) ở gần mặt bạn nhất, dây mảnh nhất (dây 1) ở phía sàn nhà. Guitar Lab gọi đây là góc 'Nhìn xuống (người chơi)' và dùng nó làm mặc định.",
          "Bản Tab (một kiểu ký hiệu nhạc cho guitar) lại vẽ ngược: dây 1 ở trên cùng. Bạn có thể chuyển sang góc 'Kiểu Tab' bất cứ lúc nào bằng nút phía trên hình.",
          "Mọi hình cần đàn đều có nhãn '↑ phía mặt bạn' / '↓ phía sàn nhà' và '◀ đầu đàn' để bạn luôn biết hình đang nhìn từ đâu.",
        ],
      },
      { type: "visual", visual: { kind: "fretboard", frets: 5 } },
      {
        type: "callout",
        tone: "compare",
        text: "Ôm đàn, cúi nhìn xuống: dây to nhất có nằm gần mặt bạn như hình 'Nhìn xuống' không? Bấm 'Kiểu Tab' và để ý hình đảo ngược thế nào.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Nếu bạn chơi đàn tay trái (tay phải bấm, tay trái gảy), hãy chọn 'Đàn tay trái' trong hồ sơ hoặc nút ⇄ trên hình — mọi hình sẽ được lật gương cho khớp với đàn của bạn.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Đặt đàn cạnh màn hình. Mở hình cần đàn ở trên.",
        "Chạm từng dây trong hình để nghe, rồi gảy nhẹ đúng dây đó trên đàn thật.",
        "Đổi qua lại hai góc nhìn, mỗi lần chỉ tay vào dây 6 trên đàn thật.",
      ],
    },
    mistakes: [
      { mistake: "Nghĩ dây 'trên cùng' trong hình luôn là dây 1.", fix: "Đọc nhãn dây (Dây 6, Dây 1…) và nhãn hướng trên hình, đừng đoán theo vị trí." },
    ],
    checklist: [
      { id: "tools", label: "Tôi đã có đàn và một ghế không tay vịn." },
      { id: "views", label: "Tôi đã thử cả hai góc nhìn và chỉ đúng dây 6 trên đàn thật." },
      { id: "sound", label: "Tôi nghe được âm thanh khi chạm vào dây trong hình." },
    ],
    assessment: ["Chỉ đúng dây 6 và dây 1 trên đàn thật ở cả hai góc nhìn."],
    mastery: ["Không cần nhìn nhãn vẫn biết hình đang ở góc nhìn nào."],
  },
  {
    slug: "guitar-anatomy",
    levelId: "level-0",
    order: 2,
    title: "Cấu tạo cây đàn guitar",
    summary: "Gọi đúng tên từng bộ phận và tìm thấy chúng trên đàn của bạn.",
    minutes: 12,
    objectives: [
      "Gọi tên được 11 bộ phận chính của cây đàn.",
      "Phân biệt 'phím' (khoảng giữa hai thanh kim loại) và 'thanh phím' (thanh kim loại).",
      "Biết khác biệt cơ bản giữa đàn acoustic, classic và đàn điện.",
    ],
    prerequisites: ["introduction"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Hình dưới vẽ đàn acoustic nhìn thẳng từ phía trước, dựng đứng, đầu đàn ở trên. Đây cũng là cách sơ đồ hợp âm nhìn cây đàn — bạn sẽ gặp lại ở Level 1.",
        ],
      },
      { type: "visual", visual: { kind: "anatomy" }, caption: "Chạm vào từng nhãn để xem giải thích." },
      {
        type: "callout",
        tone: "compare",
        text: "Dựng đàn của bạn đứng thẳng, mặt đàn hướng về bạn. Lần lượt chạm tay vào từng bộ phận trên đàn thật theo thứ tự nhãn trong hình. Dây to nhất phải nằm bên TRÁI của bạn (đàn tay phải).",
      },
      {
        type: "text",
        heading: "Phím đàn — điều quan trọng nhất cần nhớ",
        paragraphs: [
          "'Phím 1' là ô giữa lược đàn và thanh kim loại thứ nhất. 'Phím 2' là ô giữa thanh thứ nhất và thanh thứ hai, cứ thế tiếp tục về phía thùng đàn.",
          "Khi bấm 'phím 2', đầu ngón tay đặt trong ô phím 2, sát thanh kim loại thứ hai (thanh nằm về phía thùng đàn). Bấm sát thanh kim loại giúp tiếng rõ và đỡ tốn lực.",
        ],
      },
      {
        type: "text",
        heading: "Acoustic, classic hay điện?",
        paragraphs: [
          "Acoustic: dây sắt, thùng rỗng có lỗ thoát âm. Classic: dây nylon, cần đàn rộng hơn. Đàn điện: thân đặc, không có lỗ thoát âm, cần amply. Mọi bài trong Level 0 dùng được cho cả ba loại.",
        ],
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Che phần giải thích, chạm vào từng bộ phận trên đàn thật và nói to tên của nó.",
        "Đếm phím: đặt ngón trỏ vào phím 1, 3, 5, 7 và kiểm tra chấm định vị ở phím 3, 5, 7.",
      ],
    },
    mistakes: [
      { mistake: "Đếm thanh kim loại thay vì đếm ô phím.", fix: "Phím 1 là ô ngay sát lược đàn — ô đó chưa có thanh kim loại nào phía đầu đàn của nó." },
    ],
    checklist: [
      { id: "parts", label: "Tôi chỉ đúng 11 bộ phận trên đàn thật." },
      { id: "frets", label: "Tôi tìm được phím 5 và phím 12 nhờ chấm định vị." },
      { id: "type", label: "Tôi biết đàn của mình là acoustic, classic hay đàn điện." },
    ],
    assessment: ["Gọi đúng tên ít nhất 9/11 bộ phận khi được chỉ vào."],
    mastery: ["Tìm phím bất kỳ từ 1 đến 12 trong vòng 3 giây nhờ chấm định vị."],
  },
  {
    slug: "posture",
    levelId: "level-0",
    order: 3,
    title: "Tư thế ôm đàn đúng",
    summary: "Ngồi thoải mái, đàn không trượt, hai tay tự do — nền tảng để tập lâu mà không đau.",
    minutes: 10,
    objectives: [
      "Ngồi đúng tư thế: lưng thẳng, vai thả lỏng.",
      "Đặt đàn ổn định: thùng đàn trên đùi, cần đàn hơi chếch lên.",
      "Giữ đàn bằng thân và cánh tay gảy, không phải bằng tay bấm.",
    ],
    prerequisites: ["guitar-anatomy"],
    blocks: [
      { type: "visual", visual: { kind: "posture" } },
      {
        type: "steps",
        heading: "Từng bước (người thuận tay phải)",
        items: [
          "Ngồi trên ghế không tay vịn, ngồi về nửa trước mặt ghế, hai bàn chân đặt phẳng trên sàn.",
          "Đặt chỗ thắt eo của thùng đàn lên đùi PHẢI. Đầu đàn chĩa sang bên TRÁI của bạn.",
          "Mặt sau thùng đàn tựa nhẹ vào bụng/ngực. Mặt đàn gần như thẳng đứng — chỉ hơi ngả ra sau một chút để bạn liếc thấy cần đàn.",
          "Đặt cẳng tay phải lên cạnh trên của thùng đàn (phía gần mặt bạn). Bàn tay phải rơi tự nhiên trước lỗ thoát âm.",
          "Cần đàn hơi chếch lên (đầu đàn cao hơn thùng đàn một chút, khoảng ngang vai).",
          "Thử buông tay trái khỏi cần đàn: đàn phải đứng yên. Nếu đàn trượt, chỉnh lại vị trí trên đùi và cẳng tay phải.",
        ],
      },
      {
        type: "callout",
        tone: "compare",
        text: "Đặt điện thoại trước mặt và chụp ảnh chính mình (hoặc soi gương). So với hình: đàn ở đùi phải? Cần đàn chếch lên? Lưng thẳng? Người tay trái: mọi thứ đổi bên.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Đừng ngả mặt đàn nằm ngửa lên để nhìn cho rõ. Bạn sẽ phải vặn cổ tay trái và tiếng đàn bị bí. Chỉ liếc nhìn bằng cách hơi nghiêng đầu.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Ngồi đúng tư thế, buông tay trái, đếm chậm đến 20: đàn không được trượt.",
        "Đứng dậy, đặt đàn xuống, rồi ngồi lại vào tư thế đúng. Lặp lại 3 lần.",
      ],
    },
    mistakes: [
      { mistake: "Tay trái phải đỡ cần đàn cho khỏi rơi.", fix: "Đàn được giữ bởi đùi, thân và cẳng tay phải. Tay trái chỉ để bấm." },
      { mistake: "Gù lưng để nhìn cần đàn.", fix: "Giữ lưng thẳng, chỉ nghiêng đầu nhẹ." },
    ],
    checklist: [
      { id: "seat", label: "Tôi ngồi lưng thẳng, hai chân đặt phẳng." },
      { id: "stable", label: "Đàn đứng yên 20 giây khi tôi buông tay bấm." },
      { id: "photo", label: "Tôi đã đối chiếu tư thế của mình với hình minh họa." },
    ],
    assessment: ["Vào tư thế đúng trong dưới 10 giây, 3 lần liên tiếp."],
    mastery: ["Ngồi tập 10 phút không mỏi vai và đàn không trượt."],
  },
  {
    slug: "hand-position",
    levelId: "level-0",
    order: 4,
    title: "Vị trí tay bấm và tay gảy",
    summary: "Số ngón tay dùng trong mọi sơ đồ, cách đặt tay bấm và cách cầm phím gảy.",
    minutes: 12,
    objectives: [
      "Thuộc số ngón tay bấm: 1 trỏ, 2 giữa, 3 áp út, 4 út, T cái.",
      "Đặt tay bấm đúng: ngón cái sau cần đàn, ngón tay cong, bấm bằng đầu ngón.",
      "Cầm phím gảy (pick) đúng hoặc gảy bằng ngón cái.",
    ],
    prerequisites: ["posture"],
    blocks: [
      { type: "visual", visual: { kind: "fingers" } },
      {
        type: "text",
        heading: "Tay bấm (tay trái với người thuận tay phải)",
        paragraphs: [
          "Mọi sơ đồ hợp âm trong Guitar Lab ghi SỐ NGÓN trong chấm tròn: 1 = trỏ, 2 = giữa, 3 = áp út, 4 = út. Ngón cái (T) gần như luôn ở mặt sau cần đàn.",
        ],
      },
      {
        type: "steps",
        heading: "Đặt tay bấm",
        items: [
          "Đặt ngón cái ở mặt sau cần đàn, khoảng giữa bề rộng cần, đối diện ngón giữa.",
          "Lòng bàn tay không áp sát cần đàn — chừa một khoảng trống nhỏ như đang cầm quả trứng.",
          "Cong các ngón tay để đầu ngón chạm dây theo phương gần thẳng đứng xuống mặt phím.",
          "Mỗi ngón phụ trách một phím: thả lỏng tay, ngón 1 ở phím 1, ngón 2 phím 2, ngón 3 phím 3, ngón 4 phím 4.",
        ],
      },
      {
        type: "visual",
        visual: {
          kind: "fretboard",
          frets: 5,
          markers: [
            { string: 4, fret: 1, finger: 1 },
            { string: 4, fret: 2, finger: 2 },
            { string: 4, fret: 3, finger: 3 },
            { string: 4, fret: 4, finger: 4 },
          ],
          highlightStrings: [4],
        },
        caption: "Bài tập 'mỗi ngón một phím' trên dây 4 (Rê): ngón 1 ở phím 1 … ngón 4 ở phím 4.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trong hình 'Nhìn xuống', dây 4 là dây thứ ba tính từ trên xuống (từ phía mặt bạn). Trên đàn thật: đếm từ dây to nhất (gần mặt bạn) xuống — dây thứ ba là dây 4.",
      },
      {
        type: "text",
        heading: "Tay gảy (tay phải)",
        paragraphs: [
          "Cầm phím gảy giữa đầu ngón cái và cạnh đốt đầu ngón trỏ, chỉ để lộ khoảng 2–3 mm đầu phím. Nếu chưa có phím gảy, dùng phần thịt bên cạnh ngón cái.",
          "Gảy ở khoảng giữa lỗ thoát âm và cuối cần đàn. Chuyển động đến từ cổ tay, không phải cả cánh tay.",
        ],
      },
    ],
    practice: {
      minutes: 6,
      steps: [
        "Đặt bốn ngón lên dây 4 như hình (phím 1–4). Nhấc lên rồi đặt lại 10 lần mà không nhìn.",
        "Giữ phím gảy, gảy dây 4 buông 8 lần đều tay.",
      ],
    },
    mistakes: [
      { mistake: "Ngón cái thò lên quá cạnh trên cần đàn, lòng bàn tay áp sát.", fix: "Hạ ngón cái xuống giữa mặt sau cần đàn; để khoảng trống trong lòng bàn tay." },
      { mistake: "Bấm bằng phần bụng ngón phẳng.", fix: "Cong ngón, bấm bằng đầu ngón; cắt móng tay bấm thật ngắn." },
    ],
    checklist: [
      { id: "numbers", label: "Tôi nói đúng số của từng ngón tay bấm." },
      { id: "thumb", label: "Ngón cái tôi ở mặt sau cần đàn, lòng bàn tay không áp sát." },
      { id: "spider", label: "Tôi đặt được 4 ngón lên phím 1–4 trên dây 4." },
      { id: "pick", label: "Tôi cầm phím gảy (hoặc dùng ngón cái) và gảy được dây 4." },
    ],
    assessment: ["Khi nghe gọi 'ngón 3', đặt đúng ngón áp út mà không nhìn tay."],
    mastery: ["Đặt 4 ngón vào phím 1–4 trên bất kỳ dây nào, ngón cong, không chạm dây bên cạnh."],
  },
  {
    slug: "six-strings",
    levelId: "level-0",
    order: 5,
    title: "Sáu dây đàn",
    summary: "Số thứ tự, tên nốt và âm thanh của từng dây — và cách tìm chúng trên đàn của bạn.",
    minutes: 10,
    objectives: [
      "Biết dây 1 mảnh nhất, dây 6 to nhất.",
      "Thuộc tên 6 dây: E A D G B E (Mi La Rê Sol Si Mi), từ dây 6 đến dây 1.",
      "Tìm đúng dây bất kỳ trên đàn thật trong vài giây.",
    ],
    prerequisites: ["hand-position"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Dây đàn được đánh số theo độ mảnh: dây 1 mảnh nhất và cao nhất; dây 6 to nhất và trầm nhất. Số dây KHÔNG phụ thuộc vào hình vẽ đặt dây nào ở trên — đó là lý do Guitar Lab luôn ghi 'Dây 6', 'Dây 1' trên mọi hình.",
        ],
      },
      { type: "visual", visual: { kind: "strings" } },
      { type: "visual", visual: { kind: "fretboard", frets: 3 }, caption: "Chạm vào từng dây để nghe." },
      {
        type: "callout",
        tone: "compare",
        text: "Ôm đàn, nhìn xuống. Dây gần mặt bạn nhất là dây 6 (E). Dây gần sàn nhà nhất là dây 1 (E). Gảy từng dây theo thứ tự 6 → 1: âm thanh phải đi từ trầm đến cao, giống nút 'Nghe' ở trên.",
      },
      {
        type: "text",
        heading: "Câu nhớ tên dây",
        paragraphs: [
          "Từ dây 6 đến dây 1: E – A – D – G – B – E. Một câu nhớ phổ biến: 'Em Ăn Dưa Gang Bên Em'.",
        ],
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Gảy lần lượt dây 6 → 1, nói to tên từng dây: 'Sáu – E', 'Năm – A'…",
        "Gảy ngược 1 → 6.",
        "Nhắm mắt, dùng ngón cái tay gảy tìm dây 4 và dây 2 rồi gảy.",
      ],
    },
    mistakes: [{ mistake: "Nhầm dây 1 với dây 6 vì cả hai đều là E.", fix: "Dây 1 mảnh và cao; dây 6 to và trầm. Nhìn độ dày, không nhìn tên nốt." }],
    checklist: [
      { id: "names", label: "Tôi đọc thuộc E A D G B E từ dây 6 đến dây 1." },
      { id: "find", label: "Tôi gảy đúng dây khi được gọi số ngẫu nhiên." },
      { id: "compare", label: "Tôi đã đối chiếu thứ tự dây trên đàn thật với hình." },
    ],
    assessment: ["Gảy đúng 6/6 dây được gọi ngẫu nhiên."],
    mastery: ["Gọi được tên nốt của dây khi chỉ nghe số dây (và ngược lại) ngay lập tức."],
  },
  {
    slug: "standard-tuning",
    levelId: "level-0",
    order: 6,
    title: "Lên dây chuẩn E A D G B E",
    summary: "Vì sao phải lên dây, chiều vặn khóa và cách lên dây an toàn.",
    minutes: 10,
    objectives: [
      "Hiểu: căng dây → nốt cao lên; nới dây → nốt thấp xuống.",
      "Tìm đúng khóa đàn của từng dây.",
      "Biết tần số chuẩn của 6 dây và lên dây an toàn, không đứt dây.",
    ],
    prerequisites: ["six-strings"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Dây đàn tự chùng dần theo thời gian và nhiệt độ. Đàn lệch dây thì mọi hợp âm bấm đúng vẫn nghe sai — nên lên dây là việc đầu tiên của MỌI buổi tập.",
          "Chuẩn phổ biến nhất (Standard Tuning) từ dây 6 đến dây 1: E2 (82,41 Hz) – A2 (110 Hz) – D3 (146,83 Hz) – G3 (196 Hz) – B3 (246,94 Hz) – E4 (329,63 Hz).",
        ],
      },
      { type: "visual", visual: { kind: "strings" } },
      {
        type: "steps",
        heading: "Tìm khóa của một dây",
        items: [
          "Đặt ngón tay lên dây cần lên ở gần lược đàn.",
          "Lần theo dây đó qua lược đàn lên đầu đàn cho tới trục khóa mà nó quấn vào.",
          "Đó là khóa của dây. Đừng đoán theo vị trí — mỗi kiểu đầu đàn (3+3 hay 6 khóa một hàng) bố trí khác nhau.",
        ],
      },
      {
        type: "steps",
        heading: "Chiều vặn",
        items: [
          "Gảy dây và vặn khóa thật chậm (một phần tư vòng mỗi lần) trong khi dây còn ngân.",
          "Nếu nốt cao lên: bạn đang căng dây. Nếu nốt thấp xuống: bạn đang nới dây.",
          "Luôn lên dây TỪ DƯỚI LÊN: nếu nốt đang cao hơn chuẩn, nới xuống thấp hơn chuẩn một chút rồi căng lên lại — dây giữ chuẩn lâu hơn.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Nếu vặn nhiều vòng mà nốt không đổi, có thể bạn đang vặn nhầm khóa. Dừng lại, lần theo dây lần nữa. Căng quá mức có thể làm đứt dây — dây 1 dễ đứt nhất.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Với từng dây từ 6 đến 1: lần theo dây tìm khóa, gảy, vặn 1/4 vòng, nghe nốt cao lên hay thấp xuống, rồi vặn trả về.",
        "Bấm 'Nghe' của dây 5 (A) ở bảng trên và cố gắng nghe xem dây 5 trên đàn của bạn cao hơn hay thấp hơn.",
      ],
    },
    mistakes: [
      { mistake: "Vặn nhanh nhiều vòng khi chưa biết chiều.", fix: "Mỗi lần chỉ 1/4 vòng, vừa vặn vừa gảy." },
      { mistake: "Đoán khóa theo vị trí.", fix: "Luôn lần theo dây từ lược đàn lên khóa." },
    ],
    checklist: [
      { id: "pegs", label: "Tôi tìm đúng khóa của cả 6 dây bằng cách lần theo dây." },
      { id: "direction", label: "Tôi biết chiều vặn làm nốt cao lên với từng khóa." },
      { id: "frequencies", label: "Tôi biết chuẩn E A D G B E từ dây 6 đến dây 1." },
    ],
    assessment: ["Chỉ đúng khóa của dây được gọi ngẫu nhiên và nói đúng chiều căng."],
    mastery: ["Đổi chiều vặn đúng ngay lần đầu cho cả 6 dây."],
  },
  {
    slug: "using-a-tuner",
    levelId: "level-0",
    order: 7,
    title: "Dùng Tuner để lên dây",
    summary: "Lên dây cả 6 dây bằng Tuner thật của Guitar Lab qua micro.",
    minutes: 12,
    objectives: [
      "Bật Tuner, cấp quyền micro.",
      "Đọc tên nốt và độ lệch cent (âm = thấp, dương = cao).",
      "Lên chuẩn cả 6 dây trong khoảng ±5 cent.",
    ],
    prerequisites: ["standard-tuning"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Tuner nghe tiếng đàn qua micro, tìm cao độ và so với nốt chuẩn của dây gần nhất. 'Cent' là đơn vị rất nhỏ: 100 cent = 1 phím đàn. Kim ở giữa (±5 cent) là chuẩn.",
          "Số âm (kim lệch trái): dây đang thấp → căng thêm. Số dương (kim lệch phải): dây đang cao → nới ra.",
        ],
      },
      { type: "visual", visual: { kind: "tuner" } },
      {
        type: "steps",
        heading: "Lên dây từng dây",
        items: [
          "Ở nơi yên tĩnh, đặt điện thoại/máy tính cách đàn khoảng 30–50 cm.",
          "Bấm 'Bật micro', cho phép trình duyệt dùng micro.",
          "Gảy dây 6 một lần, để ngân. Đọc tên nốt: cần là E2.",
          "Vặn khóa từ từ đến khi kim nằm giữa và chữ chuyển màu xanh.",
          "Lặp lại cho dây 5 (A2), 4 (D3), 3 (G3), 2 (B3), 1 (E4). Sau đó kiểm tra lại cả 6 dây một lần nữa — căng dây này có thể làm dây khác lệch nhẹ.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Nếu Tuner nhảy sang dây khác do dây đang lệch quá xa, chạm vào ô dây (ví dụ 'E dây 6') để khóa mục tiêu.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Lên chuẩn cả 6 dây bằng Tuner.",
        "Nới dây 3 ra khoảng nửa vòng, rồi tự lên lại bằng Tuner.",
      ],
    },
    mistakes: [
      { mistake: "Gảy liên tục và quá mạnh, kim nhảy loạn.", fix: "Gảy một lần vừa phải, để dây ngân, rồi đọc kim." },
      { mistake: "Lên đúng tên nốt nhưng sai quãng tám (ví dụ E3 thay vì E2).", fix: "Đọc cả số quãng tám: dây 6 phải là E2, dây 1 là E4." },
    ],
    checklist: [
      { id: "mic", label: "Tuner nghe được tiếng đàn của tôi." },
      { id: "all6", label: "Tôi đã lên chuẩn cả 6 dây (±5 cent)." },
      { id: "retune", label: "Tôi tự lên lại được một dây đã bị nới." },
    ],
    assessment: ["Lên chuẩn cả 6 dây trong dưới 5 phút."],
    mastery: ["Lên chuẩn 6 dây trong dưới 2 phút vào đầu mỗi buổi tập."],
  },
  {
    slug: "open-strings",
    levelId: "level-0",
    order: 8,
    title: "Gảy dây buông",
    summary: "Gảy từng dây buông chính xác, đều tay, theo nhịp.",
    minutes: 12,
    objectives: [
      "Gảy đúng một dây mà không chạm dây bên cạnh.",
      "Phân biệt gảy xuống (về phía sàn nhà) và gảy lên (về phía mặt bạn).",
      "Gảy dây buông đều theo metronome 60 BPM.",
    ],
    prerequisites: ["using-a-tuner"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "'Dây buông' là dây được gảy mà tay bấm không chạm vào. Trong sơ đồ và hình cần đàn, dây buông được đánh dấu bằng vòng tròn rỗng (O) ở phía đầu đàn.",
          "Gảy xuống: đầu phím gảy di chuyển về phía sàn nhà (từ dây 6 về phía dây 1). Gảy lên: ngược lại, về phía mặt bạn.",
        ],
      },
      {
        type: "visual",
        visual: {
          kind: "fretboard",
          frets: 3,
          markers: [
            { string: 6, fret: 0 },
            { string: 5, fret: 0 },
            { string: 4, fret: 0 },
            { string: 3, fret: 0 },
            { string: 2, fret: 0 },
            { string: 1, fret: 0 },
          ],
        },
        caption: "Sáu vòng tròn rỗng: cả sáu dây đều gảy buông.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trong góc 'Nhìn xuống', gảy xuống là đi từ hàng trên cùng (dây 6) về hàng dưới cùng (dây 1) — đúng với chuyển động tay bạn về phía sàn nhà.",
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Bật metronome 60 BPM. Gảy xuống dây 6, mỗi tiếng click một lần, 8 lần.",
        "Chuyển sang dây 5, 4, 3, 2, 1 — mỗi dây 8 lần, không dừng nhịp khi đổi dây.",
        "Gảy xen kẽ xuống–lên trên dây 3: xuống ở tiếng click, lên ở giữa hai click.",
      ],
    },
    mistakes: [
      { mistake: "Vung cả cánh tay, chạm sang dây bên cạnh.", fix: "Chuyển động nhỏ từ cổ tay, phím gảy chỉ đi qua đúng một dây." },
      { mistake: "Dừng nhịp mỗi khi đổi dây.", fix: "Nhìn trước dây kế tiếp ở 2 phách cuối." },
    ],
    checklist: [
      { id: "single", label: "Tôi gảy đúng một dây, không chạm dây bên cạnh." },
      { id: "metronome", label: "Tôi gảy 6 dây × 8 lần theo metronome 60 BPM không dừng." },
      { id: "updown", label: "Tôi gảy xuống–lên xen kẽ được trên một dây." },
    ],
    assessment: ["Gảy 48 nốt liên tục (6 dây × 8) theo 60 BPM, sai dây không quá 2 lần."],
    mastery: ["Làm được bài trên ở 80 BPM với xuống–lên xen kẽ."],
  },
  {
    slug: "fretboard-basics",
    levelId: "level-0",
    order: 9,
    title: "Làm quen cần đàn",
    summary: "Mỗi phím cao hơn nửa cung. Bấm một nốt rõ tiếng và tìm nốt trên dây 6, dây 5.",
    minutes: 12,
    objectives: [
      "Hiểu: mỗi phím về phía thùng đàn làm nốt cao thêm nửa cung.",
      "Bấm một nốt rõ tiếng bằng đầu ngón, sát thanh kim loại.",
      "Biết phím 12 cho lại tên nốt của dây buông, cao hơn một quãng tám.",
    ],
    prerequisites: ["open-strings"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Mỗi khi ngón tay dịch một phím về phía thùng đàn, nốt cao lên nửa cung. 12 nửa cung = một quãng tám: ở phím 12, dây phát lại đúng tên nốt của dây buông nhưng cao hơn.",
        ],
      },
      {
        type: "visual",
        visual: {
          kind: "fretboard",
          frets: 12,
          markers: [
            { string: 6, fret: 0, tone: "root" },
            { string: 6, fret: 3, label: "G" },
            { string: 6, fret: 5, label: "A" },
            { string: 6, fret: 12, label: "E", tone: "root" },
          ],
          highlightStrings: [6],
        },
        caption: "Dây 6: buông = E, phím 3 = G, phím 5 = A, phím 12 = E (cao hơn một quãng tám).",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Ở góc 'Nhìn xuống', dây 6 là hàng trên cùng (gần mặt bạn). Trên đàn thật, đặt ngón 1 vào phím 3 của dây to nhất — đó là nốt G. Kiểm tra lại bằng Tuner nếu muốn.",
      },
      {
        type: "steps",
        heading: "Bấm một nốt rõ tiếng",
        items: [
          "Đặt đầu ngón trong ô phím, sát thanh kim loại phía thùng đàn.",
          "Ấn vừa đủ để dây chạm thanh kim loại — không cần ấn hết sức.",
          "Gảy. Nếu tiếng rè: dịch ngón sát thanh kim loại hơn hoặc ấn thêm một chút. Nếu tiếng tắt: ngón đang đè lên thanh kim loại hoặc chạm dây khác.",
        ],
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Trên dây 6, bấm và gảy lần lượt phím 1 → 4 bằng ngón 1 → 4 (một ngón một phím), rồi đi ngược lại 4 → 1.",
        "So sánh dây 6 buông và dây 6 phím 12: cùng tên nốt E, nhưng phím 12 cao hơn.",
        "Trên dây 5: bấm phím 2 (B), phím 3 (C), phím 5 (D) và gảy.",
      ],
    },
    mistakes: [
      { mistake: "Bấm ở giữa ô phím hoặc đè lên thanh kim loại.", fix: "Sát thanh kim loại phía thùng đàn, nhưng không đè lên nó." },
      { mistake: "Ấn quá mạnh, tay mỏi nhanh.", fix: "Giảm lực từ từ đến khi tiếng bắt đầu rè, rồi tăng lại chút ít — đó là lực vừa đủ." },
    ],
    checklist: [
      { id: "clear", label: "Tôi bấm được một nốt rõ tiếng, không rè." },
      { id: "octave", label: "Tôi nghe được dây buông và phím 12 cùng tên nốt." },
      { id: "find", label: "Tôi tìm được G (phím 3) và A (phím 5) trên dây 6." },
    ],
    assessment: ["Bấm rõ tiếng 5 nốt liên tiếp trên dây 6 (phím 1–5)."],
    mastery: ["Bấm rõ tiếng phím 1–5 trên cả 6 dây."],
  },
  {
    slug: "musical-notes",
    levelId: "level-0",
    order: 10,
    title: "Bảy nốt nhạc",
    summary: "C D E F G A B, nửa cung và nguyên cung, và cách chúng nằm trên cần đàn.",
    minutes: 12,
    objectives: [
      "Thuộc 7 nốt tự nhiên: C D E F G A B (Đô Rê Mi Fa Sol La Si).",
      "Biết E–F và B–C chỉ cách nhau nửa cung (1 phím); các cặp khác cách nhau một cung (2 phím).",
      "Tìm các nốt tự nhiên trên dây 6 và dây 5 đến phím 12.",
    ],
    prerequisites: ["fretboard-basics"],
    blocks: [
      { type: "visual", visual: { kind: "notes" } },
      {
        type: "text",
        paragraphs: [
          "Âm nhạc phương Tây dùng 7 tên nốt lặp lại: C D E F G A B rồi lại C. Giữa hai nốt liền nhau thường có một nốt 'thăng/giáng' (#/♭) — trừ hai cặp E–F và B–C.",
          "Trên guitar: nửa cung = 1 phím, một cung = 2 phím.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "fretboard", frets: 12, showAllNotes: true, highlightStrings: [6, 5] },
        caption: "Tất cả nốt tự nhiên đến phím 12. Tập trung vào dây 6 và dây 5 (được tô màu).",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Ở góc 'Nhìn xuống', dây 6 và dây 5 là hai hàng trên cùng. Trên đàn của bạn: hai dây to nhất, gần mặt bạn nhất. Đây là hai dây chứa nốt gốc của hầu hết hợp âm bạn sẽ học.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Trên dây 6, chơi E (buông) – F (1) – G (3) – A (5) – B (7) – C (8) – D (10) – E (12), nói to tên nốt.",
        "Làm tương tự trên dây 5 từ A (buông) đến A (12).",
        "Chơi C ở dây 5 phím 3, rồi C ở dây 6 phím 8: hai vị trí khác nhau cho CÙNG một nốt (cùng cao độ). Cần đàn có nhiều chỗ chơi cùng một nốt.",
      ],
    },
    mistakes: [{ mistake: "Cho rằng giữa E và F có một phím trống.", fix: "E–F và B–C liền nhau, cách 1 phím." }],
    checklist: [
      { id: "seven", label: "Tôi đọc thuộc C D E F G A B và tên Việt Đô Rê Mi Fa Sol La Si." },
      { id: "half", label: "Tôi nhớ E–F và B–C chỉ cách nhau một phím." },
      { id: "string6", label: "Tôi chơi được các nốt tự nhiên trên dây 6 đến phím 12." },
    ],
    assessment: ["Tìm đúng nốt được gọi ngẫu nhiên trên dây 6 hoặc dây 5 trong 5 giây."],
    mastery: ["Tìm mọi nốt tự nhiên trên dây 6 và 5 trong 2 giây."],
  },
  {
    slug: "pitch-and-rhythm",
    levelId: "level-0",
    order: 11,
    title: "Cao độ và nhịp cơ bản",
    summary: "Nghe cao – thấp, cảm nhận phách đều và đếm 1-2-3-4 theo metronome.",
    minutes: 12,
    objectives: [
      "Phân biệt nốt cao hơn / thấp hơn khi nghe hai nốt.",
      "Hiểu phách (pulse) và nhịp 4/4: 4 phách mỗi ô nhịp, phách 1 mạnh nhất.",
      "Gảy đều nốt đen (1 tiếng/phách) và móc đơn (2 tiếng/phách).",
    ],
    prerequisites: ["musical-notes"],
    blocks: [
      {
        type: "text",
        heading: "Cao độ",
        paragraphs: [
          "Cao độ là độ cao – thấp của âm thanh. Dây mảnh hơn hoặc phần dây rung ngắn hơn (bấm gần thùng đàn hơn) → nốt cao hơn.",
        ],
      },
      { type: "visual", visual: { kind: "fretboard", frets: 7, markers: [{ string: 5, fret: 0 }, { string: 5, fret: 7, label: "E" }], highlightStrings: [5] }, caption: "Chạm dây 5: so sánh nốt buông (A) với nốt bấm phím 7 (E) trên đàn thật." },
      {
        type: "callout",
        tone: "compare",
        text: "Dây 5 là dây to thứ hai — ở góc 'Nhìn xuống' là hàng thứ hai từ trên. Bấm phím 7 (có chấm định vị) trên đàn thật: phần dây rung ngắn lại nên nốt cao hơn dây buông.",
      },
      {
        type: "text",
        heading: "Phách và nhịp",
        paragraphs: [
          "Phách là nhịp đập đều của bài nhạc — như tiếng tích tắc của đồng hồ. Metronome đánh dấu từng phách. Trong nhịp 4/4, ta đếm '1 – 2 – 3 – 4', phách 1 nhấn mạnh hơn.",
          "Nốt đen: gảy 1 lần mỗi phách (xuống). Móc đơn: gảy 2 lần mỗi phách — xuống đúng tiếng click, lên ở giữa hai click, đếm '1 và 2 và 3 và 4 và'.",
        ],
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Bật metronome 60 BPM, vỗ tay theo click và đếm to '1 2 3 4' trong 2 ô nhịp.",
        "Gảy xuống dây 6 buông theo nốt đen: 4 ô nhịp.",
        "Gảy móc đơn (xuống–lên) trên dây 4 buông: 4 ô nhịp, đếm '1 và 2 và…'.",
        "Gảy dây 5 buông rồi dây 5 phím 7 — nói to nốt nào cao hơn.",
      ],
    },
    mistakes: [
      { mistake: "Nhanh dần khi hưng phấn.", fix: "Nghe click làm chỉ huy; gảy CÙNG lúc với click, không trước." },
    ],
    checklist: [
      { id: "pitch", label: "Tôi nói đúng nốt nào cao hơn khi nghe hai nốt." },
      { id: "count", label: "Tôi đếm và vỗ tay đúng 4/4 theo metronome." },
      { id: "eighths", label: "Tôi gảy móc đơn xuống–lên đều ở 60 BPM." },
    ],
    assessment: ["Gảy 4 ô nhịp móc đơn ở 60 BPM không lệch nhịp rõ rệt."],
    mastery: ["Gảy móc đơn đều ở 80 BPM trong 8 ô nhịp."],
  },
  {
    slug: "clean-sounds",
    levelId: "level-0",
    order: 12,
    title: "Tạo âm thanh sạch",
    summary: "Kết hợp mọi thứ: tư thế, bấm sát phím, gảy chính xác — và tự sửa tiếng rè, tiếng tắt.",
    minutes: 15,
    objectives: [
      "Chẩn đoán 3 lỗi âm thanh: rè, tắt tiếng, chạm dây bên cạnh.",
      "Chơi một chuỗi nốt sạch trên 2 dây theo metronome.",
      "Tự đánh giá trước khi sang Level 1.",
    ],
    prerequisites: ["pitch-and-rhythm"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Âm thanh sạch = mỗi nốt bạn muốn đều ngân rõ, và không có tiếng nào bạn không muốn. Đây là tiêu chuẩn cho mọi hợp âm sau này.",
        ],
      },
      {
        type: "steps",
        heading: "Sửa lỗi theo triệu chứng",
        items: [
          "Rè (bzz): ngón chưa đủ sát thanh kim loại phía thùng đàn, hoặc lực ấn quá nhẹ.",
          "Tắt tiếng (tịt): ngón đè lên thanh kim loại, hoặc phần thịt ngón chạm vào dây bên cạnh — cong ngón hơn.",
          "Nghe thêm tiếng lạ: tay gảy chạm nhầm dây — thu nhỏ chuyển động.",
        ],
      },
      {
        type: "visual",
        visual: {
          kind: "fretboard",
          frets: 5,
          markers: [
            { string: 2, fret: 1, finger: 1, label: "C" },
            { string: 2, fret: 3, finger: 3, label: "D" },
            { string: 1, fret: 0, label: "E" },
            { string: 1, fret: 1, finger: 1, label: "F" },
            { string: 1, fret: 3, finger: 3, label: "G" },
          ],
          highlightStrings: [2, 1],
        },
        caption: "Chuỗi nốt: B (dây 2 buông) – C – D – E (dây 1 buông) – F – G.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Dây 2 và dây 1 là hai dây mảnh nhất — trong góc 'Nhìn xuống' là hai hàng dưới cùng, trên đàn thật là hai dây gần sàn nhà nhất.",
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 10,
      steps: [
        "Chơi chuỗi B – C – D – E – F – G (xem hình), mỗi nốt một phách ở 60 BPM. Dùng ngón 1 cho phím 1, ngón 3 cho phím 3.",
        "Chơi ngược lại G → B.",
        "Mỗi nốt rè hoặc tắt: dừng, sửa theo bảng triệu chứng, chơi lại nốt đó 3 lần.",
      ],
    },
    mistakes: [
      { mistake: "Bỏ qua tiếng rè 'vì vẫn nghe được'.", fix: "Không chấp nhận rè — đây là thói quen quyết định chất lượng hợp âm sau này." },
    ],
    checklist: [
      { id: "diagnose", label: "Tôi phân biệt được tiếng rè và tiếng tắt, và biết cách sửa." },
      { id: "sequence", label: "Tôi chơi sạch chuỗi B → G theo 60 BPM." },
      { id: "reverse", label: "Tôi chơi sạch chuỗi ngược G → B." },
    ],
    assessment: ["Chơi chuỗi B → G → B (11 nốt) ở 60 BPM, mọi nốt rõ tiếng."],
    mastery: ["Chơi chuỗi trên ở 80 BPM, móc đơn, sạch hoàn toàn."],
  },
];
