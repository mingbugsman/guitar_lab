"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { CHORDS } from "@/lib/music/chords";
import { createClient } from "@/lib/supabase/server";
import { chordChangeRunSchema, type ActionResult, type ChordChangeRunInput } from "@/lib/validation/schemas";
import { chordChangeKey } from "./key";

export type ChordChangeHistory = { runs: { changes: number; at: string }[]; best: number | null };

const HISTORY_LENGTH = 8;

async function readHistory(key: string): Promise<ChordChangeHistory> {
  const supabase = await createClient();
  const [{ data: recent }, { data: top }] = await Promise.all([
    supabase
      .from("chord_change_runs")
      .select("changes, created_at")
      .eq("chords", key)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LENGTH),
    supabase.from("chord_change_runs").select("changes").eq("chords", key).order("changes", { ascending: false }).limit(1),
  ]);
  return {
    runs: (recent ?? []).reverse().map((r) => ({ changes: r.changes as number, at: r.created_at as string })),
    best: (top?.[0]?.changes as number | undefined) ?? null,
  };
}

function validChords(chords: string[]): boolean {
  return chords.every((c) => c in CHORDS);
}

/** History for one chord or pair. Visitors who are not signed in simply get no history. */
export async function getChordChangeHistory(chords: string[]): Promise<ActionResult<ChordChangeHistory>> {
  if (chords.length < 1 || chords.length > 2 || !validChords(chords)) return { ok: false, error: "Hợp âm không hợp lệ." };
  const user = await getUser();
  if (!user) return { ok: false, error: "signed-out" };
  return { ok: true, data: await readHistory(chordChangeKey(chords)) };
}

export async function saveChordChangeRun(input: ChordChangeRunInput): Promise<ActionResult<ChordChangeHistory>> {
  const parsed = chordChangeRunSchema.safeParse(input);
  if (!parsed.success || !validChords(parsed.data.chords)) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const user = await getUser();
  if (!user) return { ok: false, error: "signed-out" };

  const key = chordChangeKey(parsed.data.chords);
  const supabase = await createClient();
  const { error } = await supabase.from("chord_change_runs").insert({
    user_id: user.id,
    chords: key,
    changes: parsed.data.changes,
    seconds: parsed.data.seconds,
    counted_by: parsed.data.countedBy,
  });
  if (error) return { ok: false, error: "Không lưu được kết quả. Thử lại sau." };
  revalidatePath("/progress");
  return { ok: true, data: await readHistory(key) };
}
