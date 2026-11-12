import { describe, expect, it } from "vitest";
import { pickPosition } from "./strum-motion";

describe("strum pick motion", () => {
  it("a down stroke travels from the top row (string 6) to the bottom row", () => {
    expect(pickPosition(["D", "U"], 0, 0).y).toBe(0);
    expect(pickPosition(["D", "U"], 0, 0.3).y).toBe(1);
  });

  it("an up stroke travels from the bottom row to the top", () => {
    expect(pickPosition(["D", "U"], 1, 0).y).toBe(1);
    expect(pickPosition(["D", "U"], 1, 0.3).y).toBe(0);
  });

  it("down, down: the hand returns through the air, shown as a ghost", () => {
    const back = pickPosition(["D", "D"], 0, 0.75);
    expect(back.ghost).toBe(true);
    expect(back.y).toBeGreaterThan(0);
    expect(back.y).toBeLessThan(1);
    expect(pickPosition(["D", "D"], 0, 0.999).y).toBeCloseTo(0, 2);
  });

  it("down, up: no ghost return, the next stroke starts where this one ended", () => {
    expect(pickPosition(["D", "U"], 0, 0.9)).toEqual({ y: 1, ghost: false });
  });
});
