"use client";

import { Volume2 } from "lucide-react";
import { ChordCompare } from "@/components/guitar/chord-compare";
import { GuitarAnatomy } from "@/components/guitar/guitar-anatomy";
import { FingerNumberDiagram, PostureDiagram } from "@/components/guitar/hand-diagrams";
import { InteractiveFretboard } from "@/components/guitar/interactive-fretboard";
import { useGuitarView } from "@/components/guitar/view-context";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";
import { Button } from "@/components/ui/button";
import { playString } from "@/lib/audio/guitar-synth";
import { CHORDS } from "@/lib/music/chords";
import { NATURAL_NOTES } from "@/lib/music/notes";
import { STANDARD_TUNING, STRING_NUMBERS_LOW_TO_HIGH } from "@/lib/music/guitar";
import type { Visual } from "@/content/types";

function StringsTable() {
  return (
    <div className="overflow-hidden border-y">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Dây</th>
            <th className="px-3 py-2">Nốt</th>
            <th className="hidden px-3 py-2 sm:table-cell">Tần số</th>
            <th className="px-3 py-2">Vị trí khi ôm đàn nhìn xuống</th>
            <th className="px-3 py-2"><span className="sr-only">Nghe</span></th>
          </tr>
        </thead>
        <tbody>
          {STRING_NUMBERS_LOW_TO_HIGH.map((s) => {
            const st = STANDARD_TUNING[s];
            return (
              <tr key={s} className="border-t">
                <td className="px-3 py-2 font-semibold">Dây {s}</td>
                <td className="gl-num px-3 py-2">{st.label}</td>
                <td className="hidden px-3 py-2 tabular-nums sm:table-cell">{st.frequency.toFixed(2)} Hz</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {s === 6 ? "Trên cùng — gần mặt bạn, to nhất" : s === 1 ? "Dưới cùng — gần sàn nhà, mảnh nhất" : `Thứ ${7 - s} tính từ phía mặt bạn`}
                </td>
                <td className="px-2 py-1 text-right">
                  <Button size="sm" variant="ghost" onClick={() => playString(s)} aria-label={`Nghe dây ${s}`}>
                    <Volume2 /> Nghe
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NotesRow() {
  return (
    <div className="grid grid-cols-7 gap-1.5 text-center">
      {NATURAL_NOTES.map((n, i) => (
        <div key={n.letter} className="border-y py-2">
          <div className="text-lg font-bold">{n.letter}</div>
          <div className="text-xs text-muted-foreground">{n.solfege}</div>
          {i < 6 && (
            <div className="gl-num mt-1 text-[10px] text-muted-foreground">
              {n.letter === "E" || n.letter === "B" ? "→ ½" : "→ 1"}
            </div>
          )}
        </div>
      ))}
      <p className="col-span-7 mt-1 text-xs text-muted-foreground">
        “→ 1” = cách nốt kế tiếp một cung (2 phím) · “→ ½” = nửa cung (1 phím)
      </p>
    </div>
  );
}

export function LessonVisual({ visual }: { visual: Visual }) {
  const { handedness } = useGuitarView();
  switch (visual.kind) {
    case "anatomy":
      return <GuitarAnatomy handedness={handedness} initialPart={visual.initialPart} />;
    case "posture":
      return <PostureDiagram handedness={handedness} />;
    case "fingers":
      return <FingerNumberDiagram handedness={handedness} />;
    case "fretboard":
      return (
        <InteractiveFretboard
          frets={visual.frets}
          markers={visual.markers}
          highlightStrings={visual.highlightStrings}
          showAllNotes={visual.showAllNotes}
        />
      );
    case "chord":
      return <ChordCompare chord={CHORDS[visual.chord]} />;
    case "strings":
      return <StringsTable />;
    case "tuner":
      return <Tuner />;
    case "metronome":
      return <Metronome initialBpm={visual.bpm} initialBeats={visual.beats} compact />;
    case "notes":
      return <NotesRow />;
  }
}
