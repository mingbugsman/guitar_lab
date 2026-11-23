"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Minus, Pause, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGuitar } from "@/lib/audio/guitar-synth";
import { claimTransport, ownsTransport, releaseTransport } from "@/lib/audio/transport-owner";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { BEATS_PER_BAR, countLabel, handMove, strokeNotes, strumTimeline, type Stroke } from "@/lib/practice/strum-pattern";
import { cn } from "@/lib/utils";

const OWNER = "strum-pattern";
const MIN_BPM = 40;
const MAX_BPM = 120;
const clamp = (v: number) => Math.min(MAX_BPM, Math.max(MIN_BPM, v));

type Status = "idle" | "loading" | "countin" | "running";

const strokeLabel = (s: Stroke, slot: number) =>
  s === "D" ? "gảy xuống" : s === "U" ? "gảy lên" : handMove(slot) === "down" ? "tay đi xuống, không chạm dây" : "tay đi lên, không chạm dây";

/**
 * A strumming pattern that plays along with the metronome: one bar of 8 slots
 * ("1 và 2 và 3 và 4 và"), ↓ and ↑ where the pick touches the strings, a faint arrow where the
 * hand moves past without touching. The slot lights up exactly when its stroke sounds (both are
 * scheduled on the Web Audio clock). With several chords, each gets one bar, then it loops.
 */
