import "server-only";
import { createClient } from "@/lib/supabase/server";
import { FINGER_DRILLS } from "@/content/drills";
import { getUser } from "@/lib/auth";
import { pickDailyDrills, type DailyPick } from "./daily";
import { summarizeDrills, type DrillRow, type DrillStats } from "./stats";

/** Stats for the signed-in learner (RLS limits rows to their own). */
export async function getDrillStats(drillIds?: string[]): Promise<Record<string, DrillStats>> {
  const supabase = await createClient();
  let q = supabase.from("drill_results").select("drill_id, bpm_reached, rating, created_at").order("created_at", { ascending: false }).limit(1000);
  if (drillIds) q = q.in("drill_id", drillIds);
  const { data } = await q;
  return summarizeDrills((data ?? []) as DrillRow[]);
}

/** Today's three hand drills for the signed-in learner. */
export async function getDailyDrills(completedLessons: Set<string>): Promise<DailyPick[]> {
  const user = await getUser();
  if (!user) return [];
  const supabase = await createClient();
  const since = new Date(Date.now() - 60 * 86_400_000).toISOString();
  const { data } = await supabase
    .from("drill_results")
    .select("drill_id, bpm_reached, rating, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1000);
  return pickDailyDrills({ drills: FINGER_DRILLS, completedLessons, rows: (data ?? []) as DrillRow[], seed: user.id });
}
