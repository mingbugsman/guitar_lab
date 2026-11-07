import { midiAt, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "./guitar";
import { pitchClass, type NoteName } from "./notes";

/** Fretting-hand finger: 1 = index, 2 = middle, 3 = ring, 4 = pinky, T = thumb. */
export type Finger = 1 | 2 | 3 | 4 | "T";

/** "x" = muted / not played, 0 = open string, n = press at fret n. */
export type FretValue = number | "x";

export type ChordShape = {
  id: string;
  symbol: string;
  name: string;
  nameVi: string;
  quality: "major" | "minor" | "dominant7";
  root: NoteName;
  /** Notes that make up the chord (pitch classes). */
  tones: NoteName[];
  /** Keyed by string number (6 = thickest). */
  frets: Record<StringNumber, FretValue>;
  fingers: Partial<Record<StringNumber, Finger>>;
  /** First fret shown on the diagram (1 = nut visible). */
  baseFret: number;
};

export const CHORDS = {
  em: {
    id: "em",
    symbol: "Em",
    name: "E minor",
    nameVi: "Mi thứ",
    quality: "minor",
    root: "E",
    tones: ["E", "G", "B"],
    frets: { 6: 0, 5: 2, 4: 2, 3: 0, 2: 0, 1: 0 },
    fingers: { 5: 2, 4: 3 },
    baseFret: 1,
  },
  am: {
    id: "am",
    symbol: "Am",
    name: "A minor",
    nameVi: "La thứ",
    quality: "minor",
    root: "A",
    tones: ["A", "C", "E"],
    frets: { 6: "x", 5: 0, 4: 2, 3: 2, 2: 1, 1: 0 },
    fingers: { 4: 2, 3: 3, 2: 1 },
    baseFret: 1,
  },
  e: {
    id: "e",
    symbol: "E",
    name: "E major",
    nameVi: "Mi trưởng",
    quality: "major",
    root: "E",
    tones: ["E", "G#", "B"],
    frets: { 6: 0, 5: 2, 4: 2, 3: 1, 2: 0, 1: 0 },
    fingers: { 5: 2, 4: 3, 3: 1 },
    baseFret: 1,
  },
  a: {
    id: "a",
    symbol: "A",
    name: "A major",
    nameVi: "La trưởng",
    quality: "major",
    root: "A",
    tones: ["A", "C#", "E"],
    frets: { 6: "x", 5: 0, 4: 2, 3: 2, 2: 2, 1: 0 },
    fingers: { 4: 1, 3: 2, 2: 3 },
    baseFret: 1,
  },
  d: {
    id: "d",
    symbol: "D",
    name: "D major",
    nameVi: "Rê trưởng",
    quality: "major",
    root: "D",
    tones: ["D", "F#", "A"],
    frets: { 6: "x", 5: "x", 4: 0, 3: 2, 2: 3, 1: 2 },
    fingers: { 3: 1, 2: 3, 1: 2 },
    baseFret: 1,
  },
} satisfies Record<string, ChordShape>;

export type ChordId = keyof typeof CHORDS;
export const CHORD_IDS = Object.keys(CHORDS) as ChordId[];

export function getChord(id: string): ChordShape | undefined {
  return (CHORDS as Record<string, ChordShape>)[id];
}

/** Sounding notes from low (string 6) to high (string 1), skipping muted strings. */
export function soundingMidi(chord: ChordShape): { string: StringNumber; midi: number }[] {
  return STRING_NUMBERS_LOW_TO_HIGH.flatMap((s) => {
    const fret = chord.frets[s];
    return fret === "x" ? [] : [{ string: s, midi: midiAt(s, fret) }];
  });
}

export function soundingNotes(chord: ChordShape): NoteName[] {
  return soundingMidi(chord).map((n) => pitchClass(n.midi));
}
