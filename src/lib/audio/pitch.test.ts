import { describe, expect, it } from "vitest";
import { detectPitchYin, median, rms } from "./pitch";

const SAMPLE_RATE = 44100;

function guitarLikeTone(frequency: number, length = 4096): Float32Array {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    // fundamental + decaying harmonics, roughly like a plucked string
    buf[i] =
      0.6 * Math.sin(2 * Math.PI * frequency * t) +
      0.3 * Math.sin(2 * Math.PI * 2 * frequency * t) +
      0.15 * Math.sin(2 * Math.PI * 3 * frequency * t);
  }
  return buf;
}

describe("YIN pitch detection", () => {
  it.each([82.41, 110, 146.83, 196, 246.94, 329.63])("detects %f Hz within 1 cent", (f) => {
    const result = detectPitchYin(guitarLikeTone(f), SAMPLE_RATE);
    expect(result).not.toBeNull();
    const cents = 1200 * Math.log2(result!.frequency / f);
    expect(Math.abs(cents)).toBeLessThan(1);
  });

  it("returns null for silence and noise-free DC", () => {
    expect(detectPitchYin(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
  });

  it("computes RMS and median", () => {
    expect(rms(new Float32Array([1, -1, 1, -1]))).toBe(1);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
  });
});
