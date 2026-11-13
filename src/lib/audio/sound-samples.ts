"use client";

import type { StringNumber } from "@/lib/music/guitar";
import { playString } from "./guitar-synth";

/**
 * Example sounds of the three beginner faults (docx/WRITING_GUIDE.md §8), made by the synth so
 * the learner knows what to listen for: clean, buzzing, muted, and a neighbour string touched.
 * They are synthetic: the learner compares how the note rings, not the colour of the sound.
 */
export type SampleKind = "clean" | "buzz" | "muted" | "extra";

export const SAMPLE_KINDS: SampleKind[] = ["clean", "buzz", "muted", "extra"];

/** The neighbour a careless pick also hits: the next thinner string (or thicker for string 1). */
export function neighbourString(string: StringNumber): StringNumber {
  return (string === 1 ? 2 : string - 1) as StringNumber;
}

export async function playSample(kind: SampleKind, string: StringNumber, fret: number) {
  if (kind === "clean") return playString(string, fret);
  if (kind === "extra") {
    await playString(string, fret);
    setTimeout(() => void playString(neighbourString(string), 0), 40);
    return;
  }
  // a dead "bụp": flesh on the string, no ring, no brightness
  if (kind === "muted") return playString(string, fret, { mute: true, velocity: 0.75 });
  // the note rings on, with the string rattling against a fret while it swings wide
  return playString(string, fret, { buzz: 0.7 });
}
