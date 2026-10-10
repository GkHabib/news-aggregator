import type { FetchJson } from "@/services/news/api/http";
import type { NewsSource } from "@/services/news/api/newsSource";
import { guardianCategories } from "@/services/news/api/guardian/guardian.categories";
import {
  fetchGuardian,
  hasMoreGuardianResults,
} from "@/services/news/api/guardian/guardian.client";
import { normalizeGuardianResult } from "@/services/news/api/guardian/guardian.normalizer";

export function createGuardianSource(fetchJson: FetchJson): NewsSource {
  return {
    id: "guardian",
    label: "The Guardian",
    categories: guardianCategories,

    async search(query, signal) {
      const data = await fetchGuardian(fetchJson, query, signal);
      return {
        articles: data.response.results
          .map(normalizeGuardianResult)
          .filter((article) => article !== undefined),
        hasMore: hasMoreGuardianResults(data),
      };
    },
  };
}
