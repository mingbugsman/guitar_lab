import type { StringNumber } from "@/lib/music/guitar";

/**
 * GUITAR LAB orientation conventions (see docx/GUITAR_VISUAL.md).
 *
 * "player" — what a right-handed player sees when looking DOWN at the neck while holding
 *            the guitar: headstock on the left, string 6 (thickest) on TOP (toward your face),
 *            string 1 (thinnest) at the BOTTOM (toward the floor).
 * "tab"    — tablature convention: same left→right, but string 1 on top.
 *
 * Chord diagrams use the "upright" view: the guitar stood up facing you, nut at the top,
 * string 6 on the LEFT, string 1 on the RIGHT.
 *
 * Left-handed guitars mirror everything horizontally.
 */
export type FretboardView = "player" | "tab";
export type Handedness = "right" | "left";

export function stringRowsTopToBottom(view: FretboardView): StringNumber[] {
  return view === "player" ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
}

export function chordColumnsLeftToRight(handedness: Handedness): StringNumber[] {
  return handedness === "right" ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
}

/** Physical anchors that are TRUE on the learner's real guitar, whatever the drawing. */
export const PHYSICAL = {
  towardFace: "phía mặt bạn",
  towardFloor: "phía sàn nhà",
  headstock: "đầu đàn",
  body: "thùng đàn",
} as const;

export function viewEdgeLabels(view: FretboardView) {
  return view === "player"
    ? { top: `↑ ${PHYSICAL.towardFace}`, bottom: `↓ ${PHYSICAL.towardFloor}` }
    : { top: `↑ ${PHYSICAL.towardFloor}`, bottom: `↓ ${PHYSICAL.towardFace}` };
}

export const VIEW_LABELS: Record<FretboardView, { title: string; hint: string }> = {
  player: {
    title: "Nhìn xuống (người chơi)",
    hint: "Giống hệt khi bạn ôm đàn và cúi nhìn xuống cần đàn: dây 6 to nhất ở trên cùng.",
  },
  tab: {
    title: "Kiểu Tab",
    hint: "Quy ước của bản Tab: dây 1 mảnh nhất ở trên cùng — ngược với lúc bạn nhìn xuống.",
  },
};

/**
 * docx/WRITING_GUIDE.md §4: nothing appears on screen before a lesson teaches it. No lesson
 * teaches reading Tab yet, so the Tab view is not offered anywhere. When the Tab lesson ships,
 * set this to its slug; the view then becomes available again.
 */
export const TAB_LESSON_SLUG: string | null = null;

/** Views the learner can switch between right now. */
export const AVAILABLE_VIEWS: FretboardView[] = TAB_LESSON_SLUG ? ["player", "tab"] : ["player"];
