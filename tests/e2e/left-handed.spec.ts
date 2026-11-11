import { expect, test } from "@playwright/test";

/**
 * A left-handed learner with an electric guitar must read text that matches the mirrored
 * pictures, and see the note about what differs from the acoustic guitar the lessons assume.
 */
test("left-handed learner gets mirrored words, not just mirrored pictures", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once");
  test.setTimeout(90_000);

  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Lefty");
  await page.getByLabel("Email").fill(`lefty-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByText("Tay trái gảy").click();
  await page.getByText("Đàn điện").click();
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/academy/posture");
  await expect(page.getByTestId("guitar-type-note")).toContainText("đàn điện");
  await expect(page.getByText("lên đùi TRÁI. Đầu đàn chĩa sang bên PHẢI")).toBeVisible();
  await expect(page.getByTestId("posture-thigh")).toHaveText("đùi TRÁI");
  await expect(page.getByText("Buông tay phải khỏi cần đàn")).toBeVisible();
  await expect(page.getByText(/\{\w+\}/)).toHaveCount(0);

  // Switching the guitar back with ⇄ flips the words together with the pictures.
  await page.goto("/academy/hand-position");
  await expect(page.getByRole("heading", { name: "Tay bấm (tay phải)" })).toBeVisible();
  await page.getByTestId("lesson-forward").click(); // the fretboard (with the switch) is on the next screen
  await page.getByRole("button", { name: /Đàn tay trái/ }).first().click();
  await page.getByTestId("lesson-back").click();
  await expect(page.getByRole("heading", { name: "Tay bấm (tay trái)" })).toBeVisible();
});
