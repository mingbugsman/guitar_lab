import { AT_60, chordLesson } from "./chord-lesson";
import type { Lesson } from "./types";

/**
 * LEVEL 0 — ABSOLUTE BEGINNER (13 lessons; lesson 10 is the first chord, Em)
 * Writing rules: docx/WRITING_GUIDE.md (voice, glossary, body notes) and docx/GUITAR_VISUAL.md
 * (always name strings by NUMBER + NOTE, and describe positions with anchors that are true on
 * the learner's real guitar: "phía mặt bạn", "phía sàn nhà", "phía đầu đàn", "phía thùng đàn").
 * src/content/writing.test.ts checks the mechanical parts of those rules.
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
      "Biết mỗi bài học diễn ra thế nào và khi nào thì sang bài tiếp.",
      "Chuẩn bị đủ đồ: đàn, một ghế không tay vịn, điện thoại hoặc máy tính có micro.",
      "Đặt đàn thật cạnh hình cần đàn và chỉ ra cùng một dây trên cả hai.",
    ],
    prerequisites: [],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Guitar Lab không dùng video. Mỗi bài có lời giải thích ngắn, hình vẽ đúng hướng với đàn của bạn, âm thanh mẫu và bài tập trên đàn thật.",
          "Mỗi bài có 4 chặng: Hiểu, Luyện, Sửa lỗi, Tự đánh giá. Bạn sang bài mới khi đã làm được, không phải khi đã đọc xong.",
        ],
      },
      {
        type: "text",
        heading: "Hình cần đàn nhìn từ đâu",
        paragraphs: [
          "Hình cần đàn trong Guitar Lab vẽ đúng cảnh bạn thấy khi ôm đàn và cúi nhìn xuống. Dây to nhất (dây 6) ở trên cùng, gần mặt bạn. Dây mảnh nhất (dây 1) ở dưới cùng, phía sàn nhà.",
          "Mỗi hình đều có nhãn '↑ phía mặt bạn', '↓ phía sàn nhà' và '◀ đầu đàn'. Khi không chắc, đọc nhãn thay vì đoán.",
        ],
      },
      { type: "visual", visual: { kind: "fretboard", frets: 5 } },
      {
        type: "callout",
        tone: "compare",
        text: "Ôm đàn và cúi nhìn xuống. Dây to nhất có nằm gần mặt bạn giống hình không? Chạm vào chữ 'Dây 6' trong hình để nghe dây 6 buông, rồi gảy dây to nhất trên đàn thật: hai tiếng phải cùng trầm.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Nếu bạn gảy bằng tay trái và bấm bằng tay phải, hãy chọn 'Đàn tay trái' trong hồ sơ hoặc bấm nút ⇄ trên hình. Cả hình lẫn chữ trong bài sẽ đổi theo cho khớp với đàn của bạn.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Đặt đàn cạnh màn hình, mở hình cần đàn.",
        "Chạm chữ 'Dây 6' trong hình, rồi gảy nhẹ dây 6 trên đàn thật.",
        "Làm tiếp như vậy với dây 5, 4, 3, 2, 1.",
      ],
    },
    mistakes: [
      {
        mistake: "Tiếng dây trên đàn thật cao hơn hẳn tiếng trong hình.",
        fix: "Bạn đang gảy nhầm dây. Đọc nhãn 'Dây 6', 'Dây 1' trên hình: dây 6 là dây to nhất, gần mặt bạn.",
      },
    ],
    checklist: [
      { id: "tools", label: "Tôi đã có đàn và một ghế không tay vịn." },
      { id: "views", label: "Tôi chỉ đúng dây 6 và dây 1 trên đàn thật khi nhìn hình." },
      { id: "sound", label: "Tôi nghe được âm thanh khi chạm vào dây trong hình." },
    ],
    assessment: ["Chỉ đúng dây 6 và dây 1 trên đàn thật trong 3 giây."],
    mastery: ["Nhìn hình bất kỳ là chỉ ngay được dây đó trên đàn thật."],
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
      "Phân biệt 'phím' (ô giữa hai thanh kim loại) và 'thanh phím' (chính thanh kim loại đó).",
      "Biết đàn của mình là acoustic, classic hay đàn điện.",
    ],
    prerequisites: ["introduction"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Hình dưới vẽ đàn acoustic nhìn thẳng từ phía trước, dựng đứng, đầu đàn ở trên. Bạn sẽ gặp lại góc nhìn này ở Level 1, khi học đọc hình bấm hợp âm (nhiều nốt vang cùng lúc).",
        ],
      },
      { type: "visual", visual: { kind: "anatomy" }, caption: "Chạm vào từng nhãn để xem giải thích." },
      {
        type: "callout",
        tone: "compare",
        text: "Dựng đàn của bạn đứng thẳng, mặt đàn hướng về bạn. Lần lượt chạm tay vào từng bộ phận trên đàn thật theo thứ tự nhãn trong hình. Dây to nhất nằm ở bên {FRETSIDE} của bạn.",
      },
      {
        type: "text",
        heading: "Phím đàn: điều quan trọng nhất cần nhớ",
        paragraphs: [
          "Trên cần đàn có nhiều thanh kim loại nằm ngang. Mỗi thanh gọi là một thanh phím. Ô giữa hai thanh gọi là một phím.",
          "Phím 1 là ô giữa lược đàn (thanh trắng có 6 rãnh ở đầu cần đàn) và thanh kim loại thứ nhất. Phím 2 là ô kế tiếp, cứ thế đếm dần về phía thùng đàn.",
          "Khi bấm phím 2, đặt đầu ngón tay trong ô phím 2, sát thanh kim loại phía thùng đàn. Bấm sát thanh kim loại giúp tiếng rõ và đỡ tốn lực.",
          "Ở phím 3, 5, 7, 9 và 12 có chấm định vị (chấm tròn trên mặt cần đàn, phím 12 có hai chấm). Nhờ chúng bạn tìm phím nhanh mà không phải đếm từ đầu.",
        ],
      },
      {
        type: "text",
        heading: "Acoustic, classic hay điện?",
        paragraphs: [
          "Acoustic: dây sắt, thùng rỗng, trên mặt đàn có lỗ thoát âm (lỗ tròn cho tiếng đàn vang ra). Classic: dây nylon, cần đàn rộng hơn. Đàn điện: thân đặc, không có lỗ thoát âm, cần cắm loa (amply).",
          "Guitar Lab viết bài cho đàn acoustic. Dùng classic hoặc đàn điện vẫn học được: đầu mỗi bài có ghi chú những chỗ khác với đàn của bạn.",
        ],
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Chạm vào từng bộ phận trên đàn thật và nói to tên của nó.",
        "Đặt ngón trỏ vào phím 1, rồi phím 3, 5, 7.",
        "Tìm chấm định vị ở phím 3, 5, 7 và hai chấm ở phím 12.",
      ],
    },
    mistakes: [
      {
        mistake: "Đếm phím ra số lớn hơn thật một đơn vị.",
        fix: "Bạn đang đếm thanh kim loại. Phím 1 là ô ngay sát lược đàn: phía đầu đàn của ô đó chưa có thanh kim loại nào.",
      },
    ],
    checklist: [
      { id: "parts", label: "Tôi chỉ đúng 11 bộ phận trên đàn thật." },
      { id: "frets", label: "Tôi tìm được phím 5 và phím 12 nhờ chấm định vị." },
      { id: "type", label: "Tôi biết đàn của mình là acoustic, classic hay đàn điện." },
    ],
    assessment: ["Gọi đúng tên ít nhất 9 trên 11 bộ phận khi được chỉ vào."],
    mastery: ["Tìm phím bất kỳ từ 1 đến 12 trong 3 giây nhờ chấm định vị."],
  },
  {
    slug: "posture",
    levelId: "level-0",
    order: 3,
    title: "Tư thế ôm đàn đúng",
    summary: "Ngồi thoải mái, đàn không trượt, hai tay tự do: nền tảng để tập lâu mà không đau.",
    minutes: 10,
    objectives: [
      "Ngồi lưng thẳng, vai thả lỏng.",
      "Đặt đàn chắc trên đùi, cần đàn hơi chếch lên.",
      "Giữ đàn bằng đùi, thân và cẳng tay gảy, để tay bấm được rảnh.",
    ],
    prerequisites: ["guitar-anatomy"],
    blocks: [
      { type: "visual", visual: { kind: "posture" } },
      {
        type: "steps",
        heading: "Từng bước",
        items: [
          "Ngồi lên nửa trước mặt ghế không tay vịn. Đặt hai bàn chân phẳng trên sàn.",
          "Đặt chỗ thắt eo của thùng đàn lên đùi {PICKSIDE}. Đầu đàn chĩa sang bên {FRETSIDE} của bạn.",
          "Tựa nhẹ mặt sau thùng đàn vào bụng. Giữ mặt đàn gần như thẳng đứng, chỉ hơi ngả ra sau để bạn liếc thấy cần đàn.",
          "Đặt cẳng {pickHand} lên cạnh trên của thùng đàn, phía gần mặt bạn. Để bàn {pickHand} rơi tự nhiên trước lỗ thoát âm (lỗ tròn trên mặt đàn).",
          "Nâng đầu đàn cao hơn thùng đàn một chút, khoảng ngang vai.",
          "Buông {fretHand} khỏi cần đàn. Đàn phải đứng yên. Nếu đàn trượt, chỉnh lại chỗ đặt trên đùi và cẳng {pickHand}.",
        ],
      },
      {
        type: "callout",
        tone: "compare",
        text: "Soi gương hoặc chụp ảnh chính mình. So với hình: đàn ở đùi {pickSide}? Cần đàn chếch lên? Lưng thẳng? Hình vẽ nhìn từ phía người đối diện, nên trái phải trong hình ngược với của bạn, giống như soi gương.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Đừng ngả mặt đàn nằm ngửa lên để nhìn cho rõ. Cổ {fretHand} sẽ phải vặn và tiếng đàn bị bí. Chỉ cần hơi nghiêng đầu để liếc.",
      },
      {
        type: "callout",
        tone: "body",
        text: "Mỏi lưng hoặc vai sau 10 đến 15 phút đầu là bình thường khi cơ chưa quen. Đứng dậy vươn vai rồi ngồi lại. Thường mất 2 đến 3 buổi tập để vào tư thế đúng mà không cần nhìn hình. Dừng ngay nếu đau nhói ở lưng, vai hoặc cổ tay, hoặc tê tay: đó là dấu hiệu tư thế đang sai, không phải do bạn tập chưa đủ.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Ngồi vào tư thế đúng.",
        "Buông {fretHand} và đếm chậm đến 20. Đàn không được trượt.",
        "Đứng dậy, đặt đàn xuống, rồi ngồi lại vào tư thế. Làm 3 lần.",
      ],
    },
    mistakes: [
      {
        mistake: "Đàn trượt xuống mỗi khi buông {fretHand}.",
        fix: "{FretHand} đang phải đỡ đàn. Kéo thùng đàn sát bụng hơn và tì cẳng {pickHand} chắc lên cạnh thùng đàn. {FretHand} chỉ để bấm.",
      },
      {
        mistake: "Mỏi cổ và lưng chỉ sau vài phút.",
        fix: "Bạn đang gù lưng để nhìn cần đàn. Ngồi thẳng lưng, chỉ nghiêng đầu nhẹ để liếc.",
      },
    ],
    checklist: [
      { id: "seat", label: "Tôi ngồi lưng thẳng, hai chân đặt phẳng." },
      { id: "stable", label: "Tôi buông tay bấm 20 giây mà đàn vẫn đứng yên." },
      { id: "photo", label: "Tôi đã đối chiếu tư thế của mình với hình minh họa." },
    ],
    assessment: ["Vào tư thế đúng trong dưới 10 giây, 3 lần liên tiếp."],
    mastery: ["Ngồi tập 10 phút mà không mỏi vai và đàn không trượt."],
  },
  {
    slug: "hand-position",
    levelId: "level-0",
    order: 4,
    title: "Vị trí tay bấm và tay gảy",
    summary: "Số ngón tay dùng trong mọi hình bấm, cách đặt tay bấm và cách cầm phím gảy.",
    minutes: 12,
    objectives: [
      "Thuộc số ngón tay bấm: 1 trỏ, 2 giữa, 3 áp út, 4 út, T cái.",
      "Đặt tay bấm đúng: ngón cái sau cần đàn, ngón tay cong, bấm bằng đầu ngón.",
      "Cầm phím gảy (pick: miếng nhựa nhỏ để gảy dây), hoặc gảy bằng ngón cái nếu chưa có.",
    ],
    prerequisites: ["posture"],
    blocks: [
      { type: "visual", visual: { kind: "fingers" } },
      {
        type: "text",
        heading: "Tay bấm ({fretHand})",
        paragraphs: [
          "Mỗi ngón tay bấm có một số: 1 là ngón trỏ, 2 là ngón giữa, 3 là ngón áp út, 4 là ngón út. Ngón cái là T, gần như luôn nằm ở mặt sau cần đàn.",
          "Ở Level 1, mỗi sơ đồ hợp âm (hình chỉ chỗ đặt từng ngón khi bấm nhiều nốt cùng lúc) ghi số này trong chấm tròn, nên thuộc chúng ngay từ bây giờ.",
        ],
      },
      {
        type: "steps",
        heading: "Đặt tay bấm",
        items: [
          "Đặt ngón cái ở mặt sau cần đàn, khoảng giữa bề rộng cần, đối diện ngón giữa.",
          "Chừa một khoảng trống nhỏ giữa lòng bàn tay và cần đàn, như đang cầm quả trứng.",
          "Cong các ngón tay để đầu ngón chạm dây gần như thẳng đứng.",
          "Đặt mỗi ngón vào một phím: ngón 1 phím 1, ngón 2 phím 2, ngón 3 phím 3, ngón 4 phím 4.",
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
        caption: "Bài tập 'mỗi ngón một phím' trên dây 4 (D, tức Rê): ngón 1 ở phím 1 đến ngón 4 ở phím 4.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trên hình, dây 4 là hàng thứ ba tính từ trên xuống (từ phía mặt bạn). Trên đàn thật: đếm từ dây to nhất, gần mặt bạn, xuống. Dây thứ ba là dây 4.",
      },
      {
        type: "text",
        heading: "Tay gảy ({pickHand})",
        paragraphs: [
          "Kẹp phím gảy giữa đầu ngón cái và cạnh đốt đầu ngón trỏ. Chỉ để lộ khoảng 2 đến 3 mm đầu phím. Nếu chưa có phím gảy, dùng phần thịt bên cạnh ngón cái.",
          "Gảy ở khoảng giữa lỗ thoát âm (lỗ tròn trên mặt đàn) và cuối cần đàn. Chuyển động đến từ cổ tay, không phải cả cánh tay.",
        ],
      },
      {
        type: "callout",
        tone: "body",
        text: "Ngón út yếu và khó nhấc riêng từng ngón là bình thường: các ngón chưa quen làm việc độc lập. Thường mất 3 đến 5 buổi tập để đặt 4 ngón lên 4 phím mà không cần nhìn. Cổ tay bấm hơi căng là bình thường. Dừng ngay nếu đau nhói ở cổ tay hoặc tê ngón, rồi kiểm tra ngón cái: có thể bạn đang bóp cần đàn quá chặt.",
      },
    ],
    practice: {
      minutes: 6,
      steps: [
        "Đặt bốn ngón lên dây 4 như hình, phím 1 đến phím 4.",
        "Nhấc cả bàn tay lên rồi đặt lại, không nhìn tay. Làm 10 lần.",
        "Cầm phím gảy, gảy dây 4 không bấm 8 lần đều tay.",
      ],
    },
    mistakes: [
      {
        mistake: "Ngón 4 không với tới phím 4.",
        fix: "Ngón cái đang thò lên quá cạnh trên cần đàn và lòng bàn tay áp sát. Hạ ngón cái xuống giữa mặt sau cần đàn, để trống lòng bàn tay.",
      },
      {
        mistake: "Nốt bấm nghe đục, dây bên cạnh bị tắt tiếng.",
        fix: "Bạn đang bấm bằng bụng ngón. Cong ngón, bấm bằng đầu ngón và cắt ngắn móng tay bấm.",
      },
    ],
    checklist: [
      { id: "numbers", label: "Tôi nói đúng số của từng ngón tay bấm." },
      { id: "thumb", label: "Tôi để ngón cái ở mặt sau cần đàn, lòng bàn tay không áp sát." },
      { id: "spider", label: "Tôi đặt được 4 ngón lên phím 1 đến 4 trên dây 4." },
      { id: "pick", label: "Tôi cầm phím gảy (hoặc dùng ngón cái) và gảy được dây 4." },
    ],
    assessment: ["Khi nghe gọi 'ngón 3', đặt đúng ngón áp út mà không nhìn tay."],
    mastery: ["Đặt 4 ngón vào phím 1 đến 4 trên bất kỳ dây nào, ngón cong, không chạm dây bên cạnh."],
  },
  {
    slug: "six-strings",
    levelId: "level-0",
    order: 5,
    title: "Sáu dây đàn",
    summary: "Số thứ tự, tên nốt và âm thanh của từng dây, và cách tìm chúng trên đàn của bạn.",
    minutes: 10,
    objectives: [
      "Biết dây 1 mảnh nhất, dây 6 to nhất.",
      "Thuộc tên 6 dây từ dây 6 đến dây 1: E A D G B E (Mi La Rê Sol Si Mi).",
      "Tìm đúng dây được gọi trên đàn thật trong 3 giây.",
    ],
    prerequisites: ["hand-position"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Dây đàn được đánh số theo độ mảnh. Dây 1 mảnh nhất, tiếng cao nhất. Dây 6 to nhất, tiếng trầm nhất.",
          "Số dây không đổi dù hình vẽ đặt dây nào ở trên. Vì vậy mọi hình trong Guitar Lab đều ghi 'Dây 6', 'Dây 1'.",
        ],
      },
      { type: "visual", visual: { kind: "strings" } },
      { type: "visual", visual: { kind: "fretboard", frets: 3 }, caption: "Chạm vào chữ 'Dây 6' đến 'Dây 1' để nghe từng dây buông (dây không bấm). Chạm vào một ô phím để nghe nốt bấm ở đó." },
      {
        type: "callout",
        tone: "compare",
        text: "Ôm đàn, nhìn xuống. Dây gần mặt bạn nhất là dây 6 (E). Dây gần sàn nhà nhất là dây 1 (E). Gảy lần lượt từ dây 6 đến dây 1: tiếng phải đi từ trầm lên cao, giống nút 'Nghe' ở trên.",
      },
      {
        type: "text",
        heading: "Câu nhớ tên dây",
        paragraphs: ["Từ dây 6 đến dây 1: E, A, D, G, B, E. Một câu dễ nhớ: 'Em Ăn Dưa Gang Bên Em'."],
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Gảy lần lượt dây 6 đến dây 1, nói to tên từng dây: 'Sáu, E', 'Năm, A'…",
        "Gảy ngược từ dây 1 về dây 6.",
        "Nhắm mắt, dùng ngón cái tay gảy tìm dây 4 rồi gảy.",
        "Nhắm mắt, tìm dây 2 rồi gảy.",
      ],
    },
    mistakes: [
      {
        mistake: "Gọi dây 1 là dây 6 hoặc ngược lại.",
        fix: "Cả hai đều tên E nên dễ nhầm. Nhìn độ dày, không nhìn tên: dây 1 mảnh và cao, dây 6 to và trầm.",
      },
    ],
    checklist: [
      { id: "names", label: "Tôi đọc thuộc E A D G B E từ dây 6 đến dây 1." },
      { id: "find", label: "Tôi gảy đúng dây khi được gọi số ngẫu nhiên." },
      { id: "compare", label: "Tôi đã đối chiếu thứ tự dây trên đàn thật với hình." },
    ],
    assessment: ["Gảy đúng 6 trên 6 dây được gọi ngẫu nhiên."],
    mastery: ["Nghe số dây là nói ngay tên nốt, và ngược lại."],
  },
  {
    slug: "standard-tuning",
    levelId: "level-0",
    order: 6,
    title: "Lên dây chuẩn E A D G B E",
    summary: "Vì sao phải lên dây, chiều vặn khóa và cách lên dây an toàn.",
    minutes: 10,
    objectives: [
      "Hiểu: căng dây thì nốt cao lên, nới dây thì nốt thấp xuống.",
      "Tìm đúng khóa đàn (trục vặn để căng hoặc nới dây) của từng dây.",
      "Lên dây an toàn, không làm đứt dây.",
    ],
    prerequisites: ["six-strings"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Dây đàn tự chùng dần theo thời gian và nhiệt độ. Khi đàn lệch dây, bạn bấm đúng mà vẫn nghe sai. Vì vậy lên dây là việc đầu tiên của mỗi buổi tập.",
          "Cách lên dây phổ biến nhất gọi là lên dây chuẩn (Standard Tuning). Từ dây 6 đến dây 1: E2, A2, D3, G3, B3, E4.",
          "Số sau chữ cái cho biết nốt nằm ở quãng tám (cùng tên nốt nhưng cao hơn, cách nhau 12 phím) nào. Ví dụ dây 6 và dây 1 cùng là E, nhưng dây 1 (E4) cao hơn dây 6 (E2) hai quãng tám.",
        ],
      },
      { type: "visual", visual: { kind: "strings" } },
      {
        type: "steps",
        heading: "Tìm khóa của một dây",
        items: [
          "Đặt ngón tay lên dây cần lên, chỗ gần lược đàn (thanh trắng có 6 rãnh ở đầu cần đàn).",
          "Lần theo dây đó qua lược đàn lên đầu đàn, tới trục mà dây quấn vào. Đó là khóa của dây.",
          "Đừng đoán theo vị trí: đầu đàn 3 khóa mỗi bên và đầu đàn 6 khóa một hàng bố trí khác nhau.",
        ],
      },
      {
        type: "steps",
        heading: "Chiều vặn",
        items: [
          "Gảy dây, rồi vặn khóa một phần tư vòng trong khi dây còn ngân.",
          "Nghe: nốt cao lên nghĩa là bạn đang căng dây. Nốt thấp xuống nghĩa là bạn đang nới dây.",
          "Luôn lên dây từ thấp lên: nếu nốt đang cao hơn chuẩn, nới xuống thấp hơn chuẩn một chút rồi căng lên lại. Dây sẽ giữ chuẩn lâu hơn.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Nếu vặn 2 vòng mà nốt không đổi, có thể bạn đang vặn nhầm khóa. Dừng lại và lần theo dây lần nữa. Căng quá mức có thể làm đứt dây, dây 1 dễ đứt nhất.",
      },
    ],
    practice: {
      minutes: 5,
      steps: [
        "Chọn dây 6. Lần theo dây để tìm khóa của nó.",
        "Gảy dây 6, vặn khóa một phần tư vòng và nghe nốt cao lên hay thấp xuống.",
        "Vặn trả về chỗ cũ. Làm tiếp như vậy với dây 5 đến dây 1.",
        "Bấm 'Nghe' của dây 5 (A) ở bảng trên. Nghe xem dây 5 trên đàn của bạn cao hơn hay thấp hơn.",
      ],
    },
    mistakes: [
      {
        mistake: "Dây đột nhiên chùng hẳn hoặc căng cứng.",
        fix: "Bạn vặn nhanh nhiều vòng khi chưa biết chiều. Mỗi lần chỉ vặn một phần tư vòng, vừa vặn vừa gảy.",
      },
      {
        mistake: "Vặn mãi mà nốt của dây đang gảy không đổi.",
        fix: "Bạn đang vặn khóa của dây khác. Lần theo dây từ lược đàn lên khóa.",
      },
    ],
    checklist: [
      { id: "pegs", label: "Tôi tìm đúng khóa của cả 6 dây bằng cách lần theo dây." },
      { id: "direction", label: "Tôi biết chiều vặn làm nốt cao lên với từng khóa." },
      { id: "frequencies", label: "Tôi biết chuẩn E A D G B E từ dây 6 đến dây 1." },
    ],
    assessment: ["Chỉ đúng khóa của dây được gọi ngẫu nhiên và nói đúng chiều căng."],
    mastery: ["Vặn đúng chiều ngay lần đầu cho cả 6 dây."],
  },
  {
    slug: "using-a-tuner",
    levelId: "level-0",
    order: 7,
    title: "Dùng máy lên dây (Tuner)",
    summary: "Lên đủ 6 dây bằng máy lên dây của Guitar Lab, nghe qua micro.",
    minutes: 12,
    objectives: [
      "Bật máy lên dây (Tuner: công cụ nghe tiếng đàn và báo lệch bao nhiêu) và cho phép dùng micro.",
      "Đọc tên nốt và độ lệch trên màn hình.",
      "Lên chuẩn cả 6 dây, lệch không quá 5 cent (cent là đơn vị đo độ lệch rất nhỏ: 100 cent bằng 1 phím đàn).",
    ],
    prerequisites: ["standard-tuning"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Máy lên dây nghe tiếng đàn qua micro, tìm nốt bạn vừa gảy và so với nốt chuẩn của dây gần nhất.",
          "Màn hình báo độ lệch bằng cent. Lệch trong khoảng 5 cent là chuẩn, kim nằm giữa và chữ chuyển màu xanh.",
          "Số âm, kim lệch trái: dây đang thấp, cần căng thêm. Số dương, kim lệch phải: dây đang cao, cần nới ra.",
        ],
      },
      { type: "visual", visual: { kind: "tuner" } },
      {
        type: "steps",
        heading: "Lên dây từng dây",
        items: [
          "Ngồi ở chỗ yên tĩnh. Đặt điện thoại hoặc máy tính cách đàn 30 đến 50 cm.",
          "Bấm 'Bật micro & bắt đầu' và cho phép trình duyệt dùng micro.",
          "Gảy dây 6 một lần và để dây ngân. Màn hình phải hiện E2.",
          "Vặn khóa từ từ đến khi kim nằm giữa và chữ chuyển màu xanh.",
          "Làm tiếp với dây 5 (A2), 4 (D3), 3 (G3), 2 (B3), 1 (E4).",
          "Kiểm tra lại cả 6 dây một lần nữa. Căng dây này có thể làm dây khác lệch nhẹ.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Nếu máy nhận nhầm sang dây khác vì dây đang lệch quá xa, chạm vào ô của dây đó (ví dụ ô 'E, dây 6') để khóa mục tiêu.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Lên chuẩn cả 6 dây bằng máy lên dây.",
        "Nới dây 3 ra khoảng nửa vòng.",
        "Tự lên lại dây 3 bằng máy lên dây.",
      ],
    },
    mistakes: [
      {
        mistake: "Kim nhảy loạn, không đứng yên.",
        fix: "Bạn đang gảy liên tục hoặc quá mạnh. Gảy một lần vừa phải, để dây ngân, rồi đọc kim.",
      },
      {
        mistake: "Đúng tên nốt nhưng tiếng dây nghe căng bất thường.",
        fix: "Dây đang ở sai quãng tám (cùng tên nốt nhưng cao hơn 12 phím), ví dụ E3 thay vì E2. Đọc cả con số: dây 6 phải là E2, dây 1 là E4.",
      },
    ],
    checklist: [
      { id: "mic", label: "Tôi thấy máy lên dây nghe được tiếng đàn của mình." },
      { id: "all6", label: "Tôi đã lên chuẩn cả 6 dây, lệch không quá 5 cent." },
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
    summary: "Gảy từng dây không bấm, chính xác và đều tay theo nhịp.",
    minutes: 12,
    objectives: [
      "Gảy từng dây buông (dây gảy mà tay bấm không chạm vào) mà không chạm dây bên cạnh.",
      "Phân biệt gảy xuống (về phía sàn nhà) và gảy lên (về phía mặt bạn).",
      "Gảy đều theo máy đếm nhịp (Metronome: công cụ phát tiếng tích tắc đều) ở 60 BPM (60 tiếng tích mỗi phút).",
    ],
    prerequisites: ["using-a-tuner"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Trên hình cần đàn, dây buông được đánh dấu bằng vòng tròn rỗng (O) ở phía đầu đàn.",
          "Gảy xuống: đầu phím gảy (miếng nhựa nhỏ, hoặc ngón cái) đi về phía sàn nhà, từ dây 6 về phía dây 1. Gảy lên: ngược lại, về phía mặt bạn.",
          "Mỗi tiếng tích của máy đếm nhịp là một phách (nhịp đập đều của bài nhạc). Gảy đúng lúc tiếng tích vang lên.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strum", pattern: ["D", "U", "D", "U", "D", "U", "D", "U"], perBeat: 2, strings: [3], bpm: 50 },
        caption: "Phím gảy đi qua dây 3: mũi tên ↓ là gảy xuống (về phía sàn nhà), ↑ là gảy lên (về phía mặt bạn). Bấm 'Xem và nghe', rồi làm theo trên đàn thật.",
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
        text: "Trên hình, gảy xuống là đi từ hàng trên cùng (dây 6) về hàng dưới cùng (dây 1). Trên đàn thật, đó chính là tay bạn đi về phía sàn nhà.",
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Bật máy đếm nhịp ở 60 BPM. Gảy xuống dây 6, mỗi tiếng tích một lần, 8 lần.",
        "Chuyển sang dây 5, 4, 3, 2, 1, mỗi dây 8 lần, không dừng khi đổi dây.",
        "Trên dây 3: gảy xuống đúng tiếng tích, gảy lên ở giữa hai tiếng tích. Làm 8 cặp.",
      ],
    },
    mistakes: [
      {
        mistake: "Nghe thêm tiếng của dây bên cạnh.",
        fix: "Cánh tay đang vung quá rộng. Gảy bằng chuyển động nhỏ từ cổ tay, phím gảy chỉ đi qua đúng một dây.",
      },
      {
        mistake: "Bị lỡ nhịp mỗi lần đổi dây.",
        fix: "Bạn tìm dây mới quá muộn. Nhìn trước dây kế tiếp trong 2 phách cuối.",
      },
    ],
    checklist: [
      { id: "single", label: "Tôi gảy đúng một dây, không chạm dây bên cạnh." },
      { id: "metronome", label: "Tôi gảy 6 dây, mỗi dây 8 lần, theo máy đếm nhịp 60 BPM không dừng." },
      { id: "updown", label: "Tôi gảy xuống, lên xen kẽ được trên một dây." },
    ],
    assessment: ["Gảy 48 nốt liên tục (6 dây, mỗi dây 8 lần) ở 60 BPM, sai dây không quá 2 lần."],
    mastery: ["Làm được bài trên ở 80 BPM, gảy xuống và lên xen kẽ."],
  },
  {
    slug: "fretboard-basics",
    levelId: "level-0",
    order: 9,
    title: "Làm quen cần đàn",
    summary: "Mỗi phím cao hơn nửa cung. Bấm một nốt rõ tiếng và tìm nốt trên dây 6, dây 5.",
    minutes: 12,
    objectives: [
      "Hiểu: mỗi phím về phía thùng đàn làm nốt cao thêm nửa cung (khoảng cách nhỏ nhất giữa hai nốt trên guitar).",
      "Bấm một nốt rõ tiếng bằng đầu ngón, sát thanh kim loại.",
      "Biết phím 12 cho lại tên nốt của dây buông (dây không bấm), cao hơn một quãng tám (cùng tên nốt nhưng cao hơn).",
    ],
    prerequisites: ["open-strings"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Mỗi lần ngón tay dịch một phím về phía thùng đàn, nốt cao lên nửa cung. Dịch 12 phím là cao lên một quãng tám: ở phím 12, dây phát lại đúng tên nốt của dây buông, nhưng cao hơn.",
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
        caption: "Dây 6: buông là E, phím 3 là G, phím 5 là A, phím 12 lại là E nhưng cao hơn một quãng tám.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trên hình, dây 6 là hàng trên cùng, gần mặt bạn. Trên đàn thật, đặt ngón 1 vào phím 3 của dây to nhất: đó là nốt G. Muốn chắc chắn, kiểm tra bằng máy lên dây (Tuner).",
      },
      {
        type: "steps",
        heading: "Bấm một nốt rõ tiếng",
        items: [
          "Đặt đầu ngón trong ô phím, sát thanh kim loại phía thùng đàn.",
          "Ấn vừa đủ để dây chạm thanh kim loại. Không cần ấn hết sức.",
          "Gảy dây và nghe.",
          "Nếu tiếng rè: dịch ngón sát thanh kim loại hơn, hoặc ấn thêm một chút. Nếu tiếng tắt: ngón đang đè lên thanh kim loại hoặc chạm dây khác.",
        ],
      },
      {
        type: "callout",
        tone: "body",
        text: "Đây là bài đầu tiên bạn ấn dây xuống nhiều lần. Đầu ngón tay bấm hơi đau và có vết hằn dây là bình thường với dây sắt, da sẽ dày lên sau 1 đến 2 tuần tập đều. Thường mất 3 đến 5 buổi tập để bấm sạch tiếng phím 1 đến 5 trên dây 6. Tập 2 đến 3 lần mỗi ngày, mỗi lần 10 phút, tốt hơn một lần 30 phút. Dừng ngay nếu đau nhói ở cổ tay hoặc tê ngón. Nghỉ một ngày nếu đầu ngón bị phồng.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Trên dây 6, bấm và gảy lần lượt phím 1 đến phím 4, mỗi ngón một phím.",
        "Đi ngược lại từ phím 4 về phím 1.",
        "Gảy dây 6 buông, rồi dây 6 phím 12. Nghe: cùng tên nốt E, nhưng phím 12 cao hơn.",
        "Trên dây 5: bấm phím 2 (B), phím 3 (C), phím 5 (D) và gảy từng nốt.",
      ],
    },
    mistakes: [
      {
        mistake: "Nốt bấm bị rè hoặc tắt tiếng.",
        fix: "Ngón đang ở giữa ô phím hoặc đè lên thanh kim loại. Đặt sát thanh kim loại phía thùng đàn, nhưng không đè lên nó.",
      },
      {
        mistake: "Tay bấm mỏi chỉ sau vài nốt.",
        fix: "Bạn ấn quá mạnh. Giảm lực từ từ đến khi tiếng bắt đầu rè, rồi tăng lại một chút: đó là lực vừa đủ.",
      },
    ],
    checklist: [
      { id: "clear", label: "Tôi bấm được một nốt rõ tiếng, không rè." },
      { id: "octave", label: "Tôi nghe được dây buông và phím 12 cùng tên nốt." },
      { id: "find", label: "Tôi tìm được G (phím 3) và A (phím 5) trên dây 6." },
    ],
    assessment: ["Bấm rõ tiếng 5 nốt liên tiếp trên dây 6, từ phím 1 đến phím 5."],
    mastery: ["Bấm rõ tiếng phím 1 đến 5 trên cả 6 dây."],
  },
  chordLesson("em", { levelId: "level-0", order: 10, prerequisites: ["fretboard-basics"] }, {
    readFrom: "fretboard",
    drill: ["em"],
    summary: "Hợp âm đầu tiên: hai ngón, cả sáu dây đều gảy.",
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. Em (Mi thứ) chỉ cần hai ngón và gảy cả 6 dây, nên là hợp âm dễ nhất để bắt đầu.",
      "Bạn đã biết bấm một nốt rõ tiếng. Em chỉ là bấm hai nốt cùng lúc, ở cùng phím 2, rồi gảy cả 6 dây.",
      "Em nghe trầm và hơi buồn. Đó là màu của hợp âm thứ.",
      "Bên cạnh hình cần đàn có thêm một hình nhỏ: sơ đồ hợp âm (hình vẽ đàn dựng đứng, chỉ chỗ đặt từng ngón). Bạn sẽ học đọc nó ở đầu Level 1. Bây giờ chỉ cần nhìn hình cần đàn: nó vẽ đúng như khi bạn cúi nhìn xuống.",
    ],
    compare:
      "Trên hình cần đàn, hai chấm nằm ở hàng thứ hai và thứ ba tính từ trên (dây 5 và dây 4), cùng ở phím 2. Trên đàn thật: dây thứ hai và thứ ba tính từ phía mặt bạn.",
    tip: "Đặt ngón 2 và ngón 3 cạnh nhau trong cùng ô phím 2. Ngón 2 ở dây to hơn, gần mặt bạn hơn.",
    sessions: "2 đến 3",
    practice: [
      "Đặt Em và gảy từng dây, từ dây 6 đến dây 1.",
      `Gảy xuống cả hợp âm 4 lần ${AT_60}.`,
    ],
    mistakes: [
      {
        mistake: "Dây 3 bị tắt tiếng.",
        fix: "Ngón 3 đang chạm vào dây 3. Cong ngón 3 hơn để đầu ngón đứng thẳng trên dây 4.",
      },
      {
        mistake: "Dây 5 hoặc dây 4 bị rè.",
        fix: "Ngón đó chưa sát thanh kim loại phía thùng đàn. Dịch đầu ngón sát hơn, giống cách bấm một nốt ở bài trước.",
      },
    ],
  }),
  {
    slug: "musical-notes",
    levelId: "level-0",
    order: 11,
    title: "Bảy nốt nhạc",
    summary: "C D E F G A B, nửa cung và một cung, và cách chúng nằm trên cần đàn.",
    minutes: 12,
    objectives: [
      "Thuộc 7 nốt: C D E F G A B (Đô Rê Mi Fa Sol La Si).",
      "Biết E với F và B với C chỉ cách nhau nửa cung (1 phím). Các cặp khác cách nhau một cung (2 phím).",
      "Tìm 7 nốt này trên dây 6 và dây 5, đến phím 12.",
    ],
    prerequisites: ["chord-em"],
    blocks: [
      { type: "visual", visual: { kind: "notes" } },
      {
        type: "text",
        paragraphs: [
          "Nhạc dùng 7 tên nốt lặp lại: C D E F G A B rồi lại C.",
          "Giữa hai nốt liền nhau thường có một nốt nữa, viết có dấu # (thăng, cao hơn nửa cung) hoặc ♭ (giáng, thấp hơn nửa cung). Có hai chỗ ngoại lệ: giữa E và F, giữa B và C không có nốt nào.",
          "Trên guitar: nửa cung là 1 phím, một cung là 2 phím.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "fretboard", frets: 12, showAllNotes: true, highlightStrings: [6, 5] },
        caption: "7 nốt đến phím 12 (không ghi các nốt có dấu #). Tập trung vào dây 6 và dây 5, hai dây được tô màu.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trên hình, dây 6 và dây 5 là hai hàng trên cùng. Trên đàn của bạn: hai dây to nhất, gần mặt bạn nhất. Nốt trầm nhất của Em và của hầu hết các hợp âm (nhiều nốt vang cùng lúc) bạn sắp học nằm trên hai dây này.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Trên dây 6, chơi E (buông), F (1), G (3), A (5), B (7), C (8), D (10), E (12). Nói to tên từng nốt.",
        "Làm tương tự trên dây 5, từ A (buông) đến A (12).",
        "Chơi C ở dây 5 phím 3, rồi C ở dây 6 phím 8. Hai chỗ khác nhau nhưng cùng một nốt, cùng độ cao.",
      ],
    },
    mistakes: [
      {
        mistake: "Đếm từ E lên F mà lại bấm phím 2.",
        fix: "E và F liền nhau, chỉ cách 1 phím. B và C cũng vậy. Các cặp khác mới cách 2 phím.",
      },
    ],
    checklist: [
      { id: "seven", label: "Tôi đọc thuộc C D E F G A B và tên Việt Đô Rê Mi Fa Sol La Si." },
      { id: "half", label: "Tôi nhớ E với F và B với C chỉ cách nhau một phím." },
      { id: "string6", label: "Tôi chơi được 7 nốt trên dây 6 đến phím 12." },
    ],
    assessment: ["Tìm đúng nốt được gọi ngẫu nhiên trên dây 6 hoặc dây 5 trong 5 giây."],
    mastery: ["Tìm mọi nốt (không dấu #) trên dây 6 và 5 trong 2 giây."],
  },
  {
    slug: "pitch-and-rhythm",
    levelId: "level-0",
    order: 12,
    title: "Cao độ và nhịp cơ bản",
    summary: "Nghe cao, thấp, cảm nhận phách đều và đếm 1-2-3-4 theo máy đếm nhịp.",
    minutes: 12,
    objectives: [
      "Nghe hai nốt và nói được nốt nào cao hơn.",
      "Đếm đều 1-2-3-4 theo máy đếm nhịp (Metronome: công cụ phát tiếng tích tắc đều).",
      "Gảy đều 1 tiếng hoặc 2 tiếng cho mỗi tiếng tích.",
    ],
    prerequisites: ["musical-notes"],
    blocks: [
      {
        type: "text",
        heading: "Độ cao của nốt",
        paragraphs: [
          "Cao độ là độ cao hay thấp của một âm thanh. Dây mảnh hơn cho tiếng cao hơn. Bấm gần thùng đàn hơn thì phần dây rung ngắn lại, tiếng cũng cao hơn.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "fretboard", frets: 7, markers: [{ string: 5, fret: 0 }, { string: 5, fret: 7, label: "E" }], highlightStrings: [5] },
        caption: "Chạm chữ 'Dây 5' để nghe dây buông (A), rồi chạm ô phím 7 trên dây 5 để nghe E. Nốt bấm cao hơn.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Dây 5 là dây to thứ hai, trên hình là hàng thứ hai từ trên xuống. Bấm phím 7 (có chấm tròn) trên đàn thật: phần dây rung ngắn lại nên tiếng cao hơn dây buông.",
      },
      {
        type: "text",
        heading: "Đếm nhịp",
        paragraphs: [
          "Phách là nhịp đập đều của bài nhạc, giống tiếng tích tắc của đồng hồ. Máy đếm nhịp phát một tiếng tích cho mỗi phách.",
          "Phần lớn bài hát đếm theo nhóm 4 phách: '1, 2, 3, 4', rồi lại '1, 2, 3, 4'. Mỗi nhóm như vậy gọi là một ô nhịp (một nhóm phách lặp lại). Phách 1 được nhấn mạnh hơn. Cách đếm này gọi là nhịp 4/4.",
          "Gảy 1 lần mỗi phách gọi là nốt đen (một tiếng cho mỗi phách). Gảy 2 lần mỗi phách gọi là móc đơn (hai tiếng cho mỗi phách): gảy xuống đúng tiếng tích, gảy lên ở giữa hai tiếng tích, đếm '1 và 2 và 3 và 4 và'.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strum", pattern: ["D", "D", "D", "D"], perBeat: 1, chord: "em", bpm: 60 },
        caption: "Nốt đen: một lần gảy xuống mỗi phách. Giữa hai lần gảy, tay quay lên trong không khí, không chạm dây (phím gảy mờ đi).",
      },
      {
        type: "visual",
        visual: { kind: "strum", pattern: ["D", "U", "D", "U", "D", "U", "D", "U"], perBeat: 2, strings: [4], bpm: 60 },
        caption: "Móc đơn: xuống đúng tiếng tích, lên ở chữ 'và'. Tay đi xuống, lên đều như con lắc.",
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Bật máy đếm nhịp ở 60 BPM (60 tiếng tích mỗi phút). Vỗ tay theo tiếng tích và đếm to '1, 2, 3, 4' trong 2 ô nhịp.",
        "Bấm Em (hợp âm bạn đã học) và gảy xuống cả 6 dây, mỗi phách một lần, trong 4 ô nhịp.",
        "Gảy xuống, lên trên dây 4 buông, mỗi phách hai lần, trong 4 ô nhịp. Đếm '1 và 2 và…'.",
        "Gảy dây 5 buông rồi dây 5 phím 7. Nói to nốt nào cao hơn.",
      ],
    },
    mistakes: [
      {
        mistake: "Tiếng gảy dần đi trước tiếng tích.",
        fix: "Bạn đang nhanh dần. Để tiếng tích dẫn đường: gảy cùng lúc với tiếng tích, không gảy trước.",
      },
    ],
    checklist: [
      { id: "pitch", label: "Tôi nói đúng nốt nào cao hơn khi nghe hai nốt." },
      { id: "count", label: "Tôi đếm và vỗ tay đúng theo máy đếm nhịp, 4 phách mỗi ô nhịp." },
      { id: "eighths", label: "Tôi gảy xuống, lên đều, hai tiếng mỗi phách, ở 60 BPM." },
    ],
    assessment: ["Gảy 4 ô nhịp, hai tiếng mỗi phách, ở 60 BPM mà tiếng gảy không lệch khỏi tiếng tích."],
    mastery: ["Gảy hai tiếng mỗi phách đều ở 80 BPM trong 8 ô nhịp."],
  },
  {
    slug: "clean-sounds",
    levelId: "level-0",
    order: 13,
    title: "Tạo âm thanh sạch",
    summary: "Kết hợp mọi thứ: tư thế, bấm sát phím, gảy chính xác, và tự sửa tiếng rè, tiếng tắt.",
    minutes: 15,
    objectives: [
      "Nhận ra 3 lỗi âm thanh: rè, tắt tiếng, chạm dây bên cạnh.",
      "Chơi sạch một chuỗi 6 nốt trên dây 2 và dây 1, theo máy đếm nhịp (Metronome) ở 60 BPM (60 tiếng tích mỗi phút).",
      "Tự đánh giá trước khi sang Level 1.",
    ],
    prerequisites: ["pitch-and-rhythm"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Âm thanh sạch nghĩa là mỗi nốt bạn muốn đều ngân rõ, và không có tiếng nào bạn không muốn. Mọi hợp âm (nhiều nốt vang cùng lúc) sau này đều cần điều này.",
        ],
      },
      {
        type: "steps",
        heading: "Sửa lỗi theo triệu chứng",
        items: [
          "Tiếng rè (nốt có tiếng rè rè lẫn vào): ngón chưa sát thanh kim loại phía thùng đàn, hoặc ấn quá nhẹ.",
          "Tiếng tắt (nốt tịt ngay, không ngân): ngón đè lên thanh kim loại, hoặc phần thịt ngón chạm vào dây bên cạnh. Cong ngón hơn.",
          "Có thêm tiếng lạ: tay gảy chạm nhầm dây. Thu nhỏ chuyển động gảy.",
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
        caption: "Chuỗi nốt: B (dây 2 buông), C, D, E (dây 1 buông), F, G.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Dây 2 và dây 1 là hai dây mảnh nhất. Trên hình là hai hàng dưới cùng, trên đàn thật là hai dây gần sàn nhà nhất.",
      },
      { type: "visual", visual: { kind: "metronome", bpm: 60, beats: 4 } },
    ],
    practice: {
      minutes: 10,
      steps: [
        "Chơi chuỗi B, C, D, E, F, G theo hình, mỗi nốt một tiếng tích ở 60 BPM. Dùng ngón 1 cho phím 1, ngón 3 cho phím 3.",
        "Chơi ngược lại từ G về B.",
        "Gặp nốt rè hoặc tắt: dừng, sửa theo bảng triệu chứng, rồi chơi lại nốt đó 3 lần.",
        "Bấm Em và gảy từng dây từ dây 6 đến dây 1. Dây nào rè hoặc tắt, sửa theo bảng triệu chứng.",
      ],
    },
    mistakes: [
      {
        mistake: "Vẫn còn tiếng rè nhưng bỏ qua vì 'vẫn nghe được nốt'.",
        fix: "Sửa ngay từ bây giờ: dịch ngón sát thanh kim loại hơn. Thói quen này quyết định hợp âm của bạn sau này sạch hay rè.",
      },
    ],
    checklist: [
      { id: "diagnose", label: "Tôi phân biệt được tiếng rè và tiếng tắt, và biết cách sửa." },
      { id: "sequence", label: "Tôi chơi sạch chuỗi B đến G ở 60 BPM." },
      { id: "reverse", label: "Tôi chơi sạch chuỗi ngược từ G về B." },
      { id: "em-clean", label: "Tôi gảy Em từng dây và cả 6 dây đều ngân rõ." },
    ],
    assessment: ["Chơi chuỗi B lên G rồi về B (11 nốt) ở 60 BPM, mọi nốt ngân rõ, không rè."],
    mastery: ["Chơi chuỗi trên ở 80 BPM, hai nốt mỗi tiếng tích, sạch hoàn toàn."],
  },
];
