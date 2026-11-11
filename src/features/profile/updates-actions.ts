"use server";

import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** The learner dismissed "Có gì mới": remember it on their profile (every device). */
export async function markUpdatesSeen(): Promise<void> {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from("profiles").update({ updates_seen_at: new Date().toISOString() }).eq("id", user.id);
}
