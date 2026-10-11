import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { setViewportWidth } from "@/test/viewport";

// Data-layer tests run in Node; everything below only applies to jsdom tests.
const isDom = typeof window !== "undefined";

if (isDom) {
  // jsdom has no modal dialogs: emulate the open state and the close event.
  HTMLDialogElement.prototype.showModal ??= function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function close(this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };

  // jsdom doesn't implement scrolling; React Router's scroll restoration calls it.
  window.scrollTo = () => {};

  // jsdom has no layout, so nothing ever intersects; tests trigger it explicitly if needed.
  window.IntersectionObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

beforeEach(() => {
  if (isDom) setViewportWidth(375);
});

afterEach(() => {
  cleanup();
  if (isDom) {
    localStorage.clear();
    sessionStorage.clear();
  }
});
