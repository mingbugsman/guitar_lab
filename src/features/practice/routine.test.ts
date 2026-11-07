import { describe, expect, it } from "vitest";
import { DAILY_30, routineForGoal } from "./routine";

const total = (r: { minutes: number }[]) => r.reduce((s, a) => s + a.minutes, 0);

describe("daily routine", () => {
  it("matches the roadmap 30-minute plan", () => {
    expect(DAILY_30.map((a) => [a.kind, a.minutes])).toEqual([
      ["recall", 4],
      ["theory", 5],
      ["technical", 8],
      ["application", 8],
      ["free_play", 3],
      ["reflection", 2],
    ]);
    expect(total(DAILY_30)).toBe(30);
  });

  it.each([10, 15, 20, 45, 60, 90, 120])("scales to a %i-minute goal exactly", (goal) => {
    const r = routineForGoal(goal);
    expect(total(r)).toBe(goal);
    expect(r.every((a) => a.minutes >= 1)).toBe(true);
  });
});
