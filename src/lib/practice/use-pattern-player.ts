"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getGuitar } from "@/lib/audio/guitar-synth";
import { claimTransport, ownsTransport, releaseTransport } from "@/lib/audio/transport-owner";
import { buildTimeline, tempoForRound, type Sequence, type Tempo } from "./sequence";

export type PlayerStatus = "idle" | "loading" | "preview" | "countin" | "running";

export const PREVIEW_BPM = 30;
const OWNER = "pattern-player";
const COUNT_IN = 4;

/**
 * Plays a practice sequence on the Web Audio clock (Tone.Transport), so pictures and sound stay
 * in step. Preview = one slow pass with no count-in. Run = one bar of count-in, then the sequence
 * loops and speeds up round by round (tempoForRound) until the learner stops.
 */
export function usePatternPlayer(sequence: Sequence, tempo: Tempo) {
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [stepIndex, setStepIndex] = useState(-1);
  const [beat, setBeat] = useState(-1);
  const [round, setRound] = useState(0);
  const [bpm, setBpm] = useState(tempo.start);
  const [error, setError] = useState<string | null>(null);

  const held = useRef<number | null>(null);
  const muted = useRef(false);
  const cleanup = useRef<(() => void) | null>(null);
  const startedAt = useRef<number | null>(null);
  const [isHeld, setIsHeld] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const stop = useCallback(() => {
    cleanup.current?.();
    cleanup.current = null;
    setStatus("idle");
    setStepIndex(-1);
    setBeat(-1);
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback(
    async (mode: "preview" | "run") => {
      cleanup.current?.();
      setError(null);
      setStatus("loading");
      try {
        const { Tone, pluck } = await getGuitar();
        claimTransport(OWNER, () => {
          cleanup.current?.();
          cleanup.current = null;
          setStatus("idle");
          setStepIndex(-1);
        });
        const t = Tone.getTransport();
        t.stop();
        t.cancel();
        t.position = 0;
        t.loop = false;

        const hi = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 } }).toDestination();
        const lo = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 } }).toDestination();
        hi.volume.value = -10;
        lo.volume.value = -16;

        const countIn = mode === "preview" ? 0 : COUNT_IN;
        const ticks = (beats: number) => `${Math.round(beats * t.PPQ)}i`;
        const draw = Tone.getDraw();

        for (const e of buildTimeline(sequence, countIn)) {
          t.schedule((time) => {
            if (e.type === "click") {
              (e.accent ? hi : lo).triggerAttackRelease(e.accent ? 1600 : 1000, 0.03, time);
              const b = Math.round(e.beat - (e.countIn ? 0 : countIn)) % 4;
              draw.schedule(() => {
                setBeat(b);
                if (e.countIn) setStatus("countin");
              }, time);
            } else {
              if (!muted.current) for (const h of sequence.steps[e.index].hits) pluck(h.string, h.fret, time);
              draw.schedule(() => setStepIndex(e.index), time);
            }
          }, ticks(e.beat));
        }

        if (mode === "preview") {
          t.bpm.value = PREVIEW_BPM;
          setBpm(PREVIEW_BPM);
          t.schedule((time) => draw.schedule(() => stop(), time), ticks(sequence.beats + 0.5));
          setStatus("preview");
        } else {
          let r = -1;
          t.bpm.value = tempoForRound(tempo, 0, held.current);
          setBpm(t.bpm.value);
          setRound(0);
          // fires each time the loop starts again: next round, maybe faster
          t.schedule((time) => {
            r += 1;
            const next = tempoForRound(tempo, r, held.current);
            t.bpm.setValueAtTime(next, time);
            draw.schedule(() => {
              setRound(r);
              setBpm(next);
              setStatus("running");
            }, time);
          }, ticks(countIn));
          t.loop = true;
          t.loopStart = ticks(countIn);
          t.loopEnd = ticks(countIn + sequence.beats);
        }

        cleanup.current = () => {
          if (ownsTransport(OWNER)) {
            t.stop();
            t.cancel();
            t.loop = false;
            t.position = 0;
            releaseTransport(OWNER);
          }
          hi.dispose();
          lo.dispose();
        };
        startedAt.current = performance.now();
        t.start("+0.1");
      } catch {
        setError("Trình duyệt không phát được âm thanh. Hãy chạm lại nút để thử lần nữa.");
        setStatus("idle");
      }
    },
    [sequence, tempo, stop],
  );

  return {
    status,
    stepIndex,
    beat,
    round,
    bpm,
    error,
    isHeld,
    isMuted,
    preview: () => void play("preview"),
    start: () => void play("run"),
    stop,
    /** Seconds since the last start (for saving results). */
    elapsedSeconds: () => (startedAt.current ? Math.round((performance.now() - startedAt.current) / 1000) : 0),
    /** Freeze the current tempo (or let it rise again). */
    toggleHold: () => {
      held.current = held.current == null ? bpm : null;
      setIsHeld(held.current != null);
    },
    /** Only the click, no guitar sound: play along on the real guitar. */
    toggleMute: () => {
      muted.current = !muted.current;
      setIsMuted(muted.current);
    },
  };
}
