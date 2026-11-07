import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { requireOnboardedProfile } from "@/lib/auth";
import { formatDate, formatDuration } from "@/lib/format";
import { getPracticeSessions, getPracticeTotals } from "@/features/progress/queries";
import { routineForGoal } from "@/features/practice/routine";
import { startPracticeSession } from "@/features/practice/actions";

export const metadata: Metadata = { title: "Practice Studio" };

export default async function PracticePage() {
  const profile = await requireOnboardedProfile("/practice");
  const [sessions, totals] = await Promise.all([getPracticeSessions(20), getPracticeTotals()]);
  const routine = routineForGoal(profile.practice_goal_minutes);
  const open = sessions.find((s) => s.status === "in_progress");

  return (
    <>
      <PageHeader
        eyebrow="Practice Studio"
        title={`Buổi tập ${profile.practice_goal_minutes} phút`}
        description="Mỗi buổi tập có mục tiêu rõ ràng: ôn lại, nhạc lý, kỹ thuật, ứng dụng, chơi tự do và tự nhìn lại."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Lịch tập hằng ngày</h2>
          <ol className="mt-3 space-y-3">
            {routine.map((a, i) => (
              <li key={a.kind} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between font-medium">
                    <span>{a.title}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">{a.minutes} phút</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.guidance[0]}</p>
                </div>
              </li>
            ))}
          </ol>
          {open ? (
            <Link href={`/practice/${open.id}`} className={buttonVariants({ className: "mt-5 h-11 w-full" })}>
              Tiếp tục buổi tập đang dở
            </Link>
          ) : (
            <form action={startPracticeSession}>
              <Button type="submit" className="mt-5 h-11 w-full" data-testid="start-session">
                <PlayCircle /> Bắt đầu buổi tập
              </Button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Lịch sử luyện tập</h2>
            <span className="text-sm text-muted-foreground">Tổng: {formatDuration(totals.totalSeconds)}</span>
          </div>
          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Chưa có buổi tập nào. Buổi đầu tiên sẽ xuất hiện ở đây.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {sessions.map((s) => (
                <li key={s.id} className="py-2.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <span>{formatDate(s.started_at)}</span>
                    <span className="tabular-nums">
                      {s.status === "completed" ? formatDuration(s.duration_seconds) : (
                        <Link href={`/practice/${s.id}`} className="text-primary hover:underline">Đang dở →</Link>
                      )}
                    </span>
                  </div>
                  {s.notes && <p className="mt-0.5 line-clamp-2 text-muted-foreground">“{s.notes}”</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
