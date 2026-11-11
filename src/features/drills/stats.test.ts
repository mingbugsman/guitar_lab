import { describe, expect, it } from "vitest";
import { suggestedStart, summarizeDrills } from "./stats";

describe("drill stats", () => {
  const rows = [
    { drill_id: "spider-1234", bpm_reached: 60, rating: "clean" as const, created_at: "2026-11-10T10:00:00Z" },
    { drill_id: "spider-1234", bpm_reached: 75, rating: "lost" as const, created_at: "2026-11-11T10:00:00Z" },
    { drill_id: "spider-1234", bpm_reached: 55, rating: "clean" as const, created_at: "2026-11-09T10:00:00Z" },
  ];
  it("keeps the fastest clean tempo and the latest run", () => {
    const s = summarizeDrills(rows)["spider-1234"];
    expect(s.bestClean).toBe(60);
    expect(s.last).toMatchObject({ bpm: 75, rating: "lost" });
    expect(s.runs).toBe(3);
  });
  it("suggests where to start next time, inside the drill's range", () => {
    const s = summarizeDrills(rows)["spider-1234"];
    expect(suggestedStart(40, 90, s)).toBe(65); // lost at 75 → 10 slower
    expect(suggestedStart(40, 90, { bestClean: 85, last: { bpm: 90, rating: "clean", at: "" }, runs: 1 })).toBe(90);
    expect(suggestedStart(40, 90, undefined)).toBe(40);
  });
});
