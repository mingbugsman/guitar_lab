import { describe, expect, it } from "vitest";
import { LESSONS, getLesson } from "@/content/curriculum";
import { practiceVisuals, toScenes } from "./lesson-player";

describe("lesson player scenes", () => {
  it("never puts two pictures on one screen and never loses a block", () => {
    for (const l of LESSONS) {
      const scenes = toScenes(l.blocks);
      const visuals = l.blocks.filter((b) => b.type === "visual").length;
      expect(scenes.filter((s) => s.visual).length, l.slug).toBe(visuals);
      const kept = scenes.reduce((n, s) => n + s.blocks.length + (s.visual ? 1 : 0), 0);
      expect(kept, l.slug).toBe(l.blocks.length);
    }
  });

  it("keeps a 'compare with your guitar' note on the same screen as the picture it refers to", () => {
    const chordLesson = getLesson("chord-am")!;
    const scene = toScenes(chordLesson.blocks).find((s) => s.visual?.visual.kind === "chord")!;
    expect(scene.blocks.some((b) => b.type === "callout" && b.tone === "compare")).toBe(true);
  });

  it("pins the chord and the metronome while practising", () => {
    expect(practiceVisuals(getLesson("chord-am")!.blocks).map((v) => v.kind)).toEqual(["chord"]);
    expect(practiceVisuals(getLesson("open-strings")!.blocks).map((v) => v.kind)).toEqual(["fretboard", "metronome"]);
  });
});
