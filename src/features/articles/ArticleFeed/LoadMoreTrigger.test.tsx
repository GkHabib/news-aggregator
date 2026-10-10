// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoadMoreTrigger } from "@/features/articles/ArticleFeed/LoadMoreTrigger";

type ObserverCallback = (entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void;

/** Captures the observer so the test can simulate the trigger scrolling into range. */
function mockIntersectionObserver() {
  const observers: { callback: ObserverCallback; options?: IntersectionObserverInit }[] = [];
  const original = window.IntersectionObserver;
  window.IntersectionObserver = class {
    constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
      observers.push({ callback, options });
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  return { observers, restore: () => (window.IntersectionObserver = original) };
}

describe("LoadMoreTrigger", () => {
  let restore = () => {};
  afterEach(() => restore());

  it("loads more when it comes within 800px of the viewport, using the latest callback", () => {
    const mock = mockIntersectionObserver();
    restore = mock.restore;
    const first = vi.fn();
    const latest = vi.fn();
    const { rerender } = render(<LoadMoreTrigger onLoadMore={first} />);
    rerender(<LoadMoreTrigger onLoadMore={latest} />);

    expect(mock.observers).toHaveLength(1); // not re-created on re-render
    expect(mock.observers[0]!.options?.rootMargin).toBe("0px 0px 800px 0px");

    act(() => mock.observers[0]!.callback([{ isIntersecting: false }]));
    expect(latest).not.toHaveBeenCalled();
    act(() => mock.observers[0]!.callback([{ isIntersecting: true }]));
    expect(latest).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });
});
