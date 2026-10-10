import type { Author, Category, IsoDateTime } from "@/types";

const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Compact relative time: "just now", "5m ago", "3h ago", "2d ago", then "4 Oct". */
export function formatRelativeTime(dateTime: IsoDateTime, now = Date.now()): string {
  const elapsed = now - Date.parse(dateTime);
  if (elapsed < minute) return "just now";
  if (elapsed < hour) return `${Math.floor(elapsed / minute)}m ago`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)}h ago`;
  if (elapsed < 7 * day) return `${Math.floor(elapsed / day)}d ago`;
  return shortDate.format(new Date(dateTime));
}

/** "11 Oct 2026, 08:12" (local time). */
export const formatFullDate = (dateTime: IsoDateTime): string =>
  fullDate.format(new Date(dateTime));

/** "Daniel Park", "Daniel Park & Ruth Klein", "A, B & C". */
export function formatAuthors(authors: readonly Author[]): string {
  const names = authors.map((author) => author.name);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`;
}

export const formatCategory = (category: Category): string =>
  category.charAt(0).toUpperCase() + category.slice(1);

/** "A, B and 2 more" when the list is longer than `max`. */
export function summarizeList(items: readonly string[], max: number): string {
  if (items.length <= max) return items.join(", ");
  return `${items.slice(0, max).join(", ")} and ${items.length - max} more`;
}
