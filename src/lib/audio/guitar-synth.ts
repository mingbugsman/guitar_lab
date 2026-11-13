"use client";

import { midiAt, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "@/lib/music/guitar";
import { soundingMidi, type ChordShape } from "@/lib/music/chords";
import { midiToFrequency } from "@/lib/music/notes";
import { getTone } from "./tone";

type ToneNS = typeof import("tone");

/** Outside the middleware matcher (`audio/`), so it is served as a plain static file. */
const WORKLET_URL = "/audio/guitar-string-worklet.js";

export type PluckOptions = {
  /** 0..1: louder is also brighter. */
  velocity?: number;
  /** Flesh lies on the string: a dull "bụp" that stops at once. */
  mute?: boolean;
  /** 0..1: the string slaps a fret while it swings wide, a rattle over the ringing note. */
  buzz?: number;
};

type Pluck = (string: StringNumber, fret: number, time: number, opts?: PluckOptions) => void;

let guitar: Promise<{ Tone: ToneNS; pluck: Pluck }> | null = null;

/**
 * The guitar body after the strings. An acoustic guitar is loud and warm because the top plate
 * and the air inside resonate: the air mode near 100 Hz (broad), the first top-plate mode near
 * 200 Hz and a third resonance near 400 Hz that listeners rate most important (Jansson, KTH
 * "Acoustics for violin and guitar makers" ch. 6; Meyer's 15-guitar study). Above ~4 kHz there
 * is only pick noise, so the top is softened a little. A short room reverb at the end.
 */
async function buildBody(Tone: ToneNS) {
  const out = new Tone.Volume(-4).toDestination();
  const room = new Tone.Reverb({ decay: 1.3, preDelay: 0.01, wet: 0.14 }).connect(out);
  await room.ready;
  const air = new Tone.Filter({ type: "peaking", frequency: 100, Q: 1.2, gain: 5 });
  const top = new Tone.Filter({ type: "peaking", frequency: 205, Q: 2.5, gain: 3.5 });
  const t3 = new Tone.Filter({ type: "peaking", frequency: 400, Q: 3, gain: 2.5 });
  const soft = new Tone.Filter({ type: "highshelf", frequency: 4500, gain: -5 });
  air.chain(top, t3, soft, room);
  return air;
}

async function buildWorklet(Tone: ToneNS): Promise<Pluck> {
  const ctx = Tone.getContext();
  const raw = ctx.rawContext as unknown as { audioWorklet?: { addModule(url: string): Promise<void> } };
  if (!raw.audioWorklet) throw new Error("AudioWorklet unavailable");
  // not ctx.addAudioWorkletModule: Tone caches one module promise for its own processors
  await raw.audioWorklet.addModule(WORKLET_URL);
  const node = ctx.createAudioWorkletNode("gl-guitar", { numberOfInputs: 0, outputChannelCount: [1] });
  Tone.connect(node, await buildBody(Tone));
  return (string, fret, time, opts = {}) =>
    node.port.postMessage({
      type: "pluck",
      string,
      freq: midiToFrequency(midiAt(string, fret)),
      time,
      velocity: opts.velocity ?? 0.8,
      fretted: fret > 0,
      mute: opts.mute,
      buzz: opts.buzz,
    });
}

/** Older browsers without AudioWorklet: Tone's PluckSynth, one voice per string. */
function buildFallback(Tone: ToneNS): Pluck {
  const out = new Tone.Volume(-6).toDestination();
  const voices = new Map(
    STRING_NUMBERS_LOW_TO_HIGH.map((s) => [s, new Tone.PluckSynth({ attackNoise: 1.2, dampening: 3600, resonance: 0.96 }).connect(out)]),
  );
  return (string, fret, time) => voices.get(string)!.triggerAttack(midiToFrequency(midiAt(string, fret)), time);
}

async function getVoice() {
  const Tone = await getTone();
  if (!guitar) {
    guitar = buildWorklet(Tone)
      .catch(() => buildFallback(Tone))
      .then((pluck) => ({ Tone, pluck }));
  }
  return guitar;
}

/** For schedulers (the practice engine): pluck `string` at `fret` exactly at audio time `time`. */
export async function getGuitar() {
  return getVoice();
}

export async function playString(string: StringNumber, fret = 0, opts?: PluckOptions) {
  const { Tone, pluck } = await getVoice();
  pluck(string, fret, Tone.now(), opts);
}

/**
 * Strum a chord. "down" = pick moves toward the floor: string 6 → string 1.
 * "up" = toward your face: string 1 → string 6, a little lighter, as an upstroke is.
 * ~15 ms between strings: a whole strum takes well under a tenth of a second.
 */
export async function strumChord(chord: ChordShape, direction: "down" | "up" = "down", spreadMs = 15) {
  const { Tone, pluck } = await getVoice();
  const notes = soundingMidi(chord);
  const ordered = direction === "down" ? notes : [...notes].reverse();
  const now = Tone.now();
  const velocity = direction === "down" ? 0.85 : 0.65;
  ordered.forEach((n, i) => {
    const fret = n.midi - midiAt(n.string, 0);
    pluck(n.string, fret, now + (i * spreadMs) / 1000, { velocity: velocity - i * 0.02 });
  });
}

/** Play the chord one string at a time (arpeggio) so learners hear every string ring. */
export async function arpeggiateChord(chord: ChordShape, gapMs = 320) {
  const { Tone, pluck } = await getVoice();
  const now = Tone.now();
  soundingMidi(chord).forEach((n, i) => {
    pluck(n.string, n.midi - midiAt(n.string, 0), now + (i * gapMs) / 1000, { velocity: 0.75 });
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
