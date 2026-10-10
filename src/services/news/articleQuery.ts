import type { ArticleQuery } from "@/types";

const canonicalList = <T extends string>(list: readonly T[] | undefined): T[] | undefined =>
  list?.length ? [...new Set(list)].sort() : undefined;

/**
 * Canonical form of a query: equivalent queries become deeply equal, so they
 * share a cache entry (and a URL). Trims the keyword, lowercases authors
 * (matching is case-insensitive), sorts and dedupes lists, and drops empty
 * values and the default page.
 */
export function normalizeArticleQuery(query: ArticleQuery): ArticleQuery {
  const authors = query.authors?.map((author) => author.trim().toLowerCase()).filter(Boolean);
  const normalized: ArticleQuery = {
    keyword: query.keyword?.trim() || undefined,
    categories: canonicalList(query.categories),
    sources: canonicalList(query.sources),
    authors: canonicalList(authors),
    from: query.from,
    to: query.to,
    page: query.page && query.page > 1 ? query.page : undefined,
  };
  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined),
  ) as ArticleQuery;
}
