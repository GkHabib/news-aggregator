import { describe, expect, it } from "vitest";
import { HttpError } from "@/services/news/api/http";
import { AllSourcesFailedError, isTransientError } from "@/services/news/errors";

describe("isTransientError", () => {
  it("retries network failures and 5xx only", () => {
    expect(isTransientError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isTransientError(new HttpError(503, "Unavailable"))).toBe(true);
    expect(isTransientError(new HttpError(429, "Rate limited"))).toBe(false);
    expect(isTransientError(new HttpError(401, "Bad key"))).toBe(false);
    expect(isTransientError(new Error("Unknown"))).toBe(false);
  });

  it("retries a total failure when any source failed transiently", () => {
    const rateLimited = { sourceId: "newsApi", message: "429", status: 429 } as const;
    const offline = { sourceId: "guardian", message: "offline" } as const;

    expect(isTransientError(new AllSourcesFailedError([rateLimited]))).toBe(false);
    expect(isTransientError(new AllSourcesFailedError([rateLimited, offline]))).toBe(true);
  });
});
