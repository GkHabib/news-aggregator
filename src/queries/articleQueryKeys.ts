import type { ArticleQuery } from "@/types";

/** Single source of truth for article cache keys (also used for invalidation). */
export const articleQueryKeys = {
  all: ["articles"] as const,
  /** `query` must already be normalized so equivalent queries share an entry. */
  search: (query: ArticleQuery) => [...articleQueryKeys.all, "search", query] as const,
};
