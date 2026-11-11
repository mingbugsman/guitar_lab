import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { RoutineBar } from "@/components/learning/routine-bar";
import { requireOnboardedProfile } from "@/lib/auth";
import { formatDate, formatDuration } from "@/lib/format";
import { getPracticeSessions, getPracticeTotals } from "@/features/progress/queries";
import { routineForGoal } from "@/features/practice/routine";
import { startPracticeSession } from "@/features/practice/actions";

export const metadata: Metadata = { title: "Luyện tập" };

export default async function PracticePage() {
  const profile = await requireOnboardedProfile("/practice");
  const [sessions, totals] = await Promise.all([getPracticeSessions(20), getPracticeTotals()]);
  const routine = routineForGoal(profile.practice_goal_minutes);
  const open = sessions.find((s) => s.status === "in_progress");

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Buổi tập ${profile.practice_goal_minutes} phút`}
        description="Buổi tập chia sẵn thành sáu phần. Có đồng hồ bấm giờ, bạn chỉ việc làm theo từng phần."
      />

      <RoutineBar segments={routine.map((a) => ({ key: a.kind, title: a.title, minutes: a.minutes }))} />

      <ol className="mt-6 divide-y border-y">
        {routine.map((a, i) => (
          <li key={a.kind} className="flex gap-4 py-3">
            <span className="gl-num w-5 shrink-0 pt-0.5 text-sm text-muted-foreground">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-muted-foreground">{a.guidance[0]}</p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              <span className="gl-num text-foreground">{a.minutes}</span> phút
            </span>
          </li>
        ))}
      </ol>

      {open ? (
        <Link href={`/practice/${open.id}`} className={buttonVariants({ className: "mt-6 h-12 px-6 text-base" })}>
          Tập tiếp buổi đang dở <ArrowRight />
        </Link>
      ) : (
        <form action={startPracticeSession}>
          <Button type="submit" className="mt-6 h-12 px-6 text-base" data-testid="start-session">
            Bắt đầu buổi tập <ArrowRight />
          </Button>
        </form>
      )}

      <section className="mt-12" aria-labelledby="extra">
        <h2 id="extra" className="border-b border-foreground pb-2 text-lg font-semibold">
          Tập riêng
        </h2>
        <ul className="divide-y">
          <li>
            <Link
              href="/practice/drills"
              className="flex items-center justify-between gap-4 py-3 hover:bg-muted/50"
              data-testid="open-drills"
            >
              <span>
                <span className="block font-medium">Bài tập ngón</span>
                <span className="block text-sm text-muted-foreground">
                  12 bài: spider, tách ngón, dời thế tay, nhảy dây… Có xem mẫu, nhanh dần.
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          </li>
          <li>
            <Link href="/tools" className="flex items-center justify-between gap-4 py-3 hover:bg-muted/50">
              <span>
                <span className="block font-medium">Đổi hợp âm 1 phút</span>
                <span className="block text-sm text-muted-foreground">Máy đếm số lần bạn đổi hợp âm, lưu kỷ lục từng cặp.</span>
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="history">
        <div className="flex items-baseline justify-between border-b border-foreground pb-2">
          <h2 id="history" className="text-lg font-semibold">
            Các buổi đã tập
          </h2>
          <span className="text-sm text-muted-foreground">Tổng {formatDuration(totals.totalSeconds)}</span>
        </div>
        {sessions.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Chưa có buổi nào. Buổi đầu tiên của bạn sẽ hiện ở đây.</p>
        ) : (
          <ul className="divide-y">
            {sessions.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span>{formatDate(s.started_at)}</span>
                  {s.status === "completed" ? (
                    <span className="font-medium">{formatDuration(s.duration_seconds)}</span>
                  ) : (
                    <Link href={`/practice/${s.id}`} className="underline underline-offset-4">
                      Đang dở, tập tiếp
                    </Link>
                  )}
                </div>
                {s.notes && <p className="mt-1 line-clamp-2 text-muted-foreground">{s.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
