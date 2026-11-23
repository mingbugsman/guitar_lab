import { describe, expect, it } from "vitest";
import { CHORDS } from "@/lib/music/chords";
import { countLabel, handMove, patternProblems, STRUM_PRESETS, strokeNotes, strumTimeline, type Stroke } from "./strum-pattern";

describe("strumming patterns", () => {
  it("every preset can be played with a steady hand: down on the numbers, up on 'và'", () => {
    for (const preset of Object.values(STRUM_PRESETS)) expect(patternProblems(preset.strokes), preset.id).toEqual([]);
  });

  it("the first pattern is the common folk strum: ↓ ↓↑ ↑↓↑", () => {
    expect(STRUM_PRESETS.folk.strokes.join("")).toBe("D-DU-UDU");
  });

  it("flags a stroke against the hand's motion", () => {
    expect(patternProblems("UDUDUDUD".split("") as Stroke[])).not.toEqual([]);
    expect(patternProblems("D-D-".split("") as Stroke[])).not.toEqual([]);
  });

  it("counts 1 và 2 và 3 và 4 và", () => {
    expect(Array.from({ length: 8 }, (_, i) => countLabel(i)).join(" ")).toBe("1 và 2 và 3 và 4 và");
    expect(handMove(0)).toBe("down");
    expect(handMove(7)).toBe("up");
  });

  it("schedules a bar of count-in, then one bar per chord with a click on every beat", () => {
    const ev = strumTimeline(STRUM_PRESETS.folk.strokes, ["g", "em", "c", "d"]);
    const clicks = ev.filter((e) => e.kind === "click");
    expect(clicks).toHaveLength(4 + 16);
    expect(clicks.filter((c) => c.kind === "click" && c.countIn)).toHaveLength(4);
    // beat 1 of every bar is accented, count-in included
    expect(clicks.filter((c) => c.kind === "click" && c.accent).map((c) => c.beat)).toEqual([0, 4, 8, 12, 16]);

    const slots = ev.filter((e) => e.kind === "slot");
    expect(slots).toHaveLength(32);
    // slot k of bar n lands half a beat apart, after the count-in
    const third = slots.filter((s) => s.kind === "slot" && s.bar === 2);
    expect(third.map((s) => s.beat)).toEqual([12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5]);
    expect(new Set(third.map((s) => s.kind === "slot" && s.chord))).toEqual(new Set(["c"]));
    // up strokes always sit on "và"
    for (const s of slots) if (s.kind === "slot" && s.stroke === "U") expect(s.beat % 1).toBe(0.5);
  });

  it("a down stroke sounds every chord string from the thickest; an up stroke the thin ones from string 1", () => {
    const down = strokeNotes("g", "down").map((n) => n.string);
    expect(down).toEqual([6, 5, 4, 3, 2, 1]);
    expect(strokeNotes("c", "down")[0].string).toBe(5); // string 6 is not played on C
    const up = strokeNotes("g", "up");
    expect(up.map((n) => n.string)).toEqual([1, 2, 3, 4]);
    expect(up[0].fret).toBe(CHORDS.g.frets[1]);
    // a four-string chord: the up stroke still stays on its strings
    expect(strokeNotes("d", "up").map((n) => n.string)).toEqual([1, 2, 3, 4]);
  });
});
