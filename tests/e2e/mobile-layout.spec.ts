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

test("guitar pictures fit the phone without sideways scrolling inside them", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  for (const path of ["/", "/guitar"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const boards = page.locator("svg[data-view]");
    await expect(boards.first()).toBeVisible();
    const scrollers = await page.evaluate(() =>
      [...document.querySelectorAll(".gl-stage, .gl-stage *")].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
    );
    expect(scrollers, `${path}: a guitar picture scrolls sideways`).toBe(0);
    // every fretboard is drawn at the width it is shown, so its text is real-size
    const ratios = await boards.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().width / (el as SVGSVGElement).viewBox.baseVal.width),
    );
    for (const r of ratios) expect(r).toBeGreaterThan(0.9);
  }
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
