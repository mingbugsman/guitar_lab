import { describe, expect, it } from "vitest";
import { createStrumDetector } from "./strum-detector";

/** A strum: a jump to `peak`, then the chord ringing and decaying for `ringMs`. */
function strum(peak: number, ringMs = 600, stepMs = 16): number[] {
  const out: number[] = [];
  for (let t = 0; t < ringMs; t += stepMs) out.push(peak * Math.exp(-t / 250));
  return out;
}

function run(levels: number[], stepMs = 16, noise = 0.004) {
  const d = createStrumDetector();
  for (let i = 0; i < 30; i++) d.calibrate(noise);
  let count = 0;
  levels.forEach((l, i) => {
    if (d.push(l, i * stepMs)) count++;
  });
  return count;
}

describe("strum detector", () => {
  it("counts each strum once, even though the chord keeps ringing", () => {
    const quiet = Array(20).fill(0.004);
    expect(run([...quiet, ...strum(0.3), ...quiet, ...strum(0.25), ...strum(0.28)])).toBe(3);
  });

  it("ignores room noise and soft taps on the guitar body", () => {
    const noisy = Array.from({ length: 200 }, (_, i) => 0.004 + (i % 7) * 0.001);
    expect(run([...noisy, 0.012, ...noisy])).toBe(0);
  });

  it("does not double-count one strum that has two quick peaks (pick hitting strings one by one)", () => {
    const quiet = Array(20).fill(0.004);
    expect(run([...quiet, 0.2, 0.1, 0.35, ...strum(0.3)])).toBe(1);
  });

  it("works in a noisier room once it has heard the background", () => {
    const room = Array(20).fill(0.02);
    const d = createStrumDetector();
    for (let i = 0; i < 30; i++) d.calibrate(0.02);
    let count = 0;
    [...room, ...strum(0.3), ...room, ...strum(0.3)].forEach((l, i) => {
      if (d.push(l, i * 16)) count++;
    });
    expect(count).toBe(2);
    // the 0.05 hum of a fan would be a strum in a silent room, but not here
    expect(d.push(0.05, 100_000)).toBe(false);
  });
});
