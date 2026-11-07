import { midiToFrequency, midiToNoteLabel, pitchClass, type NoteName } from "./notes";

/**
 * String numbering follows the guitar convention:
 *   string 6 = thickest, lowest (E2) … string 1 = thinnest, highest (E4).
 */
export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;
export const STRING_NUMBERS_LOW_TO_HIGH: readonly StringNumber[] = [6, 5, 4, 3, 2, 1];
export const STRING_NUMBERS_HIGH_TO_LOW: readonly StringNumber[] = [1, 2, 3, 4, 5, 6];

export type GuitarString = {
  number: StringNumber;
  midi: number;
  note: NoteName;
  label: string;
  frequency: number;
  /** Vietnamese nickname used consistently across lessons. */
  nickname: string;
  /** Relative gauge used for drawing (1 = thinnest). */
  gauge: number;
};

const STANDARD_MIDI: Record<StringNumber, number> = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
const NICKNAMES: Record<StringNumber, string> = {
  6: "Mi trầm — dây to nhất",
  5: "La",
  4: "Rê",
  3: "Sol",
  2: "Si",
  1: "Mi cao — dây mảnh nhất",
};
const GAUGES: Record<StringNumber, number> = { 6: 3.2, 5: 2.7, 4: 2.2, 3: 1.8, 2: 1.3, 1: 1 };

export const STANDARD_TUNING: Record<StringNumber, GuitarString> = Object.fromEntries(
  STRING_NUMBERS_LOW_TO_HIGH.map((n) => [
    n,
    {
      number: n,
      midi: STANDARD_MIDI[n],
      note: pitchClass(STANDARD_MIDI[n]),
      label: midiToNoteLabel(STANDARD_MIDI[n]),
      frequency: midiToFrequency(STANDARD_MIDI[n]),
      nickname: NICKNAMES[n],
      gauge: GAUGES[n],
    },
  ]),
) as Record<StringNumber, GuitarString>;

export function midiAt(string: StringNumber, fret: number): number {
  return STANDARD_TUNING[string].midi + fret;
}

export function noteAt(string: StringNumber, fret: number): NoteName {
  return pitchClass(midiAt(string, fret));
}

/** Which guitar string a detected frequency is closest to (by cents). */
export function nearestString(frequency: number): GuitarString {
  let best = STANDARD_TUNING[6];
  let bestDistance = Infinity;
  for (const n of STRING_NUMBERS_LOW_TO_HIGH) {
    const s = STANDARD_TUNING[n];
    const distance = Math.abs(1200 * Math.log2(frequency / s.frequency));
    if (distance < bestDistance) {
      best = s;
      bestDistance = distance;
    }
  }
  return best;
}

/** Fret numbers that carry position-marker dots on most guitars. */
export const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21] as const;
export const DOUBLE_INLAY_FRETS = [12, 24] as const;
