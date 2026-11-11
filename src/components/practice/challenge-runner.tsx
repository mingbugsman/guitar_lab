"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Volume2, VolumeX, X } from "lucide-react";
import { ChordDiagram } from "@/components/guitar/chord-diagram";
import { useGuitarView } from "@/components/guitar/view-context";
import { Button } from "@/components/ui/button";
import { getGuitar } from "@/lib/audio/guitar-synth";
import { claimTransport, ownsTransport, releaseTransport } from "@/lib/audio/transport-owner";
import { CHORDS, soundingMidi } from "@/lib/music/chords";
import { secondsAtBeat, type ChallengePlan } from "@/lib/practice/challenge";
import { useWakeLock } from "@/lib/use-wake-lock";
import { cn } from "@/lib/utils";

const OWNER = "chord-challenge";
const COUNT_IN = 4;
/**
 * Horizontal distance of one beat on the lane (faster tempo = cards move faster). It shrinks on
 * narrow screens so the learner always sees the chord on the line plus at least 3 coming up.
 */
const MAX_PX_PER_BEAT = 30;
const CHORDS_IN_VIEW = 4.3;
export function pxPerBeatFor(laneWidth: number, beatsPerChord: number): number {
  return Math.max(8, Math.min(MAX_PX_PER_BEAT, laneWidth / (beatsPerChord * CHORDS_IN_VIEW)));
}
/** The strum line sits this far from the left edge of the lane. */
const LINE_X = 18;

export type ChallengeOutcome = { reachedStage: number; seconds: number; stopped: boolean };

/**
 * Plays a chord challenge: count-in, then cards scroll from right to left on the Web Audio clock.
 * Strum once when a card reaches the line. The lane is a time axis, so it never mirrors;
 * chord diagrams do follow the learner's handedness.
 */
