import type { InfiniteData } from "@tanstack/react-query";
import type { Article, SearchResult, SourceError, SourceId } from "@/types";
import { dedupeByUrl } from "@/services/news";

/** Which page to load next, and from which sources (only those that still have results). */
export interface ArticlePageParam {
  readonly page: number;
  /** Undefined means every source the query allows. */
  readonly sources?: readonly SourceId[];
}

/** What the UI consumes: all loaded pages flattened into one feed. */
export interface ArticleFeed {
  readonly articles: readonly Article[];
  readonly errors: readonly SourceError[];
  /** How many pages have been loaded so far. */
  readonly pageCount: number;
}

export const firstPageParam = (sources?: readonly SourceId[]): ArticlePageParam => ({
  page: 1,
  sources,
});

export function getNextPageParam(
  lastPage: SearchResult,
  _allPages: readonly SearchResult[],
  lastPageParam: ArticlePageParam,
): ArticlePageParam | undefined {
  if (!lastPage.sourcesWithMore.length) return undefined;
  return { page: lastPageParam.page + 1, sources: lastPage.sourcesWithMore };
}

/**
 * Feed semantics: pages are appended in load order (each is already newest-first)
 * and never re-sorted globally, so loading more never reshuffles what the user
 * has already scrolled past. Duplicates across pages keep their first position;
 * each source keeps its latest error.
 */
export function mergePages(data: InfiniteData<SearchResult, ArticlePageParam>): ArticleFeed {
  const errorsBySource = new Map(
    data.pages.flatMap((page) => page.errors).map((error) => [error.sourceId, error] as const),
  );
  return {
    articles: dedupeByUrl(data.pages.flatMap((page) => page.articles)),
    errors: [...errorsBySource.values()],
    pageCount: data.pages.length,
  };
}
