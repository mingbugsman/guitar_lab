import type { FretMarker } from "@/components/guitar/fretboard";
import type { PartId } from "@/components/guitar/guitar-anatomy";
import type { ChordId } from "@/lib/music/chords";
import type { StringNumber } from "@/lib/music/guitar";

export type Visual =
  | { kind: "anatomy"; initialPart?: PartId }
  | { kind: "posture" }
  | { kind: "fingers" }
  | {
      kind: "fretboard";
      frets?: number;
      markers?: FretMarker[];
      highlightStrings?: StringNumber[];
      showAllNotes?: boolean;
    }
  | { kind: "chord"; chord: ChordId }
  | { kind: "strings" }
  | { kind: "tuner" }
  | { kind: "metronome"; bpm?: number; beats?: number }
  | { kind: "notes" }
  /** One-minute chord changes: one chord (place, lift, replace) or a pair to switch between. */
  | { kind: "chordChange"; chords: [ChordId] | [ChordId, ChordId] };

export type Block =
  | { type: "text"; heading?: string; paragraphs: string[] }
  | { type: "visual"; visual: Visual; caption?: string }
  | { type: "steps"; heading: string; items: string[] }
  /**
   * "compare" = put your real guitar next to the picture and check it.
   * "body" = what the learner's hands and body will feel, how many sessions it takes, and when
   * to stop (docx/WRITING_GUIDE.md §5).
   */
  | { type: "callout"; tone: "tip" | "warning" | "compare" | "body"; text: string };

export type Lesson = {
  slug: string;
  levelId: LevelId;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  objectives: string[];
  prerequisites: string[];
  blocks: Block[];
  practice: { minutes: number; steps: string[] };
  mistakes: { mistake: string; fix: string }[];
  checklist: { id: string; label: string }[];
  assessment: string[];
  mastery: string[];
};

export type LevelId = "level-0" | "level-1";

export type Level = {
  id: LevelId;
  number: number;
  title: string;
  subtitle: string;
  outcome: string;
  /** Present when only part of the level ships in the current release. */
  note?: string;
};
