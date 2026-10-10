import type { Author } from "@/types/author";
import type { Category } from "@/types/category";
import type { IsoDateTime } from "@/types/date";
import type { SourceId } from "@/types/source";

/** Unique across providers: `${sourceId}:${providerId}`. */
export type ArticleId = `${SourceId}:${string}`;

/** Provider-independent article. Every source is normalized into this shape. */
export interface Article {
  readonly id: ArticleId;
  readonly sourceId: SourceId;
  /** Outlet that published it, e.g. "The Verge" (via NewsAPI) or "The Guardian". */
  readonly publisher: string;
  readonly title: string;
  readonly summary?: string;
  readonly url: string;
  readonly imageUrl?: string;
  readonly authors: readonly Author[];
  readonly category: Category;
  readonly publishedAt: IsoDateTime;
}
