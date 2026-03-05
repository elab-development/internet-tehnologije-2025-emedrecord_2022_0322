import { expect, test } from "@playwright/test";

test("landing page is reachable and shows CTA", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Next-level\s*eMedRecord/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "New Patient" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login to account" })).toBeVisible();
});
