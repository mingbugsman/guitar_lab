import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type Profile = {
  id: string;
  display_name: string | null;
  experience: "complete_beginner" | "some_experience";
  guitar_type: "acoustic" | "electric" | "classical" | null;
  handedness: "right" | "left";
  practice_goal_minutes: number;
  learning_target: string;
  onboarded_at: string | null;
};

/** Current user, verified with Supabase Auth (cached per request). */
export const getUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, experience, guitar_type, handedness, practice_goal_minutes, learning_target, onboarded_at")
    .eq("id", user.id)
    .single();
  return (data as Profile | null) ?? null;
});

export async function requireUser(next?: string) {
  const user = await getUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

/** Signed-in user who has finished onboarding. */
export async function requireOnboardedProfile(next?: string): Promise<Profile> {
  await requireUser(next);
  const profile = await getProfile();
  if (!profile || !profile.onboarded_at) redirect("/onboarding");
  return profile;
}
