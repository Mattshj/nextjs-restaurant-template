import { expect, test, type Page } from "@playwright/test";

// Wednesday 25 November 2026, noon: a fixed "today" keeps dates and slots stable.
const today = new Date(2026, 10, 25, 12, 0);

async function chooseDate(page: Page, day: RegExp) {
  const panel = page.locator("#book");
  await panel.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: day }).click();
}

test.describe("booking a table", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(today);
  });

  test("a guest finds open times and holds a table", async ({ page }) => {
    await page.goto("/#book");
    const panel = page.locator("#book");

    await chooseDate(page, /November 27/);
    await panel.getByRole("button", { name: "More guests" }).click();
    await panel.getByRole("button", { name: "Find a table" }).click();

    const times = panel.getByRole("radiogroup", { name: /Open at Downtown/ });
    const slot = times.getByRole("radio").first();
    const label = await slot.innerText();
    await slot.click();

    await expect(slot).toBeChecked();
    await expect(page.getByText("Table held for 10 minutes")).toBeVisible();
    await expect(
      page.getByText(`Downtown · Fri 27 Nov · ${label} · 3 guests`),
    ).toBeVisible();
  });

  test("a location's Book link preselects it", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Book Riverside" }).click();

    await expect(page).toHaveURL(/\?location=riverside#book$/);
    await expect(
      page.locator("#book").getByRole("combobox", { name: "Location" }),
    ).toHaveText("Riverside");
  });

  test("time slots can be chosen with the keyboard", async ({ page }) => {
    await page.goto("/#book");
    const panel = page.locator("#book");
    await chooseDate(page, /November 27/);
    await panel.getByRole("button", { name: "Find a table" }).click();
    const radios = panel.getByRole("radio");
    await expect(radios.first()).toBeVisible();

    await radios.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(radios.nth(1)).toBeFocused();
    await page.keyboard.press("Space");

    await expect(radios.nth(1)).toBeChecked();
    await expect(page.getByText("Table held for 10 minutes")).toBeVisible();
  });
});
