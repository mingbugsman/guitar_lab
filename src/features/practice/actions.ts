"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfile, getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { completeActivitySchema, finishSessionSchema, type ActionResult } from "@/lib/validation/schemas";
import { syncMilestones } from "@/features/progress/queries";
import { routineForGoal } from "./routine";

/** Create a practice session with its activities, then open it. Resumes today's unfinished session if any. */
export async function startPracticeSession(): Promise<void> {
  const user = await getUser();
  if (!user) redirect("/login?next=/practice");
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: open } = await supabase
    .from("practice_sessions")
    .select("id, started_at")
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (open && Date.now() - new Date(open.started_at).getTime() < 12 * 3600 * 1000) {
    redirect(`/practice/${open.id}`);
  }

  const goal = profile?.practice_goal_minutes ?? 30;
  const routine = routineForGoal(goal);
  const { data: session, error } = await supabase
    .from("practice_sessions")
    .insert({ user_id: user.id, planned_minutes: goal, routine_key: `daily-${goal}` })
    .select("id")
    .single();
  if (error || !session) throw new Error("Không tạo được buổi tập.");

  const { error: actError } = await supabase.from("practice_activities").insert(
    routine.map((a, i) => ({
      session_id: session.id,
      user_id: user.id,
      position: i,
      kind: a.kind,
      title: a.title,
      planned_seconds: a.minutes * 60,
    })),
  );
  if (actError) {
    await supabase.from("practice_sessions").delete().eq("id", session.id);
    throw new Error("Không tạo được hoạt động luyện tập.");
  }
  revalidatePath("/practice");
  redirect(`/practice/${session.id}`);
}

export async function completeActivity(input: {
  sessionId: string;
  activityId: string;
  actualSeconds: number;
}): Promise<ActionResult> {
  const parsed = completeActivitySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("practice_activities")
    .update({ actual_seconds: parsed.data.actualSeconds, completed_at: new Date().toISOString() })
    .eq("id", parsed.data.activityId)
    .eq("session_id", parsed.data.sessionId);
  if (error) return { ok: false, error: "Không lưu được hoạt động." };
  return { ok: true };
}

export async function finishPracticeSession(input: {
  sessionId: string;
  durationSeconds: number;
  notes: string;
  focusRating: number | null;
}): Promise<ActionResult> {
  const parsed = finishSessionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const user = await getUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("practice_sessions")
    .update({
      status: "completed",
      duration_seconds: parsed.data.durationSeconds,
      notes: parsed.data.notes.trim() || null,
      focus_rating: parsed.data.focusRating,
      ended_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.sessionId);
  if (error) return { ok: false, error: "Không lưu được buổi tập." };
  await syncMilestones(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/practice");
  revalidatePath("/progress");
  return { ok: true };
}
