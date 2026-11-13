// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { midiAt, type StringNumber } from "@/lib/music/guitar";
import { midiToFrequency } from "@/lib/music/notes";

/**
 * The string model in public/audio/guitar-string-worklet.js, measured like a real guitar tone:
 * pitch against equal temperament, and how fast each partial dies against Jansson's
 * measurement of E3 on string 6 (KTH, "Acoustics for violin and guitar makers", ch. 6).
 */
type Strings = {
  add(ev: { frame: number; string: number; freq: number; velocity?: number; fretted?: boolean; t0?: number }): void;
  render(out: Float32Array, start: number): Float32Array;
};
let GuitarStrings: new (fs: number) => Strings;

beforeAll(async () => {
  // @ts-expect-error plain JS worklet file, exposes its DSP class on globalThis outside a worklet
  await import("../../../public/audio/guitar-string-worklet.js");
  GuitarStrings = (globalThis as unknown as { GLGuitarStrings: typeof GuitarStrings }).GLGuitarStrings;
});

function pluck(fs: number, string: StringNumber, fret: number, seconds: number, t0?: number) {
  const g = new GuitarStrings(fs);
  g.add({ frame: 0, string, freq: midiToFrequency(midiAt(string, fret)), velocity: 0.8, fretted: fret > 0, t0 });
  return g.render(new Float32Array(Math.round(fs * seconds)), 0);
}

/** Amplitude of the component at `f` Hz in a Hann-windowed slice. */
function amp(x: Float32Array, fs: number, f: number, from: number, len: number) {
  let re = 0;
  let im = 0;
  for (let i = 0; i < len; i++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (len - 1));
    const ph = (2 * Math.PI * f * (from + i)) / fs;
    re += x[from + i] * w * Math.cos(ph);
    im += x[from + i] * w * Math.sin(ph);
  }
  return Math.hypot(re, im) / len;
}

const db = (v: number) => 20 * Math.log10(v + 1e-12);

/** Measured pitch in cents from `f0`: peak of the spectrum, searched to 0.01 cent. */
function cents(x: Float32Array, fs: number, f0: number) {
  const from = Math.round(0.1 * fs);
  const len = Math.round(0.3 * fs);
  const at = (c: number) => amp(x, fs, f0 * 2 ** (c / 1200), from, len);
  let lo = -40;
  let hi = 40;
  for (let k = 0; k < 60; k++) {
    const a = lo + (hi - lo) / 3;
    const b = hi - (hi - lo) / 3;
    if (at(a) < at(b)) lo = a;
    else hi = b;
  }
  return (lo + hi) / 2;
}

function level(x: Float32Array, fs: number, t: number) {
  const a = Math.round(t * fs);
  const n = Math.round(0.05 * fs);
  let e = 0;
  for (let i = a; i < a + n; i++) e += x[i] * x[i];
  return db(Math.sqrt(e / n));
}

describe("guitar string voice", { timeout: 60_000 }, () => {
  it.each([44100, 48000])("every string and fret is in tune to within 1 cent at %i Hz", (fs) => {
    for (const s of [6, 5, 4, 3, 2, 1] as StringNumber[]) {
      for (const fret of [0, 1, 5, 7, 12]) {
        const x = pluck(fs, s, fret, 0.45);
        expect(Math.abs(cents(x, fs, midiToFrequency(midiAt(s, fret)))), `string ${s} fret ${fret}`).toBeLessThan(1);
      }
    }
  });

  it("high partials die faster than low ones, close to Jansson's E3 measurement", () => {
    const fs = 48000;
    const f0 = midiToFrequency(midiAt(6, 12));
    const x = pluck(fs, 6, 12, 0.5);
    const len = Math.round(0.08 * fs);
    const drop = (k: number) => db(amp(x, fs, k * f0, Math.round(0.03 * fs), len)) - db(amp(x, fs, k * f0, Math.round(0.23 * fs), len));
    const mean = (ks: number[]) => ks.reduce((t, k) => t + drop(k), 0) / ks.length;
    const low = mean([1, 2, 3, 4]);
    const mid = mean([7, 8, 9, 10]);
    const high = mean([12, 13, 14]);
    // Jansson: ~3, ~10 and ~15 dB in 0.2 s
    expect(low).toBeGreaterThan(2);
    expect(low).toBeLessThan(6);
    expect(mid).toBeGreaterThan(6);
    expect(mid).toBeLessThan(13);
    expect(high).toBeGreaterThan(11);
    expect(high).toBeLessThan(20);
  });

  it("the pluck point leaves a gap around the 11th partial, as on a real guitar", () => {
    const fs = 48000;
    const f0 = midiToFrequency(midiAt(6, 12));
    const x = pluck(fs, 6, 12, 0.2);
    const a = (k: number) => db(amp(x, fs, k * f0, Math.round(0.02 * fs), Math.round(0.1 * fs)));
    // the pluck point moves a little each time (a hand is not a machine): the gap lands on 10, 11 or 12
    const gap = Math.min(a(10), a(11), a(12));
    expect(gap).toBeLessThan(Math.min(a(9), a(13)) - 4);
  });

  it("a clean note still rings 2 seconds later, as the sound samples promise", () => {
    const fs = 44100;
    const x = pluck(fs, 2, 1, 2.2);
    expect(level(x, fs, 2) - level(x, fs, 0.02)).toBeGreaterThan(-40);
  });

  it("a muted note is gone within a third of a second", () => {
    const fs = 44100;
    const x = pluck(fs, 2, 1, 0.4, 0.08);
    expect(level(x, fs, 0.3) - level(x, fs, 0.02)).toBeLessThan(-40);
  });

  it("plucks land on the scheduled sample frame", () => {
    const fs = 44100;
    const g = new GuitarStrings(fs);
    g.add({ frame: 1000, string: 1, freq: 329.63 });
    const x = g.render(new Float32Array(2000), 0);
    expect(x.slice(0, 1000).every((v) => v === 0)).toBe(true);
    expect(x.slice(1000, 1200).some((v) => v !== 0)).toBe(true);
  });
});
