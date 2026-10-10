import type { CalendarDate, IsoDateTime } from "@/types";

const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Accepts any date string `Date` can parse; returns undefined when invalid. */
export function parseIsoDateTime(value: string | null | undefined): IsoDateTime | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : (date.toISOString() as IsoDateTime);
}

/** Accepts `YYYY-MM-DD` only (the format of `<input type="date">`). */
export function parseCalendarDate(value: string | null | undefined): CalendarDate | undefined {
  if (!value || !calendarDatePattern.test(value)) return undefined;
  return parseIsoDateTime(value)?.startsWith(value) ? (value as CalendarDate) : undefined;
}

/** UTC calendar day of a timestamp. */
export function toCalendarDate(dateTime: IsoDateTime): CalendarDate {
  return dateTime.slice(0, 10) as CalendarDate;
}
