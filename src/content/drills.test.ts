import { describe, expect, it } from "vitest";
import { buildTimeline, fretFor, roundsToTarget, tempoForRound, validateSequence } from "@/lib/practice/sequence";
import { LESSONS } from "./curriculum";
import { FINGER_DRILLS, getDrill } from "./drills";

describe("practice engine: tempo goes from slow to fast", () => {
  const t = { start: 40, target: 60, step: 5, roundsPerStep: 2 };
  it("raises the tempo every few rounds and stops at the target", () => {
    expect([0, 1, 2, 3, 4, 7, 8, 30].map((r) => tempoForRound(t, r))).toEqual([40, 40, 45, 45, 50, 55, 60, 60]);
    expect(roundsToTarget(t)).toBe(8);
  });
  it("keeps a held tempo", () => {
    expect(tempoForRound(t, 20, 45)).toBe(45);
  });
});

describe("practice engine: timeline", () => {
  it("counts in one bar, then clicks every beat and places every step after the count-in", () => {
    const seq = getDrill("spider-1234")!.sequence;
    const tl = buildTimeline(seq, 4);
    const clicks = tl.filter((e) => e.type === "click");
    expect(clicks).toHaveLength(4 + seq.beats);
    expect(clicks.filter((c) => c.type === "click" && c.countIn)).toHaveLength(4);
    const steps = tl.filter((e) => e.type === "step");
    expect(steps).toHaveLength(seq.steps.length);
    expect(steps[0].beat).toBe(4);
    expect(tl.map((e) => e.beat)).toEqual([...tl.map((e) => e.beat)].sort((a, b) => a - b));
  });
});

describe("finger drills", () => {
  it("ships at least 12 drills with unique ids", () => {
    expect(FINGER_DRILLS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(FINGER_DRILLS.map((d) => d.id)).size).toBe(FINGER_DRILLS.length);
    for (const d of FINGER_DRILLS) expect(d.id).toMatch(/^[a-z0-9-]{1,40}$/);
  });

  for (const d of FINGER_DRILLS) {
    it(`${d.id}: valid sequence, sensible tempo, unlocked by a real lesson`, () => {
      expect(validateSequence(d.sequence)).toEqual([]);
      expect(d.tempo.start).toBeLessThan(d.tempo.target);
      expect(d.tempo.start).toBeGreaterThanOrEqual(30);
      expect(d.sequence.beats % 4).toBe(0);
      expect(LESSONS.some((l) => l.slug === d.unlockAfter)).toBe(true);
      expect(d.howTo.length).toBeGreaterThanOrEqual(2);
      expect(d.howTo.length).toBeLessThanOrEqual(4);
      // every fretted note follows "finger n at fret startFret + n − 1": fingers and frets rise together
      for (const s of d.sequence.steps) for (const h of s.hits) if (typeof h.finger === "number") expect(h.fret).toBeGreaterThanOrEqual(h.finger);
      // the board drawn is wide enough for every note
      for (const s of d.sequence.steps) for (const h of s.hits) expect(h.fret).toBeLessThanOrEqual(d.frets);
    });
  }

  it("spider 1-2-3-4 walks string 6 to string 1 with one finger per fret", () => {
    const steps = getDrill("spider-1234")!.sequence.steps;
    expect(steps).toHaveLength(24);
    expect(steps.slice(0, 4).map((s) => [s.hits[0].string, s.hits[0].fret, s.hits[0].finger])).toEqual([
      [6, 1, 1],
      [6, 2, 2],
      [6, 3, 3],
      [6, 4, 4],
    ]);
    expect(steps[23].hits[0]).toMatchObject({ string: 1, fret: 4, finger: 4 });
    expect(fretFor(3, 2)).toBe(4);
  });

  it("the hold drill keeps earlier fingers down on the same string only", () => {
    const steps = getDrill("spider-hold")!.sequence.steps;
    expect(steps[3].hold?.map((h) => h.finger)).toEqual([1, 2, 3]);
    expect(steps[4].hold).toBeUndefined(); // new string: everything lifted
    expect(steps[3].caption).toContain("vẫn giữ");
  });

  it("alternate picking marks down and up strokes in turn", () => {
    const steps = getDrill("alternate")!.sequence.steps;
    expect(steps.slice(0, 4).map((s) => s.action)).toEqual(["pick-down", "pick-up", "pick-down", "pick-up"]);
  });

  it("speaks to the learner in the same voice as lessons", () => {
    for (const d of FINGER_DRILLS) {
      const text = [d.title, d.goal, ...d.howTo, d.body].join(" ");
      expect(text, d.id).not.toMatch(/(?<![\p{L}])(chúng ta|ta)(?![\p{L}])|\bclick\b|metronome/iu);
      expect(d.body, d.id).toMatch(/bình thường/);
      expect(d.body, d.id).toMatch(/Dừng/);
    }
  });
});
