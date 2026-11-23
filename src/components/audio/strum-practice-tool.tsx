"use client";

import { useState } from "react";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { STRUM_PRESETS } from "@/lib/practice/strum-pattern";
import { StrumPattern } from "./strum-pattern";

/** Chord loops a beginner can already play after Level 1, one chord per bar. */
const PROGRESSIONS: ChordId[][] = [["em"], ["g", "c"], ["g", "em", "c", "d"], ["am", "e7"], ["c", "g", "am", "em"]];

const label = (p: ChordId[]) => p.map((c) => CHORDS[c].symbol).join(" – ");
const presets = Object.values(STRUM_PRESETS);

/** Tools page: any strumming pattern over any beginner chord loop, with the metronome. */
export function StrumPracticeTool() {
  const [preset, setPreset] = useState(STRUM_PRESETS.folk.id);
  const [prog, setProg] = useState(2);
  const strokes = presets.find((p) => p.id === preset)!.strokes;

  return (
    <section className="space-y-4" data-testid="strum-tool">
      <div>
        <h2 className="font-semibold">Tập mẫu gảy</h2>
        <p className="text-sm text-muted-foreground">
          Chọn mẫu gảy và vòng hợp âm, mỗi hợp âm một ô nhịp. Máy đếm 4 tiếng tích rồi mới gảy.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="space-y-1 text-sm">
          <span className="block text-muted-foreground">Mẫu gảy</span>
          <select className="h-10 rounded-md border bg-background px-2" value={preset} onChange={(e) => setPreset(e.target.value)} data-testid="strum-tool-pattern">
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}: {p.strokes.map((s) => (s === "D" ? "↓" : s === "U" ? "↑" : "·")).join(" ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="block text-muted-foreground">Vòng hợp âm</span>
          <select className="h-10 rounded-md border bg-background px-2" value={prog} onChange={(e) => setProg(Number(e.target.value))} data-testid="strum-tool-chords">
            {PROGRESSIONS.map((p, i) => (
              <option key={i} value={i}>
                {label(p)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* a new choice starts a fresh player (and stops the old one) */}
      <StrumPattern key={`${preset}-${prog}`} strokes={strokes} chords={PROGRESSIONS[prog]} bpm={70} />
    </section>
  );
}
