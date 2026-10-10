import type { Article, ArticleQuery } from "@/types";
import { toCalendarDate } from "@/utils/date";

/**
 * Re-applies the filters that not every provider honours server-side
 * (NewsAPI headlines ignore dates; no provider filters by author).
 * Keyword search stays server-side: providers match full text we never receive.
 */
export function matchesQuery(article: Article, query: ArticleQuery): boolean {
  return (
    isWithinDateRange(article, query) && hasCategory(article, query) && hasAuthor(article, query)
  );
}

function isWithinDateRange(article: Article, { from, to }: ArticleQuery): boolean {
  const day = toCalendarDate(article.publishedAt);
  return (!from || day >= from) && (!to || day <= to);
}

function hasCategory(article: Article, { categories }: ArticleQuery): boolean {
  return !categories?.length || categories.includes(article.category);
}

function hasAuthor(article: Article, { authors }: ArticleQuery): boolean {
  if (!authors?.length) return true;
  const names = article.authors.map((author) => author.name.toLowerCase());
  return authors.some((wanted) => names.some((name) => name.includes(wanted.toLowerCase())));
}
