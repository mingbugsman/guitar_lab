import { expect, test } from "@playwright/test";

/**
 * Chord challenge: choose chords by preset or group, read the suggestion, set it by hand,
 * watch random chords scroll past the line, stop, rate and see the next suggestion change.
 * Uses the real Web Audio clock, so the custom run is set very fast to stay short.
 */
test("a learner builds a chord challenge, plays it and the next suggestion builds on the result", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  test.setTimeout(120_000);

  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Challenge");
  await page.getByLabel("Email").fill(`challenge-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/practice");
  await page.getByTestId("open-challenge").click();
  await expect(page).toHaveURL(/\/practice\/challenge$/);

  // default: beginner chords, suggested settings
  await expect(page.getByTestId("challenge-selected")).toHaveText("Em · Am · D · G");
  await expect(page.getByTestId("challenge-suggestion")).toContainText("4 hợp âm");

  // a preset with a barre chord: slower suggestion, says why
  await page.getByTestId("preset-pop").click();
  await expect(page.getByTestId("challenge-selected")).toHaveText("C · G · Am · F");
  await expect(page.getByTestId("challenge-suggestion")).toContainText("F là hợp âm chặn");
  await expect(page.getByTestId("challenge-suggestion")).toContainText("8 phách");

  // groups: open "Bảy (7)" and add the whole group
  await page.getByTestId("group-seventh").getByRole("button", { name: /Bảy \(7\)/ }).click();
  await page.getByTestId("group-all-seventh").click();
  await expect(page.getByTestId("challenge-count")).toHaveText("10");
  await page.getByTestId("preset-beginner").click();

  // set it by hand: very fast so the test is short
  await page.getByTestId("mode-custom").click();
  await page.getByTestId("custom-minutes").fill("1");
  await page.getByTestId("custom-start").fill("160");
  await page.getByTestId("custom-end").fill("160");
  await page.getByTestId("custom-stages").fill("1");
  await page.getByRole("button", { name: "2 phách" }).click();
  await page.getByTestId("challenge-open").click();

  const runner = page.getByTestId("challenge-runner");
  await page.getByTestId("challenge-start").click();
  await expect(runner).toHaveAttribute("data-phase", "running", { timeout: 15_000 });
  // the chord on the line changes as cards scroll past
  await expect(runner).not.toHaveAttribute("data-current", "0", { timeout: 10_000 });
  await expect(runner).not.toHaveAttribute("data-current", "-1");
  await page.getByTestId("challenge-stop").click();

  await page.getByTestId("stage-0").click();
  await page.getByTestId("challenge-rate-clean").click();
  await expect(page.getByTestId("challenge-saved")).toContainText("160 BPM");

  // the suggestion for the same chords now starts from the last result
  await page.getByTestId("mode-suggest").click();
  await expect(page.getByTestId("challenge-suggestion")).toContainText("lần trước bạn tới 160 BPM");
});
