import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(scroll, `${path} overflows horizontally`).toBeLessThanOrEqual(client);
}

test("public pages fit the phone screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  for (const path of ["/", "/login", "/register", "/guitar", "/tools"]) await expectNoHorizontalOverflow(page, path);
});

test("signed-in pages fit the phone screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  test.setTimeout(90_000);
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Mobile");
  await page.getByLabel("Email").fill(`mobile-${Date.now()}@example.com`);
  await page.getByLabel("Mật khẩu").fill("guitar-lab-123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await expectNoHorizontalOverflow(page, "/onboarding");
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  for (const path of [
    "/dashboard",
    "/academy",
    "/academy/guitar-anatomy",
    "/academy/six-strings",
    "/academy/chord-am",
    "/practice",
    "/progress",
    "/profile",
  ]) {
    await expectNoHorizontalOverflow(page, path);
  }
});
