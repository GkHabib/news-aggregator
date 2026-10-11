// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FeedError } from "@/features/articles/FeedError/FeedError";

describe("FeedError", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const button = () => screen.getByRole("button", { name: /Try again/ });
  // One act per second: each tick schedules the next one from an effect.
  const wait = (seconds: number) => {
    for (let i = 0; i < seconds; i++) act(() => vi.advanceTimersByTime(1000));
  };

  it("retries, then cools down for 10s, doubling up to 60s", () => {
    const onRetry = vi.fn();
    render(<FeedError onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("We couldn't load any stories");

    fireEvent.click(button());
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(button()).toBeDisabled();
    expect(button()).toHaveTextContent("Try again in 10s");

    wait(10);
    expect(button()).toBeEnabled();

    fireEvent.click(button());
    expect(button()).toHaveTextContent("Try again in 20s");
    wait(20);
    fireEvent.click(button()); // 40s
    wait(40);
    fireEvent.click(button()); // capped at 60s
    expect(button()).toHaveTextContent("Try again in 60s");
    expect(onRetry).toHaveBeenCalledTimes(4);
  });
});
