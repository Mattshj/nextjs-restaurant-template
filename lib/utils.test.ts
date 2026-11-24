import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("lets a later class override a conflicting earlier one", () => {
    expect(cn("px-5.5 py-2", "px-10")).toBe("py-2 px-10");
  });

  it("keeps Hearthwick colour tokens that do not conflict", () => {
    expect(
      cn("bg-primary text-primary-foreground", "hover:bg-primary-hover"),
    ).toBe("bg-primary text-primary-foreground hover:bg-primary-hover");
  });

  it("treats a later background token as replacing an earlier one", () => {
    expect(cn("bg-primary", "bg-secondary")).toBe("bg-secondary");
  });

  it("drops falsy values from conditional classes", () => {
    const selected = false;
    expect(cn("rounded-full", selected && "bg-primary", undefined, null)).toBe(
      "rounded-full",
    );
  });
});
