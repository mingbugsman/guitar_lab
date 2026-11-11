import "server-only";
import { createClient } from "@/lib/supabase/server";
import { summarizeDrills, type DrillRow, type DrillStats } from "./stats";

/** Stats for the signed-in learner (RLS limits rows to their own). */
export async function getDrillStats(drillIds?: string[]): Promise<Record<string, DrillStats>> {
  const supabase = await createClient();
  let q = supabase.from("drill_results").select("drill_id, bpm_reached, rating, created_at").order("created_at", { ascending: false }).limit(1000);
  if (drillIds) q = q.in("drill_id", drillIds);
  const { data } = await q;
  return summarizeDrills((data ?? []) as DrillRow[]);
}
