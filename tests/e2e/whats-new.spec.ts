import { expect, test } from "@playwright/test";

test("visitors see what's new once, until they dismiss it", async ({ page }) => {
  await page.goto("/tools");
  const notice = page.getByTestId("whats-new");
  await expect(notice).toContainText("Có gì mới:");
  await page.getByTestId("whats-new-open").click();
  await expect(page.getByTestId("whats-new-list")).toContainText("Bài tập ngón");
  await page.getByTestId("whats-new-dismiss").click();
  await expect(notice).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("tuner")).toBeVisible();
  await expect(page.getByTestId("whats-new")).toHaveCount(0);

  // the full list stays available from the footer
  await page.getByTestId("updates-link").click();
  await expect(page).toHaveURL(/\/updates$/);
  await expect(page.getByTestId("updates-list")).toContainText("Đổi hợp âm 1 phút");
});

test("a new account is not greeted with older news", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("New");
  await page.getByLabel("Email").fill(`news-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByTestId("today-lesson")).toBeVisible();
  await expect(page.getByTestId("whats-new")).toHaveCount(0);
});
