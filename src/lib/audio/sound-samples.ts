"use client";

import { midiAt, type StringNumber } from "@/lib/music/guitar";
import { midiToFrequency } from "@/lib/music/notes";
import { playString } from "./guitar-synth";
import { getTone } from "./tone";

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
  const freq = midiToFrequency(midiAt(string, fret));
  if (kind === "clean") return playString(string, fret);
  if (kind === "extra") {
    await playString(string, fret);
    setTimeout(() => void playString(neighbourString(string), 0), 40);
    return;
  }
  const Tone = await getTone();
  const now = Tone.now();
  if (kind === "muted") {
    // a dead "thup": almost no resonance, the string stops at once
    const out = new Tone.Volume(-4).toDestination();
    const p = new Tone.PluckSynth({ attackNoise: 2, dampening: 900, resonance: 0.55 }).connect(out);
    p.triggerAttack(freq, now);
    setTimeout(() => (p.dispose(), out.dispose()), 1500);
    return;
  }
  // buzz: the note rings, with a rattle from the string slapping the fret mixed in
  await playString(string, fret);
  const out = new Tone.Volume(-20).toDestination();
  const shake = new Tone.Tremolo(38, 1).connect(out).start();
  const air = new Tone.Filter(1800, "highpass").connect(shake);
  const rattle = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.002, decay: 0.9, sustain: 0, release: 0.1 },
  }).connect(air);
  rattle.triggerAttackRelease(freq, 0.9, now);
  setTimeout(() => (rattle.dispose(), air.dispose(), shake.dispose(), out.dispose()), 2000);
}
