import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOnboardedProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/format";
import { getLessonProgress } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { SessionRunner, type RunnerActivity } from "@/features/practice/session-runner";

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

  return (
    <div className="space-y-5">
      <Link href="/practice" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Practice Studio
      </Link>
      <h1 className="text-2xl font-bold">Buổi tập {session.planned_minutes} phút</h1>
      {session.status === "completed" ? (
        <div className="rounded-2xl border bg-card p-5">
          <p className="font-medium">Buổi tập này đã được lưu — {formatDuration(session.duration_seconds)}.</p>
          {session.notes && <p className="mt-2 text-muted-foreground">“{session.notes}”</p>}
        </div>
      ) : (
        <SessionRunner
          sessionId={session.id}
          plannedMinutes={session.planned_minutes}
          activities={(activities ?? []) as RunnerActivity[]}
          currentLesson={lesson ? { slug: lesson.slug, title: lesson.title } : null}
        />
      )}
    </div>
  );
}
