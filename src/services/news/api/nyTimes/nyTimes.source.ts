import type { FetchJson } from "@/services/news/api/http";
import type { NewsSource } from "@/services/news/api/newsSource";
import { nyTimesCategories } from "@/services/news/api/nyTimes/nyTimes.categories";
import { fetchNyTimes, hasMoreNyTimesResults } from "@/services/news/api/nyTimes/nyTimes.client";
import { normalizeNyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.normalizer";

export function createNyTimesSource(fetchJson: FetchJson): NewsSource {
  return {
    id: "nyTimes",
    label: "The New York Times",
    categories: nyTimesCategories,

    async search(query, signal) {
      const data = await fetchNyTimes(fetchJson, query, signal);
      return {
        articles: (data.response.docs ?? [])
          .map(normalizeNyTimesDoc)
          .filter((article) => article !== undefined),
        hasMore: hasMoreNyTimesResults(data, query.page ?? 1),
      };
    },
  };
}
