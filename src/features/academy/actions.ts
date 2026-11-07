"use server";

import { revalidatePath } from "next/cache";
import { getLesson } from "@/content/curriculum";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { lessonProgressSchema, type ActionResult, type LessonProgressInput } from "@/lib/validation/schemas";
import { syncMilestones } from "@/features/progress/queries";

/**
 * Save the learner's progress on a lesson.
 * - Completion requires every checklist item to be ticked (validated here, not only in the UI).
 * - "mastered" can never be set from the client (also enforced by a DB constraint + column grants).
 */
export async function saveLessonProgress(input: LessonProgressInput): Promise<ActionResult> {
  const parsed = lessonProgressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const { slug, checklist, status, selfRating, complete } = parsed.data;

  const lesson = getLesson(slug);
  if (!lesson) return { ok: false, error: "Bài học không tồn tại." };
  const validIds = new Set(lesson.checklist.map((c) => c.id));
  const cleanChecklist = [...new Set(checklist.filter((id) => validIds.has(id)))];
  if (complete && cleanChecklist.length !== validIds.size) {
    return { ok: false, error: "Hãy hoàn thành mọi mục trong checklist trước khi đánh dấu hoàn thành." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập." };
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("lesson_slug", slug)
    .maybeSingle();

  const completedAt = complete ? (existing?.completed_at ?? new Date().toISOString()) : null;

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_slug: slug,
      checklist: cleanChecklist,
      status: complete ? "practicing" : status,
      self_rating: selfRating,
      completed_at: completedAt,
    },
    { onConflict: "user_id,lesson_slug" },
  );
  if (error) return { ok: false, error: "Không lưu được tiến độ. Thử lại sau." };

  if (complete) await syncMilestones(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/academy");
  revalidatePath("/progress");
  return { ok: true };
}
