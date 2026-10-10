import type { ArticleQuery, CalendarDate, DatePreset, FeedFilters, FeedPreferences } from "@/types";
import { isFiltering } from "@/features/filters/feedFilters";
import { parseIsoDateTime, toCalendarDate } from "@/utils/date";

type FeedQuery = Omit<ArticleQuery, "page">;

const dayMs = 24 * 60 * 60 * 1000;

/** How far back each preset reaches; "today" is the current UTC day. */
const presetDaysBack: Record<Exclude<DatePreset, "any" | "custom">, number> = {
  today: 0,
  week: 7,
  month: 30,
};

const daysAgo = (days: number, now: number): CalendarDate =>
  toCalendarDate(parseIsoDateTime(new Date(now - days * dayMs).toISOString())!);

function dateRange({ date, from, to }: FeedFilters, now: number): Pick<FeedQuery, "from" | "to"> {
  if (date === "any") return {};
  if (date === "custom") return { from, to };
  return { from: daysAgo(presetDaysBack[date], now) };
}

/**
 * What the feed asks the data layer for: the applied filters in results mode,
 * otherwise the saved preferences ("For you"), otherwise everything ("Top stories").
 */
export function buildFeedQuery(
  filters: FeedFilters,
  preferences: FeedPreferences,
  now = Date.now(),
): FeedQuery {
  if (isFiltering(filters)) {
    return {
      keyword: filters.keyword,
      categories: filters.categories,
      sources: filters.sources,
      ...dateRange(filters, now),
    };
  }
  return {
    categories: preferences.categories,
    sources: preferences.sources,
    authors: preferences.authors.map((author) => author.name),
  };
}
