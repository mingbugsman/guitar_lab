"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, Lock, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { FretOverlay } from "@/components/guitar/fretboard";
import { InteractiveFretboard } from "@/components/guitar/interactive-fretboard";
import { Button } from "@/components/ui/button";
import type { Drill } from "@/content/drills";
import { saveDrillResult } from "@/features/drills/actions";
import { suggestedStart, type DrillRating, type DrillStats } from "@/features/drills/stats";
import { roundsToTarget } from "@/lib/practice/sequence";
import { usePatternPlayer } from "@/lib/practice/use-pattern-player";
import { useWakeLock } from "@/lib/use-wake-lock";
import { cn } from "@/lib/utils";

const RATINGS: { value: DrillRating; title: string; detail: string }[] = [
  { value: "clean", title: "Sạch hết", detail: "Không nốt nào rè hoặc tắt, không lỡ ô nào." },
  { value: "some-buzz", title: "Có vài nốt rè", detail: "Theo kịp nhịp nhưng vài nốt chưa rõ tiếng." },
  { value: "lost", title: "Không theo kịp", detail: "Lỡ nhiều ô sáng, tay đến muộn hơn tiếng tích." },
];

/** How many rounds at the target tempo before the run ends by itself. */
const ROUNDS_AT_TARGET = 2;

