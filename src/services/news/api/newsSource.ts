import type { Article, ArticleQuery, Category, SourceId } from "@/types";

export const pageSize = 10;

/** One page of a single provider's results. */
export interface SourcePage {
  readonly articles: readonly Article[];
  readonly hasMore: boolean;
}

/**
 * Contract every provider module implements. A provider owns its raw types,
 * request building and normalization; consumers only ever see `Article`.
 */
export interface NewsSource {
  readonly id: SourceId;
  readonly label: string;
  /** Categories this provider can filter by server-side. */
  readonly categories: readonly Category[];
  /** `query.categories` is already narrowed to `this.categories`. */
  search(query: ArticleQuery, signal?: AbortSignal): Promise<SourcePage>;
}
