import { expect, test, type Page } from "@playwright/test";

/**
 * Motion pictures inside lessons (writing guide item 5): strumming direction and chord changes.
 * Set SHOTS=<dir> to also save screenshots for a visual check.
 */
async function register(page: Page, name: string) {
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill(name);
  await page.getByLabel("Email").fill(`${name.toLowerCase()}-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** Step through the lesson's learn screens until `testId` shows up. */
async function forwardUntil(page: Page, testId: string) {
  const target = page.getByTestId(testId).first();
  for (let i = 0; i < 12 && !(await target.isVisible()); i++) await page.getByTestId("lesson-forward").click();
  await expect(target).toBeVisible();
  return target;
}

test("strumming direction: the pick sweeps and the count follows", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await register(page, `Strum${testInfo.project.name}`);
  await page.goto("/academy/open-strings");
  const strum = await forwardUntil(page, "strum-motion");
  await expect(strum.locator("li")).toHaveCount(8);
  await expect(strum.locator("li").first()).toContainText("↓");
  await expect(strum.locator("li").nth(1)).toContainText("và");

  await strum.getByTestId("strum-play").click();
  await expect(strum.locator("li[data-active]")).toHaveCount(1, { timeout: 5_000 });
  await expect(strum).not.toHaveAttribute("data-slot", "0", { timeout: 5_000 });
  if (process.env.SHOTS) await strum.screenshot({ path: `${process.env.SHOTS}/strum-${testInfo.project.name}.png` });
  await strum.getByTestId("strum-play").click();
  await expect(strum.locator("li[data-active]")).toHaveCount(0);
});

test("chord change: finger dots glide from Em to Am with one line per finger", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await register(page, `Move${testInfo.project.name}`);
  await page.goto("/academy/chord-am");
  const move = await forwardUntil(page, "chord-move-em-am");
  await expect(move.getByTestId("chord-move-steps").locator("li")).toHaveCount(3);
  await expect(move).toContainText("Ngón 2 và 3 giữ nguyên hình dạng");

  // Em: finger 2 on string 5, finger 1 not used yet (hidden)
  await expect(move.locator('[data-finger="2"]')).toHaveAttribute("data-string", "5");
  await expect(move.locator('[data-finger="1"]')).toHaveAttribute("data-hidden", "true");

  await move.getByRole("button", { name: "Am", exact: true }).click();
  await expect(move).toHaveAttribute("data-at", "to");
  await expect(move.locator('[data-finger="2"]')).toHaveAttribute("data-string", "4");
  await expect(move.locator('[data-finger="1"]')).not.toHaveAttribute("data-hidden", "true");
  if (process.env.SHOTS) {
    await page.waitForTimeout(900);
    await move.screenshot({ path: `${process.env.SHOTS}/move-${testInfo.project.name}.png` });
  }

  // auto play goes back to Em, then on to Am again
  await move.getByTestId("chord-move-play").click();
  await expect(move).toHaveAttribute("data-at", "from");
  await expect(move).toHaveAttribute("data-at", "to", { timeout: 5_000 });
  await move.getByTestId("chord-move-play").click();
});

test("clean sounds: four example sounds to compare against", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  test.setTimeout(90_000);
  await register(page, "Samples");
  await page.goto("/academy/clean-sounds");
  const samples = await forwardUntil(page, "sound-samples");
  await expect(samples.locator('[data-testid^="sample-"]')).toHaveCount(4);
  await expect(samples.getByTestId("sample-extra")).toContainText("dây 2 và thêm dây 1");
  await samples.getByTestId("sample-buzz").click();
  await expect(samples.getByTestId("sample-buzz")).toHaveAttribute("data-played", "true");
  if (process.env.SHOTS) await samples.screenshot({ path: `${process.env.SHOTS}/samples.png` });
});
