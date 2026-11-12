import { describe, expect, it } from "vitest";
import { neighbourString, SAMPLE_KINDS } from "./sound-samples";

describe("sound samples", () => {
  it("has the clean sound and the three beginner faults", () => {
    expect(SAMPLE_KINDS).toEqual(["clean", "buzz", "muted", "extra"]);
  });

  it("the touched neighbour is the next thinner string, or string 2 for string 1", () => {
    expect(neighbourString(6)).toBe(5);
    expect(neighbourString(2)).toBe(1);
    expect(neighbourString(1)).toBe(2);
  });
});
