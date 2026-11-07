import { CHORDS, type ChordId } from "@/lib/music/chords";
import type { Lesson } from "./types";

/**
 * LEVEL 1 — FIRST CHORDS (MVP 0.1 ships: reading diagrams + Em, Am, E, A, D).
 * Finger-by-finger steps are generated from chord data (describeChord) and shown next to
 * the diagram, so lesson text below only adds technique and context.
 */

function chordLesson(
  id: ChordId,
  order: number,
  prerequisites: string[],
  extra: Pick<Lesson, "summary" | "mistakes"> & { intro: string[]; compare: string; practice: string[]; tip?: string },
): Lesson {
  const chord = CHORDS[id];
  return {
    slug: `chord-${id}`,
    levelId: "level-1",
    order,
    title: `Hợp âm ${chord.symbol} — ${chord.nameVi}`,
    summary: extra.summary,
    minutes: 15,
    objectives: [
      `Bấm đúng thế ${chord.symbol} theo sơ đồ, đúng ngón.`,
      `Gảy ${chord.symbol} với mọi dây cần thiết đều rõ tiếng.`,
      `Biết hợp âm ${chord.symbol} gồm các nốt ${chord.tones.join(" – ")}.`,
    ],
    prerequisites,
    blocks: [
      { type: "text", paragraphs: extra.intro },
      { type: "visual", visual: { kind: "chord", chord: id } },
      { type: "callout", tone: "compare", text: extra.compare },
      ...(extra.tip ? [{ type: "callout" as const, tone: "tip" as const, text: extra.tip }] : []),
      {
        type: "steps",
        heading: "Kiểm tra từng dây",
        items: [
          "Bấm thế hợp âm và giữ yên.",
          "Gảy từng dây một, từ dây thấp nhất được phép gảy đến dây 1 (như nút 'Nghe từng dây').",
          "Dây nào rè hoặc tắt: điều chỉnh đúng ngón đó (cong hơn, sát thanh kim loại hơn) rồi gảy lại.",
          "Khi mọi dây đều rõ, gảy xuống một lần cả hợp âm.",
        ],
      },
    ],
    practice: {
      minutes: 10,
      steps: extra.practice,
    },
    mistakes: extra.mistakes,
    checklist: [
      { id: "shape", label: `Tôi đặt đúng thế ${chord.symbol}, đúng ngón như sơ đồ.` },
      { id: "compare", label: "Tôi đã đối chiếu tay mình với hình cần đàn ở góc 'Nhìn xuống'." },
      { id: "clean", label: "Gảy từng dây, mọi dây cần gảy đều rõ tiếng." },
      { id: "reset", label: `Tôi nhấc tay ra và đặt lại ${chord.symbol} 10 lần liên tiếp.` },
    ],
    assessment: [`Đặt ${chord.symbol} trong 3 giây và mọi dây rõ tiếng, 5 lần liên tiếp.`],
    mastery: [`Đặt ${chord.symbol} trong 1 giây, không nhìn tay, sạch tiếng.`],
  };
}

