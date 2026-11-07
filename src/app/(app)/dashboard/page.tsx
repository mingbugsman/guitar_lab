import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, PlayCircle, Timer } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { requireOnboardedProfile } from "@/lib/auth";
import { formatClock, formatDate, formatDuration, isToday } from "@/lib/format";
import { getLessonProgress, getPracticeSessions, getPracticeTotals } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { routineForGoal } from "@/features/practice/routine";
import { startPracticeSession } from "@/features/practice/actions";

export const metadata: Metadata = { title: "Tổng quan" };

export default async function DashboardPage() {
  const profile = await requireOnboardedProfile("/dashboard");
  const [progress, sessions, totals] = await Promise.all([getLessonProgress(), getPracticeSessions(30), getPracticeTotals()]);
  const state = buildLearningState(progress);
  const todaySessions = sessions.filter((s) => isToday(s.started_at));
  const todaySeconds = todaySessions.filter((s) => s.status === "completed").reduce((t, s) => t + s.duration_seconds, 0);
  const openToday = todaySessions.find((s) => s.status === "in_progress");
  const goalSeconds = profile.practice_goal_minutes * 60;
  const routine = routineForGoal(profile.practice_goal_minutes);
  const continueLesson = state.inProgressLesson ?? state.nextLesson;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Level {state.currentLevel.number} · {state.currentLevel.title}</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Chào {profile.display_name ?? "bạn"} 👋
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Continue learning / today's lesson */}
        <section className="rounded-2xl border bg-card p-5" aria-labelledby="today-lesson">
          <p className="text-xs font-semibold text-primary uppercase">
            {state.inProgressLesson ? "Tiếp tục học" : "Bài học hôm nay"}
          </p>
          {continueLesson ? (
            <>
              <h2 id="today-lesson" className="mt-1 text-xl font-bold" data-testid="today-lesson">
                {continueLesson.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{continueLesson.summary}</p>
              <Link href={`/academy/${continueLesson.slug}`} className={buttonVariants({ className: "mt-4 h-11" })}>
                <PlayCircle /> {state.inProgressLesson ? "Học tiếp" : "Bắt đầu bài"}
              </Link>
            </>
          ) : (
            <>
              <h2 id="today-lesson" className="mt-1 text-xl font-bold">
                Bạn đã hoàn thành mọi bài trong bản này 🎉
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tiếp tục luyện tập hằng ngày để thành thạo. Bài mới (Dm, C, G, nhịp điệu…) sẽ có ở bản 0.2.
              </p>
            </>
          )}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Tiến độ giáo trình</span>
              <span className="tabular-nums" data-testid="progress-count">
                {state.completedCount}/{state.totalCount} bài · {state.percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={state.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${state.percent}%` }} />
            </div>
          </div>
        </section>

        {/* Today's practice */}
        <section className="rounded-2xl border bg-card p-5" aria-labelledby="today-practice">
          <div className="flex items-center justify-between">
            <h2 id="today-practice" className="font-semibold">
              Luyện tập hôm nay
            </h2>
            <Timer className="size-5 text-muted-foreground" aria-hidden />
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {formatClock(todaySeconds)} <span className="text-base font-normal text-muted-foreground">/ {profile.practice_goal_minutes} phút</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[var(--gl-highlight)]" style={{ width: `${Math.min(100, (todaySeconds / goalSeconds) * 100)}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {routine.map((a) => (
              <li key={a.kind} className="flex justify-between">
                <span>{a.title}</span>
                <span className="text-muted-foreground tabular-nums">{a.minutes} phút</span>
              </li>
            ))}
          </ul>
          {openToday ? (
            <Link href={`/practice/${openToday.id}`} className={buttonVariants({ className: "mt-4 h-11 w-full" })}>
              Tiếp tục buổi tập <ArrowRight />
            </Link>
          ) : (
            <form action={startPracticeSession}>
              <Button type="submit" className="mt-4 h-11 w-full">
                <PlayCircle /> Bắt đầu buổi tập {profile.practice_goal_minutes} phút
              </Button>
            </form>
          )}
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tổng thời gian luyện</p>
          <p className="mt-1 text-xl font-bold" data-testid="total-practice">{formatDuration(totals.totalSeconds)}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Buổi tập đã lưu</p>
          <p className="mt-1 flex items-center gap-1 text-xl font-bold">
            <Flame className="size-5 text-primary" aria-hidden /> {totals.completedSessions}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Vừa hoàn thành</p>
          {state.recentlyCompleted ? (
            <Link href={`/academy/${state.recentlyCompleted.lesson.slug}`} className="mt-1 flex items-start gap-1.5 font-semibold hover:underline">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[oklch(0.55_0.15_150)]" aria-hidden />
              <span>
                {state.recentlyCompleted.lesson.title}
                <span className="block text-xs font-normal text-muted-foreground">{formatDate(state.recentlyCompleted.completedAt)}</span>
              </span>
            </Link>
          ) : (
            <p className="mt-1 text-sm">Chưa có bài nào — bắt đầu với bài đầu tiên nhé.</p>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Công cụ nhanh</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/tools" className={buttonVariants({ variant: "outline" })}>Tuner</Link>
          <Link href="/tools" className={buttonVariants({ variant: "outline" })}>Metronome</Link>
          <Link href="/guitar" className={buttonVariants({ variant: "outline" })}>Đối chiếu cây đàn</Link>
          <Link href="/progress" className={buttonVariants({ variant: "outline" })}>Tiến độ của tôi</Link>
        </div>
      </section>
    </div>
  );
}
