import type { ChordShape, Finger } from "./chords";
import { STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "./guitar";

/**
 * How each finger of the fretting hand travels from one chord to the next: the motion picture
 * of a chord change (docx/WRITING_GUIDE.md item 5). Pure, so the words and the animation come
 * from the same data and are unit tested.
 */
export type FingerSpot = { finger: Exclude<Finger, "T">; string: StringNumber; fret: number };

export type FingerMove =
  | { kind: "stay"; finger: FingerSpot["finger"]; at: FingerSpot }
  | { kind: "slide"; finger: FingerSpot["finger"]; from: FingerSpot; to: FingerSpot }
  | { kind: "move"; finger: FingerSpot["finger"]; from: FingerSpot; to: FingerSpot }
  | { kind: "lift"; finger: FingerSpot["finger"]; from: FingerSpot }
  | { kind: "place"; finger: FingerSpot["finger"]; to: FingerSpot };

/** Where each finger presses; a finger on several strings (barre) counts at its thickest string. */
export function fingerSpots(chord: ChordShape): FingerSpot[] {
  const spots = new Map<FingerSpot["finger"], FingerSpot>();
  for (const s of STRING_NUMBERS_LOW_TO_HIGH) {
    const finger = chord.fingers[s];
    const fret = chord.frets[s];
    if (finger == null || finger === "T" || typeof fret !== "number" || fret === 0) continue;
    if (!spots.has(finger)) spots.set(finger, { finger, string: s, fret });
  }
  return [...spots.values()].sort((a, b) => a.finger - b.finger);
}

export function chordMoves(from: ChordShape, to: ChordShape): FingerMove[] {
  const a = new Map(fingerSpots(from).map((p) => [p.finger, p]));
  const b = new Map(fingerSpots(to).map((p) => [p.finger, p]));
  const fingers = [...new Set([...a.keys(), ...b.keys()])].sort();
  return fingers.map((finger): FingerMove => {
    const p = a.get(finger);
    const q = b.get(finger);
    if (p && q) {
      if (p.string === q.string && p.fret === q.fret) return { kind: "stay", finger, at: q };
      if (p.string === q.string) return { kind: "slide", finger, from: p, to: q };
      return { kind: "move", finger, from: p, to: q };
    }
    if (p) return { kind: "lift", finger, from: p };
    return { kind: "place", finger, to: q! };
  });
}

/** Toward the floor = a thinner string (smaller number); toward your face = a thicker one. */
function stringsAway(from: StringNumber, to: StringNumber): string {
  const n = Math.abs(from - to);
  const dir = to < from ? "về phía sàn nhà" : "về phía mặt bạn";
  return `${n === 1 ? "sang dây bên cạnh" : `dịch ${n} dây`} ${dir}`;
}

/** One sentence per finger, in finger order. */
export function describeMoves(moves: FingerMove[]): string[] {
  return moves.map((m) => {
    switch (m.kind) {
      case "stay":
        return `Ngón ${m.finger} giữ nguyên ở dây ${m.at.string} phím ${m.at.fret}: ngón trụ, không nhấc lên.`;
      case "slide":
        return `Ngón ${m.finger} trượt dọc dây ${m.from.string} từ phím ${m.from.fret} sang phím ${m.to.fret}, chạm nhẹ dây trong lúc trượt.`;
      case "move":
        return `Ngón ${m.finger} ${stringsAway(m.from.string, m.to.string)}: từ dây ${m.from.string} phím ${m.from.fret} tới dây ${m.to.string} phím ${m.to.fret}.`;
      case "lift":
        return `Ngón ${m.finger} nhấc lên khỏi dây ${m.from.string}.`;
      case "place":
        return `Ngón ${m.finger} đặt xuống dây ${m.to.string} phím ${m.to.fret}.`;
    }
  });
}

/**
 * The one idea to remember for this change, when there is one: a group of fingers that keeps its
 * shape and moves together, or a finger that never leaves the string.
 */
export function moveSummary(moves: FingerMove[]): string | null {
  const shifts = moves.filter((m): m is Extract<FingerMove, { kind: "move" }> => m.kind === "move");
  const groups = new Map<string, number[]>();
  for (const m of shifts) {
    const key = `${m.to.string - m.from.string}:${m.to.fret - m.from.fret}`;
    groups.set(key, [...(groups.get(key) ?? []), m.finger]);
  }
  const together = [...groups.entries()].find(([key, fs]) => fs.length >= 2 && key.endsWith(":0"));
  if (together) {
    const [key, fs] = together;
    const delta = Number(key.split(":")[0]);
    const names = fs.join(fs.length === 2 ? " và " : ", ");
    const all = fs.length === moves.length;
    return `${all ? "Cả bàn tay giữ nguyên hình dạng" : `Ngón ${names} giữ nguyên hình dạng`}, cùng dịch ${Math.abs(delta)} dây ${
      delta < 0 ? "về phía sàn nhà" : "về phía mặt bạn"
    }, vẫn ở phím cũ.`;
  }
  const anchors = moves.filter((m) => m.kind === "stay");
  if (anchors.length) return `Ngón ${anchors.map((m) => m.finger).join(" và ")} đứng yên làm trụ, các ngón còn lại xoay quanh nó.`;
  return null;
}
