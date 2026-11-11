import { describe, expect, it } from "vitest";
import { UPDATES, unseenUpdates } from "./changelog";

describe("what's new", () => {
  it("lists entries newest first with unique ids", () => {
    const times = UPDATES.map((u) => Date.parse(u.publishedAt));
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(new Set(UPDATES.map((u) => u.id)).size).toBe(UPDATES.length);
    for (const u of UPDATES) expect(Number.isNaN(Date.parse(u.publishedAt))).toBe(false);
  });

  it("shows everything to a learner who never dismissed it and joined earlier", () => {
    expect(unseenUpdates(UPDATES, { seenAt: null, accountCreatedAt: "2026-11-07T00:00:00Z" })).toHaveLength(UPDATES.length);
  });

  it("hides what was dismissed, and shows only what came after", () => {
    const seen = UPDATES[1].publishedAt;
    expect(unseenUpdates(UPDATES, { seenAt: seen, accountCreatedAt: null }).map((u) => u.id)).toEqual([UPDATES[0].id]);
    expect(unseenUpdates(UPDATES, { seenAt: UPDATES[0].publishedAt, accountCreatedAt: null })).toEqual([]);
  });

  it("keeps entries dated in the future hidden until their time", () => {
    const at = Date.parse(UPDATES[0].publishedAt);
    expect(unseenUpdates(UPDATES, { seenAt: null, accountCreatedAt: null, now: at - 1000 }).map((u) => u.id)).not.toContain(UPDATES[0].id);
    expect(unseenUpdates(UPDATES, { seenAt: null, accountCreatedAt: null, now: at }).map((u) => u.id)).toContain(UPDATES[0].id);
  });

  it("does not greet a brand-new account with older news", () => {
    expect(unseenUpdates(UPDATES, { seenAt: null, accountCreatedAt: "2030-01-01T00:00:00Z" })).toEqual([]);
  });
});
