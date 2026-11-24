import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows every section of the design in order", async ({ page }) => {
    await expect(page).toHaveTitle(/Hearthwick/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Fire-cooked. Every plate, on purpose.",
    );

    const sectionTitles = await page
      .getByRole("main")
      .getByRole("heading", { level: 2 })
      .allTextContents();
    expect(sectionTitles).toEqual([
      "From the hearth",
      "Three rooms, one fire",
      "Private dining & events",
    ]);

    await expect(page.getByRole("contentinfo")).toContainText(
      "a concept project by MapleCatch Solutions",
    );
  });

  test("keeps content placeholders until real content is provided", async ({
    page,
  }) => {
    await expect(page.getByText("[PRICE]")).toHaveCount(3);
    await expect(page.getByText("[ADDRESS]")).toHaveCount(3);
  });

  test("fits the viewport without horizontal scrolling", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBe(0);
  });

  test("offers a skip link as the first focus stop", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();

    await skipLink.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("reaches the main navigation on every screen size", async ({
    page,
  }, testInfo) => {
    // Below the `lg` breakpoint the navigation lives in the drawer.
    if (testInfo.project.name !== "desktop") {
      await page.getByRole("button", { name: "Open menu" }).click();
      const drawer = page.getByRole("dialog", { name: "Menu" });
      await expect(drawer).toBeVisible();

      await drawer.getByRole("link", { name: "Locations" }).click();
      await expect(drawer).toBeHidden();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Locations" })
        .click();
    }

    await expect(page).toHaveURL(/#locations$/);
    await expect(
      page.getByRole("heading", { name: "Three rooms, one fire" }),
    ).toBeInViewport();
  });
});
