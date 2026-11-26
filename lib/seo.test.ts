import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  buildRestaurantJsonLd,
  getSiteUrl,
  serializeJsonLd,
} from "./seo";

describe("getSiteUrl", () => {
  it("uses a configured https URL and drops the trailing slash", () => {
    expect(getSiteUrl("https://hearthwick.example/").href).toBe(
      "https://hearthwick.example/",
    );
    expect(getSiteUrl("https://example.com/hearthwick/").pathname).toBe(
      "/hearthwick",
    );
  });

  it.each([[undefined], [""], ["not a url"], ["ftp://example.com"]])(
    "falls back to localhost for %j",
    (value) => {
      expect(getSiteUrl(value).href).toBe("http://localhost:3000/");
    },
  );
});

describe("absoluteUrl", () => {
  it("joins paths onto the site URL, keeping a base path", () => {
    const base = getSiteUrl("https://example.com/hearthwick");

    expect(absoluteUrl("/", base)).toBe("https://example.com/hearthwick/");
    expect(absoluteUrl("/?location=riverside#book", base)).toBe(
      "https://example.com/hearthwick/?location=riverside#book",
    );
  });
});

describe("buildRestaurantJsonLd", () => {
  const base = getSiteUrl("https://hearthwick.example");
  const graph = buildRestaurantJsonLd(base)["@graph"];

  it("describes the group and one restaurant per location", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "Restaurant",
      "Restaurant",
      "Restaurant",
    ]);
  });

  it("links each restaurant to its booking panel and to the group", () => {
    const riverside = graph.find(
      (node) => node.name === "Hearthwick Riverside",
    );

    expect(riverside).toMatchObject({
      url: "https://hearthwick.example/?location=riverside#book",
      acceptsReservations: true,
      parentOrganization: { "@id": "https://hearthwick.example/#organization" },
    });
  });

  it("never publishes placeholder content such as [ADDRESS]", () => {
    expect(JSON.stringify(graph)).not.toMatch(/\[(ADDRESS|PRICE)\]/);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so the data cannot close the script tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)" });
  });
});
