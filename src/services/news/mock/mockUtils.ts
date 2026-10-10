/** Server-side behaviour shared by the fake providers. */

export type MockHandler = (path: string, params: URLSearchParams) => unknown;

export const fixtureImage = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;

/** Case-insensitive phrase match, like a (much simpler) full-text search. */
export function includesKeyword(
  keyword: string | null,
  ...texts: readonly (string | null | undefined)[]
): boolean {
  if (!keyword) return true;
  const needle = keyword.toLowerCase();
  return texts.some((text) => text?.toLowerCase().includes(needle));
}

/** `from` / `to` are inclusive `YYYY-MM-DD` days; `dateTime` is ISO 8601. */
export function isWithinDays(dateTime: string, from: string | null, to: string | null): boolean {
  const day = dateTime.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

/** `page` is 1-based. */
export const paginate = <T>(items: readonly T[], page: number, size: number): T[] =>
  items.slice((page - 1) * size, page * size);

export const numberParam = (params: URLSearchParams, name: string, fallback: number) =>
  Number(params.get(name) ?? fallback);
