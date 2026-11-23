import { CHORDS, type ChordId } from "./chords";

/**
 * "Trưởng hay thứ?": the learner hears one chord and says major or minor. Only chords they have
 * already played, so the sound is familiar and the answer can be checked on the guitar.
 */
export const QUIZ_CHORDS: ChordId[] = ["e", "em", "a", "am", "d", "dm", "c", "g"];

/** The three pairs that differ by one note, in the order Level 1 teaches them. */
export const PAIRS: [ChordId, ChordId][] = [
  ["e", "em"],
  ["a", "am"],
  ["d", "dm"],
];

export type Quality = "major" | "minor";

export function qualityOf(id: ChordId): Quality {
  const q = CHORDS[id].quality;
  if (q !== "major" && q !== "minor") throw new Error(`${id} is neither major nor minor`);
  return q;
}

/**
 * The next chord to ask. Never the same chord twice in a row, and never the same quality three
 * times in a row: otherwise a lucky streak of "trưởng" teaches nothing.
 */
export function nextQuizChord(history: ChordId[], rand: () => number = Math.random): ChordId {
  const last = history.at(-1);
  const twoSame = history.length >= 2 && qualityOf(history.at(-1)!) === qualityOf(history.at(-2)!);
  const pool = QUIZ_CHORDS.filter((c) => c !== last && !(twoSame && qualityOf(c) === qualityOf(last!)));
  return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
}

export const QUIZ_LENGTH = 10;
