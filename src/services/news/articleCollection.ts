import type { Article } from "@/types";

/**
 * The same story can arrive twice, e.g. a Guardian piece via NewsAPI, or across
 * pages. The first occurrence wins, in place.
 */
export function dedupeByUrl(articles: readonly Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
}

export const sortByNewest = (articles: readonly Article[]): Article[] =>
  articles.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** Unique articles, newest first. */
export const mergeArticles = (articles: readonly Article[]): Article[] =>
  sortByNewest(dedupeByUrl(articles));
