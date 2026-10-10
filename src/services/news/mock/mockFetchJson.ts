import { guardianBasePath } from "@/services/news/api/guardian/guardian.client";
import { HttpError, type FetchJson } from "@/services/news/api/http";
import { newsApiBasePath } from "@/services/news/api/newsApi/newsApi.client";
import { nyTimesBasePath } from "@/services/news/api/nyTimes/nyTimes.client";
import { handleGuardian } from "@/services/news/mock/guardian/guardian.handler";
import type { MockHandler } from "@/services/news/mock/mockUtils";
import { handleNewsApi } from "@/services/news/mock/newsApi/newsApi.handler";
import { handleNyTimes } from "@/services/news/mock/nyTimes/nyTimes.handler";

const routes: readonly (readonly [basePath: string, handler: MockHandler])[] = [
  [newsApiBasePath, handleNewsApi],
  [guardianBasePath, handleGuardian],
  [nyTimesBasePath, handleNyTimes],
];

const latencyMs = 300;

/**
 * Drop-in replacement for `httpFetchJson`: routes requests to in-memory fake
 * providers that return raw responses, so clients and normalizers run unchanged.
 */
export const mockFetchJson: FetchJson = async <T>(url: string, signal?: AbortSignal) => {
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  signal?.throwIfAborted();

  const { pathname, searchParams } = new URL(url, "http://mock.local");
  const route = routes.find(([basePath]) => pathname.startsWith(basePath));
  if (!route) throw new HttpError(404, `No mock handler for ${pathname}`);

  const [basePath, handle] = route;
  return structuredClone(handle(pathname.slice(basePath.length), searchParams)) as T;
};
