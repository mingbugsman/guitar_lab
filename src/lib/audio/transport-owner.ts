"use client";

/**
 * Tone.Transport is one shared clock. Only one feature may drive it at a time (the metronome,
 * a drill…). Claiming it stops the previous owner, and an owner only stops the transport while
 * it still owns it, so a late cleanup can never silence the new owner.
 */
let owner: { id: string; stop: () => void } | null = null;

export function claimTransport(id: string, stop: () => void) {
  if (owner && owner.id !== id) owner.stop();
  owner = { id, stop };
}

export function ownsTransport(id: string): boolean {
  return owner?.id === id;
}

export function releaseTransport(id: string) {
  if (owner?.id === id) owner = null;
}
