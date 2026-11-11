"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hand, Mic, RotateCcw, X } from "lucide-react";
import { ChordDiagram } from "@/components/guitar/chord-diagram";
import { useGuitarView } from "@/components/guitar/view-context";
import { Button } from "@/components/ui/button";
import { getChordChangeHistory, saveChordChangeRun, type ChordChangeHistory } from "@/features/chord-changes/actions";
import { playReference } from "@/lib/audio/guitar-synth";
import { rms } from "@/lib/audio/pitch";
import { createStrumDetector } from "@/lib/audio/strum-detector";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { cn } from "@/lib/utils";
import { useWakeLock } from "@/lib/use-wake-lock";

type Phase = "idle" | "countdown" | "running" | "done";
type Counting = "mic" | "manual";

const COUNTDOWN_S = 3;
const CHORD_IDS = Object.keys(CHORDS) as ChordId[];

/**
 * One-minute chord changes. Place a chord, strum once, (switch / lift and replace), strum again…
 * The microphone counts the strums so both hands stay on the guitar; counting by hand is the
 * fallback for noisy rooms or a blocked microphone.
 */
export function ChordChangeTimer({
  chords: initialChords,
  allowPick = false,
  seconds = 60,
}: {
  chords: ChordId[];
  allowPick?: boolean;
  seconds?: number;
}) {
  const { handedness } = useGuitarView();
  const [chords, setChords] = useState<ChordId[]>(initialChords);
  const [phase, setPhase] = useState<Phase>("idle");
  const [counting, setCounting] = useState<Counting>("mic");
  const [count, setCount] = useState(0);
  const [left, setLeft] = useState(seconds);
  const [notice, setNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<ChordChangeHistory | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [previousBest, setPreviousBest] = useState<number | null>(null);

  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const countRef = useRef(0);
  const stopMic = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);

  useWakeLock(phase === "countdown" || phase === "running");

  const key = chords.join("-");
  useEffect(() => {
    let alive = true;
    void getChordChangeHistory(chords).then((r) => {
      if (!alive) return;
      if (r.ok) setHistory(r.data ?? null);
      else if (r.error === "signed-out") setSignedOut(true);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures `chords`
  }, [key]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  };

  const teardown = useCallback(() => {
    clearTimers();
    stopMic.current?.();
    stopMic.current = null;
  }, []);
  useEffect(() => teardown, [teardown]);

  const bump = useCallback(() => {
    if (phaseRef.current !== "running") return;
    countRef.current += 1;
    setCount(countRef.current);
  }, []);

  const finish = useCallback(
    async (how: Counting) => {
      teardown();
      setPhase("done");
      void playReference(659.25);
      const best = history?.best ?? null;
      setPreviousBest(best);
      const r = await saveChordChangeRun({ chords, changes: countRef.current, seconds, countedBy: how });
      if (r.ok) setHistory(r.data ?? null);
      else if (r.error === "signed-out") setSignedOut(true);
      else setNotice(r.error);
    },
    [chords, history, seconds, teardown],
  );

  /** 3-2-1 (the mic learns the room's background noise meanwhile), then the minute starts. */
  const runClock = useCallback(
    (how: Counting) => {
      setPhase("countdown");
      const t0 = performance.now();
      setLeft(COUNTDOWN_S);
      const tick = window.setInterval(() => {
        const elapsed = (performance.now() - t0) / 1000;
        if (elapsed < COUNTDOWN_S) {
          setLeft(Math.ceil(COUNTDOWN_S - elapsed));
          return;
        }
        if (phaseRef.current === "countdown") {
          phaseRef.current = "running";
          setPhase("running");
        }
        const remaining = Math.max(0, Math.ceil(seconds - (elapsed - COUNTDOWN_S)));
        setLeft(remaining);
        if (remaining === 0) void finish(how);
      }, 100);
      timers.current.push(tick);
    },
    [finish, seconds],
  );

  async function startWithMic() {
    setNotice(null);
    countRef.current = 0;
    setCount(0);
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setNotice("Trình duyệt này không dùng được micro. Bạn tự đếm bằng tay nhé.");
      return startManual();
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      setNotice("Micro đang bị chặn nên máy không tự đếm được. Bạn tự đếm bằng tay nhé.");
      return startManual();
    }
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);
    const detector = createStrumDetector();
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      analyser.getFloatTimeDomainData(buffer);
      const level = rms(buffer);
      if (phaseRef.current === "countdown") detector.calibrate(level);
      else if (phaseRef.current === "running" && detector.push(level, t)) bump();
    };
    raf = requestAnimationFrame(loop);
    stopMic.current = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((tr) => tr.stop());
      void ctx.close();
    };
    setCounting("mic");
    runClock("mic");
  }

  function startManual() {
    countRef.current = 0;
    setCount(0);
    setCounting("manual");
    runClock("manual");
  }

  function cancel() {
    teardown();
    setPhase("idle");
    setLeft(seconds);
  }

  // Manual counting: the space bar works without looking at the screen.
  useEffect(() => {
    if (phase !== "running" || counting !== "manual") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        bump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, counting, bump]);

  const pair = chords.length === 2;
  const current = CHORDS[chords[pair ? count % 2 : 0]];
  const next = pair ? CHORDS[chords[(count + 1) % 2]] : null;
  const label = chords.map((c) => CHORDS[c].symbol).join(" – ");

  return (
    <section className="gl-stage p-4 sm:p-6" data-testid="chord-change-timer" aria-label={`Đổi hợp âm 1 phút: ${label}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">
          Đổi hợp âm 1 phút <span className="font-normal text-muted-foreground">· {label}</span>
        </h3>
        {history?.best != null && phase !== "running" && (
          <span className="text-sm text-muted-foreground">
            Tốt nhất: <span className="gl-num font-semibold text-foreground">{history.best}</span>
          </span>
        )}
      </div>

      {phase === "idle" && (
        <div className="mt-4 space-y-4">
          {allowPick && <ChordPicker chords={chords} onChange={setChords} />}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {pair
              ? `Đặt ${CHORDS[chords[0]].symbol}, gảy xuống một cái, đổi sang ${CHORDS[chords[1]].symbol}, gảy, đổi lại… trong ${seconds} giây. Không cần theo nhịp. Mỗi lần gảy là một lần đếm.`
              : `Đặt ${CHORDS[chords[0]].symbol}, gảy xuống một cái, nhấc cả bàn tay lên rồi đặt lại, gảy… trong ${seconds} giây. Mỗi lần gảy là một lần đếm.`}{" "}
            Chỉ gảy khi tay đã đặt xong: tiếng gảy là cách máy đếm.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="h-12 flex-1 text-base" onClick={() => void startWithMic()} data-testid="chord-change-start">
              <Mic /> Bắt đầu, máy tự đếm
            </Button>
            <Button variant="outline" className="h-12" onClick={startManual} data-testid="chord-change-manual-start">
              <Hand /> Tự đếm bằng tay
            </Button>
          </div>
          {notice && <p className="text-sm text-destructive">{notice}</p>}
          <HistoryLine history={history} signedOut={signedOut} />
        </div>
      )}

      {(phase === "countdown" || phase === "running") && (
        <div className="mt-4">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="gl-label">{phase === "countdown" ? "Đặt tay sẵn" : pair ? "Bấm ngay" : "Nhấc tay, đặt lại"}</p>
              <p className="gl-num text-7xl leading-none font-semibold sm:text-8xl" data-testid="chord-change-current">
                {current.symbol}
              </p>
              {next && phase === "running" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  rồi đổi sang <span className="gl-num font-semibold text-foreground">{next.symbol}</span>
                </p>
              )}
            </div>
            <ChordDiagram chord={current} handedness={handedness} showStringLabels={false} className="w-24 sm:w-32" />
          </div>
          <div className="mt-5 flex items-end justify-between border-t pt-4">
            <div>
              <p className="gl-label">{phase === "countdown" ? "Bắt đầu sau" : "Còn lại"}</p>
              <p className="gl-num text-4xl font-semibold" aria-live="off">
                {left}
                <span className="text-base font-normal text-muted-foreground"> giây</span>
              </p>
            </div>
            <div className="text-right">
              <p className="gl-label">{counting === "mic" ? "Máy đã đếm" : "Đã đếm"}</p>
              <p className="gl-num text-4xl font-semibold" data-testid="chord-change-count">
                {count}
              </p>
            </div>
          </div>
          {counting === "manual" && phase === "running" && (
            <Button className="mt-4 h-16 w-full text-lg" onClick={bump} data-testid="chord-change-tap">
              +1 <span className="ml-2 text-sm font-normal opacity-80">(hoặc phím cách)</span>
            </Button>
          )}
          <Button variant="ghost" className="mt-3 h-11" onClick={cancel}>
            <X /> Dừng, không lưu
          </Button>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 space-y-4" data-testid="chord-change-result">
          <p>
            <span className="gl-num text-6xl font-semibold">{count}</span>
            <span className="ml-2 text-muted-foreground">lần trong {seconds} giây</span>
          </p>
          <p className="text-sm">{verdict(count, previousBest)}</p>
          {notice && <p className="text-sm text-destructive">{notice}</p>}
          <HistoryLine history={history} signedOut={signedOut} />
          <Button variant="outline" className="h-11" onClick={() => setPhase("idle")}>
            <RotateCcw /> Làm lượt nữa
          </Button>
        </div>
      )}
    </section>
  );
}

function verdict(count: number, previousBest: number | null): string {
  if (previousBest == null) return "Đây là con số đầu tiên của bạn. Mai tập lại và thử vượt nó.";
  if (count > previousBest) return `Kỷ lục mới: hơn lần tốt nhất trước ${count - previousBest} lần.`;
  if (count === previousBest) return "Bằng kỷ lục của bạn.";
  return `Kỷ lục vẫn là ${previousBest}. Ngày tay mỏi thì chậm hơn là bình thường, quan trọng là đổi cho sạch.`;
}

function HistoryLine({ history, signedOut }: { history: ChordChangeHistory | null; signedOut: boolean }) {
  if (signedOut) return <p className="text-xs text-muted-foreground">Đăng nhập để lưu kết quả và xem mình tiến bộ qua từng ngày.</p>;
  if (!history || history.runs.length === 0) return null;
  return (
    <p className="text-sm text-muted-foreground" data-testid="chord-change-history">
      Các lần gần đây:{" "}
      {history.runs.map((r, i) => (
        <span key={r.at}>
          {i > 0 && <span aria-hidden> → </span>}
          <span className={cn("gl-num", i === history.runs.length - 1 && "font-semibold text-foreground")}>{r.changes}</span>
        </span>
      ))}
    </p>
  );
}

function ChordPicker({ chords, onChange }: { chords: ChordId[]; onChange: (c: ChordId[]) => void }) {
  const pair = chords.length === 2;
  const setAt = (i: number, id: ChordId) => {
    const next = [...chords] as ChordId[];
    next[i] = id;
    if (next.length === 2 && next[0] === next[1]) next[1 - i] = CHORD_IDS.find((c) => c !== id)!;
    onChange(next);
  };
  const select = (i: number) => (
    <select
      value={chords[i]}
      onChange={(e) => setAt(i, e.target.value as ChordId)}
      aria-label={i === 0 ? "Hợp âm thứ nhất" : "Hợp âm thứ hai"}
      className="h-11 rounded-md border bg-background px-3 text-base"
    >
      {CHORD_IDS.map((id) => (
        <option key={id} value={id}>
          {CHORDS[id].symbol}
        </option>
      ))}
    </select>
  );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="radiogroup" aria-label="Số hợp âm" className="inline-flex rounded-lg border bg-muted p-0.5">
        {[1, 2].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={chords.length === n}
            onClick={() => onChange(n === 1 ? [chords[0]] : [chords[0], CHORD_IDS.find((c) => c !== chords[0])!])}
            className={cn(
              "min-h-9 rounded-md px-3 text-sm font-medium",
              chords.length === n ? "bg-card shadow-sm" : "text-muted-foreground",
            )}
          >
            {n} hợp âm
          </button>
        ))}
      </div>
      {select(0)}
      {pair && (
        <>
          <span aria-hidden className="text-muted-foreground">
            ⇄
          </span>
          {select(1)}
        </>
      )}
    </div>
  );
}
