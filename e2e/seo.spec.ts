import { expect, test } from "@playwright/test";

test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Head tags and metadata routes don't depend on screen size.",
  );
});

test.describe("search and sharing metadata", () => {
  test("the homepage has a canonical URL, a social card and structured data", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https?:\/\//,
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Hearthwick",
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBeTruthy();
    const image = await request.get(new URL(ogImage ?? "").pathname);
    expect(image.headers()["content-type"]).toBe("image/png");

    const jsonLd = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    );
    const restaurants = jsonLd["@graph"].filter(
      (node: { "@type": string }) => node["@type"] === "Restaurant",
    );
    expect(restaurants).toHaveLength(3);
  });

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("<loc>");
  });
});
