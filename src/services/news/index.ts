import { enableMockData } from "@/config/env";
import { httpFetchJson, type FetchJson } from "@/services/news/api/http";
import { createNewsSources } from "@/services/news/api/sources";
import { createArticleService } from "@/services/news/articleService";

/**
 * The mock is imported lazily inside a build-time branch: the main bundle never
 * contains mock code, and only a mock build ever downloads the mock chunk
 * (Vite still emits that chunk file in real-data builds; it is just never requested).
 */
const fetchJson: FetchJson = enableMockData
  ? async <T>(url: string, signal?: AbortSignal) => {
      const { mockFetchJson } = await import("@/services/news/mock/mockFetchJson");
      return mockFetchJson<T>(url, signal);
    }
  : httpFetchJson;

/** Composition root: the only place that decides between real and mock data. */
export const newsSources = createNewsSources(fetchJson);

export const articleService = createArticleService(Object.values(newsSources));

export type { ArticleService } from "@/services/news/articleService";
export type { NewsSource } from "@/services/news/api/newsSource";
export { dedupeByUrl } from "@/services/news/articleCollection";
export { normalizeArticleQuery } from "@/services/news/articleQuery";
export { AllSourcesFailedError, isTransientError } from "@/services/news/errors";
