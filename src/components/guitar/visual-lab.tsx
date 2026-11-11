"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CHORDS, CHORD_IDS, type ChordId } from "@/lib/music/chords";
import { ChordCompare } from "./chord-compare";
import { GuitarAnatomy } from "./guitar-anatomy";
import { FingerNumberDiagram } from "./hand-diagrams";
import { InteractiveFretboard } from "./interactive-fretboard";
import { useGuitarView } from "./view-context";

export function GuitarVisualLab() {
  const { handedness } = useGuitarView();
  const [showNotes, setShowNotes] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [chord, setChord] = useState<ChordId>("em");

  return (
    <div className="space-y-10">
      <section aria-labelledby="board" className="space-y-3">
        <h2 id="board" className="text-xl font-bold">
          Cần đàn — đối chiếu với đàn của bạn
        </h2>
        <p className="text-sm text-muted-foreground">
          Ôm đàn như khi chơi và cúi nhìn xuống: đàn của bạn trông giống góc “Nhìn xuống”. Hình luôn ghi số dây và hướng thật
          (phía mặt bạn / phía sàn nhà / đầu đàn) để bạn không bị nhầm khi đổi góc nhìn.
        </p>
        <Button size="sm" variant={showNotes ? "default" : "outline"} onClick={() => setShowNotes((v) => !v)} aria-pressed={showNotes}>
          {showNotes ? "Ẩn tên nốt" : "Hiện tên nốt tự nhiên"}
        </Button>
        <Button
          size="sm"
          variant={zoom ? "default" : "outline"}
          onClick={() => setZoom((v) => !v)}
          aria-pressed={zoom}
          className="ml-2"
        >
          {zoom ? "Xem đủ 12 phím" : "Phóng to phím 1–5"}
        </Button>
        <InteractiveFretboard frets={zoom ? 5 : 12} showAllNotes={showNotes} />
      </section>

      <section aria-labelledby="chords" className="space-y-3">
        <h2 id="chords" className="text-xl font-bold">
          Sơ đồ hợp âm ↔ cần đàn
        </h2>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn hợp âm">
          {CHORD_IDS.map((id) => (
            <Button key={id} size="sm" role="radio" aria-checked={chord === id} variant={chord === id ? "default" : "outline"} onClick={() => setChord(id)}>
              {CHORDS[id].symbol}
            </Button>
          ))}
        </div>
        <ChordCompare chord={CHORDS[chord]} />
      </section>

      <section aria-labelledby="anatomy" className="space-y-3">
        <h2 id="anatomy" className="text-xl font-bold">
          Cấu tạo cây đàn
        </h2>
        <GuitarAnatomy handedness={handedness} />
      </section>

      <section aria-labelledby="fingers" className="space-y-3">
        <h2 id="fingers" className="text-xl font-bold">
          Số ngón tay bấm
        </h2>
        <div className="gl-stage p-4">
          <FingerNumberDiagram handedness={handedness} />
        </div>
      </section>
    </div>
  );
}
