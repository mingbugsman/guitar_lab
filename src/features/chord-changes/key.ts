/** Storage key for a chord or a pair: order does not matter, so "Em → Am" and "Am → Em" share history. */
export function chordChangeKey(chords: readonly string[]): string {
  return [...new Set(chords)].sort().join("-");
}
