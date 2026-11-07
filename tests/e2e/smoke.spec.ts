import { expect, test } from "@playwright/test";

test("landing page loads with the guitar visual", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Học guitar từ con số 0");
  await expect(page.locator('svg[data-chord="am"]')).toBeVisible();
});

test("guitar visual: player view shows string 6 on top, tab view flips it", async ({ page }) => {
  await page.goto("/guitar");
  const board = page.locator('svg[data-view]').first();
  await expect(board).toHaveAttribute("data-view", "player");
  const y = async (s: number) => Number(await board.locator(`g[data-string="${s}"] line`).first().getAttribute("y1"));
  expect(await y(6)).toBeLessThan(await y(1));

  await page.getByRole("radio", { name: "Kiểu Tab" }).first().click();
  await expect(board).toHaveAttribute("data-view", "tab");
  expect(await y(1)).toBeLessThan(await y(6));

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
