import { CHORDS, CHORDS_WITH_LESSON, type ChordId } from "@/lib/music/chords";

/**
 * Chord challenge (internal design doc §3): random chords scroll from right to left, one strum
 * when a chord reaches the line, tempo rising stage by stage. Everything here is pure and tested;
 * the player only schedules what this returns.
 */
export type BeatsPerChord = 2 | 4 | 8;

export type ChallengeSettings = {
  chords: ChordId[];
  minutes: number;
  startBpm: number;
  endBpm: number;
  beatsPerChord: BeatsPerChord;
  stages: number;
};

export type ChallengeStage = { index: number; bpm: number; startBeat: number; beats: number };
export type ChallengeItem = { chord: ChordId; startBeat: number; beats: number; stage: number };
export type ChallengePlan = { stages: ChallengeStage[]; items: ChallengeItem[]; totalBeats: number; totalSeconds: number };

export const LIMITS = { minChords: 2, maxChords: 12, minMinutes: 1, maxMinutes: 10, minBpm: 30, maxBpm: 160, maxStages: 6 } as const;

/** Small seeded random generator (mulberry32) so a challenge can be replayed and tested. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round5 = (n: number) => Math.round(n / 5) * 5;

/** Tempo of each stage, evenly spread from start to end, rounded to 5 BPM. */
export function stageTempos(startBpm: number, endBpm: number, stages: number): number[] {
  if (stages <= 1) return [startBpm];
  return Array.from({ length: stages }, (_, i) => round5(startBpm + ((endBpm - startBpm) * i) / (stages - 1)));
}

/**
 * Random order where every chord appears about equally often (shuffled "bags" of all chords)
 * and the same chord never comes twice in a row.
 */
export function chordOrder(chords: ChordId[], count: number, rand: () => number): ChordId[] {
  const out: ChordId[] = [];
  while (out.length < count) {
    const bag = [...chords];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    // a new bag must not start with the chord that ended the previous one
    if (out.length && bag.length > 1 && bag[0] === out[out.length - 1]) {
      const k = 1 + Math.floor(rand() * (bag.length - 1));
      [bag[0], bag[k]] = [bag[k], bag[0]];
    }
    out.push(...bag);
  }
  return out.slice(0, count);
}

export function buildChallenge(settings: ChallengeSettings, seed: number): ChallengePlan {
  const { chords, minutes, beatsPerChord } = settings;
  const tempos = stageTempos(settings.startBpm, settings.endBpm, settings.stages);
  const stageSeconds = (minutes * 60) / tempos.length;

  const stages: ChallengeStage[] = [];
  let beat = 0;
  tempos.forEach((bpm, index) => {
    const chordsInStage = Math.max(1, Math.round((stageSeconds * bpm) / 60 / beatsPerChord));
    const beats = chordsInStage * beatsPerChord;
    stages.push({ index, bpm, startBeat: beat, beats });
    beat += beats;
  });

  const totalChords = stages.reduce((n, s) => n + s.beats / beatsPerChord, 0);
  const order = chordOrder(chords, totalChords, seededRandom(seed));
  const items: ChallengeItem[] = [];
  let k = 0;
  for (const s of stages) {
    for (let b = s.startBeat; b < s.startBeat + s.beats; b += beatsPerChord) {
      items.push({ chord: order[k++], startBeat: b, beats: beatsPerChord, stage: s.index });
    }
  }
  const totalSeconds = stages.reduce((t, s) => t + (s.beats * 60) / s.bpm, 0);
  return { stages, items, totalBeats: beat, totalSeconds };
}

/** Seconds from the start of the challenge to `beat` (tempo changes at each stage). */
export function secondsAtBeat(plan: ChallengePlan, beat: number): number {
  let t = 0;
  for (const s of plan.stages) {
    const inStage = Math.min(Math.max(beat - s.startBeat, 0), s.beats);
    t += (inStage * 60) / s.bpm;
  }
  return t;
}

