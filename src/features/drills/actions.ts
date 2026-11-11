"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { drillResultSchema, type ActionResult, type DrillResultInput } from "@/lib/validation/schemas";
import { getDrillStats } from "./queries";
import type { DrillStats } from "./stats";

export async function saveDrillResult(input: DrillResultInput): Promise<ActionResult<DrillStats>> {
  const parsed = drillResultSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const user = await getUser();
  if (!user) return { ok: false, error: "signed-out" };
  const supabase = await createClient();
  const { drillId, kind, bpmReached, rating, seconds } = parsed.data;
  const { error } = await supabase
    .from("drill_results")
    .insert({ user_id: user.id, drill_id: drillId, kind, bpm_reached: bpmReached, rating, seconds });
  if (error) return { ok: false, error: "Không lưu được kết quả. Thử lại sau." };
  revalidatePath("/practice/drills");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  const stats = await getDrillStats([drillId]);
  return { ok: true, data: stats[drillId] };
}

/** Last result for one drill or challenge, for suggestions. Signed-out visitors get null. */
export async function getLastDrillResult(drillId: string): Promise<{ bpm: number; rating: "clean" | "some-buzz" | "lost" } | null> {
  if (!/^[a-z0-9:-]{1,80}$/.test(drillId)) return null;
  const user = await getUser();
  if (!user) return null;
  const stats = await getDrillStats([drillId]);
  const last = stats[drillId]?.last;
  return last ? { bpm: last.bpm, rating: last.rating } : null;
}
