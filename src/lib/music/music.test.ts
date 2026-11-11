import { describe, expect, it } from "vitest";
import { CHORD_CATEGORIES, CHORDS, CHORD_IDS, soundingMidi, soundingNotes } from "./chords";
import { nearestString, noteAt, STANDARD_TUNING } from "./guitar";
import { frequencyToNote, midiToFrequency, midiToNoteLabel } from "./notes";

describe("standard tuning", () => {
  it("is E A D G B E from string 6 to string 1", () => {
    expect([6, 5, 4, 3, 2, 1].map((n) => STANDARD_TUNING[n as 6].label)).toEqual([
      "E2", "A2", "D3", "G3", "B3", "E4",
    ]);
  });

  it("has the correct reference frequencies", () => {
    expect(STANDARD_TUNING[6].frequency).toBeCloseTo(82.41, 1);
    expect(STANDARD_TUNING[5].frequency).toBeCloseTo(110, 1);
    expect(STANDARD_TUNING[1].frequency).toBeCloseTo(329.63, 1);
  });

  it("finds notes on the fretboard", () => {
    expect(noteAt(6, 5)).toBe("A");
    expect(noteAt(5, 5)).toBe("D");
    expect(noteAt(3, 4)).toBe("B");
    expect(noteAt(1, 12)).toBe("E");
  });

  it("maps frequencies to the nearest string", () => {
    expect(nearestString(83).number).toBe(6);
    expect(nearestString(196).number).toBe(3);
    expect(nearestString(330).number).toBe(1);
  });
});

describe("note math", () => {
  it("converts A4 = 440 Hz", () => {
    expect(midiToFrequency(69)).toBe(440);
    expect(midiToNoteLabel(69)).toBe("A4");
  });

  it("reports cents deviation", () => {
    const sharp = frequencyToNote(440 * 2 ** (10 / 1200));
    expect(sharp.name).toBe("A");
    expect(sharp.cents).toBeCloseTo(10, 0);
    const flat = frequencyToNote(110 * 2 ** (-20 / 1200));
    expect(flat.name).toBe("A");
    expect(flat.octave).toBe(2);
    expect(flat.cents).toBeCloseTo(-20, 0);
  });
});

describe("chord shapes are musically correct", () => {
  it.each(CHORD_IDS)("%s only sounds its chord tones", (id) => {
    const chord = CHORDS[id];
    for (const note of soundingNotes(chord)) {
      expect(chord.tones).toContain(note);
    }
    // every chord tone is present at least once (except tones the shape leaves out on purpose)
    for (const tone of chord.tones.filter((t) => !(chord as { omitted?: string[] }).omitted?.includes(t))) {
      expect(soundingNotes(chord)).toContain(tone);
    }
  });

  it.each(CHORD_IDS)("%s has the root as its lowest sounding note", (id) => {
    const chord = CHORDS[id];
    expect(soundingNotes(chord)[0]).toBe(chord.root);
  });

  it.each(CHORD_IDS)("%s assigns exactly one finger to each fretted string", (id) => {
    const chord = CHORDS[id];
    for (const [s, fret] of Object.entries(chord.frets)) {
      const finger = chord.fingers[Number(s) as 1];
      if (typeof fret === "number" && fret > 0) expect(finger).toBeDefined();
      else expect(finger).toBeUndefined();
    }
  });

  it("D chord does not play strings 6 and 5", () => {
    expect(soundingMidi(CHORDS.d).map((n) => n.string)).toEqual([4, 3, 2, 1]);
  });
});

describe("chord library", () => {
  const all = CHORD_IDS.map((id) => CHORDS[id]);

  it("has at least 35 chords with url-safe ids", () => {
    expect(all.length).toBeGreaterThanOrEqual(35);
    for (const c of all) expect(c.id).toMatch(/^[a-z0-9]{1,8}$/);
  });

  it.each(CHORD_IDS)("%s fits the diagram window and a hand", (id) => {
    const c = CHORDS[id];
    const fretted = Object.values(c.frets).filter((f): f is number => typeof f === "number" && f > 0);
    if (fretted.length) {
      expect(Math.min(...fretted)).toBeGreaterThanOrEqual(c.baseFret);
      expect(Math.max(...fretted) - c.baseFret).toBeLessThan(4);
    }
    // at most 4 fingers; one finger may cover several strings only as a barre
    const fingers = Object.values(c.fingers);
    expect(new Set(fingers).size).toBeLessThanOrEqual(4);
    const repeated = fingers.filter((f, i) => fingers.indexOf(f) !== i);
    for (const f of repeated) expect(c.barre?.finger, `${id}: finger ${f} on several strings needs a barre`).toBe(f);
  });

  it.each(CHORD_IDS.filter((id) => CHORDS[id].barre))("%s: the barre finger presses every barred string that sounds at that fret", (id) => {
    const c = CHORDS[id];
    const b = c.barre!;
    for (let s = b.from; s >= b.to; s--) {
      const fret = c.frets[s as 1];
      if (fret === b.fret) expect(c.fingers[s as 1]).toBe(b.finger);
      else expect(typeof fret === "number" && fret > b.fret).toBe(true); // other fingers sit above the barre
    }
  });

  it("groups chords by category, every chord is in a group, beginners need no barre", () => {
    const grouped = new Set(CHORD_CATEGORIES.flatMap((g) => g.chords));
    for (const id of CHORD_IDS) expect(grouped.has(id), id).toBe(true);
    for (const g of CHORD_CATEGORIES) for (const id of g.chords) expect(CHORDS[id]).toBeDefined();
    const beginner = CHORD_CATEGORIES.find((g) => g.id === "beginner")!;
    expect(beginner.chords).toEqual(expect.arrayContaining(["em", "am", "c", "g", "d"]));
    for (const id of beginner.chords) expect(CHORDS[id].barre).toBeUndefined();
  });
});
