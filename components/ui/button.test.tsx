import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders a native button that responds to the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Find a table</Button>);

    const button = screen.getByRole("button", { name: "Find a table" });
    button.focus();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders its child link instead of a button when asChild is set", () => {
    render(
      <Button asChild variant="secondary">
        <a href="#menu">View the menu</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "View the menu" })).toHaveAttribute(
      "href",
      "#menu",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("cannot be activated while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Find a table
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Find a table" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
