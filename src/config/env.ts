// Top-level constants (not an object) so the bundler can fold them at build time
// and drop unused branches, e.g. the mock providers from a real-data build.

/** Serve fixture data from the in-memory mock providers instead of the real APIs. */
export const enableMockData = import.meta.env.ENABLE_MOCK_DATA === "true";