export function ChallengeRunner({
  plan,
  onDone,
}: {
  plan: ChallengePlan;
  onDone: (o: ChallengeOutcome) => void;
}) {
  const { handedness } = useGuitarView();
  const [phase, setPhase] = useState<"ready" | "loading" | "countin" | "running">("ready");
  const [current, setCurrent] = useState(-1);
  const [stage, setStage] = useState(0);
  const [beatInBar, setBeatInBar] = useState(-1);
  const [flash, setFlash] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const demoRef = useRef(false);
  demoRef.current = demo;

  const track = useRef<HTMLDivElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const beatsPerChord = plan.items[0]?.beats ?? 4;
  const [pxPerBeat, setPxPerBeat] = useState(MAX_PX_PER_BEAT);
  const pxRef = useRef(MAX_PX_PER_BEAT);
  pxRef.current = pxPerBeat;
  useEffect(() => {
    const el = lane.current;
    if (!el) return;
    const measure = () => setPxPerBeat(pxPerBeatFor(el.clientWidth - LINE_X, beatsPerChord));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [beatsPerChord]);
  const clock = useRef<HTMLSpanElement>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const reached = useRef(0);
  const startedAt = useRef(0);

  useWakeLock(phase === "countin" || phase === "running");

  const stop = useCallback(() => {
    cleanup.current?.();
    cleanup.current = null;
  }, []);
  useEffect(() => stop, [stop]);

  const finish = useCallback(
    (stopped: boolean) => {
      stop();
      onDone({ reachedStage: reached.current, seconds: Math.max(5, Math.round((performance.now() - startedAt.current) / 1000)), stopped });
    },
    [onDone, stop],
  );

  async function start() {
    setPhase("loading");
    const { Tone, pluck } = await getGuitar();
    claimTransport(OWNER, () => stop());
    const t = Tone.getTransport();
    t.stop();
    t.cancel();
    t.position = 0;
    t.loop = false;
    t.bpm.value = plan.stages[0].bpm;

    const hi = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 } }).toDestination();
    const lo = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 } }).toDestination();
    hi.volume.value = -9;
    lo.volume.value = -17;
    const draw = Tone.getDraw();
    const at = (beat: number) => `${Math.round((beat + COUNT_IN) * t.PPQ)}i`;
    const chordStarts = new Set(plan.items.map((i) => i.startBeat));

    for (let b = -COUNT_IN; b < plan.totalBeats; b++) {
      const strumBeat = b >= 0 && chordStarts.has(b);
      t.schedule((time) => {
        (strumBeat || b === -COUNT_IN ? hi : lo).triggerAttackRelease(strumBeat ? 1600 : 1000, 0.03, time);
        draw.schedule(() => {
          setBeatInBar(((b % 4) + 4) % 4);
          if (b < 0) setPhase("countin");
        }, time);
      }, at(b));
    }
    plan.items.forEach((item, index) => {
      t.schedule((time) => {
        if (demoRef.current) {
          soundingMidi(CHORDS[item.chord]).forEach((n, i) => pluck(n.string, CHORDS[item.chord].frets[n.string] as number, time + i * 0.03));
        }
        draw.schedule(() => {
          setCurrent(index);
          setPhase("running");
        }, time);
      }, at(item.startBeat));
    });
    plan.stages.forEach((s) => {
      if (s.index === 0) return;
      t.schedule((time) => {
        t.bpm.setValueAtTime(s.bpm, time);
        draw.schedule(() => {
          reached.current = s.index;
          setStage(s.index);
          setFlash(`Nhanh hơn: ${s.bpm} BPM`);
          window.setTimeout(() => setFlash(null), 1800);
        }, time);
      }, at(s.startBeat));
    });
    t.schedule((time) => draw.schedule(() => finish(false), time), at(plan.totalBeats));

    // the lane follows the transport position, one style write per frame
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const beat = t.ticks / t.PPQ - COUNT_IN;
      if (track.current) track.current.style.transform = `translateX(${LINE_X - beat * pxRef.current}px)`;
      if (clock.current) {
        const left = Math.max(0, Math.ceil(plan.totalSeconds - secondsAtBeat(plan, beat)));
        clock.current.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      }
    };
    raf = requestAnimationFrame(frame);

    cleanup.current = () => {
      cancelAnimationFrame(raf);
      if (ownsTransport(OWNER)) {
        t.stop();
        t.cancel();
        t.position = 0;
        releaseTransport(OWNER);
      }
      hi.dispose();
      lo.dispose();
    };
    reached.current = 0;
    startedAt.current = performance.now();
    t.start("+0.1");
  }

  const live = phase === "countin" || phase === "running";
  const now = current >= 0 ? plan.items[current] : plan.items[0];
  const next = plan.items[current + 1] ?? null;
  // only render the cards near the line
  const from = Math.max(0, current - 1);
  const visible = useMemo(() => plan.items.slice(from, from + 10).map((item, k) => ({ item, index: from + k })), [plan.items, from]);
  const st = plan.stages[stage];

  return (
    <div className="space-y-5" data-testid="challenge-runner" data-phase={phase} data-current={current}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 text-sm">
        <p>
          Chặng <span className="gl-num font-semibold">{stage + 1}</span>/<span className="gl-num">{plan.stages.length}</span> ·{" "}
          <span className="gl-num font-semibold" data-testid="challenge-bpm">
            {st.bpm}
          </span>{" "}
          BPM
        </p>
        <p className="text-muted-foreground">
          Còn{" "}
          <span ref={clock} className="gl-num font-semibold text-foreground">
            {Math.floor(plan.totalSeconds / 60)}:{String(Math.round(plan.totalSeconds % 60)).padStart(2, "0")}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center">
        {/* the chord to hold now */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-start">
          <div>
            <p className="gl-label">{phase === "running" ? "Bấm ngay" : "Hợp âm đầu tiên"}</p>
            <p className="gl-num text-6xl leading-none font-semibold" data-testid="challenge-current">
              {CHORDS[now.chord].symbol}
            </p>
            {next && phase === "running" && (
              <p className="mt-1 text-sm text-muted-foreground">
                tiếp: <span className="gl-num font-semibold text-foreground">{CHORDS[next.chord].symbol}</span>
              </p>
            )}
          </div>
          <ChordDiagram chord={CHORDS[now.chord]} handedness={handedness} showStringLabels={false} className="w-28 sm:w-40" />
        </div>

        {/* the lane: cards come from the right, strum when one reaches the line */}
        <div ref={lane} className="gl-stage relative h-36 overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 z-10 w-0.5 bg-[var(--gl-finger)]" style={{ left: LINE_X }} />
          <div ref={track} className="absolute inset-y-0 left-0 will-change-transform" style={{ transform: `translateX(${LINE_X + COUNT_IN * pxPerBeat}px)` }}>
            {visible.map(({ item, index }) => (
              <div
                key={index}
                className={cn(
                  "absolute top-3 bottom-3 flex flex-col items-center justify-center gap-1 rounded-md border bg-card px-1",
                  index === current ? "border-[var(--gl-finger)] ring-2 ring-[var(--gl-finger)]" : index < current ? "opacity-40" : "",
                )}
                style={{ left: item.startBeat * pxPerBeat + 2, width: item.beats * pxPerBeat - 4 }}
                data-card={item.chord}
              >
                <span className="gl-num text-xl font-semibold">{CHORDS[item.chord].symbol}</span>
                {item.beats * pxPerBeat >= 56 && <ChordDiagram chord={CHORDS[item.chord]} handedness={handedness} showStringLabels={false} className="w-12" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-8 items-center gap-4">
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2, 3].map((b) => (
            <span
              key={b}
              className={cn(
                "size-3 rounded-full border border-foreground/30",
                beatInBar === b && (phase === "countin" ? "border-foreground bg-foreground" : "border-[var(--gl-finger)] bg-[var(--gl-finger)]"),
              )}
            />
          ))}
        </div>
        <p className="text-sm font-medium" aria-live="polite">
          {phase === "countin" ? "Đặt tay vào hợp âm đầu tiên… gảy khi thẻ chạm vạch cam." : flash ?? ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!live ? (
          <Button className="h-12 px-6 text-base" onClick={() => void start()} disabled={phase === "loading"} data-testid="challenge-start">
            <Play /> Bắt đầu
          </Button>
        ) : (
          <Button className="h-12 px-6 text-base" onClick={() => finish(true)} data-testid="challenge-stop">
            <X /> Dừng và tự đánh giá
          </Button>
        )}
        <Button variant="ghost" className="h-12" onClick={() => setDemo((d) => !d)} aria-pressed={demo}>
          {demo ? <Volume2 /> : <VolumeX />} {demo ? "Máy gảy mẫu mỗi hợp âm" : "Chỉ nghe tiếng tích"}
        </Button>
      </div>
    </div>
  );
}
