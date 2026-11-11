export type DrillRating = "clean" | "some-buzz" | "lost";
export type DrillStats = { bestClean: number | null; last: { bpm: number; rating: DrillRating; at: string } | null; runs: number };
export type DrillRow = { drill_id: string; bpm_reached: number; rating: DrillRating; created_at: string };

/** Per drill: fastest clean tempo, latest run, number of runs. Rows may come in any order. */
export function summarizeDrills(rows: DrillRow[]): Record<string, DrillStats> {
  const out: Record<string, DrillStats> = {};
  for (const r of rows) {
    const s = (out[r.drill_id] ??= { bestClean: null, last: null, runs: 0 });
    s.runs += 1;
    if (r.rating === "clean" && (s.bestClean == null || r.bpm_reached > s.bestClean)) s.bestClean = r.bpm_reached;
    if (!s.last || r.created_at > s.last.at) s.last = { bpm: r.bpm_reached, rating: r.rating, at: r.created_at };
  }
  return out;
}

/** Where to start next time: a bit faster after a clean run, slower after losing the beat. */
export function suggestedStart(startBpm: number, targetBpm: number, stats: DrillStats | undefined): number {
  if (!stats?.last) return startBpm;
  const { bpm, rating } = stats.last;
  const next = rating === "clean" ? bpm + 5 : rating === "lost" ? bpm - 10 : bpm;
  return Math.max(startBpm, Math.min(targetBpm, Math.round(next / 5) * 5));
}
