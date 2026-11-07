"use client";

import { midiAt, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "@/lib/music/guitar";
import { soundingMidi, type ChordShape } from "@/lib/music/chords";
import { midiToFrequency } from "@/lib/music/notes";
import { getTone } from "./tone";

type PluckSynth = import("tone").PluckSynth;
let voices: Map<StringNumber, PluckSynth> | null = null;

/** One Karplus-Strong voice per string, like a real guitar (a string can only ring once). */
async function getVoices() {
  const Tone = await getTone();
  if (!voices) {
    voices = new Map();
    const out = new Tone.Volume(-6).toDestination();
    for (const s of STRING_NUMBERS_LOW_TO_HIGH) {
      voices.set(s, new Tone.PluckSynth({ attackNoise: 1.2, dampening: 3600, resonance: 0.96 }).connect(out));
    }
  }
  return { Tone, voices };
}

export async function playString(string: StringNumber, fret = 0) {
  const { Tone, voices } = await getVoices();
  voices.get(string)!.triggerAttack(midiToFrequency(midiAt(string, fret)), Tone.now());
}

/**
 * Strum a chord. "down" = pick moves toward the floor: string 6 → string 1.
 * "up" = toward your face: string 1 → string 6.
 */
export async function strumChord(chord: ChordShape, direction: "down" | "up" = "down", spreadMs = 35) {
  const { Tone, voices } = await getVoices();
  const notes = soundingMidi(chord);
  const ordered = direction === "down" ? notes : [...notes].reverse();
  const now = Tone.now();
  ordered.forEach((n, i) => {
    voices.get(n.string)!.triggerAttack(midiToFrequency(n.midi), now + (i * spreadMs) / 1000);
  });
}

/** Play the chord one string at a time (arpeggio) so learners hear every string ring. */
export async function arpeggiateChord(chord: ChordShape, gapMs = 320) {
  const { Tone, voices } = await getVoices();
  const now = Tone.now();
  soundingMidi(chord).forEach((n, i) => {
    voices.get(n.string)!.triggerAttack(midiToFrequency(n.midi), now + (i * gapMs) / 1000);
  });
}

/** Play a sustained reference tone (used by the tuner "listen" button). */
export async function playReference(frequency: number, seconds = 1.6) {
  const Tone = await getTone();
  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.6 },
  }).toDestination();
  synth.volume.value = -10;
  synth.triggerAttackRelease(frequency, seconds);
  setTimeout(() => synth.dispose(), (seconds + 1) * 1000);
}
