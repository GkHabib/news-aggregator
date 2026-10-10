import type { Category } from "@/types/category";
import type { CalendarDate } from "@/types/date";
import type { SourceId } from "@/types/source";

/** What the UI asks for. Empty or missing lists mean "no restriction". */
export interface ArticleQuery {
  readonly keyword?: string;
  readonly categories?: readonly Category[];
  readonly sources?: readonly SourceId[];
  /** Case-insensitive partial match against author names. */
  readonly authors?: readonly string[];
  /** Inclusive range. */
  readonly from?: CalendarDate;
  readonly to?: CalendarDate;
  /** 1-based. */
  readonly page?: number;
}
