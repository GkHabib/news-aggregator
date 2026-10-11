// Top-level constants (not an object) so the bundler can fold them at build time
// and drop unused branches, e.g. the mock providers from a real-data build.

/** Serve fixture data from the in-memory mock providers instead of the real APIs. */
export const enableMockData = import.meta.env.ENABLE_MOCK_DATA === "true";

/**
 * Which data the mock providers serve: the small deterministic fixtures in
 * tests, the captured real-data snapshot everywhere else (`pnpm dev`, Docker).
 */
export const mockDataset: "fixtures" | "snapshot" =
  import.meta.env.MODE === "test" ? "fixtures" : "snapshot";
