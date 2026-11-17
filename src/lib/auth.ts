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
  created_at: string;
  updates_seen_at: string | null;
};

export type SessionUser = { id: string; email: string | null };

/**
 * Current user (cached per request). getClaims() checks the session token's signature against
 * the project's public key (ES256, fetched once per server process) instead of asking the Auth
 * server on every page, so a click costs one round trip less. If the project ever goes back to
 * a shared-secret key, getClaims() falls back to asking the Auth server by itself.
 */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, display_name, experience, guitar_type, handedness, practice_goal_minutes, learning_target, onboarded_at, created_at, updates_seen_at",
    )
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
