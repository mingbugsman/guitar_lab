import type { ChordId, Finger } from "@/lib/music/chords";
import type { StringNumber } from "@/lib/music/guitar";

/**
 * The practice engine's data model (internal design doc: docx/PRACTICE_ENGINE.md).
 * A drill is data: a sequence of steps placed on beats. Finger drills, the chord challenge and,
 * later, fingerpicking patterns all use these same types and the same player.
 */

/** Picking-hand fingers for fingerpicking: p thumb, i index, m middle, a ring. */
export type PickFinger = "p" | "i" | "m" | "a";

export type Hit = { string: StringNumber; fret: number; finger?: Finger; pick?: PickFinger };

export type StepAction = "pick-down" | "pick-up" | "pluck" | "pinch" | "strum-down" | "strum-up" | "slap";

export type Step = {
  /** Position in beats from the start of the sequence (0, 0.5, 1…). */
  at: number;
  /** Notes to play now; several = played together (pinch, chord). Empty only for chord or slap steps. */
  hits: Hit[];
  /** Fretting fingers that stay down from earlier steps (drawn pale). */
  hold?: Hit[];
  action?: StepAction;
  chord?: ChordId;
  /** Shown while previewing, e.g. "Dây 6, phím 2: ngón 2. Ngón 1 vẫn giữ." */
  caption?: string;
};

export type Sequence = { beats: number; steps: Step[] };

export type Tempo = {
  start: number;
  target: number;
  /** BPM added after every `roundsPerStep` rounds. */
  step: number;
  roundsPerStep: number;
};

/** Fret for a finger when the hand sits in a 4-fret window starting at `startFret` (finger 1 there). */
export function fretFor(finger: 1 | 2 | 3 | 4, startFret: number): number {
  return startFret + finger - 1;
}

/** BPM to use for round `round` (0-based). Speeds up gradually; `held` freezes it. */
export function tempoForRound(tempo: Tempo, round: number, held: number | null = null): number {
  if (held != null) return held;
  const raised = tempo.start + Math.floor(round / tempo.roundsPerStep) * tempo.step;
  return Math.min(tempo.target, raised);
}

/** First round index at which the target tempo is reached. */
export function roundsToTarget(tempo: Tempo): number {
  return Math.ceil((tempo.target - tempo.start) / tempo.step) * tempo.roundsPerStep;
}

export type FingerNote = { string: StringNumber; finger: 1 | 2 | 3 | 4; startFret?: number };

/**
 * Turn a list of finger notes into evenly spaced steps (`noteBeats` apart), with captions and,
 * when `holdOnString` is set, the earlier fingers on the same string kept down.
 */
export function stepsFromNotes(
  notes: FingerNote[],
  { noteBeats = 0.5, holdOnString = false, startAt = 0, alternatePick = false }: {
    noteBeats?: number;
    holdOnString?: boolean;
    startAt?: number;
    alternatePick?: boolean;
  } = {},
): Step[] {
  return notes.map((n, i) => {
    const fret = fretFor(n.finger, n.startFret ?? 1);
    const hit: Hit = { string: n.string, fret, finger: n.finger };
    let hold: Hit[] | undefined;
    if (holdOnString) {
      hold = [];
      for (let j = i - 1; j >= 0 && notes[j].string === n.string; j--) {
        const p = notes[j];
        if (p.finger < n.finger) hold.unshift({ string: p.string, fret: fretFor(p.finger, p.startFret ?? 1), finger: p.finger });
        else break;
      }
    }
    const action: StepAction | undefined = alternatePick ? (i % 2 === 0 ? "pick-down" : "pick-up") : undefined;
    const pick = action === "pick-down" ? " Gảy xuống." : action === "pick-up" ? " Gảy lên." : "";
    const holding = hold?.length ? ` Ngón ${hold.map((h) => h.finger).join(", ")} vẫn giữ.` : "";
    return {
      at: startAt + i * noteBeats,
      hits: [hit],
      hold: hold?.length ? hold : undefined,
      action,
      caption: `Dây ${n.string}, phím ${fret}: ngón ${n.finger}.${holding}${pick}`,
    };
  });
}

export function sequenceFromSteps(steps: Step[], minBeats = 1): Sequence {
  const last = steps.reduce((m, s) => Math.max(m, s.at), 0);
  // round the length up to a whole bar of 4 beats so the click and the drill line up
  const beats = Math.max(minBeats, Math.ceil((last + 0.5) / 4) * 4);
  return { beats, steps };
}

/** Highest fret a sequence uses, for sizing the fretboard. */
export function highestFret(seq: Sequence): number {
  return seq.steps.reduce((m, s) => Math.max(m, ...s.hits.map((h) => h.fret), ...(s.hold ?? []).map((h) => h.fret)), 0);
}

/** Problems with a sequence; empty when it is valid. Used by tests for every drill. */
export function validateSequence(seq: Sequence): string[] {
  const problems: string[] = [];
  let prev = -Infinity;
  seq.steps.forEach((s, i) => {
    if (s.at < prev) problems.push(`step ${i} is earlier than the step before it`);
    prev = s.at;
    if (s.at < 0 || s.at >= seq.beats) problems.push(`step ${i} at ${s.at} is outside 0..${seq.beats}`);
    if (s.hits.length === 0 && !s.chord && s.action !== "slap") problems.push(`step ${i} plays nothing`);
    for (const h of [...s.hits, ...(s.hold ?? [])]) {
      if (h.fret < 0 || h.fret > 15) problems.push(`step ${i}: fret ${h.fret}`);
      if (h.finger && h.finger !== "T" && h.fret === 0) problems.push(`step ${i}: finger on an open string`);
    }
    const strings = s.hits.map((h) => h.string);
    if (new Set(strings).size !== strings.length) problems.push(`step ${i} plays one string twice`);
  });
  return problems;
}

/** One event on the player's timeline, in beats from the start (count-in included). */
export type TimelineEvent =
  | { beat: number; type: "click"; accent: boolean; countIn: boolean }
  | { beat: number; type: "step"; index: number };

/** Clicks for the count-in and for every beat of the sequence, plus every step, sorted. */
export function buildTimeline(seq: Sequence, countInBeats = 4): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  for (let b = 0; b < countInBeats; b++) events.push({ beat: b, type: "click", accent: b === 0, countIn: true });
  for (let b = 0; b < seq.beats; b++) events.push({ beat: countInBeats + b, type: "click", accent: b % 4 === 0, countIn: false });
  seq.steps.forEach((s, index) => events.push({ beat: countInBeats + s.at, type: "step", index }));
  return events.sort((a, b) => a.beat - b.beat || (a.type === "click" ? -1 : 1));
}
