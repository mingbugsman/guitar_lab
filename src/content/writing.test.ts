import { describe, expect, it } from "vitest";
import { LESSONS } from "./curriculum";
import type { Lesson } from "./types";

/**
 * Automatic checks for docx/WRITING_GUIDE.md. They cannot judge tone, but they catch the
 * mechanical slips: unexplained jargon, banned words, shouting in capitals, missing body notes.
 */

/** Everything the learner reads in a lesson, in the order the lesson player shows it. Headings excluded. */
function readingOrder(l: Lesson): string[] {
  const out: string[] = [...l.objectives];
  for (const b of l.blocks) {
    if (b.type === "text") out.push(...b.paragraphs);
    else if (b.type === "visual") out.push(b.caption ?? "");
    else if (b.type === "steps") out.push(...b.items);
    else out.push(b.text);
  }
  out.push(...l.practice.steps);
  for (const m of l.mistakes) out.push(m.mistake, m.fix);
  out.push(...l.checklist.map((c) => c.label), ...l.assessment, ...l.mastery);
  return out;
}

/** §4 glossary: the first time one of these appears in a lesson it must be explained. */
const TERMS: { term: string; caseSensitive?: boolean }[] = [
  { term: "dây buông" },
  { term: "lược đàn" },
  { term: "ngựa đàn" },
  { term: "thanh phím" },
  { term: "khóa đàn" },
  { term: "hợp âm" },
  { term: "nốt gốc" },
  { term: "nửa cung" },
  { term: "quãng tám" },
  { term: "phách" },
  { term: "ô nhịp" },
  { term: "nốt đen" },
  { term: "móc đơn" },
  { term: "cao độ" },
  { term: "BPM", caseSensitive: true },
  { term: "cent", caseSensitive: true },
  { term: "phím gảy" },
  { term: "máy lên dây" },
  { term: "máy đếm nhịp" },
  { term: "sơ đồ hợp âm" },
  { term: "chấm định vị" },
  { term: "lỗ thoát âm" },
  { term: "Tab", caseSensitive: true },
];

/** Explained = followed by "(…)", "là", ":" or "=", or itself sitting inside an explanation in brackets. */
function isExplained(text: string, at: number, term: string): boolean {
  const after = text.slice(at + term.length);
  if (/^['’”]?\s*(\(|là\s|:|=)/.test(after)) return true;
  const before = text.slice(0, at);
  return before.lastIndexOf("(") > before.lastIndexOf(")");
}

function firstUse(l: Lesson, term: string, caseSensitive = false) {
  const re = new RegExp(`(?<![\\p{L}])${term}(?![\\p{L}])`, caseSensitive ? "u" : "iu");
  for (const text of readingOrder(l)) {
    const m = re.exec(text);
    if (m) return { text, at: m.index };
  }
  return null;
}

describe("writing guide §4 — terms are explained the first time they appear in each lesson", () => {
  for (const l of LESSONS) {
    it(l.slug, () => {
      const unexplained = TERMS.flatMap(({ term, caseSensitive }) => {
        const hit = firstUse(l, term, caseSensitive);
        return hit && !isExplained(hit.text, hit.at, term) ? [`"${term}" in: ${hit.text}`] : [];
      });
      expect(unexplained).toEqual([]);
    });
  }
});

describe("writing guide §2 and §4 — wording", () => {
  const all = LESSONS.flatMap((l) =>
    [l.title, l.summary, ...readingOrder(l), ...l.blocks.flatMap((b) => (b.type === "text" || b.type === "steps") && b.heading ? [b.heading] : [])].map(
      (text) => ({ slug: l.slug, text }),
    ),
  );

  it("uses the glossary word, not its look-alikes", () => {
    const banned = [
      /dây mở/iu,
      /\bngăn (đàn|phím|\d)/iu,
      /móng gảy/iu,
      /trục lên dây/iu,
      /\bbeat\b/iu,
      /\bclick\b/iu,
      /\bpulse\b/iu,
      /(?<!máy đếm nhịp \()metronome/iu,
      /(?<!máy lên dây \()(?<![\p{L}])tuner/iu,
    ];
    const hits = all.filter(({ text }) => banned.some((re) => re.test(text)));
    expect(hits).toEqual([]);
  });

  it("does not shout: no words in capitals except TRÁI / PHẢI and symbols", () => {
    const allowed = new Set(["TRÁI", "PHẢI", "BPM"]);
    const hits = all.flatMap(({ slug, text }) =>
      (text.replace(/\{[A-Za-z]+\}/g, "").match(/(?<![\p{L}])\p{Lu}{2,}(?![\p{L}\d])/gu) ?? [])
        .filter((w) => !allowed.has(w))
        .map((w) => `${slug}: ${w}`),
    );
    expect(hits).toEqual([]);
  });

  it("speaks to the learner as 'bạn', never 'ta' / 'chúng ta'", () => {
    const hits = all.filter(({ text }) => /(?<![\p{L}])(chúng ta|ta)(?![\p{L}])/iu.test(text));
    expect(hits).toEqual([]);
  });

  it("self-check lines are said by the learner: they start with 'Tôi'", () => {
    const hits = LESSONS.flatMap((l) => l.checklist.filter((c) => !c.label.startsWith("Tôi ")).map((c) => `${l.slug}: ${c.label}`));
    expect(hits).toEqual([]);
  });
});

describe("writing guide §5 — body and expectations", () => {
  const needsBodyNote = LESSONS.filter(
    (l) => ["posture", "hand-position", "fretboard-basics"].includes(l.slug) || l.slug.startsWith("chord-"),
  );

  it("covers posture, hand position, fretting notes and every chord lesson", () => {
    expect(needsBodyNote.map((l) => l.slug)).toEqual(
      expect.arrayContaining(["posture", "hand-position", "fretboard-basics", "chord-em", "chord-am", "chord-e", "chord-a", "chord-d"]),
    );
  });

  for (const l of needsBodyNote) {
    it(`${l.slug}: says what is normal, how many sessions it takes, and when to stop`, () => {
      const notes = l.blocks.filter((b) => b.type === "callout" && b.tone === "body");
      expect(notes).toHaveLength(1);
      const text = notes[0].type === "callout" ? notes[0].text : "";
      expect(text).toMatch(/bình thường/);
      expect(text).toMatch(/\d+\s*(đến|–)\s*\d+ buổi/);
      expect(text).toMatch(/[Dd]ừng/);
    });
  }
});
