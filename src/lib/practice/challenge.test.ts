import { describe, expect, it } from "vitest";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import {
  buildChallenge,
  CHALLENGE_PRESETS,
  challengeId,
  chordOrder,
  itemAtBeat,
  normalizeSettings,
  secondsAtBeat,
  seededRandom,
  stageTempos,
  suggestChallenge,
  type ChallengeSettings,
} from "./challenge";

const base: ChallengeSettings = { chords: ["em", "am", "d", "g"], minutes: 3, startBpm: 50, endBpm: 80, beatsPerChord: 4, stages: 4 };

describe("chord challenge", () => {
  it("never repeats a chord twice in a row, and spreads chords evenly", () => {
    for (const chords of [["em", "am"], ["em", "am", "d", "g"], ["c", "g", "am", "f", "dm", "e7", "a"]] as ChordId[][]) {
      for (let seed = 1; seed < 40; seed++) {
        const order = chordOrder(chords, 50, seededRandom(seed));
        for (let i = 1; i < order.length; i++) expect(order[i]).not.toBe(order[i - 1]);
        const counts = chords.map((c) => order.filter((o) => o === c).length);
        expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
      }
    }
  });

  it("is random but repeatable: same seed same order, different seed different order", () => {
    const a = buildChallenge(base, 7).items.map((i) => i.chord).join();
    expect(buildChallenge(base, 7).items.map((i) => i.chord).join()).toBe(a);
    expect(buildChallenge(base, 8).items.map((i) => i.chord).join()).not.toBe(a);
  });

  it("speeds up stage by stage and lasts about the chosen time", () => {
    expect(stageTempos(50, 80, 4)).toEqual([50, 60, 70, 80]);
    const plan = buildChallenge(base, 1);
    expect(plan.stages.map((s) => s.bpm)).toEqual([50, 60, 70, 80]);
    expect(Math.abs(plan.totalSeconds - 180)).toBeLessThan(15);
    // stages are back to back, chords fill each stage exactly
    for (let i = 1; i < plan.stages.length; i++) expect(plan.stages[i].startBeat).toBe(plan.stages[i - 1].startBeat + plan.stages[i - 1].beats);
    expect(plan.items.at(-1)!.startBeat + plan.items.at(-1)!.beats).toBe(plan.totalBeats);
  });

  it("knows which chord is on the line and how much time has passed at any beat", () => {
    const plan = buildChallenge(base, 1);
    expect(itemAtBeat(plan, -1)).toBe(-1);
    expect(itemAtBeat(plan, 0)).toBe(0);
    expect(itemAtBeat(plan, 3.9)).toBe(0);
    expect(itemAtBeat(plan, 4)).toBe(1);
    expect(secondsAtBeat(plan, 4)).toBeCloseTo((4 * 60) / 50);
    expect(secondsAtBeat(plan, plan.totalBeats)).toBeCloseTo(plan.totalSeconds);
  });

  it("suggests slower, longer chords for barre or not-yet-learned chords", () => {
    const easy = suggestChallenge(["em", "am", "d", "a"], null);
    expect(easy.settings).toMatchObject({ beatsPerChord: 4, startBpm: 50, endBpm: 70, minutes: 3 });
    const hard = suggestChallenge(["c", "g", "am", "f"], null);
    expect(hard.settings.beatsPerChord).toBe(8);
    expect(hard.settings.startBpm).toBe(45);
    expect(hard.reason).toContain("F là hợp âm chặn");
  });

  it("builds on the last result for the same chords", () => {
    expect(suggestChallenge(["em", "am"], { bpm: 80, rating: "clean" }).settings.startBpm).toBe(75);
    expect(suggestChallenge(["em", "am"], { bpm: 80, rating: "lost" }).settings.startBpm).toBe(65);
    expect(suggestChallenge(["em", "am"], { bpm: 80, rating: "clean" }).reason).toContain("lần trước bạn tới 80 BPM");
  });

  it("keeps hand-made settings in safe ranges and ids independent of order", () => {
    expect(normalizeSettings({ ...base, minutes: 99, startBpm: 10, endBpm: 5, stages: 0 })).toMatchObject({
      minutes: 10,
      startBpm: 30,
      endBpm: 30,
      stages: 1,
    });
    expect(challengeId(["g", "em", "am"])).toBe(challengeId(["am", "g", "em"]));
    expect(challengeId(["g", "em"])).toMatch(/^challenge:[a-z0-9-]+$/);
  });

  it("only uses chords that exist in presets", () => {
    for (const p of CHALLENGE_PRESETS) for (const c of p.chords) expect(CHORDS[c]).toBeDefined();
  });
});

describe("challenge lane", () => {
  it("shows at least the chord on the line plus 3 more, even on a phone with 8 beats per chord", async () => {
    const { pxPerBeatFor } = await import("@/components/practice/challenge-runner");
    for (const [width, beats] of [[330, 8], [330, 4], [330, 2], [900, 8], [900, 2]] as const) {
      const px = pxPerBeatFor(width, beats);
      expect(width / (px * beats)).toBeGreaterThanOrEqual(4);
    }
    expect(pxPerBeatFor(2000, 2)).toBe(30); // never faster-looking than 30 px per beat
  });
});
