import { expect, test } from "@playwright/test";

/** Level 2's strumming pattern player, on the public tools page: count-in, slots in time, stop. */
test("the strumming pattern counts in, lights the slots in order with the click, and stops", async ({ page }) => {
  await page.goto("/tools");
  const tool = page.getByTestId("strum-tool");
  await tool.getByTestId("strum-tool-pattern").selectOption("folk");
  await tool.getByTestId("strum-tool-chords").selectOption("2");
  const player = tool.getByTestId("strum-pattern");
  // ↓ ↓↑ ↑↓↑: two of the eight slots are the hand moving without touching the strings
  await expect(player.locator('[data-stroke="-"]')).toHaveCount(2);

  // a tap before the page is interactive does nothing: retry until the player reacts
  await expect(async () => {
    await tool.getByTestId("strum-start").click();
    await expect(player).not.toHaveAttribute("data-status", "idle", { timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  await expect(tool.getByTestId("strum-status")).toContainText("Chuẩn bị", { timeout: 5000 });
  await expect(player).toHaveAttribute("data-status", "running", { timeout: 8000 });

  // slots advance 0 → 7 and the chord changes bar by bar: G, then Em
  const seen = new Set<string>();
  await expect
    .poll(async () => {
      seen.add((await player.getAttribute("data-slot")) ?? "");
      return seen.size;
    }, { timeout: 10_000, intervals: [50] })
    .toBeGreaterThanOrEqual(6);
  await expect(tool.getByTestId("strum-chord")).toHaveText("Em", { timeout: 10_000 });

  await tool.getByTestId("strum-start").click();
  await expect(player).toHaveAttribute("data-status", "idle");
  await expect(player).toHaveAttribute("data-slot", "-1");

  // stopping at any moment stays stopped: a picture update queued just before the stop must
  // not flip the player back to "running"
  for (const wait of [350, 520, 700, 880, 1010, 1240]) {
    await tool.getByTestId("strum-start").click();
    await expect(player).toHaveAttribute("data-status", /countin|running/, { timeout: 5000 });
    await page.waitForTimeout(wait);
    await tool.getByTestId("strum-start").click();
    await page.waitForTimeout(400);
    await expect(player).toHaveAttribute("data-status", "idle");
  }
});
