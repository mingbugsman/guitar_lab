import { expect, test } from "@playwright/test";

/** "Có gì mới" is a bell: a red badge counts unseen updates; opening it lists them and clears the badge. */
test("visitors see a badge on the bell until they open it", async ({ page }, testInfo) => {
  const where = testInfo.project.name === "mobile" ? "header" : "sidebar";
  await page.goto("/tools");
  const bell = page.getByTestId(`bell-${where}`);
  await expect(bell.getByTestId("bell-badge")).toHaveText(/^[1-9]/);

  await bell.getByTestId("bell-button").click();
  const panel = bell.getByTestId("bell-panel");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Thử thách hợp âm");
  await expect(panel.locator("[data-fresh]").first()).toContainText("Mới");
  await expect(bell.getByTestId("bell-badge")).toHaveCount(0);

  // Escape closes it; after a reload the badge stays gone
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("tuner")).toBeVisible();
  await expect(page.getByTestId(`bell-${where}`).getByTestId("bell-badge")).toHaveCount(0);

  // the full list stays available
  await page.getByTestId(`bell-${where}`).getByTestId("bell-button").click();
  await page.getByRole("link", { name: "Xem tất cả" }).click();
  await expect(page).toHaveURL(/\/updates$/);
  await expect(page.getByTestId("updates-list")).toContainText("Đổi hợp âm 1 phút");
});

test("a new account has no badge for older news", async ({ page }, testInfo) => {
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
  await expect(page.getByTestId("bell-sidebar").getByTestId("bell-button")).toBeVisible();
  await expect(page.getByTestId("bell-sidebar").getByTestId("bell-badge")).toHaveCount(0);
});
