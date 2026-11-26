import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("lists the homepage under the configured site URL", () => {
    vi.stubEnv("SITE_URL", "https://hearthwick.example");

    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://hearthwick.example/",
    ]);
  });
});

describe("robots", () => {
  it("allows crawling and points to the sitemap", () => {
    vi.stubEnv("SITE_URL", "https://hearthwick.example");

    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://hearthwick.example/sitemap.xml",
    });
  });
});
