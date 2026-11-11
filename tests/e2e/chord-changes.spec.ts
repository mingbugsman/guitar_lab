import { expect, test } from "@playwright/test";

/**
 * One-minute chord changes, counted by hand (no microphone in CI). The browser clock is
 * controlled so the minute passes instantly.
 */
test("a learner counts one minute of Em–Am changes and sees it saved", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  test.setTimeout(90_000);

  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Changes");
  await page.getByLabel("Email").fill(`changes-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.clock.install();
  await page.goto("/tools");
  const timer = page.getByTestId("chord-change-timer");
  await expect(timer).toContainText("Em – Am");

  await timer.getByTestId("chord-change-manual-start").click();
  await page.clock.runFor(3_500); // 3-2-1
  const current = timer.getByTestId("chord-change-current");
  await expect(current).toHaveText("Em");

  const tap = timer.getByTestId("chord-change-tap");
  await tap.click();
  await expect(current).toHaveText("Am"); // the next chord to place after each strum
  await tap.click();
  await page.keyboard.press("Space");
  await expect(timer.getByTestId("chord-change-count")).toHaveText("3");

  await page.clock.runFor(61_000);
  const result = timer.getByTestId("chord-change-result");
  await expect(result).toContainText("3");
  await expect(result).toContainText("con số đầu tiên");
  await expect(timer.getByTestId("chord-change-history")).toContainText("3");

  // the result is stored: it is still there after a reload
  await page.reload();
  await expect(page.getByTestId("chord-change-timer")).toContainText("Tốt nhất: 3");
});

test("visitors who are not signed in can use the timer, but nothing is saved", async ({ page }) => {
  await page.goto("/tools");
  // signed out: the tool works, results are not saved
  await expect(page.getByTestId("chord-change-timer")).toContainText("Đăng nhập để lưu kết quả");
});
