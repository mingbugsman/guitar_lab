"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { arpeggiateChord, strumChord } from "@/lib/audio/guitar-synth";
import type { ChordShape } from "@/lib/music/chords";
import { STRING_NUMBERS_LOW_TO_HIGH } from "@/lib/music/guitar";
import { ChordDiagram, describeChord } from "./chord-diagram";
import { Fretboard, type FretMarker } from "./fretboard";
import { useGuitarView } from "./view-context";
import { ViewToggle } from "./view-toggle";

export function chordMarkers(chord: ChordShape): FretMarker[] {
  return STRING_NUMBERS_LOW_TO_HIGH.map((s) => ({
    string: s,
    fret: chord.frets[s],
    finger: chord.fingers[s],
  }));
}

/**
 * The same chord shown two ways, side by side, generated from one data source:
 *  - chord diagram (guitar stood upright facing you)
 *  - fretboard in the learner's chosen view (default: looking down while holding it)
 * plus written steps derived from the same data.
 */
export function ChordCompare({ chord }: { chord: ChordShape }) {
  const { view, handedness } = useGuitarView();
  const steps = describeChord(chord);
  return (
    <div className="space-y-4" data-testid={`chord-compare-${chord.id}`}>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <figure className="rounded-xl border bg-card p-3">
          <ChordDiagram chord={chord} handedness={handedness} className="mx-auto" />
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            Sơ đồ hợp âm: đàn dựng đứng, mặt đàn hướng về bạn, lược đàn ở trên. Dây 6 nằm bên{" "}
            {handedness === "right" ? "TRÁI" : "PHẢI"}.
          </figcaption>
        </figure>
        <figure className="space-y-2">
          <ViewToggle />
          <div className="overflow-x-auto rounded-xl border bg-card p-2">
            <div className="min-w-[480px]">
              <Fretboard view={view} handedness={handedness} frets={4} markers={chordMarkers(chord)} />
            </div>
          </div>
          <figcaption className="text-xs text-muted-foreground">
            Cùng thế bấm {chord.symbol} trên cần đàn. Số trong chấm tròn là ngón tay bấm.
          </figcaption>
        </figure>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm font-semibold">
          Cách bấm {chord.symbol}, lần lượt từ dây 6 (to nhất, gần mặt bạn) đến dây 1:
        </p>
        <ol className="mt-2 space-y-1 text-sm">
          {steps.map((s) => (
            <li
              key={s.string}
              className={
                s.kind === "muted"
                  ? "text-destructive"
                  : s.kind === "open"
                    ? "text-muted-foreground"
                    : "font-medium text-foreground"
              }
            >
              {s.text}
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => strumChord(chord, "down")}>
            <Volume2 /> Nghe gảy xuống
          </Button>
          <Button size="sm" variant="secondary" onClick={() => arpeggiateChord(chord)}>
            <Volume2 /> Nghe từng dây
          </Button>
        </div>
      </div>
    </div>
  );
}
