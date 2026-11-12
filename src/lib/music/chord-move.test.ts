import { describe, expect, it } from "vitest";
import { CHORDS } from "./chords";
import { chordMoves, describeMoves, fingerSpots, moveSummary } from "./chord-move";

describe("chord moves", () => {
  it("lists where each finger presses, in finger order", () => {
    expect(fingerSpots(CHORDS.am)).toEqual([
      { finger: 1, string: 2, fret: 1 },
      { finger: 2, string: 4, fret: 2 },
      { finger: 3, string: 3, fret: 2 },
    ]);
  });

  it("Em to Am: fingers 2 and 3 shift one string toward the floor, finger 1 is placed", () => {
    const moves = chordMoves(CHORDS.em, CHORDS.am);
    expect(moves.map((m) => [m.finger, m.kind])).toEqual([
      [1, "place"],
      [2, "move"],
      [3, "move"],
    ]);
    expect(moveSummary(moves)).toBe("Ngón 2 và 3 giữ nguyên hình dạng, cùng dịch 1 dây về phía sàn nhà, vẫn ở phím cũ.");
    expect(describeMoves(moves)[1]).toBe("Ngón 2 sang dây bên cạnh về phía sàn nhà: từ dây 5 phím 2 tới dây 4 phím 2.");
  });

  it("E to Am: the whole hand keeps its shape", () => {
    const moves = chordMoves(CHORDS.e, CHORDS.am);
    expect(moves.every((m) => m.kind === "move")).toBe(true);
    expect(moveSummary(moves)).toMatch(/^Cả bàn tay giữ nguyên hình dạng, cùng dịch 1 dây về phía sàn nhà/);
  });

  it("moving back reverses the direction", () => {
    expect(moveSummary(chordMoves(CHORDS.am, CHORDS.e))).toMatch(/về phía mặt bạn/);
  });

  it("C to Am: finger 1 and 2 stay as anchors", () => {
    const moves = chordMoves(CHORDS.c, CHORDS.am);
    expect(moves.filter((m) => m.kind === "stay").map((m) => m.finger)).toEqual([1, 2]);
    expect(moveSummary(moves)).toBe("Ngón 1 và 2 đứng yên làm trụ, các ngón còn lại xoay quanh nó.");
    expect(describeMoves(moves)[0]).toMatch(/^Ngón 1 giữ nguyên ở dây 2 phím 1/);
  });

  it("a finger on the same string changes fret by sliding", () => {
    // D: finger 3 on string 2 fret 3; A: finger 3 on string 2 fret 2
    const slide = chordMoves(CHORDS.d, CHORDS.a).find((m) => m.finger === 3)!;
    expect(slide.kind).toBe("slide");
    expect(describeMoves([slide])[0]).toBe("Ngón 3 trượt dọc dây 2 từ phím 3 sang phím 2, chạm nhẹ dây trong lúc trượt.");
  });

  it("every lesson pair produces one sentence per finger used", () => {
    for (const [a, b] of [["em", "am"], ["e", "am"], ["a", "e"], ["d", "a"]] as const) {
      const moves = chordMoves(CHORDS[a], CHORDS[b]);
      const used = new Set([...fingerSpots(CHORDS[a]), ...fingerSpots(CHORDS[b])].map((p) => p.finger));
      expect(describeMoves(moves)).toHaveLength(used.size);
    }
  });
});
