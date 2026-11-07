"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Circle, Pause, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";
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

  if (finished !== null) {
    return (
      <div className="space-y-4 rounded-2xl border bg-card p-6 text-center" data-testid="session-saved">
        <CheckCircle2 className="mx-auto size-12 text-[oklch(0.55_0.15_150)]" />
        <h2 className="text-xl font-bold">Đã lưu buổi tập</h2>
        <p className="text-muted-foreground">
          Bạn đã luyện {formatDuration(finished)} và hoàn thành {activities.filter((a) => a.completed_at).length}/{activities.length} hoạt động.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/dashboard" className={buttonVariants()}>Về tổng quan</Link>
          <Link href="/progress" className={buttonVariants({ variant: "outline" })}>Xem tiến độ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tổng buổi tập</span>
            <span className="tabular-nums" data-testid="session-total">
              {formatClock(totalSeconds)} / {plannedMinutes}:00
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${Math.min(100, (totalSeconds / (plannedMinutes * 60)) * 100)}%` }} />
          </div>

          {current ? (
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase">
                Hoạt động {currentIndex + 1}/{activities.length}
              </p>
              <h2 className="text-2xl font-bold" data-testid="current-activity">
                {current.title}
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {guidanceFor(current.kind).map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              {(current.kind === "technical" || current.kind === "recall") && currentLesson && (
                <Link href={`/academy/${currentLesson.slug}`} className="inline-block text-sm text-primary underline-offset-4 hover:underline" target="_blank">
                  Mở bài: {currentLesson.title} ↗
                </Link>
              )}
              <div className="flex items-baseline gap-2">
                <span className={cn("text-5xl font-bold tabular-nums", elapsed > current.planned_seconds && "text-primary")} data-testid="activity-timer">
                  {formatClock(elapsed)}
                </span>
                <span className="text-muted-foreground">/ {formatClock(current.planned_seconds)}</span>
              </div>
              {elapsed >= current.planned_seconds && (
                <p className="text-sm font-medium text-primary">Đã đủ thời gian dự kiến — hoàn thành khi bạn sẵn sàng.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button className="h-11" variant={running ? "outline" : "default"} onClick={() => setRunning((r) => !r)} data-testid="timer-toggle">
                  {running ? <Pause /> : <Play />} {running ? "Tạm dừng" : elapsed ? "Tiếp tục" : "Bắt đầu"}
                </Button>
                <Button className="h-11" variant="secondary" onClick={markDone} disabled={pending} data-testid="activity-done">
                  <CheckCircle2 /> Xong hoạt động này
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-5 font-medium">Bạn đã hoàn thành mọi hoạt động. Ghi chú và lưu buổi tập bên dưới.</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">Kết thúc buổi tập</h3>
          <label className="block space-y-1.5">
            <span className="text-sm">Ghi chú (điều làm tốt, điều cần sửa)</span>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} data-testid="session-notes" />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>Mức tập trung:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <Button key={n} size="sm" variant={focus === n ? "default" : "outline"} onClick={() => setFocus(n)} aria-pressed={focus === n}>
                {n}
              </Button>
            ))}
          </div>
          <Button className="h-11 w-full sm:w-auto" onClick={finish} disabled={pending || totalSeconds === 0} data-testid="finish-session">
            Lưu buổi tập
          </Button>
          {totalSeconds === 0 && <p className="text-xs text-muted-foreground">Bấm “Bắt đầu” để tính giờ trước khi lưu.</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <aside className="space-y-4">
        <ol className="space-y-1 rounded-2xl border bg-card p-4" aria-label="Danh sách hoạt động">
          {activities.map((a, i) => (
            <li key={a.id} className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", i === currentIndex && "bg-muted font-medium")}>
              {a.completed_at ? (
                <CheckCircle2 className="size-4 text-[oklch(0.55_0.15_150)]" aria-label="Xong" />
              ) : (
                <Circle className="size-4 text-muted-foreground" aria-label="Chưa xong" />
              )}
              <span className="flex-1">{a.title}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {a.completed_at ? formatClock(a.actual_seconds) : `${Math.round(a.planned_seconds / 60)}′`}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button variant={tool === "metronome" ? "default" : "outline"} className="flex-1" onClick={() => setTool(tool === "metronome" ? null : "metronome")}>
            Metronome
          </Button>
          <Button variant={tool === "tuner" ? "default" : "outline"} className="flex-1" onClick={() => setTool(tool === "tuner" ? null : "tuner")}>
            Tuner
          </Button>
        </div>
        {tool === "metronome" && <Metronome compact />}
        {tool === "tuner" && <Tuner />}
      </aside>
    </div>
  );
}
