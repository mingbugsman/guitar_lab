import "server-only";
import { createClient } from "@/lib/supabase/server";
import { earnedMilestones } from "./milestones";
import type { ProgressRow } from "./learning-state";

export type SessionRow = {
  id: string;
  status: "in_progress" | "completed";
  planned_minutes: number;
  duration_seconds: number;
  notes: string | null;
  focus_rating: number | null;
  started_at: string;
  ended_at: string | null;
};

export async function getLessonProgress(): Promise<ProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, status, checklist, self_rating, started_at, completed_at, verified_at, updated_at");
  if (error) throw new Error(`Không tải được tiến độ: ${error.message}`);
  return (data ?? []) as ProgressRow[];
}

export async function getLessonProgressFor(slug: string): Promise<ProgressRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, status, checklist, self_rating, started_at, completed_at, verified_at, updated_at")
    .eq("lesson_slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Không tải được tiến độ: ${error.message}`);
  return (data as ProgressRow | null) ?? null;
}

export async function getPracticeSessions(limit = 50): Promise<SessionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .select("id, status, planned_minutes, duration_seconds, notes, focus_rating, started_at, ended_at")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Không tải được buổi tập: ${error.message}`);
  return (data ?? []) as SessionRow[];
}

export async function getPracticeTotals() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .select("duration_seconds, started_at")
    .eq("status", "completed");
  if (error) throw new Error(`Không tải được thống kê: ${error.message}`);
  const rows = data ?? [];
  return {
    completedSessions: rows.length,
    totalSeconds: rows.reduce((s, r) => s + (r.duration_seconds ?? 0), 0),
  };
}

export async function getMilestones(): Promise<{ milestone_key: string; achieved_at: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_milestones")
    .select("milestone_key, achieved_at")
    .order("achieved_at", { ascending: true });
  if (error) throw new Error(`Không tải được cột mốc: ${error.message}`);
  return data ?? [];
}

/** Recompute milestones from real data and store any newly earned ones. */
export async function syncMilestones(userId: string): Promise<void> {
  const supabase = await createClient();
  const [progress, totals] = await Promise.all([getLessonProgress(), getPracticeTotals()]);
  const earned = earnedMilestones({
    completedLessonSlugs: progress.filter((p) => p.completed_at).map((p) => p.lesson_slug),
    completedSessions: totals.completedSessions,
    totalPracticeSeconds: totals.totalSeconds,
  });
  if (earned.length === 0) return;
  await supabase
    .from("user_milestones")
    .upsert(
      earned.map((key) => ({ user_id: userId, milestone_key: key })),
      { onConflict: "user_id,milestone_key", ignoreDuplicates: true },
    );
}
