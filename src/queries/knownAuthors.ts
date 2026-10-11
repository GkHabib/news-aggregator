import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { SearchResult } from "@/types";
import { articleQueryKeys } from "@/queries/articleQueryKeys";

type CachedFeed = InfiniteData<SearchResult> | undefined;

const key = (name: string) => name.toLocaleLowerCase();

/**
 * Unique author names from cached feed pages, minus `exclude` (case-insensitive),
 * sorted alphabetically. The first spelling seen wins.
 */
export function collectAuthorNames(
  feeds: readonly CachedFeed[],
  exclude: readonly string[] = [],
): string[] {
  const excluded = new Set(exclude.map(key));
  const names = new Map<string, string>();
  for (const page of feeds.flatMap((feed) => feed?.pages ?? [])) {
    for (const { name } of page.articles.flatMap((article) => article.authors)) {
      if (!excluded.has(key(name)) && !names.has(key(name))) names.set(key(name), name);
    }
  }
  return [...names.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * Authors of stories the app has already loaded, read from the query cache:
 * no extra requests (no provider offers an author directory). A snapshot at
 * render time, which is enough for the preferences page.
 */
export function useKnownAuthors(exclude: readonly string[] = []): string[] {
  const queryClient = useQueryClient();
  const feeds = queryClient
    .getQueriesData<InfiniteData<SearchResult>>({ queryKey: articleQueryKeys.all })
    .map(([, feed]) => feed);
  return collectAuthorNames(feeds, exclude);
}
