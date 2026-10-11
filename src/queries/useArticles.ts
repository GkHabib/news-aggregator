import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ArticleQuery } from "@/types";
import { articleService, normalizeArticleQuery } from "@/services/news";
import { articleQueryKeys } from "@/queries/articleQueryKeys";
import { firstPageParam, getNextPageParam, mergePages } from "@/queries/articlePages";

/**
 * Filters some providers can't apply server-side (authors, dates on NewsAPI
 * headlines) run after fetching, so the first pages can come back empty while
 * later ones match. Keep looking up to this many pages before calling the feed
 * empty; the cap protects the free API quotas.
 */
export const maxPagesWhileEmpty = 3;

/**
 * Articles for a query, with "load more" via `fetchNextPage` / `hasNextPage`.
 * Paging is owned here, so callers pass a query without `page`. While nothing
 * matched yet but more pages exist, it loads them itself (`isSearchingFurther`).
 */
export function useArticles(query: Omit<ArticleQuery, "page">) {
  const normalized = normalizeArticleQuery(query);

  const feed = useInfiniteQuery({
    queryKey: articleQueryKeys.search(normalized),
    queryFn: ({ pageParam, signal }) =>
      articleService.search({ ...normalized, ...pageParam }, signal),
    initialPageParam: firstPageParam(normalized.sources),
    getNextPageParam,
    select: mergePages,
  });

  const { data, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = feed;
  const pageCount = data?.pageCount ?? 0;
  const isSearchingFurther =
    data !== undefined &&
    data.articles.length === 0 &&
    pageCount < maxPagesWhileEmpty &&
    hasNextPage &&
    !isFetchNextPageError;

  // Keyed on pageCount, not only isFetchingNextPage: fast pages can batch its
  // true -> false into one render, which would otherwise never re-trigger this.
  useEffect(() => {
    if (isSearchingFurther && !isFetchingNextPage) void fetchNextPage();
  }, [isSearchingFurther, isFetchingNextPage, pageCount, fetchNextPage]);

  return { ...feed, isSearchingFurther };
}
