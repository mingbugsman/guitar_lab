import { expect, test } from "@playwright/test";

/**
 * Finger drills: preview shows the steps slowly with captions, a run counts in then lights the
 * cells in order, and the learner's self-rating is saved as the fastest clean tempo.
 * Runs on the real Web Audio clock (a few seconds), so it is kept short.
 */
test("a learner previews Spider 1-2-3-4, plays a round and saves a clean tempo", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  test.setTimeout(120_000);

  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Drills");
  await page.getByLabel("Email").fill(`drills-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/practice");
  await page.getByTestId("open-drills").click();
  await expect(page).toHaveURL(/\/practice\/drills$/);
  await expect(page.locator('[data-testid^="drill-"]')).toHaveCount(12);
  await page.getByTestId("drill-spider-1234").click();

  const player = page.getByTestId("exercise-player");
  // before playing, the first cell to press is shown as "next": string 6, fret 1
  await expect(player.locator('[data-overlay="next"][data-string="6"][data-fret="1"]')).toHaveCount(1);

  // preview: slow, with a caption for each step
  await page.getByTestId("drill-preview").click();
  await expect(page.getByTestId("drill-caption")).toContainText("Dây 6, phím 1: ngón 1", { timeout: 10_000 });
  await expect(player.locator('[data-overlay="active"][data-string="6"][data-fret="1"]')).toHaveCount(1);
  await expect(page.getByTestId("drill-caption")).toContainText("Dây 6, phím 2: ngón 2", { timeout: 10_000 });
  await page.getByRole("button", { name: "Dừng xem mẫu" }).click();

  // run: count-in, then the lit cell moves along the drill
  await page.getByTestId("drill-start").click();
  await expect(player).toHaveAttribute("data-status", "running", { timeout: 15_000 });
  await expect(player.locator('[data-overlay="active"][data-fret="3"]')).toHaveCount(1, { timeout: 10_000 });
  await page.getByTestId("drill-finish").click();

  await page.getByTestId("rate-clean").click();
  await expect(page.getByTestId("drill-saved")).toContainText("sạch ở 40 BPM");
  await expect(page.getByTestId("drill-best")).toHaveText("40");

  // next time it starts a little faster, and the list shows the record
  await page.reload();
  await expect(page.getByTestId("drill-start")).toContainText("45 BPM");
  await page.goto("/practice/drills");
  await expect(page.getByTestId("drill-spider-1234")).toContainText("40");
});
