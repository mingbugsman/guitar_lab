import type { Handedness } from "@/components/guitar/orientation";

/**
 * Lesson text must never hard-code "tay trái / tay phải / bên trái / bên phải" for things that
 * flip on a left-handed guitar. Write these tokens instead; they are resolved when rendered,
 * so the words always agree with the (mirrored) pictures. See docx/WRITING_GUIDE.md §3.
 *
 *   {fretHand} {FretHand}  tay bấm:  "tay trái" for right-handed players
 *   {pickHand} {PickHand}  tay gảy:  "tay phải" for right-handed players
 *   {fretSide} {FRETSIDE}  the side of the fretting hand: "trái" — where the headstock points,
 *                          and where string 6 sits on an upright chord diagram
 *   {pickSide} {PICKSIDE}  the side of the picking hand: "phải" — the thigh the guitar rests on
 */
const WORDS: Record<Handedness, Record<string, string>> = {
  right: {
    fretHand: "tay trái",
    FretHand: "Tay trái",
    pickHand: "tay phải",
    PickHand: "Tay phải",
    fretSide: "trái",
    FRETSIDE: "TRÁI",
    pickSide: "phải",
    PICKSIDE: "PHẢI",
  },
  left: {
    fretHand: "tay phải",
    FretHand: "Tay phải",
    pickHand: "tay trái",
    PickHand: "Tay trái",
    fretSide: "phải",
    FRETSIDE: "PHẢI",
    pickSide: "trái",
    PICKSIDE: "TRÁI",
  },
};

export const HAND_TOKENS = Object.keys(WORDS.right);
const TOKEN_RE = /\{(\w+)\}/g;

export function resolveHandedness(text: string, handedness: Handedness): string {
  return text.replace(TOKEN_RE, (whole, key: string) => WORDS[handedness][key] ?? whole);
}

/** Tokens in `text` that are not known (typos would otherwise reach the learner as "{…}"). */
export function unknownTokens(text: string): string[] {
  return [...text.matchAll(TOKEN_RE)].map((m) => m[1]).filter((k) => !(k in WORDS.right));
}

/**
 * Wording that silently assumes a right-handed player. "Đàn tay trái/phải" is the name of the
 * setting itself and is allowed, as is the sentence that introduces that setting.
 */
const HARDCODED_SIDE = /(tay|bên|đùi|cột|sang|cổ tay|cẳng tay)\s+(trái|phải)(?![\p{L}])/giu;

export function hardcodedSides(text: string): string[] {
  // The one sentence that explains the setting has to name both hands literally.
  if (text.includes("'Đàn tay trái'")) return [];
  const withoutSettingName = text.replace(/đàn tay (trái|phải)/giu, "");
  return [...withoutSettingName.matchAll(HARDCODED_SIDE)].map((m) => m[0]);
}
