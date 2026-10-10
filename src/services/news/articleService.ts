import type { Article, ArticleQuery, SearchResult, SourceError, SourceId } from "@/types";
import type { NewsSource } from "@/services/news/api/newsSource";
import { mergeArticles } from "@/services/news/articleCollection";
import { matchesQuery } from "@/services/news/articleFilters";
import { AllSourcesFailedError, toSourceError } from "@/services/news/errors";

export interface ArticleService {
  /**
   * Partial failures are reported in `errors`; throws `AllSourcesFailedError`
   * only when every queried source failed.
   */
  search(query: ArticleQuery, signal?: AbortSignal): Promise<SearchResult>;
}

/**
 * Fans a query out to the relevant sources in parallel and merges their
 * already-normalized articles.
 */
export function createArticleService(sources: readonly NewsSource[]): ArticleService {
  return {
    async search(query, signal) {
      const active = sources.filter((source) => isRelevant(source, query));

      const settled = await Promise.allSettled(
        active.map((source) => source.search(narrowToSource(query, source), signal)),
      );
      signal?.throwIfAborted();

      const articles: Article[] = [];
      const errors: SourceError[] = [];
      const sourcesWithMore: SourceId[] = [];
      settled.forEach((result, index) => {
        const { id } = active[index]!;
        if (result.status === "rejected") {
          errors.push(toSourceError(id, result.reason));
          return;
        }
        articles.push(...result.value.articles);
        if (result.value.hasMore) sourcesWithMore.push(id);
      });

      if (active.length > 0 && errors.length === active.length) {
        throw new AllSourcesFailedError(errors);
      }

      return {
        articles: mergeArticles(articles.filter((article) => matchesQuery(article, query))),
        errors,
        sourcesWithMore,
      };
    },
  };
}

/** Selected by the user and able to serve at least one requested category. */
function isRelevant(source: NewsSource, { sources, categories }: ArticleQuery): boolean {
  const selected = !sources?.length || sources.includes(source.id);
  const servesCategory =
    !categories?.length || categories.some((category) => source.categories.includes(category));
  return selected && servesCategory;
}

/** Only pass the categories the source can actually filter by. */
function narrowToSource(query: ArticleQuery, source: NewsSource): ArticleQuery {
  if (!query.categories?.length) return query;
  const categories = query.categories.filter((category) => source.categories.includes(category));
  return { ...query, categories };
}
