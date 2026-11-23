import { describe, expect, it } from "vitest";
import { CHORDS, type ChordId } from "./chords";
import { nextQuizChord, PAIRS, QUIZ_CHORDS, qualityOf } from "./major-minor";

describe("major or minor quiz", () => {
  it("asks only plain major and minor chords taught before the quiz", () => {
    for (const c of QUIZ_CHORDS) expect(["major", "minor"]).toContain(CHORDS[c].quality);
    expect(QUIZ_CHORDS.filter((c) => qualityOf(c) === "major").length).toBe(QUIZ_CHORDS.filter((c) => qualityOf(c) === "minor").length + 2);
  });

  it("each pair is the same root, one major and one minor, one note apart", () => {
    for (const [maj, min] of PAIRS) {
      expect(CHORDS[maj].root).toBe(CHORDS[min].root);
      expect(qualityOf(maj)).toBe("major");
      expect(qualityOf(min)).toBe("minor");
      const differ = CHORDS[maj].tones.filter((t) => !CHORDS[min].tones.includes(t));
      expect(differ, `${maj}/${min}`).toHaveLength(1);
    }
  });

  it("never repeats a chord, nor the same quality three times running", () => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const history: ChordId[] = [];
    for (let i = 0; i < 2000; i++) history.push(nextQuizChord(history, rand));
    for (let i = 1; i < history.length; i++) expect(history[i]).not.toBe(history[i - 1]);
    for (let i = 2; i < history.length; i++) {
      const q = [history[i - 2], history[i - 1], history[i]].map(qualityOf);
      expect(q[0] === q[1] && q[1] === q[2]).toBe(false);
    }
    // and every chord comes up
    expect(new Set(history).size).toBe(QUIZ_CHORDS.length);
  });

  it("copes with a random source that returns exactly 1", () => {
    expect(QUIZ_CHORDS).toContain(nextQuizChord(["e"], () => 1));
  });
});
