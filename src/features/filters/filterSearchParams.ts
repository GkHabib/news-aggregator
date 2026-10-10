import { categories, datePresets, type FeedFilters } from "@/types";
import { emptyFeedFilters } from "@/features/filters/feedFilters";
import { sourceIds } from "@/features/sources/sourceInfo";
import { parseCalendarDate } from "@/utils/date";
import { isOneOf, validList } from "@/utils/guards";

/**
 * Filters live in the URL so results can be shared and Back steps through
 * changes, e.g. `?q=climate&date=week&cat=science,technology&src=guardian`.
 * The URL is untrusted input: unknown values are dropped, never thrown on.
 */

const isDatePreset = isOneOf(datePresets);
const isCategory = isOneOf(categories);
const isSourceId = isOneOf(sourceIds);

const list = (value: string | null) => (value ? value.split(",") : []);

export function parseFeedFilters(params: URLSearchParams): FeedFilters {
  const date = params.get("date");
  const filters: FeedFilters = {
    keyword: params.get("q")?.trim() ?? "",
    date: isDatePreset(date) ? date : emptyFeedFilters.date,
    categories: validList(list(params.get("cat")), isCategory),
    sources: validList(list(params.get("src")), isSourceId),
  };
  if (filters.date !== "custom") return filters;
  return {
    ...filters,
    from: parseCalendarDate(params.get("from")),
    to: parseCalendarDate(params.get("to")),
  };
}

/** Defaults are omitted, so the plain feed is a clean `/`. */
export function serializeFeedFilters(filters: FeedFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("q", filters.keyword);
  if (filters.date !== emptyFeedFilters.date) params.set("date", filters.date);
  if (filters.date === "custom") {
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
  }
  if (filters.categories.length) params.set("cat", filters.categories.join(","));
  if (filters.sources.length) params.set("src", filters.sources.join(","));
  return params;
}
