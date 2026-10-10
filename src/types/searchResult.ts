import type { Article } from "@/types/article";
import type { SourceId } from "@/types/source";

export interface SourceError {
  readonly sourceId: SourceId;
  readonly message: string;
  /** HTTP status when the provider answered with an error; absent for network errors. */
  readonly status?: number;
}

export interface SearchResult {
  readonly articles: readonly Article[];
  /** Sources that failed; the remaining sources still contribute articles. */
  readonly errors: readonly SourceError[];
  /** Sources that have another page for this query. Empty when everything is loaded. */
  readonly sourcesWithMore: readonly SourceId[];
}
