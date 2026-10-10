import { QueryClient } from "@tanstack/react-query";
import { isTransientError } from "@/services/news";

const minute = 60_000;

/**
 * Short cache tuned for rate-limited free APIs: results stay fresh for 2 minutes,
 * unused ones are dropped after 5, and nothing refetches just because the
 * window regains focus.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * minute,
        gcTime: 5 * minute,
        refetchOnWindowFocus: false,
        // One retry, and only for network/5xx errors (4xx would just burn quota).
        retry: (failureCount, error) => failureCount < 1 && isTransientError(error),
      },
    },
  });
}
