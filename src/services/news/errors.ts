import type { SourceError } from "@/types";
import { HttpError } from "@/services/news/api/http";

/** Thrown when every queried source failed; partial failures are returned in `SearchResult.errors`. */
export class AllSourcesFailedError extends Error {
  readonly errors: readonly SourceError[];

  constructor(errors: readonly SourceError[]) {
    super(`All sources failed: ${errors.map((error) => error.sourceId).join(", ")}`);
    this.name = "AllSourcesFailedError";
    this.errors = errors;
  }
}

/**
 * Worth retrying: network failures and 5xx. Not 4xx: a bad key (401) or an
 * exhausted quota (429) fails again and burns more of the quota.
 */
const isTransientStatus = (status: number | undefined) => status === undefined || status >= 500;

export function isTransientError(error: unknown): boolean {
  if (error instanceof AllSourcesFailedError) {
    return error.errors.some((sourceError) => isTransientStatus(sourceError.status));
  }
  if (error instanceof HttpError) return isTransientStatus(error.status);
  return error instanceof TypeError; // fetch rejects with TypeError on network failure
}

export function toSourceError(sourceId: SourceError["sourceId"], reason: unknown): SourceError {
  return {
    sourceId,
    message: reason instanceof Error ? reason.message : String(reason),
    status: reason instanceof HttpError ? reason.status : undefined,
  };
}
