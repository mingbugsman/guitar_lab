import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

/**
 * Row Level Security: a user can never read or write another user's data,
 * and can never mark a lesson "mastered" or set verified_at.
 * Runs against the Supabase project in NEXT_PUBLIC_SUPABASE_URL (use local/dev only).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

async function newUser() {
  const client = createClient(url, key, { auth: { persistSession: false } });
  const email = `rls-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const { data, error } = await client.auth.signUp({ email, password: "rls-test-12345" });
  if (error || !data.user) throw error ?? new Error("signup failed");
  return { client, id: data.user.id };
}

test("RLS isolates users and protects verification fields", async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "data-layer test runs once");
  test.skip(!url || !key, "Supabase env not set");

  const a = await newUser();
  const b = await newUser();

  const { data: session, error } = await a.client
    .from("practice_sessions")
    .insert({ user_id: a.id, planned_minutes: 30 })
    .select("id")
    .single();
  expect(error).toBeNull();

  // B cannot see A's session or profile
  const { data: seen } = await b.client.from("practice_sessions").select("id").eq("id", session!.id);
  expect(seen).toEqual([]);
  const { data: profiles } = await b.client.from("profiles").select("id").eq("id", a.id);
  expect(profiles).toEqual([]);

  // B cannot write rows for A
  const { error: forged } = await b.client.from("practice_sessions").insert({ user_id: a.id, planned_minutes: 30 });
  expect(forged).not.toBeNull();
  const { error: forgedActivity } = await b.client.from("practice_activities").insert({
    session_id: session!.id,
    user_id: b.id,
    position: 0,
    kind: "recall",
    title: "x",
    planned_seconds: 60,
  });
  expect(forgedActivity).not.toBeNull();

  // B cannot update A's session (0 rows affected)
  const { data: updated } = await b.client.from("practice_sessions").update({ notes: "hacked" }).eq("id", session!.id).select();
  expect(updated).toEqual([]);

  // Nobody can self-certify mastery
  const { error: mastered } = await a.client
    .from("lesson_progress")
    .insert({ user_id: a.id, lesson_slug: "introduction", status: "mastered" });
  expect(mastered).not.toBeNull();
  const { error: verified } = await a.client
    .from("lesson_progress")
    .insert({ user_id: a.id, lesson_slug: "posture", verified_at: new Date().toISOString() });
  expect(verified).not.toBeNull();

  // Chord-change results: own rows only
  const { error: ownRun } = await a.client
    .from("chord_change_runs")
    .insert({ user_id: a.id, chords: "am-em", changes: 12, seconds: 60, counted_by: "mic" });
  expect(ownRun).toBeNull();
  const { error: forgedRun } = await b.client
    .from("chord_change_runs")
    .insert({ user_id: a.id, chords: "am-em", changes: 99, seconds: 60, counted_by: "mic" });
  expect(forgedRun).not.toBeNull();
  const { data: othersRuns } = await b.client.from("chord_change_runs").select("id").eq("user_id", a.id);
  expect(othersRuns).toEqual([]);

  // Anonymous clients see nothing
  const anon = createClient(url, key, { auth: { persistSession: false } });
  const { data: anonRows } = await anon.from("practice_sessions").select("id");
  expect(anonRows ?? []).toEqual([]);
});
