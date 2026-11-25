import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans when test globals are enabled; they are not,
// so unmount rendered trees explicitly to keep tests isolated.
afterEach(() => {
  cleanup();
});

// jsdom lacks browser APIs that Radix primitives (Select, Popover) call.
// No-op stand-ins are enough: tests assert behaviour, not layout.
if (typeof window !== "undefined") {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};

  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
