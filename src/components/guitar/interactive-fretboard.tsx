"use client";

import type { FretboardProps } from "./fretboard";
import { FittedFretboard } from "./fitted-fretboard";
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
    <figure className="min-w-0 space-y-3">
      {showToggle && <ViewToggle />}
      <div className="gl-stage p-2">
        <FittedFretboard view={view} handedness={handedness} markers={markers} onStringClick={onStringClick} {...rest} />
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
