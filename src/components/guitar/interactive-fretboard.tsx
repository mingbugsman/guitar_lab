"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { FretCell, FretboardProps, FretOverlay } from "./fretboard";
import { FittedFretboard } from "./fitted-fretboard";
import { stringRowsTopToBottom } from "./orientation";
import { ViewToggle } from "./view-toggle";
import { useGuitarView } from "./view-context";
import { playString } from "@/lib/audio/guitar-synth";
import { noteAt } from "@/lib/music/guitar";

type Props = Omit<FretboardProps, "view" | "handedness" | "onStringClick" | "onCellPress" | "focusCell"> & {
  playable?: boolean;
  showToggle?: boolean;
  caption?: string;
};

const PRESSED_MS = 450;

/**
 * Fretboard that follows the learner's chosen view and works like a real neck: tap any cell
 * (any string, any fret, or before the nut for the open string) to hear that note.
 * Keyboard: arrow keys move between cells in the direction they are drawn, Enter/Space plays.
 */
export function InteractiveFretboard({ playable = true, showToggle = true, caption, overlays = [], frets = 5, ...rest }: Props) {
  const { view, handedness } = useGuitarView();
  const [pressed, setPressed] = useState<FretCell | null>(null);
  const [focus, setFocus] = useState<FretCell | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const press = (cell: FretCell) => {
    void playString(cell.string, cell.fret);
    setPressed(cell);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPressed(null), PRESSED_MS);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rows = stringRowsTopToBottom(view);
    const cur = focus ?? { string: rows[0], fret: 0 };
    const row = rows.indexOf(cur.string);
    // "towards the body" is to the right on screen, or to the left when mirrored
    const toBody = handedness === "left" ? "ArrowLeft" : "ArrowRight";
    const toHead = handedness === "left" ? "ArrowRight" : "ArrowLeft";
    let next: FretCell | null = null;
    if (e.key === "ArrowUp") next = { string: rows[Math.max(0, row - 1)], fret: cur.fret };
    else if (e.key === "ArrowDown") next = { string: rows[Math.min(5, row + 1)], fret: cur.fret };
    else if (e.key === toBody) next = { ...cur, fret: Math.min(frets, cur.fret + 1) };
    else if (e.key === toHead) next = { ...cur, fret: Math.max(0, cur.fret - 1) };
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      press(cur);
      setFocus(cur);
      return;
    }
    if (next) {
      e.preventDefault();
      setFocus(next);
    }
  };

  const all: FretOverlay[] = pressed
    ? [...overlays, { ...pressed, kind: "pressed", label: noteAt(pressed.string, pressed.fret) }]
    : overlays;

  return (
    <figure className="min-w-0 space-y-3">
      {showToggle && <ViewToggle />}
      <div
        className="gl-stage p-2 outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        tabIndex={playable ? 0 : undefined}
        role={playable ? "application" : undefined}
        aria-label={playable ? "Cần đàn bấm được. Dùng phím mũi tên để chọn ô, Enter để nghe." : undefined}
        onKeyDown={playable ? onKeyDown : undefined}
        onBlur={() => setFocus(null)}
        data-pressed={pressed ? `${pressed.string}-${pressed.fret}` : undefined}
      >
        <FittedFretboard
          view={view}
          handedness={handedness}
          frets={frets}
          overlays={all}
          onCellPress={playable ? press : undefined}
          focusCell={focus}
          {...rest}
        />
      </div>
      {pressed && (
        <p className="sr-only" aria-live="polite">
          Dây {pressed.string}, {pressed.fret === 0 ? "buông" : `phím ${pressed.fret}`}: {noteAt(pressed.string, pressed.fret)}
        </p>
      )}
      {(caption || playable) && (
        <figcaption className="text-xs text-muted-foreground">
          {caption}
          {playable && " Chạm vào bất kỳ ô nào trên hình để nghe nốt đó. Chạm trước lược đàn để nghe dây buông."}
        </figcaption>
      )}
    </figure>
  );
}
