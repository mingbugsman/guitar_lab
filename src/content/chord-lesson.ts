import { CHORDS, type ChordId } from "@/lib/music/chords";
import type { Lesson, LevelId } from "./types";

/**
 * Builder shared by every chord lesson. Finger-by-finger steps are generated from chord data
 * (describeChord) and shown next to the diagram, so the text here only adds technique and context.
 * Writing rules: docx/WRITING_GUIDE.md, checked by src/content/writing.test.ts.
 */

/** §5: what the fretting hand will feel, how long a chord takes, when to stop. */
export function chordBodyNote(symbol: string, sessions: string): string {
  return [
    "Đầu ngón tay bấm đau và có vết hằn dây là bình thường với dây sắt. Da sẽ dày lên sau 1 đến 2 tuần tập đều.",
    `Thường mất ${sessions} buổi tập, mỗi buổi 10 đến 15 phút, để đặt ${symbol} sạch tiếng trong 3 giây. Vài buổi ngắn mỗi ngày tốt hơn một buổi dài.`,
    "Dừng ngay nếu đau nhói ở cổ tay, khuỷu tay hoặc vai, hoặc tê đầu ngón: tay đang gồng sai, không phải do bạn tập chưa đủ. Nghỉ một ngày nếu đầu ngón bị phồng.",
  ].join(" ");
}

/** Wording reused by chord practice: the metronome and its speed are explained on first use. */
export const AT_60 =
  "theo máy đếm nhịp (Metronome: công cụ phát tiếng tích tắc đều) ở 60 BPM (60 tiếng tích mỗi phút)";

export function chordLesson(
  id: ChordId,
  placement: { levelId: LevelId; order: number; prerequisites: string[] },
  extra: Pick<Lesson, "summary" | "mistakes"> & {
    intro: string[];
    compare: string;
    practice: string[];
    tip?: string;
    /** Typical number of practice sessions to play the chord cleanly in 3 seconds, e.g. "3 đến 5". */
    sessions: string;
    /**
     * What the learner reads the shape from. A chord taught before the "reading chord diagrams"
     * lesson must say "hình cần đàn" (the view they already know), not "sơ đồ".
     */
    readFrom?: "diagram" | "fretboard";
    /**
     * One-minute chord changes for this lesson: the chord alone (place, lift, replace) or the
     * chord paired with one learned before it.
     */
    drill: [ChordId] | [ChordId, ChordId];
  },
): Lesson {
  const chord = CHORDS[id];
  const fromDiagram = (extra.readFrom ?? "diagram") === "diagram";
  const drillLabel = extra.drill.map((c) => CHORDS[c].symbol).join(" – ");
  const drillText =
    extra.drill.length === 2
      ? `Đổi qua lại ${drillLabel} càng nhiều lần càng tốt trong 1 phút. Mỗi lần đặt xong hợp âm thì gảy xuống một cái, không cần theo nhịp.`
      : `Đặt ${chord.symbol}, gảy xuống một cái, nhấc cả bàn tay lên rồi đặt lại, càng nhiều lần càng tốt trong 1 phút.`;
  return {
    slug: `chord-${id}`,
    levelId: placement.levelId,
    order: placement.order,
    title: `Hợp âm ${chord.symbol} — ${chord.nameVi}`,
    summary: extra.summary,
    minutes: 15,
    objectives: [
      fromDiagram
        ? `Đặt đúng ${chord.symbol} theo sơ đồ hợp âm (hình chỉ chỗ đặt từng ngón), đúng ngón.`
        : `Đặt đúng ${chord.symbol} theo hình cần đàn, đúng ngón.`,
      `Gảy ${chord.symbol} mà mọi dây cần gảy đều ngân rõ.`,
      `Biết ${chord.symbol} gồm các nốt ${chord.tones.join(", ")}.`,
    ],
    prerequisites: placement.prerequisites,
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
      { type: "visual", visual: { kind: "chordChange", chords: extra.drill } },
      {
        type: "text",
        heading: "Đo tiến bộ bằng con số",
        paragraphs: [
          drillText,
          "Máy nghe tiếng gảy qua micro và đếm giúp bạn, nên hai tay cứ để trên đàn. Ngày đầu được 8 đến 10 lần là bình thường. Con số được lưu lại: mỗi ngày làm 2 lượt và thử vượt lần trước.",
        ],
      },
    ],
    practice: {
      minutes: 10,
      steps: [...extra.practice, `Đo 1 phút ${drillLabel}: bấm 'Bắt đầu, máy tự đếm' và làm 2 lượt.`],
    },
    mistakes: extra.mistakes,
    checklist: [
      { id: "shape", label: `Tôi đặt đúng ${chord.symbol}, đúng ngón như ${fromDiagram ? "sơ đồ" : "hình"}.` },
      { id: "compare", label: "Tôi đã đối chiếu tay mình với hình cần đàn." },
      { id: "clean", label: "Tôi gảy từng dây và mọi dây cần gảy đều ngân rõ." },
      { id: "reset", label: `Tôi nhấc tay ra và đặt lại ${chord.symbol} 10 lần liên tiếp.` },
    ],
    assessment: [`Đặt ${chord.symbol} trong 3 giây và mọi dây ngân rõ, 5 lần liên tiếp.`],
    mastery: [`Đặt ${chord.symbol} trong 1 giây, không nhìn tay, không dây nào rè.`],
  };
}