/** Index of the chord being played at `beat`, or -1 before the first one. */
export function itemAtBeat(plan: ChallengePlan, beat: number): number {
  if (beat < 0) return -1;
  let lo = 0;
  let hi = plan.items.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (plan.items[mid].startBeat <= beat) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

export type ChallengeHistory = { bpm: number; rating: "clean" | "some-buzz" | "lost" } | null;

/** Storage id for a set of chords, independent of order. */
export function challengeId(chords: ChordId[]): string {
  return `challenge:${[...new Set(chords)].sort().join("-")}`;
}

/**
 * What the app suggests for these chords: time, tempo range, beats per chord and stages,
 * with the reason in words.
 */
export function suggestChallenge(chords: ChordId[], last: ChallengeHistory): { settings: ChallengeSettings; reason: string } {
  const barre = chords.filter((c) => CHORDS[c].barre && c !== "dm7");
  const unlearned = chords.filter((c) => !CHORDS_WITH_LESSON.includes(c));
  const hard = barre.length > 0 || unlearned.length > 0;

  const minutes = Math.min(5, Math.max(1, Math.round((chords.length * 45) / 60)));
  const beatsPerChord: BeatsPerChord = hard ? 8 : 4;
  let start = 50;
  if (last) start = last.bpm - (last.rating === "clean" ? 5 : last.rating === "some-buzz" ? 10 : 15);
  if (barre.length && !last) start -= 5;
  start = Math.min(140, Math.max(LIMITS.minBpm, round5(start)));
  const end = Math.min(LIMITS.maxBpm, start + 20);
  const stages = Math.min(4, Math.max(2, minutes + 1));

  const parts: string[] = [`${chords.length} hợp âm`];
  if (barre.length) parts.push(`có ${barre.map((c) => CHORDS[c].symbol).join(", ")} là hợp âm chặn`);
  else if (unlearned.length) parts.push(`có ${unlearned.map((c) => CHORDS[c].symbol).join(", ")} chưa có bài học`);
  if (last) parts.push(`lần trước bạn tới ${last.bpm} BPM`);
  const reason = `${parts.join(", ")}: mỗi hợp âm ${beatsPerChord} phách, ${start} → ${end} BPM, ${minutes} phút.`;

  return { settings: { chords, minutes, startBpm: start, endBpm: end, beatsPerChord, stages }, reason };
}

/** Clamp user-entered settings into safe ranges. */
export function normalizeSettings(s: ChallengeSettings): ChallengeSettings {
  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));
  const startBpm = clamp(s.startBpm, LIMITS.minBpm, LIMITS.maxBpm);
  return {
    chords: [...new Set(s.chords)].slice(0, LIMITS.maxChords),
    minutes: clamp(s.minutes, LIMITS.minMinutes, LIMITS.maxMinutes),
    startBpm,
    endBpm: clamp(Math.max(s.endBpm, startBpm), LIMITS.minBpm, LIMITS.maxBpm),
    beatsPerChord: s.beatsPerChord,
    stages: clamp(s.stages, 1, LIMITS.maxStages),
  };
}

/** Quick presets shown above the chord picker. */
export const CHALLENGE_PRESETS: { id: string; title: string; chords: ChordId[] }[] = [
  { id: "beginner", title: "Người mới: Em–Am–D–G", chords: ["em", "am", "d", "g"] },
  { id: "pop", title: "4 hợp âm pop: C–G–Am–F", chords: ["c", "g", "am", "f"] },
  { id: "ballad", title: "Ballad: C–Am–Dm–G7", chords: ["c", "am", "dm", "g7"] },
  { id: "open-major", title: "Trưởng mở: A–D–E", chords: ["a", "d", "e"] },
  { id: "sevenths", title: "Bảy: A7–D7–E7", chords: ["a7", "d7", "e7"] },
];
