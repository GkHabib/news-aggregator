import type { Category } from "@/types/category";
import type { CalendarDate } from "@/types/date";
import type { SourceId } from "@/types/source";

export const datePresets = ["any", "today", "week", "month", "custom"] as const;

export type DatePreset = (typeof datePresets)[number];

/** What the user has applied in the UI (later mirrored in the URL). */
export interface FeedFilters {
  readonly keyword: string;
  readonly date: DatePreset;
  /** Only used when `date` is "custom". */
  readonly from?: CalendarDate;
  readonly to?: CalendarDate;
  readonly categories: readonly Category[];
  readonly sources: readonly SourceId[];
}