export function StrumPattern({ strokes, chords, bpm: initialBpm = 70 }: { strokes: Stroke[]; chords: ChordId[]; bpm?: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [bpm, setBpm] = useState(initialBpm);
  const [slot, setSlot] = useState(-1);
  const [bar, setBar] = useState(0);
  const [count, setCount] = useState(0);
  const [withGuitar, setWithGuitar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const guitarOn = useRef(true);
  const cleanup = useRef<(() => void) | null>(null);
  /**
   * Picture updates are queued ~0.1 s ahead of the sound (Tone.Draw). Each run gets a number;
   * an update from an earlier run is dropped, so a late one cannot flip a stopped player back
   * to "running".
   */
  const run = useRef(0);

  const stop = useCallback(() => {
    run.current += 1;
    cleanup.current?.();
    cleanup.current = null;
    setStatus("idle");
    setSlot(-1);
    setBar(0);
    setCount(0);
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    cleanup.current?.();
    const id = ++run.current;
    const live = () => run.current === id;
    setError(null);
    setStatus("loading");
    try {
      const { Tone, pluck } = await getGuitar();
      if (!live()) return; // stopped while the sound was loading
      claimTransport(OWNER, () => {
        run.current += 1;
        cleanup.current?.();
        cleanup.current = null;
        setStatus("idle");
        setSlot(-1);
      });
      const t = Tone.getTransport();
      t.stop();
      t.cancel();
      t.position = 0;
      t.loop = false;
      t.bpm.value = bpm;

      const hi = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 } }).toDestination();
      const lo = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 } }).toDestination();
      hi.volume.value = -14;
      lo.volume.value = -20;
      const draw = Tone.getDraw();
      const ticks = (beats: number) => `${Math.round(beats * t.PPQ)}i`;

      for (const e of strumTimeline(strokes, chords)) {
        t.schedule((time) => {
          if (e.kind === "click") {
            (e.accent ? hi : lo).triggerAttackRelease(e.accent ? 1600 : 1000, 0.03, time);
            if (e.countIn) {
              draw.schedule(() => {
                if (!live()) return;
                setStatus("countin");
                setCount(e.beat + 1);
              }, time);
            }
            return;
          }
          if (e.stroke !== "-" && guitarOn.current) {
            const dir = e.stroke === "D" ? "down" : "up";
            const velocity = dir === "down" ? (e.slot === 0 ? 0.9 : 0.8) : 0.55;
            strokeNotes(e.chord, dir).forEach((n, k) => pluck(n.string, n.fret, time + k * (dir === "down" ? 0.012 : 0.009), { velocity }));
          }
          draw.schedule(() => {
            if (!live()) return;
            setStatus("running");
            setSlot(e.slot);
            setBar(e.bar);
          }, time);
        }, ticks(e.beat));
      }
      t.loop = true;
      t.loopStart = ticks(BEATS_PER_BAR);
      t.loopEnd = ticks(BEATS_PER_BAR + chords.length * BEATS_PER_BAR);

      cleanup.current = () => {
        if (ownsTransport(OWNER)) {
          t.stop();
          t.cancel();
          t.loop = false;
          t.position = 0;
          releaseTransport(OWNER);
        }
        hi.dispose();
        lo.dispose();
      };
      t.start("+0.1");
    } catch {
      setError("Trình duyệt không phát được âm thanh. Hãy chạm lại nút Bắt đầu.");
      setStatus("idle");
    }
  };

  // tempo changes apply on the fly, without restarting
  useEffect(() => {
    if (status === "idle" || status === "loading") return;
    void import("tone").then((Tone) => {
      if (ownsTransport(OWNER)) Tone.getTransport().bpm.rampTo(bpm, 0.05);
    });
  }, [bpm, status]);

  const playing = status !== "idle";
  const current = chords[bar] ?? chords[0];
  const next = chords[(bar + 1) % chords.length];
  const describe = strokes.map((s, i) => `${countLabel(i)}: ${strokeLabel(s, i)}`).join(", ");

  return (
    <div className="space-y-3" data-testid="strum-pattern" data-status={status} data-slot={slot}>
      <div className="gl-stage space-y-4 p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-3xl font-bold" data-testid="strum-chord">
              {CHORDS[current].symbol}
            </div>
            {chords.length > 1 && (
              <div className="text-xs text-muted-foreground">
                Ô nhịp {bar + 1}/{chords.length} · tiếp theo: {CHORDS[next].symbol}
              </div>
            )}
          </div>
          <p className="text-right text-sm text-muted-foreground" aria-live="polite" data-testid="strum-status">
            {status === "countin"
              ? `Chuẩn bị: ${count}`
              : status === "running"
                ? withGuitar
                  ? "Gảy theo tiếng đàn mẫu"
                  : "Chỉ còn tiếng tích: bạn gảy"
                : "Máy đếm 4 tiếng tích rồi mới gảy"}
          </p>
        </div>

        {chords.length > 1 && (
          <ol className="flex flex-wrap gap-1.5" aria-label="Thứ tự hợp âm, mỗi hợp âm một ô nhịp">
            {chords.map((c, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-sm font-semibold",
                  playing && i === bar ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
                )}
              >
                {CHORDS[c].symbol}
              </li>
            ))}
          </ol>
        )}

        <ol className="grid grid-cols-4 gap-2" aria-label={`Mẫu gảy: ${describe}`}>
          {Array.from({ length: BEATS_PER_BAR }, (_, beat) => (
            <li key={beat} className="grid grid-cols-2 gap-1">
              {[beat * 2, beat * 2 + 1].map((i) => {
                const s = strokes[i];
                const active = status === "running" && slot === i;
                const ghost = s === "-";
                return (
                  <div
                    key={i}
                    data-active={active || undefined}
                    data-stroke={s}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-md border py-2 transition-colors duration-75",
                      ghost && "border-dashed",
                      active && !ghost && "border-foreground bg-foreground text-background",
                      active && ghost && "border-2 border-solid border-foreground",
                    )}
                  >
                    <span role="img" aria-label={strokeLabel(s, i)} className={cn(ghost && (active ? "text-foreground/60" : "text-muted-foreground/35"))}>
                      {handMove(i) === "down" ? <ArrowDown className="size-5" strokeWidth={2.75} /> : <ArrowUp className="size-5" strokeWidth={2.75} />}
                    </span>
                    <span className={cn("gl-num text-xs", !active && "text-muted-foreground")}>{countLabel(i)}</span>
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground">
          ↓ gảy xuống (về phía sàn nhà, từ dây 6 về dây 1) · ↑ gảy lên (về phía mặt bạn) · mũi tên mờ, viền đứt: tay vẫn đi theo hướng đó nhưng không chạm dây.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => (playing ? stop() : void start())} variant={playing ? "outline" : "default"} data-testid="strum-start">
          {playing ? <Pause /> : <Play />}
          {playing ? "Dừng" : "Bắt đầu"}
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Chậm hơn 5 BPM" onClick={() => setBpm((v) => clamp(v - 5))} disabled={bpm <= MIN_BPM}>
            <Minus />
          </Button>
          <span className="gl-num w-20 text-center text-sm" data-testid="strum-bpm">
            {bpm} BPM
          </span>
          <Button variant="outline" size="icon" aria-label="Nhanh hơn 5 BPM" onClick={() => setBpm((v) => clamp(v + 5))} disabled={bpm >= MAX_BPM}>
            <Plus />
          </Button>
        </div>
        <Button
          variant="ghost"
          aria-pressed={!withGuitar}
          onClick={() => {
            guitarOn.current = !guitarOn.current;
            setWithGuitar(guitarOn.current);
          }}
          data-testid="strum-guitar-toggle"
        >
          {withGuitar ? <Volume2 /> : <VolumeX />}
          {withGuitar ? "Tiếng đàn mẫu: bật" : "Tiếng đàn mẫu: tắt"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
