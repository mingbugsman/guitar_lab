import { midiAt, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "./guitar";
import { pitchClass, type NoteName } from "./notes";

/** Fretting-hand finger: 1 = index, 2 = middle, 3 = ring, 4 = pinky, T = thumb. */
export type Finger = 1 | 2 | 3 | 4 | "T";

/** "x" = muted / not played, 0 = open string, n = press at fret n. */
export type FretValue = number | "x";

export type ChordQuality = "major" | "minor" | "dominant7" | "minor7" | "major7" | "sus2" | "sus4" | "power";

export type ChordShape = {
  id: string;
  symbol: string;
  name: string;
  nameVi: string;
  quality: ChordQuality;
  root: NoteName;
  /** Notes that make up the chord (pitch classes). */
  tones: NoteName[];
  /** Keyed by string number (6 = thickest). */
  frets: Record<StringNumber, FretValue>;
  fingers: Partial<Record<StringNumber, Finger>>;
  /** First fret shown on the diagram (1 = nut visible). */
  baseFret: number;
  /** One finger pressing several strings at the same fret, from the thicker string to the thinner. */
  barre?: { fret: number; from: StringNumber; to: StringNumber; finger: Finger };
  /** Chord tones this common shape leaves out on purpose (the fifth of some seventh chords). */
  omitted?: NoteName[];
};

type Six<T> = [T, T, T, T, T, T];

/** Compact definition: frets and fingers listed from string 6 to string 1, like "x32010". */
function chord(
  id: string,
  symbol: string,
  name: string,
  nameVi: string,
  quality: ChordQuality,
  root: NoteName,
  tones: NoteName[],
  frets: Six<FretValue>,
  fingers: Six<Finger | null>,
  extra: { baseFret?: number; barre?: ChordShape["barre"]; omitted?: NoteName[] } = {},
): ChordShape {
  const f = {} as Record<StringNumber, FretValue>;
  const g: Partial<Record<StringNumber, Finger>> = {};
  ([6, 5, 4, 3, 2, 1] as StringNumber[]).forEach((s, i) => {
    f[s] = frets[i];
    const finger = fingers[i];
    if (finger != null) g[s] = finger;
  });
  return { id, symbol, name, nameVi, quality, root, tones, frets: f, fingers: g, baseFret: extra.baseFret ?? 1, barre: extra.barre, omitted: extra.omitted };
}

const x = "x" as const;
const _ = null;

export const CHORDS = {
  // open majors / minors
  em: chord("em", "Em", "E minor", "Mi thứ", "minor", "E", ["E", "G", "B"], [0, 2, 2, 0, 0, 0], [_, 2, 3, _, _, _]),
  am: chord("am", "Am", "A minor", "La thứ", "minor", "A", ["A", "C", "E"], [x, 0, 2, 2, 1, 0], [_, _, 2, 3, 1, _]),
  e: chord("e", "E", "E major", "Mi trưởng", "major", "E", ["E", "G#", "B"], [0, 2, 2, 1, 0, 0], [_, 2, 3, 1, _, _]),
  a: chord("a", "A", "A major", "La trưởng", "major", "A", ["A", "C#", "E"], [x, 0, 2, 2, 2, 0], [_, _, 1, 2, 3, _]),
  d: chord("d", "D", "D major", "Rê trưởng", "major", "D", ["D", "F#", "A"], [x, x, 0, 2, 3, 2], [_, _, _, 1, 3, 2]),
  c: chord("c", "C", "C major", "Đô trưởng", "major", "C", ["C", "E", "G"], [x, 3, 2, 0, 1, 0], [_, 3, 2, _, 1, _]),
  g: chord("g", "G", "G major", "Son trưởng", "major", "G", ["G", "B", "D"], [3, 2, 0, 0, 0, 3], [2, 1, _, _, _, 3]),
  dm: chord("dm", "Dm", "D minor", "Rê thứ", "minor", "D", ["D", "F", "A"], [x, x, 0, 2, 3, 1], [_, _, _, 2, 3, 1]),

  // dominant 7
  a7: chord("a7", "A7", "A seventh", "La bảy", "dominant7", "A", ["A", "C#", "E", "G"], [x, 0, 2, 0, 2, 0], [_, _, 2, _, 3, _]),
  b7: chord("b7", "B7", "B seventh", "Si bảy", "dominant7", "B", ["B", "D#", "F#", "A"], [x, 2, 1, 2, 0, 2], [_, 2, 1, 3, _, 4]),
  c7: chord("c7", "C7", "C seventh", "Đô bảy", "dominant7", "C", ["C", "E", "G", "A#"], [x, 3, 2, 3, 1, 0], [_, 3, 2, 4, 1, _], { omitted: ["G"] }),
  d7: chord("d7", "D7", "D seventh", "Rê bảy", "dominant7", "D", ["D", "F#", "A", "C"], [x, x, 0, 2, 1, 2], [_, _, _, 2, 1, 3]),
  e7: chord("e7", "E7", "E seventh", "Mi bảy", "dominant7", "E", ["E", "G#", "B", "D"], [0, 2, 0, 1, 0, 0], [_, 2, _, 1, _, _]),
  g7: chord("g7", "G7", "G seventh", "Son bảy", "dominant7", "G", ["G", "B", "D", "F"], [3, 2, 0, 0, 0, 1], [3, 2, _, _, _, 1]),

  // minor 7 / major 7
  am7: chord("am7", "Am7", "A minor seventh", "La thứ bảy", "minor7", "A", ["A", "C", "E", "G"], [x, 0, 2, 0, 1, 0], [_, _, 2, _, 1, _]),
  dm7: chord("dm7", "Dm7", "D minor seventh", "Rê thứ bảy", "minor7", "D", ["D", "F", "A", "C"], [x, x, 0, 2, 1, 1], [_, _, _, 2, 1, 1], {
    barre: { fret: 1, from: 2, to: 1, finger: 1 },
  }),
  em7: chord("em7", "Em7", "E minor seventh", "Mi thứ bảy", "minor7", "E", ["E", "G", "B", "D"], [0, 2, 2, 0, 3, 0], [_, 1, 2, _, 4, _]),
  cmaj7: chord("cmaj7", "Cmaj7", "C major seventh", "Đô trưởng bảy", "major7", "C", ["C", "E", "G", "B"], [x, 3, 2, 0, 0, 0], [_, 3, 2, _, _, _]),
  dmaj7: chord("dmaj7", "Dmaj7", "D major seventh", "Rê trưởng bảy", "major7", "D", ["D", "F#", "A", "C#"], [x, x, 0, 2, 2, 2], [_, _, _, 1, 2, 3]),
  fmaj7: chord("fmaj7", "Fmaj7", "F major seventh", "Fa trưởng bảy", "major7", "F", ["F", "A", "C", "E"], [x, x, 3, 2, 1, 0], [_, _, 3, 2, 1, _]),

  // sus
  asus2: chord("asus2", "Asus2", "A suspended 2", "La sus2", "sus2", "A", ["A", "B", "E"], [x, 0, 2, 2, 0, 0], [_, _, 1, 2, _, _]),
  asus4: chord("asus4", "Asus4", "A suspended 4", "La sus4", "sus4", "A", ["A", "D", "E"], [x, 0, 2, 2, 3, 0], [_, _, 1, 2, 3, _]),
  dsus2: chord("dsus2", "Dsus2", "D suspended 2", "Rê sus2", "sus2", "D", ["D", "E", "A"], [x, x, 0, 2, 3, 0], [_, _, _, 1, 3, _]),
  dsus4: chord("dsus4", "Dsus4", "D suspended 4", "Rê sus4", "sus4", "D", ["D", "G", "A"], [x, x, 0, 2, 3, 3], [_, _, _, 1, 3, 4]),
  esus4: chord("esus4", "Esus4", "E suspended 4", "Mi sus4", "sus4", "E", ["E", "A", "B"], [0, 2, 2, 2, 0, 0], [_, 2, 3, 4, _, _]),

  // barre chords
  f: chord("f", "F", "F major", "Fa trưởng", "major", "F", ["F", "A", "C"], [1, 3, 3, 2, 1, 1], [1, 3, 4, 2, 1, 1], {
    barre: { fret: 1, from: 6, to: 1, finger: 1 },
  }),
  fm: chord("fm", "Fm", "F minor", "Fa thứ", "minor", "F", ["F", "G#", "C"], [1, 3, 3, 1, 1, 1], [1, 3, 4, 1, 1, 1], {
    barre: { fret: 1, from: 6, to: 1, finger: 1 },
  }),
  bm: chord("bm", "Bm", "B minor", "Si thứ", "minor", "B", ["B", "D", "F#"], [x, 2, 4, 4, 3, 2], [_, 1, 3, 4, 2, 1], {
    baseFret: 2,
    barre: { fret: 2, from: 5, to: 1, finger: 1 },
  }),
  b: chord("b", "B", "B major", "Si trưởng", "major", "B", ["B", "D#", "F#"], [x, 2, 4, 4, 4, 2], [_, 1, 2, 3, 4, 1], {
    baseFret: 2,
    barre: { fret: 2, from: 5, to: 1, finger: 1 },
  }),
  bb: chord("bb", "Bb", "B flat major", "Si giáng trưởng", "major", "A#", ["A#", "D", "F"], [x, 1, 3, 3, 3, 1], [_, 1, 2, 3, 4, 1], {
    barre: { fret: 1, from: 5, to: 1, finger: 1 },
  }),
  fsm: chord("fsm", "F#m", "F sharp minor", "Fa thăng thứ", "minor", "F#", ["F#", "A", "C#"], [2, 4, 4, 2, 2, 2], [1, 3, 4, 1, 1, 1], {
    baseFret: 2,
    barre: { fret: 2, from: 6, to: 1, finger: 1 },
  }),
  csm: chord("csm", "C#m", "C sharp minor", "Đô thăng thứ", "minor", "C#", ["C#", "E", "G#"], [x, 4, 6, 6, 5, 4], [_, 1, 3, 4, 2, 1], {
    baseFret: 4,
    barre: { fret: 4, from: 5, to: 1, finger: 1 },
  }),
  gm: chord("gm", "Gm", "G minor", "Son thứ", "minor", "G", ["G", "A#", "D"], [3, 5, 5, 3, 3, 3], [1, 3, 4, 1, 1, 1], {
    baseFret: 3,
    barre: { fret: 3, from: 6, to: 1, finger: 1 },
  }),

  // power chords
  e5: chord("e5", "E5", "E power chord", "Mi năm (power)", "power", "E", ["E", "B"], [0, 2, 2, x, x, x], [_, 2, 3, _, _, _]),
  a5: chord("a5", "A5", "A power chord", "La năm (power)", "power", "A", ["A", "E"], [x, 0, 2, 2, x, x], [_, _, 2, 3, _, _]),
  d5: chord("d5", "D5", "D power chord", "Rê năm (power)", "power", "D", ["D", "A"], [x, x, 0, 2, 3, x], [_, _, _, 1, 3, _]),
  g5: chord("g5", "G5", "G power chord", "Son năm (power)", "power", "G", ["G", "D"], [3, 5, 5, x, x, x], [1, 3, 4, _, _, _], { baseFret: 3 }),
  c5: chord("c5", "C5", "C power chord", "Đô năm (power)", "power", "C", ["C", "G"], [x, 3, 5, 5, x, x], [_, 1, 3, 4, _, _], { baseFret: 3 }),
} satisfies Record<string, ChordShape>;

export type ChordId = keyof typeof CHORDS;

export const CHORD_IDS = Object.keys(CHORDS) as ChordId[];

/** Chords that have a lesson; the others can be practised from their diagram. */
export const CHORDS_WITH_LESSON: ChordId[] = ["em", "am", "e", "a", "d"];

/** Chord groups for pickers. A chord can be in several groups. The first group matters most to beginners. */
export const CHORD_CATEGORIES: { id: string; title: string; hint: string; chords: ChordId[] }[] = [
  { id: "beginner", title: "Cho người mới", hint: "8 hợp âm phổ biến nhất, không cần chặn", chords: ["em", "am", "e", "a", "d", "c", "g", "dm"] },
  { id: "major", title: "Trưởng", hint: "Nghe sáng, vui", chords: ["c", "d", "e", "g", "a", "f"] },
  { id: "minor", title: "Thứ", hint: "Nghe trầm, buồn", chords: ["am", "dm", "em", "bm", "fsm"] },
  { id: "seventh", title: "Bảy (7)", hint: "Hay dùng để dẫn sang hợp âm kế tiếp", chords: ["a7", "b7", "c7", "d7", "e7", "g7"] },
  { id: "seventh-color", title: "Bảy thứ / bảy trưởng", hint: "Màu tiếng mềm, hay gặp trong ballad", chords: ["am7", "dm7", "em7", "cmaj7", "dmaj7", "fmaj7"] },
  { id: "sus", title: "Sus", hint: "Lửng lơ, chờ quay về hợp âm gốc", chords: ["asus2", "asus4", "dsus2", "dsus4", "esus4"] },
  { id: "barre", title: "Chặn (barre)", hint: "Ngón 1 đè nhiều dây cùng lúc, khó hơn", chords: ["f", "fm", "bm", "b", "bb", "fsm", "csm", "gm"] },
  { id: "power", title: "Power chord (5)", hint: "Chỉ 2 nốt, hay dùng cho rock", chords: ["e5", "a5", "d5", "g5", "c5"] },
];

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
