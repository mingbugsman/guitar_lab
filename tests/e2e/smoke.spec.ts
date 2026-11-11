import { expect, test } from "@playwright/test";

test("landing page loads with the guitar visual", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Học guitar từ con số 0");
  await expect(page.locator('svg[data-chord="am"]')).toBeVisible();
});

test("footer credits the author and the About link is disabled", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByTestId("site-footer");
  await expect(footer).toContainText("Made by Tran Tuan Minh");
  await expect(footer).toContainText("6/8/2026");
  const about = footer.getByTestId("about-link");
  await expect(about).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator('a[href="/about"]')).toHaveCount(0);
  // the page itself exists for later
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Giới thiệu");
});

test("guitar visual: player view shows string 6 on top; Tab view stays hidden until Tab is taught", async ({ page }) => {
  await page.goto("/guitar");
  const board = page.locator('svg[data-view]').first();
  await expect(board).toHaveAttribute("data-view", "player");
  const y = async (s: number) => Number(await board.locator(`g[data-string="${s}"] line`).first().getAttribute("y1"));
  expect(await y(6)).toBeLessThan(await y(1));

  // a view saved before the switch was hidden must not come back
  await page.evaluate(() => localStorage.setItem("gl.fretboard-view", "tab"));
  await page.reload();
  await expect(board).toHaveAttribute("data-view", "player");
  await expect(page.getByRole("radio", { name: "Kiểu Tab" })).toHaveCount(0);
  await expect(page.getByText("Kiểu Tab")).toHaveCount(0);

  await page.getByRole("button", { name: /Đàn tay phải/ }).first().click();
  await expect(board).toHaveAttribute("data-handedness", "left");
});

test("tools page renders a working metronome", async ({ page }) => {
  await page.goto("/tools");
  await expect(page.getByTestId("tuner")).toBeVisible();
  await page.getByRole("button", { name: "Tăng 5 BPM" }).click();
  await expect(page.getByTestId("bpm")).toHaveText("65");
  await page.getByTestId("metronome-toggle").click();
  // the beat indicator advances when the Web Audio clock is running
  await expect(page.locator('[data-active="true"]').first()).toBeVisible({ timeout: 5000 });
  await page.getByTestId("metronome-toggle").click();
});

test("protected routes redirect to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
});
