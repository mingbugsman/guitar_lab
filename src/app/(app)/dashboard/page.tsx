import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { RoutineBar } from "@/components/learning/routine-bar";
import { requireOnboardedProfile } from "@/lib/auth";
import { APP_TIMEZONE, formatDate, formatDuration, isToday } from "@/lib/format";
import { getLessonProgress, getPracticeSessions, getPracticeTotals } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { routineForGoal } from "@/features/practice/routine";
import { startPracticeSession } from "@/features/practice/actions";
import { getDailyDrills } from "@/features/drills/queries";
import { DailyDrills, toDailyItems } from "@/components/practice/daily-drills";

export const metadata: Metadata = { title: "Hôm nay" };

export default async function DashboardPage() {
  const profile = await requireOnboardedProfile("/dashboard");
  const [progress, sessions, totals] = await Promise.all([getLessonProgress(), getPracticeSessions(30), getPracticeTotals()]);
  const state = buildLearningState(progress);
  const daily = await getDailyDrills(new Set(progress.filter((p) => p.completed_at).map((p) => p.lesson_slug)));
  const todaySessions = sessions.filter((s) => isToday(s.started_at));
  const todaySeconds = todaySessions.filter((s) => s.status === "completed").reduce((t, s) => t + s.duration_seconds, 0);
  const openToday = todaySessions.find((s) => s.status === "in_progress");
  const goalMinutes = profile.practice_goal_minutes;
  const practicedToday = todaySeconds >= goalMinutes * 60;
  const routine = routineForGoal(goalMinutes);
  const lesson = state.inProgressLesson ?? state.nextLesson;
  const today = new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIMEZONE, weekday: "long", day: "numeric", month: "numeric" }).format(new Date());

  return (
    <div className="max-w-2xl">
      <p className="gl-label first-letter:uppercase">{today}</p>
      <h1 className="gl-title mt-1 text-3xl sm:text-4xl">Chào {profile.display_name ?? "bạn"}</h1>

      {/* the one thing to do now */}
      <section aria-labelledby="today-lesson" className="mt-8 border-t pt-6">
        <p className="gl-label">
          {lesson ? (state.inProgressLesson ? "Bài đang học dở" : "Bài hôm nay") : "Bài học"} · Level{" "}
          <span className="gl-num">{state.currentLevel.number}</span> {state.currentLevel.subtitle}
        </p>
        {lesson ? (
          <>
            <h2 id="today-lesson" className="gl-title mt-2 text-2xl" data-testid="today-lesson">
              {lesson.title}
            </h2>
            <p className="mt-1.5 text-muted-foreground">{lesson.summary}</p>
            <Link href={`/academy/${lesson.slug}`} className={buttonVariants({ className: "mt-5 h-12 px-6 text-base" })}>
              {state.inProgressLesson ? "Học tiếp" : "Bắt đầu bài"} <ArrowRight />
            </Link>
          </>
        ) : (
          <>
            <h2 id="today-lesson" className="gl-title mt-2 text-2xl">
              Bạn đã học hết các bài hiện có
            </h2>
            <p className="mt-1.5 text-muted-foreground">
              Cứ tập đều mỗi ngày cho chắc tay. Mình đang làm tiếp các hợp âm Dm, C, G và phần gảy theo nhịp.
            </p>
          </>
        )}
        <p className="mt-5 text-sm text-muted-foreground" data-testid="progress-count">
          Đã xong{" "}
          <span className="gl-num text-foreground">
            {state.completedCount}/{state.totalCount}
          </span>{" "}
          bài
        </p>
        <div
          className="mt-2 flex gap-0.5"
          role="progressbar"
          aria-valuenow={state.completedCount}
          aria-valuemin={0}
          aria-valuemax={state.totalCount}
          aria-label="Tiến độ giáo trình"
        >
          {Array.from({ length: state.totalCount }, (_, i) => (
            <span key={i} className={i < state.completedCount ? "h-1.5 flex-1 rounded-[1px] bg-[var(--gl-highlight)]" : "h-1.5 flex-1 rounded-[1px] bg-foreground/15"} />
          ))}
        </div>
      </section>

      {/* three hand drills, picked for today */}
      <section aria-label="Bài tập tay hôm nay" className="mt-10 border-t pt-6">
        <DailyDrills items={toDailyItems(daily)} />
      </section>

      {/* today's practice as a timeline */}
      <section aria-labelledby="today-practice" className="mt-10 border-t pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="today-practice" className="text-lg font-semibold">
            Buổi tập hôm nay
          </h2>
          <p className="text-sm text-muted-foreground">
            <span className="gl-num text-foreground">{Math.floor(todaySeconds / 60)}</span>/<span className="gl-num">{goalMinutes}</span> phút
          </p>
        </div>
        <RoutineBar
          className="mt-4"
          segments={routine.map((a) => ({ key: a.kind, title: a.title, minutes: a.minutes, state: practicedToday ? "done" : "todo" }))}
        />
        {openToday ? (
          <Link href={`/practice/${openToday.id}`} className={buttonVariants({ variant: "outline", className: "mt-5 h-12 px-6 text-base" })}>
            Tập tiếp buổi đang dở <ArrowRight />
          </Link>
        ) : (
          <form action={startPracticeSession}>
            <Button type="submit" variant="outline" className="mt-5 h-12 px-6 text-base">
              {practicedToday ? "Tập thêm một buổi" : `Bắt đầu tập ${goalMinutes} phút`} <ArrowRight />
            </Button>
          </form>
        )}
      </section>

      {/* quiet facts, one line each */}
      <dl className="mt-10 divide-y border-y text-sm">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Tổng thời gian đã tập</dt>
          <dd className="font-medium" data-testid="total-practice">
            {formatDuration(totals.totalSeconds)} · <span className="gl-num">{totals.completedSessions}</span> buổi
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Bài vừa xong</dt>
          <dd className="text-right font-medium">
            {state.recentlyCompleted ? (
              <Link href={`/academy/${state.recentlyCompleted.lesson.slug}`} className="underline-offset-4 hover:underline">
                {state.recentlyCompleted.lesson.title}
                <span className="block text-xs font-normal text-muted-foreground">{formatDate(state.recentlyCompleted.completedAt)}</span>
              </Link>
            ) : (
              <span className="font-normal text-muted-foreground">Chưa có</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
