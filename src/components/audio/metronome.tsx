"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTone } from "@/lib/audio/tone";
import { claimTransport, ownsTransport, releaseTransport } from "@/lib/audio/transport-owner";
import { cn } from "@/lib/utils";

const MIN_BPM = 30;
const MAX_BPM = 240;
const clampBpm = (v: number) => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(v)));

type Props = { initialBpm?: number; initialBeats?: number; compact?: boolean };

/**
 * Real metronome: clicks are scheduled on the Web Audio clock by Tone.Transport
 * (look-ahead scheduling), so timing stays stable even if the UI thread is busy.
 */
export function Metronome({ initialBpm = 60, initialBeats = 4, compact = false }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [beats, setBeats] = useState(initialBeats);
  const [accent, setAccent] = useState(true);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const settings = useRef({ beats, accent });
  settings.current = { beats, accent };

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    (async () => {
      try {
        const Tone = await getTone();
        if (cancelled) return;
        const transport = Tone.getTransport();
        claimTransport("metronome", () => setRunning(false));
        transport.bpm.value = bpm;
        const hi = new Tone.Synth({
          oscillator: { type: "square" },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
        }).toDestination();
        const lo = new Tone.Synth({
          oscillator: { type: "square" },
          envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
        }).toDestination();
        hi.volume.value = -8;
        lo.volume.value = -14;
        let count = 0;
        const id = transport.scheduleRepeat((time) => {
          const { beats: perBar, accent: acc } = settings.current;
          const b = count % perBar;
          count++;
          if (b === 0 && acc) hi.triggerAttackRelease(1600, 0.03, time);
          else lo.triggerAttackRelease(1000, 0.03, time);
          Tone.getDraw().schedule(() => setBeat(b), time);
        }, "4n");
        transport.start("+0.05");
        cleanup.current = () => {
          transport.clear(id);
          if (ownsTransport("metronome")) {
            transport.stop();
            transport.position = 0;
            releaseTransport("metronome");
          }
          hi.dispose();
          lo.dispose();
        };
      } catch {
        setError("Trình duyệt không phát được âm thanh. Hãy thử chạm lại nút Bắt đầu.");
        setRunning(false);
      }
    })();
    return () => {
      cancelled = true;
      cleanup.current?.();
      cleanup.current = null;
      setBeat(-1);
    };
    // bpm changes are applied live below, not by restarting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (!running) return;
    import("tone").then((Tone) => {
      Tone.getTransport().bpm.rampTo(bpm, 0.05);
    });
  }, [bpm, running]);

  return (
    <div className={cn("gl-stage p-4", !compact && "sm:p-6")} data-testid="metronome">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">
          Máy đếm nhịp <span className="font-normal text-muted-foreground">(Metronome)</span>
        </h3>
        <span className="gl-num text-xs text-muted-foreground">{beats}/4</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" aria-hidden>
        {Array.from({ length: beats }, (_, i) => (
          <span
            key={i}
            data-active={beat === i}
            className={cn(
              "size-5 rounded-full border-2 border-foreground/30 transition-colors duration-75 sm:size-6",
              beat === i && (i === 0 && accent ? "border-foreground bg-foreground" : "border-foreground/60 bg-foreground/60"),
            )}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="off">
        {running ? `Phách ${beat + 1}` : "Đã dừng"}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button variant="outline" size="icon-lg" aria-label="Giảm 5 BPM" onClick={() => setBpm((v) => clampBpm(v - 5))}>
          <Minus />
        </Button>
        <div className="w-28 text-center">
          <div className="gl-num text-5xl font-semibold" data-testid="bpm">
            {bpm}
          </div>
          <div className="text-xs text-muted-foreground">BPM (phách/phút)</div>
        </div>
        <Button variant="outline" size="icon-lg" aria-label="Tăng 5 BPM" onClick={() => setBpm((v) => clampBpm(v + 5))}>
          <Plus />
        </Button>
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Tốc độ BPM</span>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(e) => setBpm(clampBpm(Number(e.target.value)))}
          className="w-full accent-[var(--primary)]"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
        {[2, 3, 4].map((n) => (
          <Button key={n} size="sm" variant={beats === n ? "default" : "outline"} onClick={() => setBeats(n)}>
            {n} phách
          </Button>
        ))}
        <Button size="sm" variant={accent ? "secondary" : "outline"} onClick={() => setAccent((a) => !a)} aria-pressed={accent}>
          Nhấn phách 1
        </Button>
      </div>

      <Button
        className="mt-4 h-11 w-full text-base"
        onClick={() => {
          setError(null);
          setRunning((r) => !r);
        }}
        data-testid="metronome-toggle"
      >
        {running ? <Pause /> : <Play />}
        {running ? "Dừng" : "Bắt đầu"}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
