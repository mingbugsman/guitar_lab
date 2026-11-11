import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { requireOnboardedProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/format";
import { getLessonProgress } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { SessionRunner, type RunnerActivity } from "@/features/practice/session-runner";
import { getDailyDrills } from "@/features/drills/queries";
import { toDailyItems } from "@/components/practice/daily-drills";

export const metadata: Metadata = { title: "Buổi tập" };

export default async function SessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  await requireOnboardedProfile(`/practice/${sessionId}`);
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) notFound();

  const supabase = await createClient();
  const [{ data: session }, { data: activities }, progress] = await Promise.all([
    supabase
      .from("practice_sessions")
      .select("id, status, planned_minutes, duration_seconds, notes")
      .eq("id", sessionId)
      .maybeSingle(),
    supabase
      .from("practice_activities")
      .select("id, position, kind, title, planned_seconds, actual_seconds, completed_at")
      .eq("session_id", sessionId)
      .order("position"),
    getLessonProgress(),
  ]);
  // RLS hides other users' sessions, so "not found" also covers "not yours".
  if (!session) notFound();
  const state = buildLearningState(progress);
  const lesson = state.inProgressLesson ?? state.nextLesson;
  const daily = await getDailyDrills(new Set(progress.filter((p) => p.completed_at).map((p) => p.lesson_slug)));

  return (
    <div className="space-y-5">
      <Link href="/practice" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Luyện tập
      </Link>
      <h1 className="gl-title text-2xl sm:text-3xl">
        Buổi tập <span className="gl-num">{session.planned_minutes}</span> phút
      </h1>
      {session.status === "completed" ? (
        <div className="max-w-xl space-y-4 border-t pt-6" data-testid="session-saved">
          <p className="flex items-center gap-2 text-sm font-medium text-[oklch(0.45_0.13_150)]">
            <CheckCircle2 className="size-5" aria-hidden /> Đã lưu buổi tập
          </p>
          <p className="gl-title text-3xl">
            Bạn đã tập <span className="gl-num">{formatDuration(session.duration_seconds)}</span>
          </p>
          <p className="text-muted-foreground">
            Xong{" "}
            <span className="gl-num">
              {(activities ?? []).filter((a) => a.completed_at).length}/{(activities ?? []).length}
            </span>{" "}
            phần của buổi tập.
          </p>
          {session.notes && <p className="border-l-2 border-foreground/40 pl-4 text-muted-foreground">{session.notes}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/dashboard" className={buttonVariants({ className: "h-12 px-6 text-base" })}>
              Về trang Hôm nay
            </Link>
            <Link href="/progress" className={buttonVariants({ variant: "outline", className: "h-12 px-6 text-base" })}>
              Xem tiến độ
            </Link>
          </div>
        </div>
      ) : (
        <SessionRunner
          sessionId={session.id}
          plannedMinutes={session.planned_minutes}
          activities={(activities ?? []) as RunnerActivity[]}
          currentLesson={lesson ? { slug: lesson.slug, title: lesson.title } : null}
          dailyDrills={toDailyItems(daily)}
        />
      )}
    </div>
  );
}
