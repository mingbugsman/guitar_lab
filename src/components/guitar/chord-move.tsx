"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { strumChord } from "@/lib/audio/guitar-synth";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { chordMoves, describeMoves, fingerSpots, moveSummary } from "@/lib/music/chord-move";
import { cn } from "@/lib/utils";
import { chordMarkersStatic } from "./chord-markers";
import { FittedFretboard } from "./fitted-fretboard";
import { useGuitarView } from "./view-context";

const HOLD_MS = 1900;

/**
 * A chord change in motion: the finger dots glide from one chord to the other on the learner's
 * fretboard view, with one sentence per finger saying where it goes.
 */
export function ChordMove({ from, to }: { from: ChordId; to: ChordId }) {
  const { view, handedness } = useGuitarView();
  const a = CHORDS[from];
  const b = CHORDS[to];
  const [at, setAt] = useState<"from" | "to">("from");
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const moves = useMemo(() => chordMoves(a, b), [a, b]);
  const summary = moveSummary(moves);
  const steps = describeMoves(moves);

  const current = at === "from" ? a : b;
  const fingers = useMemo(() => {
    const here = new Map(fingerSpots(current).map((p) => [p.finger, p]));
    const other = new Map(fingerSpots(current === a ? b : a).map((p) => [p.finger, p]));
    const all = [...new Set([...here.keys(), ...other.keys()])].sort();
    return all.map((finger) => {
      const p = here.get(finger) ?? other.get(finger)!;
      return { finger, string: p.string, fret: p.fret, hidden: !here.has(finger) };
    });
  }, [current, a, b]);
  const openAndMuted = chordMarkersStatic(current).filter((m) => m.fret === 0 || m.fret === "x");

  const show = (next: "from" | "to") => {
    setAt(next);
    void strumChord(next === "from" ? a : b);
  };

  useEffect(() => {
    if (!playing) return;
    let side: "from" | "to" = "from";
    show(side);
    timer.current = setInterval(() => {
      side = side === "from" ? "to" : "from";
      show(side);
    }, HOLD_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className="space-y-3" data-testid={`chord-move-${from}-${to}`} data-at={at}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          variant={playing ? "outline" : "default"}
          data-testid="chord-move-play"
        >
          {playing ? <Pause /> : <Play />}
          {playing ? "Dừng" : "Xem tay chuyển"}
        </Button>
        <div className="flex" role="group" aria-label="Chọn hợp âm để xem">
          {(["from", "to"] as const).map((side) => (
            <button
              key={side}
              type="button"
              aria-pressed={at === side}
              onClick={() => {
                setPlaying(false);
                show(side);
              }}
              className={cn(
                "h-9 min-w-14 border px-3 text-sm font-semibold first:rounded-l-md last:rounded-r-md last:border-l-0",
                at === side ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {(side === "from" ? a : b).symbol}
            </button>
          ))}
        </div>
      </div>

      <figure className="gl-stage p-2">
        <FittedFretboard view={view} handedness={handedness} frets={4} markers={openAndMuted} fingers={fingers} />
        <figcaption className="px-1 pt-1 text-xs text-muted-foreground">
          Đang hiện <span className="font-semibold text-foreground">{current.symbol}</span>. Chấm cam là ngón tay bấm, số trong chấm là số ngón.
        </figcaption>
      </figure>

      <div>
        <p className="text-sm font-semibold">
          Từ {a.symbol} sang {b.symbol}
          {summary && <span className="font-normal">: {summary}</span>}
        </p>
        <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground" data-testid="chord-move-steps">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Nhấc các ngón lên vừa đủ khỏi dây và di chuyển cùng lúc, không đặt từng ngón một. Đổi ngược lại thì làm ngược các bước trên.
        </p>
      </div>
    </div>
  );
}
