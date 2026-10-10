import type { Brand } from "@/types/brand";

/** Full UTC timestamp, e.g. `2026-10-09T13:36:02.000Z`. Build with `parseIsoDateTime`. */
export type IsoDateTime = Brand<string, "IsoDateTime">;

/** Calendar day without time, e.g. `2026-10-09`. Build with `parseCalendarDate`. */
export type CalendarDate = Brand<string, "CalendarDate">;
