import type { FetchJson } from "@/services/news/api/http";
import type { NewsSource } from "@/services/news/api/newsSource";
import { newsApiCategories } from "@/services/news/api/newsApi/newsApi.categories";
import { fetchNewsApi, hasMoreNewsApiResults } from "@/services/news/api/newsApi/newsApi.client";
import { normalizeNewsApiArticle } from "@/services/news/api/newsApi/newsApi.normalizer";

export function createNewsApiSource(fetchJson: FetchJson): NewsSource {
  return {
    id: "newsApi",
    label: "NewsAPI",
    categories: newsApiCategories,

    async search(query, signal) {
      const batches = await fetchNewsApi(fetchJson, query, signal);
      const articles = batches
        .flatMap(({ category, response }) =>
          response.articles.map((raw) => normalizeNewsApiArticle(raw, category)),
        )
        .filter((article) => article !== undefined);
      // One batch per category: there is more while any category has more.
      const hasMore = batches.some(({ response }) =>
        hasMoreNewsApiResults(response, query.page ?? 1),
      );
      return { articles, hasMore };
    },
  };
}
