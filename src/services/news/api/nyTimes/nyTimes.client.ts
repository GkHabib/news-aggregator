import type { ArticleQuery, CalendarDate, Category } from "@/types";
import { buildUrl, type FetchJson } from "@/services/news/api/http";
import { toNativeValues } from "@/services/news/api/shared/categoryMap";
import {
  nyTimesSectionMap,
  nyTimesSubsectionMap,
} from "@/services/news/api/nyTimes/nyTimes.categories";
import type { NyTimesResponse } from "@/services/news/api/nyTimes/nyTimes.types";

/** Proxied path; the proxy adds the API key (see vite.config.ts / nginx). Page size is fixed at 10. */
export const nyTimesBasePath = "/api/nytimes";

const nyTimesPageSize = 10;
/** Article Search only serves 0-based pages up to 100. */
const maxNyTimesPage = 100;

/**
 * `page` is our 1-based page, so the next request is NYT page `page` (0-based).
 */
export const hasMoreNyTimesResults = ({ response }: NyTimesResponse, page: number) =>
  page <= maxNyTimesPage && page * nyTimesPageSize < response.metadata.hits;

const filterClause = (field: string, values: readonly string[]) =>
  values.length ? `${field}:(${values.map((value) => `"${value}"`).join(" ")})` : undefined;

/** e.g. `section.name:("Technology") OR subsection.name:("Politics")` */
function buildFilterQuery(categories: readonly Category[]): string | undefined {
  const clauses = [
    filterClause("section.name", toNativeValues(nyTimesSectionMap, categories)),
    filterClause("subsection.name", toNativeValues(nyTimesSubsectionMap, categories)),
  ].filter((clause) => clause !== undefined);
  return clauses.length ? clauses.join(" OR ") : undefined;
}

/** `YYYY-MM-DD` -> `YYYYMMDD` */
const toNyTimesDate = (date: CalendarDate | undefined) => date?.replaceAll("-", "");

export function fetchNyTimes(
  fetchJson: FetchJson,
  query: ArticleQuery,
  signal?: AbortSignal,
): Promise<NyTimesResponse> {
  const url = buildUrl(`${nyTimesBasePath}/articlesearch.json`, {
    q: query.keyword,
    fq: buildFilterQuery(query.categories ?? []),
    begin_date: toNyTimesDate(query.from),
    end_date: toNyTimesDate(query.to),
    page: (query.page ?? 1) - 1, // 0-based
    sort: "newest",
  });
  return fetchJson<NyTimesResponse>(url, signal);
}
