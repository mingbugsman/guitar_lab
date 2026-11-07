"use client";

import { Fretboard, type FretboardProps } from "./fretboard";
import { ViewToggle } from "./view-toggle";
import { useGuitarView } from "./view-context";
import { playString } from "@/lib/audio/guitar-synth";
import type { StringNumber } from "@/lib/music/guitar";

type Props = Omit<FretboardProps, "view" | "handedness" | "onStringClick"> & {
  playable?: boolean;
  showToggle?: boolean;
  caption?: string;
};

/** Fretboard that follows the learner's chosen view and plays a string when tapped. */
export function InteractiveFretboard({ playable = true, showToggle = true, caption, markers = [], ...rest }: Props) {
  const { view, handedness } = useGuitarView();
  const onStringClick = playable
    ? (s: StringNumber) => {
        const m = markers.find((x) => x.string === s && typeof x.fret === "number");
        void playString(s, typeof m?.fret === "number" ? m.fret : 0);
      }
    : undefined;
  return (
    <figure className="space-y-3">
      {showToggle && <ViewToggle />}
      <div className="overflow-x-auto rounded-xl border bg-card p-2">
        <div className="min-w-[520px]">
          <Fretboard view={view} handedness={handedness} markers={markers} onStringClick={onStringClick} {...rest} />
        </div>
      </div>
      {(caption || playable) && (
        <figcaption className="text-xs text-muted-foreground">
          {caption}
          {playable && " Chạm vào một dây trong hình để nghe âm thanh của nó."}
        </figcaption>
      )}
    </figure>
  );
}