export const LEVEL_1_LESSONS: Lesson[] = [
  {
    slug: "reading-chord-diagrams",
    levelId: "level-1",
    order: 1,
    title: "Đọc sơ đồ hợp âm",
    summary: "Sơ đồ hợp âm nhìn cây đàn từ góc nào, và cách chuyển nó sang tay bạn.",
    minutes: 12,
    objectives: [
      "Hiểu sơ đồ hợp âm là đàn dựng đứng nhìn từ phía trước: dây 6 bên trái, lược đàn ở trên.",
      "Đọc được: chấm tròn + số ngón, O (dây buông), X (không gảy).",
      "Chuyển được một sơ đồ sang góc 'Nhìn xuống' trên đàn thật.",
    ],
    prerequisites: ["clean-sounds"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Hợp âm là nhiều nốt vang cùng lúc. Sơ đồ hợp âm cho biết đặt ngón nào, ở dây nào, phím nào.",
          "Hãy dựng đàn đứng thẳng trước mặt, mặt đàn hướng về bạn, đầu đàn ở trên — giống hình Cấu tạo đàn. Sơ đồ hợp âm chính là phần đầu cần đàn nhìn theo góc này: 6 đường dọc là 6 dây (dây 6 bên TRÁI), các đường ngang là thanh phím, vạch đậm trên cùng là lược đàn.",
        ],
      },
      { type: "visual", visual: { kind: "anatomy", initialPart: "strings" }, caption: "Đàn dựng đứng: dây 6 bên trái — giống sơ đồ hợp âm." },
      {
        type: "steps",
        heading: "Ký hiệu trên sơ đồ",
        items: [
          "Chấm tròn có số: đặt ngón tay đó vào ô phím đó (1 trỏ, 2 giữa, 3 áp út, 4 út).",
          "O phía trên lược đàn: gảy dây đó buông.",
          "X phía trên lược đàn: không gảy dây đó.",
          "Hàng chữ dưới cùng là tên nốt của dây buông (E A D G B E) và số dây (6 → 1).",
        ],
      },
      { type: "visual", visual: { kind: "chord", chord: "em" } },
      {
        type: "callout",
        tone: "compare",
        text: "Từ sơ đồ sang tay bạn: khi ôm đàn và nhìn xuống, cột TRÁI của sơ đồ (dây 6) trở thành dây gần mặt bạn nhất; hàng phím TRÊN CÙNG của sơ đồ (phím 1) trở thành ô sát lược đàn, phía đầu đàn. Hình cần đàn bên cạnh sơ đồ cho thấy đúng điều này.",
      },
    ],
    practice: {
      minutes: 6,
      steps: [
        "Dựng đàn đứng, đặt cạnh sơ đồ Em. Chỉ tay vào dây 5 phím 2 trên đàn thật rồi trên sơ đồ.",
        "Ôm đàn lại, nhìn xuống, tìm lại đúng ô đó — so với hình cần đàn 'Nhìn xuống'.",
      ],
    },
    mistakes: [
      { mistake: "Đọc sơ đồ như thể dây 1 nằm bên trái.", fix: "Đọc hàng số dây dưới sơ đồ: 6 bên trái, 1 bên phải (đàn tay phải)." },
    ],
    checklist: [
      { id: "symbols", label: "Tôi hiểu ý nghĩa của chấm số, O và X." },
      { id: "orientation", label: "Tôi dựng đàn đứng và thấy nó giống sơ đồ." },
      { id: "transfer", label: "Tôi tìm đúng ô 'dây 5 phím 2' khi ôm đàn nhìn xuống." },
    ],
    assessment: ["Đọc to đúng một sơ đồ bất kỳ: dây nào, phím nào, ngón nào, dây nào bỏ."],
    mastery: ["Đặt tay theo một sơ đồ mới mà không cần hình cần đàn hỗ trợ."],
  },
  chordLesson("em", 2, ["reading-chord-diagrams"], {
    summary: "Hợp âm dễ nhất: hai ngón, cả sáu dây đều gảy.",
    intro: [
      "Em (Mi thứ) chỉ cần hai ngón và gảy cả 6 dây — hợp âm đầu tiên lý tưởng. Âm thanh trầm, hơi buồn: đó là màu của hợp âm thứ.",
    ],
    compare:
      "Ở góc 'Nhìn xuống': hai chấm nằm ở hàng thứ hai và thứ ba tính từ trên (dây 5 và dây 4), cùng ở phím 2. Trên đàn thật: dây thứ hai và thứ ba tính từ phía mặt bạn.",
    tip: "Đặt ngón 2 và ngón 3 cạnh nhau, cùng ô phím 2, ngón 2 ở dây to hơn (gần mặt bạn hơn).",
    practice: [
      "Đặt Em, gảy từng dây kiểm tra (6 → 1).",
      "Gảy xuống cả hợp âm 4 lần theo metronome 60 BPM.",
      "Nhấc tay – đặt lại Em 10 lần, đếm thời gian.",
    ],
    mistakes: [
      { mistake: "Ngón 3 chạm vào dây 3 làm dây 3 tắt tiếng.", fix: "Cong ngón 3 hơn để đầu ngón đứng thẳng trên dây 4." },
    ],
  }),
  chordLesson("am", 3, ["chord-em"], {
    summary: "Ba ngón, bỏ dây 6. Chuyển Em → Am rất tự nhiên.",
    intro: [
      "Am (La thứ) dùng ba ngón và KHÔNG gảy dây 6 — dây thấp nhất được gảy là dây 5 buông, chính là nốt gốc A.",
      "Hình dạng Am giống Em nhưng dời sang dây mảnh hơn một hàng và thêm ngón 1.",
    ],
    compare:
      "Ở góc 'Nhìn xuống': dây 6 (hàng trên cùng) có dấu X — không gảy. Ngón 1 ở dây 2 (hàng thứ hai từ dưới lên, phía sàn nhà), phím 1, sát lược đàn nhất.",
    practice: [
      "Đặt Am, gảy từng dây từ dây 5 → 1.",
      "Chuyển Em → Am → Em, mỗi hợp âm 4 phách ở 60 BPM.",
      "Gảy xuống bắt đầu từ dây 5: cố tránh dây 6.",
    ],
    mistakes: [
      { mistake: "Lỡ gảy dây 6.", fix: "Bắt đầu cú gảy từ dây 5; hoặc chạm nhẹ đầu ngón cái tay bấm lên dây 6 để chặn tiếng." },
      { mistake: "Dây 1 bị tắt do ngón 1 chạm vào.", fix: "Cong ngón 1, bấm bằng đầu ngón." },
    ],
  }),
  chordLesson("e", 4, ["chord-am"], {
    summary: "Hợp âm trưởng đầu tiên: giống Am, dời lên một hàng dây.",
    intro: [
      "E (Mi trưởng) có đúng hình dạng của Am nhưng dời về phía dây to hơn một hàng, và gảy cả 6 dây. Nghe E rồi Em: chỉ khác một nốt (G# và G) mà màu sắc chuyển từ sáng sang buồn — đó là khác biệt trưởng/thứ.",
    ],
    compare:
      "Ở góc 'Nhìn xuống': ba chấm nằm ở hàng 2, 3, 4 từ trên xuống (dây 5, 4, 3). Ngón 1 ở dây 3, phím 1. So với Am, cả hình dạng dịch về phía mặt bạn một dây.",
    tip: "Đặt E, rồi nhấc riêng ngón 1 lên: bạn đang bấm Em. Đặt lại: E. Nghe sự khác biệt trưởng – thứ.",
    practice: [
      "Đặt E, gảy từng dây 6 → 1.",
      "Chuyển E ↔ Am mà giữ nguyên hình dạng tay — chỉ dời cả khối một dây.",
      "Đổi E ↔ Em bằng cách nhấc/đặt ngón 1, nghe khác biệt.",
    ],
    mistakes: [{ mistake: "Ngón 1 nằm quá xa thanh phím 1.", fix: "Đặt ngón 1 sát thanh kim loại thứ nhất (phía thùng đàn)." }],
  }),
  chordLesson("a", 5, ["chord-e"], {
    summary: "Ba ngón chen nhau trong cùng ô phím 2.",
    intro: [
      "A (La trưởng) đặt ba ngón cạnh nhau trong cùng ô phím 2, trên dây 4, 3, 2. Không gảy dây 6.",
      "Ô phím hẹp nên ba ngón không thể đều sát thanh kim loại — xếp hơi chéo: ngón 1 lùi về phía đầu đàn một chút, ngón 3 sát thanh kim loại nhất.",
    ],
    compare:
      "Ở góc 'Nhìn xuống': ba chấm thẳng hàng dọc ở phím 2, trên hàng thứ 3, 4, 5 từ trên xuống (dây 4, 3, 2). Dây 1 (hàng dưới cùng, phía sàn) gảy buông — đừng để ngón 3 chạm vào nó.",
    practice: [
      "Đặt A, gảy từng dây 5 → 1, đặc biệt kiểm tra dây 1.",
      "Chuyển A ↔ E, mỗi hợp âm 4 phách ở 60 BPM.",
    ],
    mistakes: [
      { mistake: "Dây 1 bị tắt.", fix: "Cong ngón 3 nhiều hơn, đầu ngón đứng thẳng trên dây 2." },
      { mistake: "Ba ngón chen không vừa.", fix: "Xếp chéo: ngón 1 hơi lùi về phía đầu đàn, ngón 3 sát thanh kim loại." },
    ],
  }),
  chordLesson("d", 6, ["chord-a"], {
    summary: "Hình tam giác trên ba dây mảnh nhất, chỉ gảy 4 dây.",
    intro: [
      "D (Rê trưởng) chỉ gảy 4 dây: dây 4 buông (nốt gốc D) và dây 3, 2, 1 có bấm. Ba ngón tạo thành hình tam giác.",
    ],
    compare:
      "Ở góc 'Nhìn xuống': dây 6 và dây 5 (hai hàng trên cùng, gần mặt bạn) có X. Tam giác nằm trên ba hàng dưới cùng (dây 3, 2, 1 — phía sàn nhà), đỉnh tam giác là ngón 3 ở phím 3, dây 2.",
    practice: [
      "Đặt D, gảy từ dây 4 → 1.",
      "Gảy xuống chỉ 4 dây: bắt đầu từ dây 4.",
      "Chuyển D ↔ A, mỗi hợp âm 4 phách ở 60 BPM.",
    ],
    mistakes: [
      { mistake: "Gảy cả dây 5, 6 nên tiếng đục.", fix: "Bắt đầu cú gảy từ dây 4 — nốt D là nốt thấp nhất." },
      { mistake: "Ngón 2 (dây 1) bị phần thịt ngón 3 đè.", fix: "Cong ngón 3 và hạ cổ tay nhẹ để các ngón đứng thẳng hơn." },
    ],
  }),
];
