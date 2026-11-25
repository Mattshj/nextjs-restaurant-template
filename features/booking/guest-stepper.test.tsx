import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GuestStepper } from "./guest-stepper";

function Stepper({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial);
  return <GuestStepper value={value} onChange={setValue} min={1} max={12} />;
}

describe("GuestStepper", () => {
  it("adds and removes guests", async () => {
    const user = userEvent.setup();
    render(<Stepper initial={2} />);

    await user.click(screen.getByRole("button", { name: "More guests" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 guests");

    await user.click(screen.getByRole("button", { name: "Fewer guests" }));
    await user.click(screen.getByRole("button", { name: "Fewer guests" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 guest");
  });

  it("stops at one guest and keeps focus on the button", async () => {
    const user = userEvent.setup();
    render(<Stepper initial={1} />);

    const fewer = screen.getByRole("button", { name: "Fewer guests" });
    await user.click(fewer);

    expect(screen.getByRole("status")).toHaveTextContent("1 guest");
    expect(fewer).toHaveAttribute("aria-disabled", "true");
    expect(fewer).toHaveFocus();
  });

  it("stops at twelve guests", async () => {
    const user = userEvent.setup();
    render(<Stepper initial={12} />);

    await user.click(screen.getByRole("button", { name: "More guests" }));

    expect(screen.getByRole("status")).toHaveTextContent("12 guests");
  });

  it("is labelled as the guests field", () => {
    render(<Stepper initial={2} />);

    expect(screen.getByRole("group", { name: "Guests" })).toBeInTheDocument();
  });
});
