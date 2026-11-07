import type { ChordShape } from "@/lib/music/chords";
import { STRING_NUMBERS_LOW_TO_HIGH } from "@/lib/music/guitar";
import type { FretMarker } from "./fretboard";

/** Fretboard markers for a chord shape (server-safe; no client hooks). */
export function chordMarkersStatic(chord: ChordShape): FretMarker[] {
  return STRING_NUMBERS_LOW_TO_HIGH.map((s) => ({ string: s, fret: chord.frets[s], finger: chord.fingers[s] }));
}
