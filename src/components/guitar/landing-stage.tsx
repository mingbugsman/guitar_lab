"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { strumChord } from "@/lib/audio/guitar-synth";
import { CHORDS } from "@/lib/music/chords";
import { chordMarkersStatic } from "./chord-markers";
import { InteractiveFretboard } from "./interactive-fretboard";
import { GuitarViewProvider } from "./view-context";

/** The landing page's one big object: a fretboard visitors can actually play and flip. */
export function LandingStage() {
  const chord = CHORDS.am;
  return (
    <GuitarViewProvider>
      <div data-testid="landing-stage">
        <InteractiveFretboard frets={5} markers={chordMarkersStatic(chord)} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-11" onClick={() => strumChord(chord, "down")}>
            <Volume2 /> Nghe hợp âm Am
          </Button>
          <p className="text-sm text-muted-foreground">
            Chấm cam là chỗ đặt ngón tay, số bên trong là ngón nào. Chạm vào một dây để nghe. Nếu bạn gảy bằng tay trái, bấm nút ⇄ để lật hình cho khớp với đàn của bạn.
          </p>
        </div>
      </div>
    </GuitarViewProvider>
  );
}
