/** Pitch-class names using sharps (Vietnamese lessons also mention flats where relevant). */
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export type NoteName = (typeof NOTE_NAMES)[number];

/** The seven natural notes and their Vietnamese solfège names. */
export const NATURAL_NOTES = [
  { letter: "C", solfege: "Đô" },
  { letter: "D", solfege: "Rê" },
  { letter: "E", solfege: "Mi" },
  { letter: "F", solfege: "Fa" },
  { letter: "G", solfege: "Sol" },
  { letter: "A", solfege: "La" },
  { letter: "B", solfege: "Si" },
] as const;

export const A4_FREQUENCY = 440;
export const A4_MIDI = 69;

export function midiToFrequency(midi: number): number {
  return A4_FREQUENCY * 2 ** ((midi - A4_MIDI) / 12);
}

export function frequencyToMidiFloat(frequency: number): number {
  return A4_MIDI + 12 * Math.log2(frequency / A4_FREQUENCY);
}

export function pitchClass(midi: number): NoteName {
  return NOTE_NAMES[((Math.round(midi) % 12) + 12) % 12];
}

export function octaveOf(midi: number): number {
  return Math.floor(Math.round(midi) / 12) - 1;
}

/** e.g. 40 → "E2" (scientific pitch notation). */
export function midiToNoteLabel(midi: number): string {
  return `${pitchClass(midi)}${octaveOf(midi)}`;
}

export type DetectedNote = {
  midi: number;
  name: NoteName;
  octave: number;
  /** Deviation from the nearest equal-tempered note, in cents (-50..+50). */
  cents: number;
};

export function frequencyToNote(frequency: number): DetectedNote {
  const exact = frequencyToMidiFloat(frequency);
  const midi = Math.round(exact);
  return {
    midi,
    name: pitchClass(midi),
    octave: octaveOf(midi),
    cents: Math.round((exact - midi) * 100 * 10) / 10,
  };
}

/** Cents between two frequencies (positive when `frequency` is sharp of `target`). */
export function centsBetween(frequency: number, target: number): number {
  return 1200 * Math.log2(frequency / target);
}
