"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  onboardingSchema,
  profileSchema,
  type ActionResult,
  type OnboardingInput,
  type ProfileInput,
} from "@/lib/validation/schemas";

export async function completeOnboarding(input: OnboardingInput): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Hãy chọn đầy đủ các mục." };
  const user = await getUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      experience: parsed.data.experience,
      guitar_type: parsed.data.guitarType,
      handedness: parsed.data.handedness,
      practice_goal_minutes: parsed.data.practiceGoalMinutes,
      learning_target: parsed.data.learningTarget,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Không lưu được thiết lập. Thử lại sau." };
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function updateProfile(input: ProfileInput): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };
  const user = await getUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      experience: parsed.data.experience,
      guitar_type: parsed.data.guitarType,
      handedness: parsed.data.handedness,
      practice_goal_minutes: parsed.data.practiceGoalMinutes,
      learning_target: parsed.data.learningTarget,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Không lưu được hồ sơ." };
  revalidatePath("/", "layout");
  return { ok: true };
}
