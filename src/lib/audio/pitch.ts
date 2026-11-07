/**
 * YIN fundamental-frequency estimator (de Cheveigné & Kawahara, 2002).
 * Pure function so it can be unit-tested without a browser.
 */
export type PitchResult = { frequency: number; probability: number } | null;

export type YinOptions = {
  threshold?: number;
  minFrequency?: number;
  maxFrequency?: number;
};

export function rms(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}

export function detectPitchYin(
  buffer: Float32Array,
  sampleRate: number,
  { threshold = 0.12, minFrequency = 60, maxFrequency = 1200 }: YinOptions = {},
): PitchResult {
  const maxTau = Math.min(Math.floor(sampleRate / minFrequency), Math.floor(buffer.length / 2));
  const minTau = Math.max(2, Math.floor(sampleRate / maxFrequency));
  if (maxTau <= minTau) return null;

  const windowSize = buffer.length - maxTau;
  const diff = new Float32Array(maxTau + 1);

  // Step 2: difference function.
  for (let tau = 1; tau <= maxTau; tau++) {
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    diff[tau] = sum;
  }

  // Step 3: cumulative mean normalized difference.
  const cmnd = new Float32Array(maxTau + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= maxTau; tau++) {
    running += diff[tau];
    cmnd[tau] = running === 0 ? 1 : (diff[tau] * tau) / running;
  }

  // Step 4: absolute threshold — first dip below threshold, then walk to its minimum.
  let tauEstimate = -1;
  for (let tau = minTau; tau <= maxTau; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= maxTau && cmnd[tau + 1] < cmnd[tau]) tau++;
      tauEstimate = tau;
      break;
    }
  }
  if (tauEstimate === -1) return null;

  // Step 5: parabolic interpolation for sub-sample accuracy.
  let betterTau = tauEstimate;
  if (tauEstimate > 1 && tauEstimate < maxTau) {
    const s0 = cmnd[tauEstimate - 1];
    const s1 = cmnd[tauEstimate];
    const s2 = cmnd[tauEstimate + 1];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) betterTau = tauEstimate + (s2 - s0) / denom;
  }

  const frequency = sampleRate / betterTau;
  if (frequency < minFrequency || frequency > maxFrequency) return null;
  return { frequency, probability: 1 - cmnd[tauEstimate] };
}

/** Median of the last N readings smooths jitter in the tuner display. */
export function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
