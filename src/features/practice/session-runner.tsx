"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Pause, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";
import { RoutineBar } from "@/components/learning/routine-bar";
import { formatClock, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import { completeActivity, finishPracticeSession } from "./actions";
import { guidanceFor, type ActivityKind } from "./routine";

export type RunnerActivity = {
  id: string;
  position: number;
  kind: ActivityKind;
  title: string;
  planned_seconds: number;
  actual_seconds: number;
  completed_at: string | null;
};

type Props = {
  sessionId: string;
  plannedMinutes: number;
  activities: RunnerActivity[];
  currentLesson: { slug: string; title: string } | null;
};

export function SessionRunner({ sessionId, plannedMinutes, activities: initial, currentLesson }: Props) {
  const [activities, setActivities] = useState(initial);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [tool, setTool] = useState<"metronome" | "tuner" | null>(null);
  const [notes, setNotes] = useState("");
  const [focus, setFocus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef<number | null>(null);
  const base = useRef(0);

  const currentIndex = activities.findIndex((a) => !a.completed_at);
  const current = currentIndex >= 0 ? activities[currentIndex] : null;
  const doneSeconds = activities.reduce((s, a) => s + (a.completed_at ? a.actual_seconds : 0), 0);
  const totalSeconds = doneSeconds + elapsed;

  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now();
    const id = setInterval(() => {
      if (startedAt.current !== null) setElapsed(base.current + Math.floor((performance.now() - startedAt.current) / 1000));
    }, 250);
    return () => {
      clearInterval(id);
      if (startedAt.current !== null) base.current += Math.floor((performance.now() - startedAt.current) / 1000);
      startedAt.current = null;
    };
  }, [running]);

  // Warn before leaving with an unsaved running timer.
  useEffect(() => {
    if (!running) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [running]);

  function markDone() {
    if (!current) return;
    const seconds = elapsed;
    setRunning(false);
    startTransition(async () => {
      const r = await completeActivity({ sessionId, activityId: current.id, actualSeconds: seconds });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setError(null);
      setActivities((list) =>
        list.map((a) => (a.id === current.id ? { ...a, actual_seconds: seconds, completed_at: new Date().toISOString() } : a)),
      );
      base.current = 0;
      setElapsed(0);
    });
  }

  function finish() {
    setRunning(false);
    const duration = doneSeconds + (current ? elapsed : 0);
    startTransition(async () => {
      if (current && elapsed > 0) {
        await completeActivity({ sessionId, activityId: current.id, actualSeconds: elapsed });
      }
      const r = await finishPracticeSession({ sessionId, durationSeconds: duration, notes, focusRating: focus });
      if (!r.ok) setError(r.error);
      else setFinished(duration);
    });
  }

  const segments = activities.map((a, i) => ({
    key: a.id,
    title: a.title,
    minutes: Math.round(a.planned_seconds / 60),
    state: a.completed_at ? ("done" as const) : i === currentIndex ? ("current" as const) : ("todo" as const),
  }));

  if (finished !== null) {
    return (
      <div className="max-w-xl space-y-4 border-t pt-6" data-testid="session-saved">
        <p className="flex items-center gap-2 text-sm font-medium text-[oklch(0.45_0.13_150)]">
          <CheckCircle2 className="size-5" aria-hidden /> Đã lưu buổi tập
        </p>
        <p className="gl-title text-3xl">
          Bạn vừa tập <span className="gl-num">{formatDuration(finished)}</span>
        </p>
        <p className="text-muted-foreground">
          Xong{" "}
          <span className="gl-num">
            {activities.filter((a) => a.completed_at).length}/{activities.length}
          </span>{" "}
          phần của buổi tập.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/dashboard" className={buttonVariants({ className: "h-12 px-6 text-base" })}>
            Về trang Hôm nay
          </Link>
          <Link href="/progress" className={buttonVariants({ variant: "outline", className: "h-12 px-6 text-base" })}>
            Xem tiến độ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <RoutineBar segments={segments} />
      <p className="mt-3 text-sm text-muted-foreground" data-testid="session-total">
        Đã tập <span className="gl-num text-foreground">{formatClock(totalSeconds)}</span> /{" "}
        <span className="gl-num">{plannedMinutes}:00</span>
      </p>

      {current ? (
        <section className="mt-8" aria-labelledby="current-activity">
          <p className="gl-label">
            Phần{" "}
            <span className="gl-num">
              {currentIndex + 1}/{activities.length}
            </span>
          </p>
          <h2 id="current-activity" className="gl-title mt-1 text-3xl" data-testid="current-activity">
            {current.title}
          </h2>
          <ul className="mt-3 space-y-1.5 text-lg leading-snug">
            {guidanceFor(current.kind).map((g) => (
              <li key={g} className="flex gap-2">
                <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-foreground/50" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          {(current.kind === "technical" || current.kind === "recall") && currentLesson && (
            <Link href={`/academy/${currentLesson.slug}`} className="mt-2 inline-block text-sm underline underline-offset-4" target="_blank">
              Mở bài: {currentLesson.title}
            </Link>
          )}

          <p className="mt-8 flex items-baseline gap-3">
            <span
              className={cn("gl-num text-6xl font-semibold sm:text-7xl", elapsed >= current.planned_seconds && "text-[oklch(0.45_0.13_150)]")}
              data-testid="activity-timer"
            >
              {formatClock(elapsed)}
            </span>
            <span className="gl-num text-lg text-muted-foreground">/ {formatClock(current.planned_seconds)}</span>
          </p>
          <p className="mt-1 min-h-5 text-sm text-muted-foreground" aria-live="polite">
            {elapsed >= current.planned_seconds ? "Đủ giờ rồi. Thấy ổn thì bấm sang phần sau." : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="h-12 px-6 text-base"
              variant={running ? "outline" : "default"}
              onClick={() => setRunning((r) => !r)}
              data-testid="timer-toggle"
            >
              {running ? <Pause /> : <Play />} {running ? "Tạm dừng" : elapsed ? "Tập tiếp" : "Bắt đầu"}
            </Button>
            <Button className="h-12 px-6 text-base" variant="outline" onClick={markDone} disabled={pending} data-testid="activity-done">
              Xong phần này
            </Button>
          </div>
        </section>
      ) : (
        <p className="mt-8 text-lg font-medium">Bạn đã xong cả buổi. Ghi lại vài dòng rồi lưu nhé.</p>
      )}

      <section className="mt-10 border-t pt-5" aria-label="Công cụ">
        <div className="flex gap-2">
          <Button
            variant={tool === "metronome" ? "default" : "outline"}
            className="h-11"
            onClick={() => setTool(tool === "metronome" ? null : "metronome")}
            aria-pressed={tool === "metronome"}
          >
            Máy đếm nhịp
          </Button>
          <Button
            variant={tool === "tuner" ? "default" : "outline"}
            className="h-11"
            onClick={() => setTool(tool === "tuner" ? null : "tuner")}
            aria-pressed={tool === "tuner"}
          >
            Máy lên dây
          </Button>
        </div>
        {tool === "metronome" && (
          <div className="mt-4">
            <Metronome compact />
          </div>
        )}
        {tool === "tuner" && (
          <div className="mt-4">
            <Tuner />
          </div>
        )}
      </section>

      <section className="mt-10 space-y-4 border-t pt-5" aria-labelledby="finish">
        <h3 id="finish" className="text-lg font-semibold">
          Kết thúc buổi tập
        </h3>
        <label className="block space-y-1.5">
          <span className="text-sm text-muted-foreground">Hôm nay phần nào ổn, phần nào cần tập thêm?</span>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} data-testid="session-notes" />
        </label>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Mức tập trung</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              variant={focus === n ? "default" : "outline"}
              className="gl-num size-11"
              onClick={() => setFocus(n)}
              aria-pressed={focus === n}
              aria-label={`Mức tập trung ${n} trên 5`}
            >
              {n}
            </Button>
          ))}
        </div>
        <Button
          className="h-12 px-6 text-base"
          variant={current ? "outline" : "default"}
          onClick={finish}
          disabled={pending || totalSeconds === 0}
          data-testid="finish-session"
        >
          Lưu buổi tập
        </Button>
        {totalSeconds === 0 && <p className="text-xs text-muted-foreground">Bấm Bắt đầu để tính giờ trước khi lưu.</p>}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
