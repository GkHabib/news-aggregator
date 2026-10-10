import type { CalendarDate, DatePreset, FeedFilters } from "@/types";
import { sourceLabel } from "@/features/sources/sourceInfo";
import { formatCategory } from "@/utils/format";

/**
 * Applies filters. With `undoMessage` the change is immediate but reversible:
 * a toast offers Undo (chip removal, Clear all).
 */
export type ApplyFilters = (next: FeedFilters, undoMessage?: string) => void;

export const emptyFeedFilters: FeedFilters = {
  keyword: "",
  date: "any",
  categories: [],
  sources: [],
};

/** Any keyword or filter turns the feed into "Results". */
export const isFiltering = (filters: FeedFilters): boolean =>
  Boolean(filters.keyword) || activeFilterChips(filters).length > 0;

export const datePresetLabels: Record<DatePreset, string> = {
  any: "Any time",
  today: "Today",
  week: "Past week",
  month: "Past month",
  custom: "Custom range",
};

const dayMonth = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const formatDay = (date: CalendarDate) => dayMonth.format(new Date(date));

/** "Past week", or "1 Oct – 11 Oct" for a custom range. */
export function dateFilterLabel({ date, from, to }: FeedFilters): string {
  if (date !== "custom") return datePresetLabels[date];
  if (from && to) return `${formatDay(from)} – ${formatDay(to)}`;
  if (from) return `From ${formatDay(from)}`;
  if (to) return `Until ${formatDay(to)}`;
  return datePresetLabels.custom;
}

export interface FilterChip {
  key: string;
  label: string;
  /** The filters without this one. */
  remove: (filters: FeedFilters) => FeedFilters;
}

/** Applied filters as removable chips, in panel order: date, categories, sources. */
export function activeFilterChips(filters: FeedFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (filters.date !== "any") {
    chips.push({
      key: "date",
      label: dateFilterLabel(filters),
      remove: (current) => ({ ...current, date: "any", from: undefined, to: undefined }),
    });
  }
  for (const category of filters.categories) {
    chips.push({
      key: `category:${category}`,
      label: formatCategory(category),
      remove: (current) => ({ ...current, categories: without(current.categories, category) }),
    });
  }
  for (const source of filters.sources) {
    chips.push({
      key: `source:${source}`,
      label: sourceLabel(source),
      remove: (current) => ({ ...current, sources: without(current.sources, source) }),
    });
  }
  return chips;
}

/** Clears filters; the keyword stays unless `includeKeyword`. */
export const clearFilters = (filters: FeedFilters, includeKeyword = false): FeedFilters => ({
  ...emptyFeedFilters,
  keyword: includeKeyword ? "" : filters.keyword,
});

/** How many individual choices differ: the date counts once, each category/source once. */
export function countChanges(draft: FeedFilters, applied: FeedFilters): number {
  const dateChanged =
    draft.date !== applied.date ||
    (draft.date === "custom" && (draft.from !== applied.from || draft.to !== applied.to));
  return (
    Number(dateChanged) +
    symmetricDifference(draft.categories, applied.categories) +
    symmetricDifference(draft.sources, applied.sources)
  );
}

export const toggle = <T>(list: readonly T[], item: T): T[] =>
  list.includes(item) ? without(list, item) : [...list, item];

const without = <T>(list: readonly T[], item: T): T[] => list.filter((entry) => entry !== item);

const symmetricDifference = <T>(a: readonly T[], b: readonly T[]) =>
  a.filter((item) => !b.includes(item)).length + b.filter((item) => !a.includes(item)).length;
