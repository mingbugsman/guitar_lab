/**
 * Counts strums from microphone loudness. A strum is a sudden jump in level above the room's
 * background noise; the ringing that follows only decays, so it is never counted twice.
 * Pure (no browser APIs) so it can be unit-tested with synthetic level sequences.
 */
export type StrumDetectorOptions = {
  /** Ignore new strums for this long after one is counted (a down-strum lasts ~100–250 ms). */
  refractoryMs?: number;
  /** A strum must be at least this many times louder than the background. */
  aboveNoise?: number;
  /** …and at least this many times louder than the previous reading (a rising edge). */
  rise?: number;
  /** Absolute floor so a silent room does not make every tiny click a strum. */
  minLevel?: number;
};

export type StrumDetector = {
  /** Feed one loudness reading (RMS, 0–1). Returns true when this reading is a new strum. */
  push: (level: number, timeMs: number) => boolean;
  /** Learn the background level before counting starts (e.g. during a 3-2-1 countdown). */
  calibrate: (level: number) => void;
  noiseFloor: () => number;
};

export function createStrumDetector({
  refractoryMs = 300,
  aboveNoise = 4,
  rise = 1.6,
  minLevel = 0.02,
}: StrumDetectorOptions = {}): StrumDetector {
  let noise = 0.005;
  let calibrated = false;
  let previous = 0;
  let lastStrum = -Infinity;

  return {
    calibrate(level) {
      noise = calibrated ? noise * 0.9 + level * 0.1 : level;
      calibrated = true;
    },
    noiseFloor: () => noise,
    push(level, timeMs) {
      const threshold = Math.max(minLevel, noise * aboveNoise);
      const isStrum = level > threshold && level > previous * rise && timeMs - lastStrum >= refractoryMs;
      previous = level;
      if (isStrum) {
        lastStrum = timeMs;
        return true;
      }
      // Quiet readings slowly update the background (rooms change); loud ones never do.
      if (level < threshold / 2) noise = noise * 0.995 + level * 0.005;
      return false;
    },
  };
}
