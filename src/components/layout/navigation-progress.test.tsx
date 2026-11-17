import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let pathname = "/dashboard";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

import { NavigationProgress } from "./navigation-progress";

function page(links: string) {
  return (
    <>
      <NavigationProgress />
      <div dangerouslySetInnerHTML={{ __html: links }} />
    </>
  );
}

/** Click a link the way Next's <Link> does: it stops the browser from following it. */
function tap(name: string, init: MouseEventInit = {}) {
  const a = screen.getByText(name);
  a.addEventListener("click", (e) => e.preventDefault(), { once: true });
  act(() => {
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init }));
  });
}

const bar = () => screen.queryByTestId("navigation-progress");

describe("navigation progress bar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pathname = "/dashboard";
    window.history.replaceState(null, "", "/dashboard");
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows while a slow page loads and goes once it arrives", () => {
    const { rerender } = render(page('<a href="/academy">Học</a>'));
    tap("Học");
    act(() => void vi.advanceTimersByTime(50));
    expect(bar()).toBeNull(); // a prefetched page would already be here: no flash
    act(() => void vi.advanceTimersByTime(100));
    expect(bar()).not.toBeNull();

    pathname = "/academy";
    rerender(page('<a href="/academy">Học</a>'));
    act(() => void vi.advanceTimersByTime(400));
    expect(bar()).toBeNull();
  });

  it("never shows for a page that arrives at once", () => {
    const { rerender } = render(page('<a href="/academy">Học</a>'));
    tap("Học");
    pathname = "/academy";
    rerender(page('<a href="/academy">Học</a>'));
    act(() => void vi.advanceTimersByTime(1000));
    expect(bar()).toBeNull();
  });

  it("ignores links that do not load a new page here", () => {
    render(
      page(
        '<a href="/dashboard">Same</a><a href="#today">Hash</a><a href="https://example.org/x">Out</a>' +
          '<a href="/academy" target="_blank">Tab</a><a href="/academy">Ctrl</a>',
      ),
    );
    for (const name of ["Same", "Hash", "Out", "Tab"]) tap(name);
    tap("Ctrl", { ctrlKey: true });
    act(() => void vi.advanceTimersByTime(500));
    expect(bar()).toBeNull();
  });

  it("gives up rather than stay stuck when a page never arrives", () => {
    render(page('<a href="/academy">Học</a>'));
    tap("Học");
    act(() => void vi.advanceTimersByTime(200));
    expect(bar()).not.toBeNull();
    act(() => void vi.advanceTimersByTime(15_000));
    expect(bar()).toBeNull();
  });
});
