import { useInfiniteQuery } from "@tanstack/react-query";
import type { ArticleQuery } from "@/types";
import { articleService, normalizeArticleQuery } from "@/services/news";
import { articleQueryKeys } from "@/queries/articleQueryKeys";
import { firstPageParam, getNextPageParam, mergePages } from "@/queries/articlePages";

/**
 * Articles for a query, with "load more" via `fetchNextPage` / `hasNextPage`.
 * Paging is owned here, so callers pass a query without `page`.
 */
export function useArticles(query: Omit<ArticleQuery, "page">) {
  const normalized = normalizeArticleQuery(query);

  return useInfiniteQuery({
    queryKey: articleQueryKeys.search(normalized),
    queryFn: ({ pageParam, signal }) =>
      articleService.search({ ...normalized, ...pageParam }, signal),
    initialPageParam: firstPageParam(normalized.sources),
    getNextPageParam,
    select: mergePages,
  });
}
