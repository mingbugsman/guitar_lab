import { CHORDS, soundingMidi, type ChordId } from "@/lib/music/chords";
import type { StringNumber } from "@/lib/music/guitar";

/**
 * Strumming patterns: two slots per beat, so 8 slots = a 4/4 bar ("1 và 2 và 3 và 4 và") and
 * 6 slots = a 3/4 bar ("1 và 2 và 3 và"). The meter comes from the pattern's length.
 * The strumming hand never stops: it goes down on every number and up on every "và". A pattern
 * only says on which of those moves the pick touches the strings:
 *   "D" = down stroke, toward the floor, string 6 → 1 (only on a number)
 *   "U" = up stroke, toward your face (only on "và")
 *   "-" = the hand still moves, but passes over the strings without touching them
 */
export type Stroke = "D" | "U" | "-";

/** Beats per bar: 4 for an 8-slot pattern (4/4), 3 for a 6-slot one (3/4). */
export const beatsOf = (strokes: Stroke[]) => strokes.length / 2;

export type StrumPreset = { id: string; name: string; strokes: Stroke[] };

const p = (s: string) => s.split("") as Stroke[];

export const STRUM_PRESETS = {
  quarters: { id: "quarters", name: "Bốn cú xuống", strokes: p("D-D-D-D-") },
  eighths: { id: "eighths", name: "Xuống lên đều", strokes: p("DUDUDUDU") },
  downDownUp: { id: "downDownUp", name: "Xuống, xuống lên", strokes: p("D-DUD-DU") },
  folk: { id: "folk", name: "Mẫu gảy đầu tiên", strokes: p("D-DU-UDU") },
  waltzDowns: { id: "waltzDowns", name: "Ba cú xuống", strokes: p("D-D-D-") },
  waltz: { id: "waltz", name: "Xuống, xuống lên, xuống lên", strokes: p("D-DUDU") },
} satisfies Record<string, StrumPreset>;

/** The hand's move in this slot: down on the numbers, up on "và". */
export function handMove(slot: number): "down" | "up" {
  return slot % 2 === 0 ? "down" : "up";
}

/** "1", "và", "2", "và"… */
export function countLabel(slot: number, beats = 4): string {
  return slot % 2 === 0 ? String(Math.floor(slot / 2) % beats + 1) : "và";
}

/** Problems with a pattern; empty when it can be played with a steady hand. */
export function patternProblems(strokes: Stroke[]): string[] {
  const out: string[] = [];
  if (strokes.length !== 6 && strokes.length !== 8) out.push(`cần 6 ô (3/4) hoặc 8 ô (4/4), có ${strokes.length}`);
  strokes.forEach((s, i) => {
    if (s === "D" && handMove(i) !== "down") out.push(`ô ${i + 1}: gảy xuống rơi vào chữ 'và'`);
    if (s === "U" && handMove(i) !== "up") out.push(`ô ${i + 1}: gảy lên rơi vào số`);
  });
  if (!strokes.includes("D")) out.push("không có cú gảy xuống nào");
  return out;
}

export type StrumEvent =
  /** A metronome click; `beat` counts quarter notes from the very start. */
  | { kind: "click"; beat: number; accent: boolean; countIn: boolean }
  /** A slot of the pattern; `stroke` "-" means the hand moves but makes no sound. */
  | { kind: "slot"; beat: number; bar: number; slot: number; stroke: Stroke; chord: ChordId };

/**
 * Everything to schedule for one pass: `countIn` clicks first, then one bar per chord.
 * A player loops the part after the count-in (from `countIn` to `countIn + chords.length * beats`).
 */
export function strumTimeline(strokes: Stroke[], chords: ChordId[], countIn = beatsOf(strokes)): StrumEvent[] {
  const beats = beatsOf(strokes);
  const out: StrumEvent[] = [];
  for (let b = 0; b < countIn; b++) out.push({ kind: "click", beat: b, accent: b === 0, countIn: true });
  chords.forEach((chord, bar) => {
    const start = countIn + bar * beats;
    for (let b = 0; b < beats; b++) out.push({ kind: "click", beat: start + b, accent: b === 0, countIn: false });
    strokes.forEach((stroke, slot) => out.push({ kind: "slot", beat: start + slot / 2, bar, slot, stroke, chord }));
  });
  return out;
}

/**
 * The notes a stroke sounds, in the order the pick meets them. A down stroke crosses every
 * string the chord uses, from the thickest. An up stroke is lighter and catches only the
 * thinnest strings (about four), from string 1 upward, as a real up stroke does.
 */
export function strokeNotes(chord: ChordId, direction: "down" | "up"): { string: StringNumber; fret: number }[] {
  const shape = CHORDS[chord];
  const notes = soundingMidi(shape).map((n) => ({ string: n.string, fret: shape.frets[n.string] as number }));
  return direction === "down" ? notes : notes.slice(-4).reverse();
}
