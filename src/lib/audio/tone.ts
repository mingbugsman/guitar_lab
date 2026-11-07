"use client";

/** Lazily load Tone.js only in the browser and only after a user gesture. */
let tonePromise: Promise<typeof import("tone")> | null = null;

export async function getTone() {
  if (!tonePromise) tonePromise = import("tone");
  const Tone = await tonePromise;
  if (Tone.getContext().state !== "running") await Tone.start();
  return Tone;
}
