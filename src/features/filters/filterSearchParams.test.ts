import { describe, expect, it } from "vitest";
import type { CalendarDate, FeedFilters } from "@/types";
import { emptyFeedFilters } from "@/features/filters/feedFilters";
import { parseFeedFilters, serializeFeedFilters } from "@/features/filters/filterSearchParams";

const parse = (search: string) => parseFeedFilters(new URLSearchParams(search));

describe("filter search params", () => {
  it("parses the spec's example URL", () => {
    expect(parse("?q=climate&date=week&cat=science,technology&src=guardian")).toEqual({
      keyword: "climate",
      date: "week",
      categories: ["science", "technology"],
      sources: ["guardian"],
    });
  });

  it("round-trips every field, including custom ranges", () => {
    const filters: FeedFilters = {
      keyword: "heat pumps",
      date: "custom",
      from: "2026-10-01" as CalendarDate,
      to: "2026-10-05" as CalendarDate,
      categories: ["health", "world"],
      sources: ["nyTimes", "newsApi"],
    };
    expect(parseFeedFilters(serializeFeedFilters(filters))).toEqual(filters);
  });

  it("serializes the default filters to an empty query string", () => {
    expect(serializeFeedFilters(emptyFeedFilters).toString()).toBe("");
  });

  it("drops anything invalid instead of failing", () => {
    expect(parse("?q=%20%20&date=decade&cat=science,cooking,science&src=bbc,guardian")).toEqual({
      keyword: "",
      date: "any",
      categories: ["science"],
      sources: ["guardian"],
    });
    expect(parse("?date=custom&from=2026-02-30&to=nope")).toEqual({
      ...emptyFeedFilters,
      date: "custom",
      from: undefined,
      to: undefined,
    });
  });

  it("ignores from/to unless the date is custom", () => {
    expect(parse("?date=week&from=2026-10-01")).not.toHaveProperty("from");
  });
});