export function ExercisePlayer({ drill, stats: initialStats, signedIn }: { drill: Drill; stats?: DrillStats; signedIn: boolean }) {
  const [stats, setStats] = useState<DrillStats | undefined>(initialStats);
  const startBpm = suggestedStart(drill.tempo.start, drill.tempo.target, stats);
  const tempo = useMemo(() => ({ ...drill.tempo, start: startBpm }), [drill.tempo, startBpm]);
  const player = usePatternPlayer(drill.sequence, tempo);
  const [rating, setRating] = useState<{ bpm: number; seconds: number } | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const playing = player.status !== "idle" && player.status !== "loading";
  useWakeLock(playing);

  // hands go to the guitar: bring the neck into view (on phones it starts below the instructions)
  const top = useRef<HTMLDivElement>(null);
  const begin = (fn: () => void) => () => {
    top.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    fn();
  };

  // the run ends itself after a couple of rounds at the target tempo
  const doneRound = roundsToTarget(tempo) + ROUNDS_AT_TARGET;
  const reachedEnd = player.status === "running" && player.round >= doneRound;
  useEffect(() => {
    if (reachedEnd) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finish reads the latest player state
  }, [reachedEnd]);

  const steps = drill.sequence.steps;
  const i = player.stepIndex;
  const current = i >= 0 ? steps[i] : null;
  const upcoming = steps[i + 1] ?? (player.status === "running" ? steps[0] : undefined);

  const overlays: FretOverlay[] = [];
  if (current) {
    for (const h of current.hold ?? []) overlays.push({ ...h, kind: "held", label: h.finger ? String(h.finger) : undefined });
    for (const h of current.hits) overlays.push({ ...h, kind: "active", label: h.finger ? String(h.finger) : undefined });
  }
  const showNext = playing ? upcoming : steps[0];
  if (showNext)
    for (const h of showNext.hits)
      if (!overlays.some((o) => o.string === h.string && o.fret === h.fret)) overlays.push({ ...h, kind: "next" });

  function finish() {
    const bpm = player.bpm;
    const seconds = Math.max(5, player.elapsedSeconds());
    player.stop();
    setSaved(null);
    setRating({ bpm, seconds });
  }

  async function rate(r: DrillRating) {
    if (!rating) return;
    if (!signedIn) {
      setSaved("Bạn chưa đăng nhập nên kết quả không được lưu.");
      setRating(null);
      return;
    }
    const res = await saveDrillResult({ drillId: drill.id, kind: "finger", bpmReached: rating.bpm, rating: r, seconds: rating.seconds });
    if (res.ok) {
      setStats(res.data);
      setSaved(r === "clean" ? `Đã lưu: sạch ở ${rating.bpm} BPM.` : `Đã lưu. Lần sau bắt đầu ở tốc độ dễ hơn một chút.`);
    } else setSaved(res.error);
    setRating(null);
  }

  return (
    <div ref={top} className="scroll-mt-4 space-y-6" data-testid="exercise-player" data-status={player.status}>
      {/* tempo strip */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-3">
        <div>
          <p className="gl-label">Tốc độ</p>
          <p className="gl-num text-3xl font-semibold" data-testid="drill-bpm">
            {playing ? player.bpm : startBpm}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              → {drill.tempo.target} BPM
            </span>
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          {player.status === "running" && (
            <p className="gl-num">
              Vòng {player.round + 1}
              {player.isHeld && " · đang giữ tốc độ"}
            </p>
          )}
          {stats?.bestClean != null && (
            <p>
              Sạch nhanh nhất: <span className="gl-num font-semibold text-foreground" data-testid="drill-best">{stats.bestClean}</span> BPM
            </p>
          )}
        </div>
      </div>

      {/* the neck */}
      <InteractiveFretboard frets={drill.frets} overlays={overlays} playable={!playing} caption={undefined} />

      {/* what to do right now */}
      <div className="flex min-h-16 items-center gap-4" aria-live="polite">
        <BeatDots beat={player.beat} counting={player.status === "countin"} />
        <div className="min-w-0">
          {player.status === "countin" && <p className="text-lg font-medium">Đặt tay sẵn… bắt đầu sau 4 tiếng tích</p>}
          {player.status === "preview" && current?.caption && (
            <p className="text-lg font-medium" data-testid="drill-caption">
              {current.caption}
            </p>
          )}
          {player.status === "running" && current && (
            <p className="flex items-center gap-3 text-lg font-medium">
              {current.hits[0]?.finger && (
                <span>
                  Ngón <span className="gl-num text-2xl">{current.hits[0].finger}</span>
                </span>
              )}
              {current.action === "pick-down" && (
                <span className="inline-flex items-center gap-1">
                  <ArrowDown className="size-5" /> gảy xuống
                </span>
              )}
              {current.action === "pick-up" && (
                <span className="inline-flex items-center gap-1">
                  <ArrowUp className="size-5" /> gảy lên
                </span>
              )}
            </p>
          )}
          {player.status === "idle" && !rating && (
            <p className="text-sm text-muted-foreground">
              Bấm <b>Xem mẫu</b> để xem máy làm một lượt thật chậm. Sau đó bấm <b>Bắt đầu</b> và chơi theo ô sáng.
            </p>
          )}
        </div>
      </div>

      {player.error && <p className="text-sm text-destructive">{player.error}</p>}

      {/* controls */}
      {!rating && (
        <div className="flex flex-wrap gap-2">
          {!playing ? (
            <>
              <Button className="h-12 px-6 text-base" onClick={begin(player.start)} disabled={player.status === "loading"} data-testid="drill-start">
                <Play /> Bắt đầu ở {startBpm} BPM
              </Button>
              <Button variant="outline" className="h-12" onClick={begin(player.preview)} disabled={player.status === "loading"} data-testid="drill-preview">
                <Eye /> Xem mẫu
              </Button>
            </>
          ) : (
            <>
              {player.status !== "preview" && (
                <Button className="h-12 px-6 text-base" onClick={finish} data-testid="drill-finish">
                  <X /> Dừng và tự đánh giá
                </Button>
              )}
              {player.status === "preview" && (
                <Button variant="outline" className="h-12" onClick={player.stop}>
                  <X /> Dừng xem mẫu
                </Button>
              )}
              {player.status === "running" && (
                <Button variant="outline" className="h-12" onClick={player.toggleHold} aria-pressed={player.isHeld}>
                  {player.isHeld ? <Play /> : <Pause />} {player.isHeld ? "Tăng tốc tiếp" : "Giữ tốc độ này"}
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" className="h-12" onClick={player.toggleMute} aria-pressed={player.isMuted}>
            {player.isMuted ? <VolumeX /> : <Volume2 />} {player.isMuted ? "Chỉ nghe tiếng tích" : "Có tiếng đàn mẫu"}
          </Button>
        </div>
      )}

      {/* self-assessment */}
      {rating && (
        <section className="border-t pt-4" aria-labelledby="rate" data-testid="drill-rating">
          <h3 id="rate" className="font-semibold">
            Bạn chơi ở <span className="gl-num">{rating.bpm}</span> BPM thế nào?
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => void rate(r.value)}
                className="min-h-16 rounded-md border px-4 py-3 text-left hover:bg-muted"
                data-testid={`rate-${r.value}`}
              >
                <span className="block font-medium">{r.title}</span>
                <span className="block text-sm text-muted-foreground">{r.detail}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {saved && (
        <p className="text-sm" data-testid="drill-saved">
          {saved}
        </p>
      )}
      {!signedIn && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Đăng nhập để lưu tốc độ của bạn.
        </p>
      )}
    </div>
  );
}

function BeatDots({ beat, counting }: { beat: number; counting: boolean }) {
  return (
    <div className="flex shrink-0 gap-1.5" aria-hidden>
      {[0, 1, 2, 3].map((b) => (
        <span
          key={b}
          className={cn(
            "size-3 rounded-full border border-foreground/30",
            beat === b && (counting ? "border-foreground bg-foreground" : "border-[var(--gl-finger)] bg-[var(--gl-finger)]"),
          )}
        />
      ))}
    </div>
  );
}
