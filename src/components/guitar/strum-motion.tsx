"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playString, strumChord } from "@/lib/audio/guitar-synth";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "@/lib/music/guitar";
import { cn } from "@/lib/utils";
import { PHYSICAL, stringRowsTopToBottom } from "./orientation";
import { useGuitarView } from "./view-context";

export type StrumDirection = "D" | "U";

/**
 * Where the pick is during one slot, from 0 (top row, string 6 side) to 1 (bottom row).
 * A down stroke crosses the strings in the first quarter of its slot; the hand then waits, or
 * travels back without touching the strings when the next stroke goes the same way.
 */
export function pickPosition(pattern: StrumDirection[], slot: number, phase: number): { y: number; ghost: boolean } {
  const dir = pattern[slot % pattern.length];
  const next = pattern[(slot + 1) % pattern.length];
  const start = dir === "D" ? 0 : 1;
  const end = 1 - start;
  const HIT = 0.25;
  if (phase < HIT) return { y: start + (end - start) * ease(phase / HIT), ghost: false };
  if (next !== dir && phase >= HIT) return { y: end, ghost: false };
  // same direction again: the hand travels back through the air in the second half
  if (phase < 0.5) return { y: end, ghost: false };
  return { y: end + (start - end) * ease((phase - 0.5) / 0.5), ghost: true };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const W = 340;
const GAP = 22;
const TOP = 34;
const ROWS_H = GAP * 5;
const H = TOP + ROWS_H + 34;
const LABEL_W = 52;

/**
 * Strumming direction in motion: the pick sweeps across the strings in the same up/down as the
 * fretboard picture (string 6 on top, toward your face), in time with the sound, with the count
 * underneath.
 */
export function StrumMotion({
  pattern,
  perBeat = 1,
  strings = STRING_NUMBERS_LOW_TO_HIGH,
  chord,
  bpm = 60,
}: {
  pattern: StrumDirection[];
  perBeat?: 1 | 2;
  /** Strings the pick crosses; one string for single-string picking. */
  strings?: readonly StringNumber[];
  /** Sound of a full strum; without it the listed strings ring open. */
  chord?: ChordId;
  bpm?: number;
}) {
  const { handedness } = useGuitarView();
  const left = handedness === "left";
  const rows = stringRowsTopToBottom("player");
  const rowY = (s: StringNumber) => TOP + rows.indexOf(s) * GAP;
  const hitTop = Math.min(...strings.map(rowY)) - 10;
  const hitBottom = Math.max(...strings.map(rowY)) + 10;

  const [playing, setPlaying] = useState(false);
  const [slot, setSlot] = useState(-1);
  const pick = useRef<SVGGElement>(null);
  const X = (x: number) => (left ? W - x : x);
  const pickX = X(LABEL_W + (W - LABEL_W) / 2);

  const placePick = (y: number, ghost: boolean) => {
    const el = pick.current;
    if (!el) return;
    el.setAttribute("transform", `translate(${pickX} ${hitTop + (hitBottom - hitTop) * y})`);
    el.style.opacity = ghost ? "0.35" : "1";
  };

  useEffect(() => {
    if (!playing) {
      setSlot(-1);
      placePick(pattern[0] === "D" ? 0 : 1, false);
      return;
    }
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slotMs = 60000 / bpm / perBeat;
    const t0 = performance.now() + 150;
    let last = -1;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - t0);
      const n = Math.floor(elapsed / slotMs);
      const phase = (elapsed % slotMs) / slotMs;
      if (n !== last) {
        last = n;
        const i = n % pattern.length;
        setSlot(i);
        const dir = pattern[i];
        if (chord) void strumChord(CHORDS[chord], dir === "D" ? "down" : "up");
        else {
          const order = dir === "D" ? [...strings].sort((a, b) => b - a) : [...strings].sort((a, b) => a - b);
          order.forEach((s, k) => setTimeout(() => void playString(s), k * 30));
        }
      }
      const p = pickPosition(pattern, n, reduce ? 0.3 : phase);
      placePick(p.y, p.ghost);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const count = pattern.map((_, i) => (perBeat === 1 ? `${i + 1}` : i % 2 === 0 ? `${i / 2 + 1}` : "và"));
  const describe = `Hướng gảy: ${pattern.map((d) => (d === "D" ? "xuống" : "lên")).join(", ")}`;

  return (
    <div className="space-y-3" data-testid="strum-motion" data-slot={slot}>
      <figure className="gl-stage p-2">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={describe} className="mx-auto h-auto w-full max-w-md select-none">
          <title>{describe}</title>
          <text x={W / 2} y={14} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            ↑ {PHYSICAL.towardFace}
          </text>
          <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            ↓ {PHYSICAL.towardFloor}
          </text>
          {rows.map((s) => {
            const on = strings.includes(s);
            return (
              <g key={s} opacity={on ? 1 : 0.3}>
                <text x={X(LABEL_W - 8)} y={rowY(s) + 4} textAnchor={left ? "start" : "end"} className="fill-foreground text-[11px] font-semibold">
                  Dây {s}
                </text>
                <line
                  x1={X(LABEL_W)}
                  x2={X(W - 6)}
                  y1={rowY(s)}
                  y2={rowY(s)}
                  stroke="var(--foreground)"
                  strokeWidth={0.8 + (s - 1) * 0.35}
                />
              </g>
            );
          })}
          {/* the pick: a rounded triangle pointing at the strings it crosses */}
          <g ref={pick} transform={`translate(${pickX} ${pattern[0] === "D" ? hitTop : hitBottom})`} data-pick>
            <path d="M -11 -9 Q 0 -14 11 -9 Q 9 4 0 12 Q -9 4 -11 -9 Z" fill="var(--gl-finger)" stroke="var(--card)" strokeWidth={1.5} transform="rotate(90)" />
          </g>
        </svg>
        <figcaption className="px-1 pt-1 text-xs text-muted-foreground">
          Hàng trên cùng là dây 6, gần mặt bạn, giống hình cần đàn. Phím gảy mờ đi là lúc tay quay về mà không chạm dây.
        </figcaption>
      </figure>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => setPlaying((p) => !p)} variant={playing ? "outline" : "default"} data-testid="strum-play">
          {playing ? <Pause /> : <Play />}
          {playing ? "Dừng" : "Xem và nghe"}
        </Button>
        <span className="gl-num text-sm text-muted-foreground">{bpm} BPM</span>
      </div>

      <ol className="flex flex-wrap gap-1.5" aria-label="Đếm và hướng gảy">
        {pattern.map((d, i) => (
          <li
            key={i}
            data-active={slot === i || undefined}
            className={cn(
              "flex w-11 flex-col items-center rounded-md border py-1 text-sm",
              slot === i ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
            )}
          >
            <span className="text-lg leading-none font-bold" aria-label={d === "D" ? "gảy xuống" : "gảy lên"}>
              {d === "D" ? "↓" : "↑"}
            </span>
            <span className="gl-num text-xs">{count[i]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
