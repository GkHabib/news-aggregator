/** Narrowing helpers for validating untrusted input (URL params, storage). */

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** `isOneOf(categories)(value)` — membership check that narrows to the union. */
export const isOneOf =
  <T extends string>(allowed: readonly T[]) =>
  (value: unknown): value is T =>
    typeof value === "string" && (allowed as readonly string[]).includes(value);

/** Keeps only valid, unique entries; anything else becomes an empty list. */
export function validList<T>(value: unknown, isValid: (item: unknown) => item is T): T[] {
  return Array.isArray(value) ? [...new Set(value.filter(isValid))] : [];
}
