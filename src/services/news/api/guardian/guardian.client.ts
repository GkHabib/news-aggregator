import type { ArticleQuery } from "@/types";
import { buildUrl, type FetchJson } from "@/services/news/api/http";
import { pageSize } from "@/services/news/api/newsSource";
import { toNativeValues } from "@/services/news/api/shared/categoryMap";
import { guardianSectionMap } from "@/services/news/api/guardian/guardian.categories";
import type { GuardianResponse } from "@/services/news/api/guardian/guardian.types";

/** Proxied path; the proxy adds the API key (see vite.config.ts / nginx). */
export const guardianBasePath = "/api/guardian";

export const hasMoreGuardianResults = ({ response }: GuardianResponse) =>
  response.currentPage < response.pages;

export function fetchGuardian(
  fetchJson: FetchJson,
  query: ArticleQuery,
  signal?: AbortSignal,
): Promise<GuardianResponse> {
  const sections = toNativeValues(guardianSectionMap, query.categories ?? []);
  const url = buildUrl(`${guardianBasePath}/search`, {
    q: query.keyword,
    section: sections.join("|"), // "|" is OR
    "from-date": query.from,
    "to-date": query.to,
    page: query.page ?? 1,
    "page-size": pageSize,
    "order-by": "newest",
    "show-fields": "trailText,byline,thumbnail",
  });
  return fetchJson<GuardianResponse>(url, signal);
}
