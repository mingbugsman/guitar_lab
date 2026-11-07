import { describe, expect, it } from "vitest";
import { CHORDS } from "@/lib/music/chords";
import { LESSONS, LEVELS, getLesson, lessonsForLevel, nextLesson } from "./curriculum";

describe("curriculum integrity", () => {
  it("has the 12 Level 0 lessons required by MVP 0.1", () => {
    expect(lessonsForLevel("level-0")).toHaveLength(12);
  });

  it("ships the first chord group Em, Am, E, A, D", () => {
    const slugs = lessonsForLevel("level-1").map((l) => l.slug);
    for (const id of ["em", "am", "e", "a", "d"]) expect(slugs).toContain(`chord-${id}`);
  });

  it("uses unique, URL-safe slugs that match the database constraint", () => {
    const slugs = LESSONS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]{1,80}$/);
  });

  it("only references existing prerequisite lessons that come earlier", () => {
    LESSONS.forEach((lesson, index) => {
      for (const p of lesson.prerequisites) {
        const pre = getLesson(p);
        expect(pre, `${lesson.slug} → ${p}`).toBeDefined();
        expect(LESSONS.indexOf(pre!)).toBeLessThan(index);
      }
    });
  });

  it("gives every lesson the required parts", () => {
    for (const l of LESSONS) {
      expect(l.objectives.length, l.slug).toBeGreaterThan(0);
      expect(l.blocks.some((b) => b.type === "visual"), `${l.slug} needs a visual`).toBe(true);
      expect(l.practice.steps.length, l.slug).toBeGreaterThan(0);
      expect(l.checklist.length, l.slug).toBeGreaterThan(0);
      expect(new Set(l.checklist.map((c) => c.id)).size, l.slug).toBe(l.checklist.length);
      expect(l.mistakes.length, l.slug).toBeGreaterThan(0);
      expect(l.assessment.length, l.slug).toBeGreaterThan(0);
      expect(l.mastery.length, l.slug).toBeGreaterThan(0);
    }
  });

  it("has a 'compare with your guitar' callout in every lesson that shows a fretboard or chord", () => {
    for (const l of LESSONS) {
      const showsBoard = l.blocks.some(
        (b) => b.type === "visual" && (b.visual.kind === "fretboard" || b.visual.kind === "chord"),
      );
      if (!showsBoard) continue;
      expect(
        l.blocks.some((b) => b.type === "callout" && b.tone === "compare"),
        `${l.slug} should tell the learner how to compare the picture with their guitar`,
      ).toBe(true);
    }
  });

  it("only references chords that exist", () => {
    for (const l of LESSONS)
      for (const b of l.blocks)
        if (b.type === "visual" && b.visual.kind === "chord") expect(CHORDS[b.visual.chord]).toBeDefined();
  });

  it("links lessons in order", () => {
    expect(nextLesson("introduction")?.slug).toBe("guitar-anatomy");
    expect(nextLesson("clean-sounds")?.slug).toBe("reading-chord-diagrams");
    expect(nextLesson(LESSONS.at(-1)!.slug)).toBeUndefined();
    expect(LEVELS.map((l) => l.id)).toEqual(["level-0", "level-1"]);
  });
});
