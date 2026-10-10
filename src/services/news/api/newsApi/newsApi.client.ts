import type { ArticleQuery, Category } from "@/types";
import { buildUrl, type FetchJson } from "@/services/news/api/http";
import { pageSize } from "@/services/news/api/newsSource";
import { newsApiCategoryMap } from "@/services/news/api/newsApi/newsApi.categories";
import type { NewsApiResponse } from "@/services/news/api/newsApi/newsApi.types";

/** Proxied path; the proxy adds the API key (see vite.config.ts / nginx). */
export const newsApiBasePath = "/api/newsapi";

/** The free plan refuses to page past the first 100 results (`maximumResultsReached`). */
const maxResults = 100;

export const hasMoreNewsApiResults = (response: NewsApiResponse, page: number) =>
  page * pageSize < Math.min(response.totalResults, maxResults);

/** NewsAPI responses carry no category, so each one is tagged with the category it was requested for. */
export interface NewsApiBatch {
  category: Category;
  response: NewsApiResponse;
}

interface NewsApiRequest {
  category: Category;
  url: string;
}

/**
 * `/top-headlines` filters by category but not by date; `/everything` filters by
 * date but not by category and needs a keyword. Pick per request; dates on
 * headlines are re-checked downstream.
 */
function buildRequests(query: ArticleQuery): NewsApiRequest[] {
  const common = { q: query.keyword, page: query.page ?? 1, pageSize };

  if (query.categories?.length) {
    // One request per category: the endpoint accepts a single category.
    return query.categories.map((category) => ({
      category,
      url: buildUrl(`${newsApiBasePath}/top-headlines`, {
        ...common,
        country: "us",
        category: newsApiCategoryMap[category],
      }),
    }));
  }

  const url = query.keyword
    ? buildUrl(`${newsApiBasePath}/everything`, {
        ...common,
        from: query.from,
        to: query.to,
        language: "en",
        sortBy: "publishedAt",
      })
    : buildUrl(`${newsApiBasePath}/top-headlines`, { ...common, country: "us" });

  return [{ category: "general", url }];
}

export async function fetchNewsApi(
  fetchJson: FetchJson,
  query: ArticleQuery,
  signal?: AbortSignal,
): Promise<NewsApiBatch[]> {
  const requests = buildRequests(query);
  const responses = await Promise.all(
    requests.map(({ url }) => fetchJson<NewsApiResponse>(url, signal)),
  );
  return responses.map((response, index) => ({ category: requests[index]!.category, response }));
}
