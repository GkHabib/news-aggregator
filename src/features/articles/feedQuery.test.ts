import { describe, expect, it } from "vitest";
import type { CalendarDate, FeedFilters } from "@/types";
import { buildFeedQuery } from "@/features/articles/feedQuery";
import { emptyFeedFilters } from "@/features/filters/feedFilters";
import { emptyPreferences } from "@/features/preferences/feedPreferences";

const now = Date.parse("2026-10-11T12:00:00Z");
const filters = (overrides: Partial<FeedFilters>): FeedFilters => ({
  ...emptyFeedFilters,
  ...overrides,
});

describe("buildFeedQuery", () => {
  it("uses the applied filters in results mode, resolving date presets", () => {
    expect(
      buildFeedQuery(
        filters({
          keyword: "climate",
          date: "week",
          categories: ["science"],
          sources: ["guardian"],
        }),
        emptyPreferences,
        now,
      ),
    ).toEqual({
      keyword: "climate",
      categories: ["science"],
      sources: ["guardian"],
      from: "2026-10-04",
    });
    expect(buildFeedQuery(filters({ date: "today" }), emptyPreferences, now).from).toBe(
      "2026-10-11",
    );
  });

  it("passes custom ranges through", () => {
    const from = "2026-10-01" as CalendarDate;
    const to = "2026-10-05" as CalendarDate;
    expect(
      buildFeedQuery(filters({ date: "custom", from, to }), emptyPreferences, now),
    ).toMatchObject({
      from,
      to,
    });
  });

  it("uses preferences when not filtering", () => {
    const preferences = {
      ...emptyPreferences,
      categories: ["technology"] as const,
      sources: ["nyTimes"] as const,
      authors: [{ name: "Ruth Klein", origin: "story" as const }],
    };
    expect(buildFeedQuery(emptyFeedFilters, preferences, now)).toEqual({
      categories: ["technology"],
      sources: ["nyTimes"],
      authors: ["Ruth Klein"],
    });
  });
});
