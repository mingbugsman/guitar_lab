import { CHORDS, type ChordId } from "@/lib/music/chords";
import type { Lesson } from "./types";

/**
 * LEVEL 1 — FIRST CHORDS (MVP 0.1 ships: reading diagrams + Em, Am, E, A, D).
 * Finger-by-finger steps are generated from chord data (describeChord) and shown next to
 * the diagram, so lesson text below only adds technique and context.
 * Writing rules: docx/WRITING_GUIDE.md, checked by src/content/writing.test.ts.
 */

/** §5: what the fretting hand will feel, how long a chord takes, when to stop. */
function chordBodyNote(symbol: string, sessions: string): string {
  return [
    "Đầu ngón tay bấm đau và có vết hằn dây là bình thường với dây sắt. Da sẽ dày lên sau 1 đến 2 tuần tập đều.",
    `Thường mất ${sessions} buổi tập, mỗi buổi 10 đến 15 phút, để đặt ${symbol} sạch tiếng trong 3 giây. Vài buổi ngắn mỗi ngày tốt hơn một buổi dài.`,
    "Dừng ngay nếu đau nhói ở cổ tay, khuỷu tay hoặc vai, hoặc tê đầu ngón: tay đang gồng sai, không phải do bạn tập chưa đủ. Nghỉ một ngày nếu đầu ngón bị phồng.",
  ].join(" ");
}

function chordLesson(
  id: ChordId,
  order: number,
  prerequisites: string[],
  extra: Pick<Lesson, "summary" | "mistakes"> & {
    intro: string[];
    compare: string;
    practice: string[];
    tip?: string;
    /** Typical number of practice sessions to play the chord cleanly in 3 seconds, e.g. "3 đến 5". */
    sessions: string;
  },
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
      `Đặt đúng ${chord.symbol} theo sơ đồ hợp âm (hình chỉ chỗ đặt từng ngón), đúng ngón.`,
      `Gảy ${chord.symbol} mà mọi dây cần gảy đều ngân rõ.`,
      `Biết ${chord.symbol} gồm các nốt ${chord.tones.join(", ")}.`,
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
          "Đặt tay vào thế bấm và giữ yên.",
          "Gảy từng dây một, từ dây trầm nhất được gảy đến dây 1, giống nút 'Nghe từng dây'.",
          "Dây nào rè hoặc tắt: chỉnh đúng ngón ở dây đó, cong hơn hoặc sát thanh kim loại hơn, rồi gảy lại.",
          "Khi mọi dây đều rõ, gảy xuống cả hợp âm một lần.",
        ],
      },
      { type: "callout", tone: "body", text: chordBodyNote(chord.symbol, extra.sessions) },
    ],
    practice: {
      minutes: 10,
      steps: extra.practice,
    },
    mistakes: extra.mistakes,
    checklist: [
      { id: "shape", label: `Tôi đặt đúng ${chord.symbol}, đúng ngón như sơ đồ.` },
      { id: "compare", label: "Tôi đã đối chiếu tay mình với hình cần đàn." },
      { id: "clean", label: "Tôi gảy từng dây và mọi dây cần gảy đều ngân rõ." },
      { id: "reset", label: `Tôi nhấc tay ra và đặt lại ${chord.symbol} 10 lần liên tiếp.` },
    ],
    assessment: [`Đặt ${chord.symbol} trong 3 giây và mọi dây ngân rõ, 5 lần liên tiếp.`],
    mastery: [`Đặt ${chord.symbol} trong 1 giây, không nhìn tay, không dây nào rè.`],
  };
}

/** Wording reused by chord practice: the metronome and its speed are explained on first use. */
const AT_60 = "theo máy đếm nhịp (Metronome: công cụ phát tiếng tích tắc đều) ở 60 BPM (60 tiếng tích mỗi phút)";

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
          "Hợp âm là nhiều nốt vang cùng lúc. Sơ đồ cho biết đặt ngón nào, ở dây nào, phím nào.",
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
        "Ôm đàn lại, nhìn xuống và tìm lại đúng ô đó. So với hình cần đàn.",
      ],
    },
    mistakes: [
      {
        mistake: "Đặt ngón vào dây 2 trong khi sơ đồ chỉ dây 5.",
        fix: "Bạn đang đọc sơ đồ như thể dây 1 nằm bên {fretSide}. Đọc hàng số dưới sơ đồ: dây 6 bên {fretSide}, dây 1 bên {pickSide}.",
      },
    ],
    checklist: [
      { id: "symbols", label: "Tôi hiểu ý nghĩa của chấm có số, dấu O và dấu X." },
      { id: "orientation", label: "Tôi dựng đàn đứng và thấy nó giống sơ đồ." },
      { id: "transfer", label: "Tôi tìm đúng ô 'dây 5 phím 2' khi ôm đàn nhìn xuống." },
    ],
    assessment: ["Đọc to đúng một sơ đồ bất kỳ: dây nào, phím nào, ngón nào, dây nào không gảy."],
    mastery: ["Đặt tay theo một sơ đồ mới mà không cần hình cần đàn hỗ trợ."],
  },
  chordLesson("em", 2, ["reading-chord-diagrams"], {
    summary: "Hợp âm dễ nhất: hai ngón, cả sáu dây đều gảy.",
    intro: [
      "Hợp âm là nhiều nốt vang cùng lúc. Em (Mi thứ) chỉ cần hai ngón và gảy cả 6 dây, nên là hợp âm đầu tiên dễ nhất.",
      "Em nghe trầm và hơi buồn. Đó là màu của hợp âm thứ.",
    ],
    compare:
      "Trên hình cần đàn, hai chấm nằm ở hàng thứ hai và thứ ba tính từ trên (dây 5 và dây 4), cùng ở phím 2. Trên đàn thật: dây thứ hai và thứ ba tính từ phía mặt bạn.",
    tip: "Đặt ngón 2 và ngón 3 cạnh nhau trong cùng ô phím 2. Ngón 2 ở dây to hơn, gần mặt bạn hơn.",
    sessions: "2 đến 3",
    practice: [
      "Đặt Em và gảy từng dây, từ dây 6 đến dây 1.",
      `Gảy xuống cả hợp âm 4 lần ${AT_60}.`,
      "Nhấc tay ra rồi đặt lại Em. Làm 10 lần.",
    ],
    mistakes: [
      {
        mistake: "Dây 3 bị tắt tiếng.",
        fix: "Ngón 3 đang chạm vào dây 3. Cong ngón 3 hơn để đầu ngón đứng thẳng trên dây 4.",
      },
    ],
  }),
  chordLesson("am", 3, ["chord-em"], {
    summary: "Ba ngón, bỏ dây 6. Chuyển từ Em sang Am rất tự nhiên.",
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
  chordLesson("e", 4, ["chord-am"], {
    summary: "Hợp âm trưởng đầu tiên: giống Am, dời lên một hàng dây.",
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
  chordLesson("a", 5, ["chord-e"], {
    summary: "Ba ngón chen nhau trong cùng ô phím 2.",
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
  chordLesson("d", 6, ["chord-a"], {
    summary: "Hình tam giác trên ba dây mảnh nhất, chỉ gảy 4 dây.",
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
