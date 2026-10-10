import type { SourceId } from "@/types";
import type { FetchJson } from "@/services/news/api/http";
import type { NewsSource } from "@/services/news/api/newsSource";
import { createGuardianSource } from "@/services/news/api/guardian/guardian.source";
import { createNewsApiSource } from "@/services/news/api/newsApi/newsApi.source";
import { createNyTimesSource } from "@/services/news/api/nyTimes/nyTimes.source";

/**
 * Registry of enabled providers. `Record<SourceId, ...>` makes the compiler
 * reject a `SourceId` without a provider, and vice versa.
 */
export const createNewsSources = (fetchJson: FetchJson): Record<SourceId, NewsSource> => ({
  newsApi: createNewsApiSource(fetchJson),
  guardian: createGuardianSource(fetchJson),
  nyTimes: createNyTimesSource(fetchJson),
});
