import { describe, expect, it } from "vitest";
import type { CalendarDate, FeedFilters } from "@/types";
import {
  activeFilterChips,
  clearFilters,
  countChanges,
  dateFilterLabel,
  emptyFeedFilters,
  isFiltering,
} from "@/features/filters/feedFilters";

const filters = (overrides: Partial<FeedFilters>): FeedFilters => ({
  ...emptyFeedFilters,
  ...overrides,
});

describe("feed filters", () => {
  it("lists active filters as chips in panel order, each removable on its own", () => {
    const applied = filters({
      keyword: "climate",
      date: "week",
      categories: ["science", "technology"],
      sources: ["guardian"],
    });
    const chips = activeFilterChips(applied);

    expect(chips.map((chip) => chip.label)).toEqual([
      "Past week",
      "Science",
      "Technology",
      "The Guardian",
    ]);
    expect(chips[1]!.remove(applied)).toEqual({ ...applied, categories: ["technology"] });
    expect(chips[0]!.remove(applied).date).toBe("any");
  });

  it("treats a keyword or any filter as results mode", () => {
    expect(isFiltering(emptyFeedFilters)).toBe(false);
    expect(isFiltering(filters({ keyword: "climate" }))).toBe(true);
    expect(isFiltering(filters({ sources: ["nyTimes"] }))).toBe(true);
  });

  it("clears filters but keeps the keyword unless asked", () => {
    const applied = filters({ keyword: "climate", date: "today", categories: ["world"] });
    expect(clearFilters(applied)).toEqual(filters({ keyword: "climate" }));
    expect(clearFilters(applied, true)).toEqual(emptyFeedFilters);
  });

  it("labels custom ranges", () => {
    const from = "2026-10-01" as CalendarDate;
    const to = "2026-10-11" as CalendarDate;
    expect(dateFilterLabel(filters({ date: "custom", from, to }))).toBe("1 Oct – 11 Oct");
    expect(dateFilterLabel(filters({ date: "custom" }))).toBe("Custom range");
  });

  it("counts unapplied changes per choice", () => {
    const applied = filters({ categories: ["science"], sources: ["guardian"] });
    const draft = filters({ date: "week", categories: ["technology"], sources: ["guardian"] });
    expect(countChanges(draft, applied)).toBe(3); // date, -science, +technology
    expect(countChanges(applied, applied)).toBe(0);
  });
});
