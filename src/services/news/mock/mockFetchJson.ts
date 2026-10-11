import { guardianBasePath } from "@/services/news/api/guardian/guardian.client";
import { HttpError, type FetchJson } from "@/services/news/api/http";
import { newsApiBasePath } from "@/services/news/api/newsApi/newsApi.client";
import { nyTimesBasePath } from "@/services/news/api/nyTimes/nyTimes.client";
import { createGuardianHandler } from "@/services/news/mock/guardian/guardian.handler";
import { fixtureDataset, type MockDataset } from "@/services/news/mock/mockDataset";
import type { MockHandler } from "@/services/news/mock/mockUtils";
import { createNewsApiHandler } from "@/services/news/mock/newsApi/newsApi.handler";
import { createNyTimesHandler } from "@/services/news/mock/nyTimes/nyTimes.handler";

const latencyMs = 300;

/**
 * Drop-in replacement for `httpFetchJson`: routes requests to in-memory fake
 * providers serving `dataset` as raw responses, so clients and normalizers
 * run unchanged.
 */
export function createMockFetchJson(dataset: MockDataset): FetchJson {
  const routes: readonly (readonly [basePath: string, handler: MockHandler])[] = [
    [newsApiBasePath, createNewsApiHandler(dataset.newsApi)],
    [guardianBasePath, createGuardianHandler(dataset.guardian)],
    [nyTimesBasePath, createNyTimesHandler(dataset.nyTimes)],
  ];

  return async <T>(url: string, signal?: AbortSignal) => {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
    signal?.throwIfAborted();

    const { pathname, searchParams } = new URL(url, "http://mock.local");
    const route = routes.find(([basePath]) => pathname.startsWith(basePath));
    if (!route) throw new HttpError(404, `No mock handler for ${pathname}`);

    const [basePath, handle] = route;
    return structuredClone(handle(pathname.slice(basePath.length), searchParams)) as T;
  };
}

/** Mock providers on the deterministic test fixtures. */
export const mockFetchJson = createMockFetchJson(fixtureDataset);

let snapshotFetchJson: Promise<FetchJson> | undefined;

/** Mock providers on the chosen dataset; the large snapshot is only loaded when asked for. */
export function loadMockFetchJson(dataset: "fixtures" | "snapshot"): Promise<FetchJson> {
  if (dataset === "fixtures") return Promise.resolve(mockFetchJson);
  snapshotFetchJson ??= import("@/services/news/mock/snapshot/snapshotDataset").then(
    ({ snapshotDataset }) => createMockFetchJson(snapshotDataset),
  );
  return snapshotFetchJson;
}
