import { expect, test } from "@playwright/test";

/**
 * Phase 1 acceptance flow against a real (local or preview) Supabase:
 * register → onboarding → complete a lesson → reload persists → practice session saved
 * → dashboard/progress reflect real data → logout → login again.
 */
test.describe.configure({ mode: "serial" });

test("a new learner can learn, practice and come back tomorrow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "full journey runs once, on desktop");
  test.setTimeout(120_000);
  const email = `learner-${Date.now()}@example.com`;
  const password = "guitar-lab-123";

  // Register
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Minh");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();

  // Onboarding
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByText("Tay phải gảy").click();
  await page.getByText("30 phút").click();
  await page.getByRole("button", { name: "Bắt đầu học" }).click();

  // Dashboard from real data
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByTestId("today-lesson")).toHaveText("Làm quen với Guitar Lab và cây đàn");
  await expect(page.getByTestId("progress-count")).toContainText("0/18");

  // Complete lesson 1
  await page.goto("/academy/introduction");
  const panel = page.getByTestId("lesson-progress");
  const complete = panel.getByTestId("complete-lesson");
  await expect(complete).toBeDisabled();
  for (const label of [
    "Tôi đã có đàn và một ghế không tay vịn.",
    "Tôi đã thử cả hai góc nhìn và chỉ đúng dây 6 trên đàn thật.",
    "Tôi nghe được âm thanh khi chạm vào dây trong hình.",
  ]) {
    await panel.getByText(label).click();
  }
  await expect(complete).toBeEnabled();
  await complete.click();
  await expect(panel.getByTestId("lesson-status")).toContainText("Đã hoàn thành");

  // Persists after reload
  await page.reload();
  await expect(page.getByTestId("lesson-status")).toContainText("Đã hoàn thành");

  // Practice session
  await page.goto("/practice");
  await page.getByTestId("start-session").click();
  await expect(page).toHaveURL(/\/practice\/[0-9a-f-]{36}/);
  await expect(page.getByTestId("current-activity")).toHaveText("Ôn lại");
  await page.getByTestId("timer-toggle").click();
  await page.waitForTimeout(2200);
  await page.getByTestId("activity-done").click();
  await expect(page.getByTestId("current-activity")).toHaveText("Nhạc lý");
  await page.getByTestId("session-notes").fill("Đã chỉ đúng dây 6 khi nhìn xuống.");
  await page.getByTestId("finish-session").click();
  await expect(page.getByTestId("session-saved")).toBeVisible();

  // Dashboard + progress reflect saved data
  await page.goto("/dashboard");
  await expect(page.getByTestId("progress-count")).toContainText("1/18");
  await expect(page.getByTestId("today-lesson")).toHaveText("Cấu tạo cây đàn guitar");
  await page.goto("/progress");
  await expect(page.locator('[data-milestone="first-lesson"]')).toHaveAttribute("data-achieved", "true");
  await expect(page.locator('[data-milestone="first-practice"]')).toHaveAttribute("data-achieved", "true");
  await expect(page.getByText("Đã chỉ đúng dây 6 khi nhìn xuống.")).toBeVisible();

  // Logout, protected route, login again
  await page.goto("/profile");
  await page.getByTestId("logout").click();
  await expect(page).toHaveURL("/");
  await page.goto("/progress");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page).toHaveURL(/\/progress/);
  await expect(page.locator('[data-milestone="first-lesson"]')).toHaveAttribute("data-achieved", "true");
});

test("wrong password shows a friendly error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Mật khẩu").fill("wrong-password");
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page.getByText("Email hoặc mật khẩu không đúng.")).toBeVisible();
});
